import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthAudit } from "@/hooks/useAuthAudit";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, nomeCompleto: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { logAuthEvent, registerActiveSession, endSession, updateSessionActivity } = useAuthAudit();

  useEffect(() => {
    // Configurar listener de mudanças de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Registar eventos de autenticação (sem await para não bloquear)
        setTimeout(() => {
          if (event === "SIGNED_IN" && session?.user) {
            logAuthEvent({
              evento: "login",
              sucesso: true,
              userId: session.user.id,
              email: session.user.email,
            });
            registerActiveSession(session.user.id, session.access_token);
          } else if (event === "SIGNED_OUT") {
            if (session?.access_token) {
              endSession(session.access_token);
            }
          } else if (event === "TOKEN_REFRESHED" && session) {
            updateSessionActivity(session.access_token);
          }
        }, 0);
      }
    );

    // DEPOIS verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // Actualizar actividade se já tiver sessão
      if (session?.access_token) {
        setTimeout(() => {
          updateSessionActivity(session.access_token);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Registar falha de login
        await logAuthEvent({
          evento: "login",
          sucesso: false,
          email: email,
          detalhes: { erro: error.message },
        });
        return { error };
      }

      // Sucesso é registado no onAuthStateChange
      return { error: null };
    } catch (error: any) {
      await logAuthEvent({
        evento: "login",
        sucesso: false,
        email: email,
        detalhes: { erro: error.message },
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, nomeCompleto: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome_completo: nomeCompleto,
          },
        },
      });

      if (error) {
        await logAuthEvent({
          evento: "signup",
          sucesso: false,
          email: email,
          detalhes: { erro: error.message },
        });
        return { error };
      }

      // Registar sucesso de registo
      await logAuthEvent({
        evento: "signup",
        sucesso: true,
        userId: data.user?.id,
        email: email,
      });

      return { error: null };
    } catch (error: any) {
      await logAuthEvent({
        evento: "signup",
        sucesso: false,
        email: email,
        detalhes: { erro: error.message },
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const currentSession = session;
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Erro ao terminar sessão");
        await logAuthEvent({
          evento: "logout",
          sucesso: false,
          userId: user?.id,
          email: user?.email,
          detalhes: { erro: error.message },
        });
      } else {
        toast.success("Sessão terminada com sucesso");
        await logAuthEvent({
          evento: "logout",
          sucesso: true,
          userId: user?.id,
          email: user?.email,
        });
        
        if (currentSession?.access_token) {
          await endSession(currentSession.access_token);
        }
      }
    } catch (error: any) {
      toast.error("Erro ao terminar sessão");
      await logAuthEvent({
        evento: "logout",
        sucesso: false,
        userId: user?.id,
        email: user?.email,
        detalhes: { erro: error.message },
      });
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
