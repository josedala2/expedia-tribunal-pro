import { supabase } from "@/integrations/supabase/client";

interface LogAuthEventParams {
  evento: "login" | "logout" | "signup" | "password_reset" | "session_refresh";
  sucesso: boolean;
  userId?: string;
  email?: string;
  detalhes?: Record<string, any>;
}

/**
 * Hook para registar eventos de autenticação
 */
export const useAuthAudit = () => {
  /**
   * Obter informações do navegador e localização
   */
  const getBrowserInfo = () => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    };
  };

  /**
   * Registar evento de autenticação
   */
  const logAuthEvent = async ({
    evento,
    sucesso,
    userId,
    email,
    detalhes,
  }: LogAuthEventParams) => {
    try {
      const browserInfo = getBrowserInfo();

      await supabase.from("auth_logs").insert({
        user_id: userId || null,
        email: email || null,
        evento,
        sucesso,
        user_agent: browserInfo.userAgent,
        detalhes: {
          ...detalhes,
          platform: browserInfo.platform,
          language: browserInfo.language,
          screenResolution: browserInfo.screenResolution,
        },
      });
    } catch (error) {
      console.error("Erro ao registar evento de autenticação:", error);
    }
  };

  /**
   * Registar nova sessão activa
   */
  const registerActiveSession = async (userId: string, sessionId: string) => {
    try {
      const browserInfo = getBrowserInfo();

      // Desactivar sessões antigas do mesmo utilizador
      await supabase
        .from("sessoes_activas")
        .update({ activa: false })
        .eq("user_id", userId)
        .eq("activa", true);

      // Verificar se já existe uma sessão com este session_id
      const { data: existingSession } = await supabase
        .from("sessoes_activas")
        .select("id")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (existingSession) {
        // Atualizar sessão existente
        await supabase
          .from("sessoes_activas")
          .update({
            activa: true,
            ultima_actividade: new Date().toISOString(),
            user_agent: browserInfo.userAgent,
          })
          .eq("session_id", sessionId);
      } else {
        // Criar nova sessão
        await supabase.from("sessoes_activas").insert({
          user_id: userId,
          session_id: sessionId,
          user_agent: browserInfo.userAgent,
        });
      }
    } catch (error) {
      console.error("Erro ao registar sessão activa:", error);
    }
  };

  /**
   * Actualizar actividade da sessão
   */
  const updateSessionActivity = async (sessionId: string) => {
    try {
      await supabase.rpc("update_session_activity", {
        session_id_param: sessionId,
      });
    } catch (error) {
      console.error("Erro ao actualizar actividade da sessão:", error);
    }
  };

  /**
   * Terminar sessão
   */
  const endSession = async (sessionId: string) => {
    try {
      await supabase
        .from("sessoes_activas")
        .update({ activa: false })
        .eq("session_id", sessionId);
    } catch (error) {
      console.error("Erro ao terminar sessão:", error);
    }
  };

  /**
   * Limpar sessões inactivas
   */
  const cleanupInactiveSessions = async () => {
    try {
      await supabase.rpc("cleanup_inactive_sessions");
    } catch (error) {
      console.error("Erro ao limpar sessões inactivas:", error);
    }
  };

  return {
    logAuthEvent,
    registerActiveSession,
    updateSessionActivity,
    endSession,
    cleanupInactiveSessions,
  };
};
