-- Remover a view SECURITY DEFINER que causou o alerta de segurança
-- Vamos usar RLS nas consultas diretas em vez de uma view
DROP VIEW IF EXISTS public.expedientes_contactos_externos;

-- Adicionar comentário explicativo sobre proteção de dados sensíveis
COMMENT ON COLUMN public.expedientes.email_externo IS 
'DADOS SENSÍVEIS: Email de contacto externo. Acesso restrito via RLS apenas para criadores e admins.';

COMMENT ON COLUMN public.expedientes.telefone_externo IS 
'DADOS SENSÍVEIS: Telefone de contacto externo. Acesso restrito via RLS apenas para criadores e admins.';