import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const initializedRef = useRef(false);
  const lastSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // Only update state if session actually changed
        const newSessionId = currentSession?.access_token || null;
        if (lastSessionIdRef.current === newSessionId && event !== 'SIGNED_OUT') {
          return;
        }
        lastSessionIdRef.current = newSessionId;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      const sessionId = existingSession?.access_token || null;
      if (lastSessionIdRef.current !== sessionId) {
        lastSessionIdRef.current = sessionId;
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, nomeCompleto: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
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
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Erro ao terminar sessão");
      } else {
        toast.success("Sessão terminada com sucesso");
      }
    } catch (error: any) {
      toast.error("Erro ao terminar sessão");
    }
  }, []);

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
