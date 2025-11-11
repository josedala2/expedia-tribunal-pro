-- Tabela de logs de autenticação
CREATE TABLE public.auth_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email VARCHAR,
  evento VARCHAR NOT NULL,
  sucesso BOOLEAN NOT NULL,
  ip_address VARCHAR,
  user_agent TEXT,
  localizacao VARCHAR,
  detalhes JSONB,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de sessões activas
CREATE TABLE public.sessoes_activas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id VARCHAR NOT NULL UNIQUE,
  ip_address VARCHAR,
  user_agent TEXT,
  localizacao VARCHAR,
  iniciada_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ultima_actividade TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  activa BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessoes_activas ENABLE ROW LEVEL SECURITY;

-- Índices para melhor performance
CREATE INDEX idx_auth_logs_user_id ON public.auth_logs(user_id);
CREATE INDEX idx_auth_logs_criado_em ON public.auth_logs(criado_em DESC);
CREATE INDEX idx_auth_logs_evento ON public.auth_logs(evento);
CREATE INDEX idx_sessoes_activas_user_id ON public.sessoes_activas(user_id);
CREATE INDEX idx_sessoes_activas_activa ON public.sessoes_activas(activa);

-- RLS Policies para auth_logs
CREATE POLICY "Admins podem ver todos os logs"
ON public.auth_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores vêem próprios logs"
ON public.auth_logs
FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Sistema pode inserir logs"
ON public.auth_logs
FOR INSERT
WITH CHECK (true);

-- RLS Policies para sessoes_activas
CREATE POLICY "Admins podem ver todas as sessões"
ON public.sessoes_activas
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores vêem próprias sessões"
ON public.sessoes_activas
FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Sistema pode gerir sessões"
ON public.sessoes_activas
FOR ALL
USING (true)
WITH CHECK (true);

-- Função para limpar logs antigos (mais de 90 dias)
CREATE OR REPLACE FUNCTION public.cleanup_old_auth_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.auth_logs
  WHERE criado_em < NOW() - INTERVAL '90 days';
END;
$$;

-- Função para actualizar última actividade de sessão
CREATE OR REPLACE FUNCTION public.update_session_activity(session_id_param VARCHAR)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.sessoes_activas
  SET ultima_actividade = NOW()
  WHERE session_id = session_id_param AND activa = true;
END;
$$;

-- Função para desactivar sessões inactivas (mais de 24h)
CREATE OR REPLACE FUNCTION public.cleanup_inactive_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.sessoes_activas
  SET activa = false
  WHERE activa = true 
    AND ultima_actividade < NOW() - INTERVAL '24 hours';
END;
$$;