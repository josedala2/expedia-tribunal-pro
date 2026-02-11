
-- Add 'informacao' to allowed notification types
ALTER TABLE public.notificacoes_entidade
  DROP CONSTRAINT IF EXISTS notificacoes_entidade_tipo_check;

ALTER TABLE public.notificacoes_entidade
  ADD CONSTRAINT notificacoes_entidade_tipo_check
  CHECK (
    tipo = ANY (
      ARRAY[
        'info'::text,
        'informacao'::text,
        'despacho'::text,
        'notificacao'::text,
        'oficio'::text,
        'urgente'::text
      ]
    )
  );
