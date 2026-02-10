-- Create security definer function to check entity membership
CREATE OR REPLACE FUNCTION public.user_entity_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT entidade_id FROM utilizadores_entidade WHERE user_id = _user_id LIMIT 1
$$;

-- Fix utilizadores_entidade SELECT policy - remove self-reference
DROP POLICY IF EXISTS "Utilizadores podem ver colegas da entidade" ON public.utilizadores_entidade;
CREATE POLICY "Utilizadores podem ver colegas da entidade"
ON public.utilizadores_entidade
FOR SELECT
USING (
  user_id = auth.uid()
  OR entidade_id = public.user_entity_id(auth.uid())
  OR EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);