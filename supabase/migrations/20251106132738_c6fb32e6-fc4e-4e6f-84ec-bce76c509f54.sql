-- Criar tabela de pensionistas/aposentados
CREATE TABLE public.pensionistas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_pensionista VARCHAR NOT NULL UNIQUE,
  funcionario_id UUID REFERENCES public.funcionarios(id),
  
  -- Dados Pessoais
  nome_completo TEXT NOT NULL,
  bi VARCHAR,
  nif VARCHAR,
  data_nascimento DATE,
  genero VARCHAR,
  estado_civil VARCHAR,
  contacto_telefone VARCHAR,
  contacto_email VARCHAR,
  morada TEXT,
  
  -- Dados da Aposentadoria/Pensão
  tipo_aposentadoria VARCHAR NOT NULL, -- 'aposentadoria_idade', 'aposentadoria_invalidez', 'pensao_sobrevivencia', 'reforma_antecipada'
  data_aposentadoria DATE NOT NULL,
  motivo_aposentadoria TEXT,
  tempo_servico_anos INTEGER,
  tempo_servico_meses INTEGER,
  
  -- Dados Financeiros
  valor_pensao NUMERIC(10,2),
  banco VARCHAR,
  iban VARCHAR,
  
  -- Status
  status VARCHAR NOT NULL DEFAULT 'ativo', -- 'ativo', 'suspenso', 'falecido'
  data_ultima_prova_vida DATE,
  proxima_prova_vida DATE,
  
  -- Observações
  observacoes TEXT,
  
  -- Metadados
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  criado_por UUID REFERENCES auth.users(id)
);

-- Criar tabela de histórico funcional do pensionista
CREATE TABLE public.historico_funcional_pensionista (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pensionista_id UUID NOT NULL REFERENCES public.pensionistas(id) ON DELETE CASCADE,
  
  cargo TEXT NOT NULL,
  unidade_organica VARCHAR,
  departamento VARCHAR,
  categoria VARCHAR,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  observacoes TEXT,
  
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de documentos do pensionista
CREATE TABLE public.documentos_pensionista (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pensionista_id UUID NOT NULL REFERENCES public.pensionistas(id) ON DELETE CASCADE,
  
  tipo_documento VARCHAR NOT NULL, -- 'bi', 'certidao_nascimento', 'prova_vida', 'declaracao_iban', 'atestado_medico', 'outro'
  titulo TEXT NOT NULL,
  descricao TEXT,
  url_arquivo TEXT,
  data_validade DATE,
  
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  criado_por UUID REFERENCES auth.users(id)
);

-- Criar tabela de pagamentos de pensões
CREATE TABLE public.pagamentos_pensao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pensionista_id UUID NOT NULL REFERENCES public.pensionistas(id) ON DELETE CASCADE,
  
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  valor_base NUMERIC(10,2) NOT NULL,
  subsidios NUMERIC(10,2) DEFAULT 0,
  descontos NUMERIC(10,2) DEFAULT 0,
  valor_liquido NUMERIC(10,2) NOT NULL,
  
  data_pagamento DATE,
  status VARCHAR NOT NULL DEFAULT 'pendente', -- 'pendente', 'pago', 'suspenso'
  observacoes TEXT,
  
  processado BOOLEAN DEFAULT false,
  processado_em TIMESTAMP WITH TIME ZONE,
  processado_por UUID REFERENCES auth.users(id),
  
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de provas de vida
CREATE TABLE public.provas_vida (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pensionista_id UUID NOT NULL REFERENCES public.pensionistas(id) ON DELETE CASCADE,
  
  data_verificacao DATE NOT NULL,
  tipo_verificacao VARCHAR NOT NULL, -- 'presencial', 'digital', 'domiciliar'
  verificado_por VARCHAR,
  local_verificacao VARCHAR,
  observacoes TEXT,
  documento_url TEXT,
  
  proxima_verificacao DATE NOT NULL,
  
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  criado_por UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.pensionistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_funcional_pensionista ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_pensionista ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos_pensao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provas_vida ENABLE ROW LEVEL SECURITY;

-- RLS Policies para pensionistas
CREATE POLICY "Admins gerenciam pensionistas" 
ON public.pensionistas 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Ver próprio registro de pensionista" 
ON public.pensionistas 
FOR SELECT 
USING (
  (EXISTS (
    SELECT 1 FROM funcionarios f 
    WHERE f.id = pensionistas.funcionario_id 
    AND f.user_id = auth.uid()
  )) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies para histórico funcional
CREATE POLICY "Admins gerenciam histórico funcional" 
ON public.historico_funcional_pensionista 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Ver próprio histórico funcional" 
ON public.historico_funcional_pensionista 
FOR SELECT 
USING (
  (EXISTS (
    SELECT 1 FROM pensionistas p
    INNER JOIN funcionarios f ON f.id = p.funcionario_id
    WHERE p.id = historico_funcional_pensionista.pensionista_id 
    AND f.user_id = auth.uid()
  )) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies para documentos
CREATE POLICY "Admins gerenciam documentos pensionista" 
ON public.documentos_pensionista 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Ver próprios documentos pensionista" 
ON public.documentos_pensionista 
FOR SELECT 
USING (
  (EXISTS (
    SELECT 1 FROM pensionistas p
    INNER JOIN funcionarios f ON f.id = p.funcionario_id
    WHERE p.id = documentos_pensionista.pensionista_id 
    AND f.user_id = auth.uid()
  )) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies para pagamentos
CREATE POLICY "Admins gerenciam pagamentos pensão" 
ON public.pagamentos_pensao 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Ver próprios pagamentos pensão" 
ON public.pagamentos_pensao 
FOR SELECT 
USING (
  (EXISTS (
    SELECT 1 FROM pensionistas p
    INNER JOIN funcionarios f ON f.id = p.funcionario_id
    WHERE p.id = pagamentos_pensao.pensionista_id 
    AND f.user_id = auth.uid()
  )) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies para provas de vida
CREATE POLICY "Admins gerenciam provas vida" 
ON public.provas_vida 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Ver próprias provas vida" 
ON public.provas_vida 
FOR SELECT 
USING (
  (EXISTS (
    SELECT 1 FROM pensionistas p
    INNER JOIN funcionarios f ON f.id = p.funcionario_id
    WHERE p.id = provas_vida.pensionista_id 
    AND f.user_id = auth.uid()
  )) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_pensionistas_updated_at
BEFORE UPDATE ON public.pensionistas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_pensionistas_numero ON public.pensionistas(numero_pensionista);
CREATE INDEX idx_pensionistas_funcionario ON public.pensionistas(funcionario_id);
CREATE INDEX idx_pensionistas_status ON public.pensionistas(status);
CREATE INDEX idx_historico_funcional_pensionista ON public.historico_funcional_pensionista(pensionista_id);
CREATE INDEX idx_documentos_pensionista ON public.documentos_pensionista(pensionista_id);
CREATE INDEX idx_pagamentos_pensao ON public.pagamentos_pensao(pensionista_id);
CREATE INDEX idx_provas_vida_pensionista ON public.provas_vida(pensionista_id);