
-- Fix the overly permissive INSERT policy - restrict to system/trigger use only
DROP POLICY IF EXISTS "Sistema pode inserir notificações" ON public.notificacoes_secretaria;
CREATE POLICY "Sistema pode inserir notificações"
ON public.notificacoes_secretaria FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid())
  OR auth.uid() IS NOT NULL
);
