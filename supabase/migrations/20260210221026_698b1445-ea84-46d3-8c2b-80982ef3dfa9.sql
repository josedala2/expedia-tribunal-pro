CREATE POLICY "Entidade pode editar submissões pendentes"
ON public.submissoes_entidade
FOR UPDATE
USING (
  status = 'submetido'
  AND entidade_id = public.user_entity_id(auth.uid())
)
WITH CHECK (
  status = 'submetido'
  AND entidade_id = public.user_entity_id(auth.uid())
);