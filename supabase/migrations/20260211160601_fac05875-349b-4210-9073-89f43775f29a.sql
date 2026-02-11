-- Fix permissive RLS policies flagged by linter

-- auth_logs: only allow authenticated user to insert their own log rows
DROP POLICY IF EXISTS "Sistema pode inserir logs" ON public.auth_logs;
CREATE POLICY "Utilizadores inserem logs próprios"
ON public.auth_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- entidades_externas: entity registration must be from an authenticated session
DROP POLICY IF EXISTS "Entidades podem registar-se" ON public.entidades_externas;
CREATE POLICY "Utilizadores registam entidade"
ON public.entidades_externas
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- logs_auditoria: only allow inserting audit logs tied to the current user
DROP POLICY IF EXISTS "Sistema cria logs" ON public.logs_auditoria;
CREATE POLICY "Utilizadores criam logs auditoria"
ON public.logs_auditoria
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- organizacao_estrutura: avoid USING(true)
DROP POLICY IF EXISTS "Todos podem ver estrutura organizacional" ON public.organizacao_estrutura;
CREATE POLICY "Utilizadores veem estrutura organizacional"
ON public.organizacao_estrutura
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- sessoes_activas: remove ALL-true policy; add explicit INSERT/UPDATE for own sessions
DROP POLICY IF EXISTS "Sistema pode gerir sessões" ON public.sessoes_activas;

CREATE POLICY "Utilizadores inserem própria sessão"
ON public.sessoes_activas
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilizadores atualizam própria sessão"
ON public.sessoes_activas
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
