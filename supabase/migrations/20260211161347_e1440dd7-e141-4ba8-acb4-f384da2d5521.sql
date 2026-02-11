
-- Expand allowed status values for portal submissions
ALTER TABLE public.submissoes_entidade
  DROP CONSTRAINT IF EXISTS submissoes_entidade_status_check;

ALTER TABLE public.submissoes_entidade
  ADD CONSTRAINT submissoes_entidade_status_check
  CHECK (
    status = ANY (
      ARRAY[
        'submetido'::text,
        'em_analise'::text,
        'aguarda_validacao_chefe'::text,
        'aceite'::text,
        'rejeitado'::text,
        'devolvido'::text
      ]
    )
  );
