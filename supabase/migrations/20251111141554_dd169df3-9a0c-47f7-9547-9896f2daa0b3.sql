-- Create table for managing sections and divisions independently
CREATE TABLE IF NOT EXISTS public.organizacao_estrutura (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR NOT NULL CHECK (tipo IN ('seccao', 'divisao')),
  nome VARCHAR NOT NULL,
  descricao TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  criado_por UUID REFERENCES auth.users(id),
  UNIQUE(tipo, nome)
);

-- Enable RLS
ALTER TABLE public.organizacao_estrutura ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins podem gerir estrutura organizacional"
  ON public.organizacao_estrutura
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Todos podem ver estrutura organizacional"
  ON public.organizacao_estrutura
  FOR SELECT
  TO authenticated
  USING (true);