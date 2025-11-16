-- Tabela para processos de visto
CREATE TABLE IF NOT EXISTS public.processos_visto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(50) NOT NULL UNIQUE,
  tipo VARCHAR(50) NOT NULL,
  natureza VARCHAR(100),
  entidade_contratante TEXT,
  entidade_adjudicataria TEXT,
  objeto TEXT NOT NULL,
  valor_contrato DECIMAL(15,2),
  fonte_financiamento TEXT,
  divisao VARCHAR(100),
  seccao VARCHAR(100),
  juiz_relator VARCHAR(200),
  juiz_adjunto VARCHAR(200),
  data_visto_tacito DATE,
  status VARCHAR(50) DEFAULT 'Em Análise',
  prioridade VARCHAR(20) DEFAULT 'Normal',
  prazo_dias INTEGER,
  observacoes TEXT,
  criado_por UUID REFERENCES auth.users(id),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para conclusão dos autos
CREATE TABLE IF NOT EXISTS public.conclusao_autos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES public.processos_visto(id) ON DELETE CASCADE,
  numero_termo VARCHAR(50) NOT NULL UNIQUE,
  escrivao VARCHAR(200) NOT NULL,
  destinatario VARCHAR(200) NOT NULL,
  data_conclusao DATE NOT NULL,
  motivo TEXT,
  status VARCHAR(50) DEFAULT 'Pendente',
  observacoes TEXT,
  criado_por UUID REFERENCES auth.users(id),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para análise e decisão do juiz relator
CREATE TABLE IF NOT EXISTS public.analise_decisao_juiz (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES public.processos_visto(id) ON DELETE CASCADE,
  juiz_relator VARCHAR(200) NOT NULL,
  data_analise DATE NOT NULL,
  tipo_decisao VARCHAR(50) NOT NULL,
  valor_original DECIMAL(15,2),
  valor_deferido DECIMAL(15,2),
  fundamentacao TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Em Análise',
  prazo_restante INTEGER,
  observacoes TEXT,
  criado_por UUID REFERENCES auth.users(id),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para promoção do ministério público
CREATE TABLE IF NOT EXISTS public.promocao_mp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES public.processos_visto(id) ON DELETE CASCADE,
  procurador VARCHAR(200) NOT NULL,
  data_promocao DATE NOT NULL,
  tipo_parecer VARCHAR(50) NOT NULL,
  decisao_juiz VARCHAR(50),
  fundamentacao TEXT NOT NULL,
  recomendacoes TEXT,
  status VARCHAR(50) DEFAULT 'Em Análise',
  prazo_restante INTEGER,
  criado_por UUID REFERENCES auth.users(id),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para recursos ordinários
CREATE TABLE IF NOT EXISTS public.recursos_ordinarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_recurso VARCHAR(50) NOT NULL UNIQUE,
  processo_original VARCHAR(50) NOT NULL,
  recorrente VARCHAR(100) NOT NULL,
  data_interposicao DATE NOT NULL,
  estado VARCHAR(50) DEFAULT 'registo',
  fundamento TEXT NOT NULL,
  observacoes TEXT,
  criado_por UUID REFERENCES auth.users(id),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para interposição de recursos
CREATE TABLE IF NOT EXISTS public.interposicao_recursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES public.processos_visto(id) ON DELETE CASCADE,
  recorrente VARCHAR(100) NOT NULL,
  data_interposicao DATE NOT NULL,
  prazo_restante INTEGER,
  etapa_atual VARCHAR(100),
  decisao_original TEXT,
  fundamentacao TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Em Análise',
  criado_por UUID REFERENCES auth.users(id),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.processos_visto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conclusao_autos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analise_decisao_juiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promocao_mp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recursos_ordinarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interposicao_recursos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para processos_visto
CREATE POLICY "Utilizadores autenticados podem ver processos visto"
  ON public.processos_visto FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores autenticados podem criar processos visto"
  ON public.processos_visto FOR INSERT
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Utilizadores podem atualizar processos visto"
  ON public.processos_visto FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores podem deletar processos visto"
  ON public.processos_visto FOR DELETE
  USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para conclusao_autos
CREATE POLICY "Utilizadores autenticados podem ver conclusão autos"
  ON public.conclusao_autos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores autenticados podem criar conclusão autos"
  ON public.conclusao_autos FOR INSERT
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Utilizadores podem atualizar conclusão autos"
  ON public.conclusao_autos FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores podem deletar conclusão autos"
  ON public.conclusao_autos FOR DELETE
  USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para analise_decisao_juiz
CREATE POLICY "Utilizadores autenticados podem ver análise decisão"
  ON public.analise_decisao_juiz FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores autenticados podem criar análise decisão"
  ON public.analise_decisao_juiz FOR INSERT
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Utilizadores podem atualizar análise decisão"
  ON public.analise_decisao_juiz FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores podem deletar análise decisão"
  ON public.analise_decisao_juiz FOR DELETE
  USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para promocao_mp
CREATE POLICY "Utilizadores autenticados podem ver promoção MP"
  ON public.promocao_mp FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores autenticados podem criar promoção MP"
  ON public.promocao_mp FOR INSERT
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Utilizadores podem atualizar promoção MP"
  ON public.promocao_mp FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores podem deletar promoção MP"
  ON public.promocao_mp FOR DELETE
  USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para recursos_ordinarios
CREATE POLICY "Utilizadores autenticados podem ver recursos ordinários"
  ON public.recursos_ordinarios FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores autenticados podem criar recursos ordinários"
  ON public.recursos_ordinarios FOR INSERT
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Utilizadores podem atualizar recursos ordinários"
  ON public.recursos_ordinarios FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores podem deletar recursos ordinários"
  ON public.recursos_ordinarios FOR DELETE
  USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para interposicao_recursos
CREATE POLICY "Utilizadores autenticados podem ver interposição recursos"
  ON public.interposicao_recursos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores autenticados podem criar interposição recursos"
  ON public.interposicao_recursos FOR INSERT
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Utilizadores podem atualizar interposição recursos"
  ON public.interposicao_recursos FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores podem deletar interposição recursos"
  ON public.interposicao_recursos FOR DELETE
  USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_processos_visto_updated_at BEFORE UPDATE ON public.processos_visto
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conclusao_autos_updated_at BEFORE UPDATE ON public.conclusao_autos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analise_decisao_updated_at BEFORE UPDATE ON public.analise_decisao_juiz
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promocao_mp_updated_at BEFORE UPDATE ON public.promocao_mp
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recursos_ordinarios_updated_at BEFORE UPDATE ON public.recursos_ordinarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interposicao_recursos_updated_at BEFORE UPDATE ON public.interposicao_recursos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();