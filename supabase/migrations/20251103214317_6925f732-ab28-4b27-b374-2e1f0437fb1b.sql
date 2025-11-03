-- Tabela para expedientes
CREATE TABLE IF NOT EXISTS public.expedientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(50) UNIQUE NOT NULL,
  natureza VARCHAR(20) NOT NULL CHECK (natureza IN ('interno', 'externo')),
  tipo VARCHAR(50) NOT NULL,
  assunto TEXT NOT NULL,
  descricao TEXT NOT NULL,
  origem VARCHAR(255) NOT NULL,
  destino VARCHAR(255) NOT NULL,
  prioridade VARCHAR(20) NOT NULL CHECK (prioridade IN ('Normal', 'Alta', 'Urgente')),
  status VARCHAR(50) DEFAULT 'Pendente',
  resposta_a VARCHAR(50),
  
  -- Dados específicos para expedientes externos
  entidade_externa VARCHAR(255),
  email_externo VARCHAR(255),
  telefone_externo VARCHAR(50),
  
  -- Dados da acta de recepção
  numero_acta VARCHAR(50),
  data_recepcao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  responsavel_entrega_nome VARCHAR(255),
  responsavel_entrega_cargo VARCHAR(255),
  responsavel_entrega_instituicao VARCHAR(255),
  responsavel_recepcao_nome VARCHAR(255),
  responsavel_recepcao_cargo VARCHAR(255),
  responsavel_recepcao_departamento VARCHAR(255),
  observacoes_acta TEXT,
  local_recepcao VARCHAR(255),
  
  -- Assinatura digital (para expedientes internos)
  assinado BOOLEAN DEFAULT false,
  assinatura_digital TEXT,
  data_assinatura TIMESTAMP WITH TIME ZONE,
  
  -- Metadados
  criado_por UUID REFERENCES auth.users(id),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_expedientes_numero ON public.expedientes(numero);
CREATE INDEX idx_expedientes_natureza ON public.expedientes(natureza);
CREATE INDEX idx_expedientes_destino ON public.expedientes(destino);
CREATE INDEX idx_expedientes_status ON public.expedientes(status);
CREATE INDEX idx_expedientes_criado_em ON public.expedientes(criado_em DESC);

-- Habilitar RLS
ALTER TABLE public.expedientes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários autenticados podem visualizar expedientes"
  ON public.expedientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar expedientes"
  ON public.expedientes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Usuários podem atualizar seus próprios expedientes"
  ON public.expedientes FOR UPDATE
  TO authenticated
  USING (auth.uid() = criado_por);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_expedientes_updated_at
  BEFORE UPDATE ON public.expedientes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();