-- Criar tabela para solicitações de declarações
CREATE TABLE public.solicitacoes_declaracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  tipo_declaracao VARCHAR NOT NULL,
  observacoes TEXT,
  status VARCHAR NOT NULL DEFAULT 'pendente',
  solicitado_por UUID REFERENCES auth.users(id),
  solicitado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  aprovado_por UUID REFERENCES auth.users(id),
  aprovado_em TIMESTAMP WITH TIME ZONE,
  documento_url TEXT,
  motivo_rejeicao TEXT,
  processado_em TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices
CREATE INDEX idx_solicitacoes_declaracoes_funcionario ON public.solicitacoes_declaracoes(funcionario_id);
CREATE INDEX idx_solicitacoes_declaracoes_status ON public.solicitacoes_declaracoes(status);
CREATE INDEX idx_solicitacoes_declaracoes_solicitado_por ON public.solicitacoes_declaracoes(solicitado_por);

-- Habilitar RLS
ALTER TABLE public.solicitacoes_declaracoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Admins podem fazer tudo
CREATE POLICY "Admins gerenciam solicitações declarações"
ON public.solicitacoes_declaracoes
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Usuários podem ver suas próprias solicitações
CREATE POLICY "Ver próprias solicitações declarações"
ON public.solicitacoes_declaracoes
FOR SELECT
TO authenticated
USING (
  solicitado_por = auth.uid() 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Usuários podem criar solicitações
CREATE POLICY "Criar solicitações declarações"
ON public.solicitacoes_declaracoes
FOR INSERT
TO authenticated
WITH CHECK (
  solicitado_por = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Criar trigger para atualizar atualizado_em
CREATE TRIGGER update_solicitacoes_declaracoes_updated_at
BEFORE UPDATE ON public.solicitacoes_declaracoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();