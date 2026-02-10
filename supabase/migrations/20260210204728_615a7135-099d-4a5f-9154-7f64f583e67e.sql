-- Fix entidades_externas SELECT policy (was comparing ue.entidade_id = ue.id instead of entidades_externas.id)
DROP POLICY IF EXISTS "Utilizadores podem ver a sua entidade" ON public.entidades_externas;
CREATE POLICY "Utilizadores podem ver a sua entidade"
ON public.entidades_externas
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM utilizadores_entidade ue
    WHERE ue.entidade_id = entidades_externas.id AND ue.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);

-- Fix utilizadores_entidade SELECT policy (was comparing ue2.entidade_id = ue2.entidade_id instead of outer table)
DROP POLICY IF EXISTS "Utilizadores podem ver colegas da entidade" ON public.utilizadores_entidade;
CREATE POLICY "Utilizadores podem ver colegas da entidade"
ON public.utilizadores_entidade
FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM utilizadores_entidade ue2
    WHERE ue2.user_id = auth.uid() AND ue2.entidade_id = utilizadores_entidade.entidade_id
  )
  OR EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);