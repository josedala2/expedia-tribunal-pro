-- Tabela para Pedidos de Redução de Emolumentos
CREATE TABLE IF NOT EXISTS public.pedidos_reducao_emolumentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES public.processos_visto(id),
  numero_processo VARCHAR NOT NULL,
  entidade_contratada TEXT NOT NULL,
  valor_emolumentos NUMERIC NOT NULL,
  valor_proposto NUMERIC NOT NULL,
  fundamentacao TEXT NOT NULL,
  documentos_anexos TEXT,
  observacoes TEXT,
  decisao VARCHAR,
  promocao TEXT,
  status VARCHAR DEFAULT 'Em Análise',
  etapa_atual VARCHAR DEFAULT 'Análise do Juiz Relator',
  data_submissao DATE DEFAULT CURRENT_DATE,
  criado_por UUID,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para Expedientes Processuais
CREATE TABLE IF NOT EXISTS public.expedientes_processuais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES public.processos_visto(id),
  numero_expediente VARCHAR NOT NULL,
  tipo_expediente VARCHAR NOT NULL,
  assunto TEXT NOT NULL,
  origem VARCHAR NOT NULL,
  destino VARCHAR NOT NULL,
  data_entrada DATE DEFAULT CURRENT_DATE,
  urgencia VARCHAR DEFAULT 'Normal',
  status VARCHAR DEFAULT 'Em Validação',
  observacoes TEXT,
  criado_por UUID,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para Tramitação de Processos
CREATE TABLE IF NOT EXISTS public.tramitacao_processos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES public.processos_visto(id) NOT NULL,
  numero_processo VARCHAR NOT NULL,
  etapa_atual VARCHAR NOT NULL,
  responsavel VARCHAR NOT NULL,
  data_inicio DATE NOT NULL,
  prazo_dias INTEGER,
  status VARCHAR DEFAULT 'Em Andamento',
  observacoes TEXT,
  criado_por UUID,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para Cumprimento de Despachos
CREATE TABLE IF NOT EXISTS public.cumprimentos_despachos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES public.processos_visto(id),
  numero_processo VARCHAR NOT NULL,
  tipo_despacho VARCHAR NOT NULL,
  conteudo_despacho TEXT NOT NULL,
  data_emissao DATE NOT NULL,
  responsavel VARCHAR NOT NULL,
  prazo_cumprimento DATE,
  status VARCHAR DEFAULT 'Pendente',
  data_cumprimento DATE,
  observacoes TEXT,
  criado_por UUID,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para Saída de Expedientes
CREATE TABLE IF NOT EXISTS public.saidas_expedientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES public.processos_visto(id),
  numero_expediente VARCHAR NOT NULL,
  tipo_documento VARCHAR NOT NULL,
  destinatario TEXT NOT NULL,
  assunto TEXT NOT NULL,
  data_envio DATE DEFAULT CURRENT_DATE,
  forma_envio VARCHAR NOT NULL,
  numero_registo VARCHAR,
  status VARCHAR DEFAULT 'Pendente',
  observacoes TEXT,
  criado_por UUID,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para Cumprimento de Despacho ADFJR
CREATE TABLE IF NOT EXISTS public.cumprimentos_despacho_adfjr (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES public.processos_visto(id),
  numero_processo VARCHAR NOT NULL,
  entidade TEXT NOT NULL,
  numero_despacho VARCHAR NOT NULL,
  data_despacho DATE NOT NULL,
  data_cumprimento DATE,
  responsavel VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'Pendente',
  descricao_despacho TEXT NOT NULL,
  acoes_tomadas TEXT,
  observacoes TEXT,
  criado_por UUID,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pedidos_reducao_emolumentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expedientes_processuais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tramitacao_processos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cumprimentos_despachos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saidas_expedientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cumprimentos_despacho_adfjr ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para pedidos_reducao_emolumentos
CREATE POLICY "Utilizadores autenticados podem ver pedidos redução"
  ON public.pedidos_reducao_emolumentos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores autenticados podem criar pedidos redução"
  ON public.pedidos_reducao_emolumentos FOR INSERT
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Utilizadores podem atualizar pedidos redução"
  ON public.pedidos_reducao_emolumentos FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores podem deletar pedidos redução"
  ON public.pedidos_reducao_emolumentos FOR DELETE
  USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para expedientes_processuais
CREATE POLICY "Utilizadores autenticados podem ver expedientes processuais"
  ON public.expedientes_processuais FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores autenticados podem criar expedientes processuais"
  ON public.expedientes_processuais FOR INSERT
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Utilizadores podem atualizar expedientes processuais"
  ON public.expedientes_processuais FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores podem deletar expedientes processuais"
  ON public.expedientes_processuais FOR DELETE
  USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para tramitacao_processos
CREATE POLICY "Utilizadores autenticados podem ver tramitação"
  ON public.tramitacao_processos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores autenticados podem criar tramitação"
  ON public.tramitacao_processos FOR INSERT
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Utilizadores podem atualizar tramitação"
  ON public.tramitacao_processos FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores podem deletar tramitação"
  ON public.tramitacao_processos FOR DELETE
  USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para cumprimentos_despachos
CREATE POLICY "Utilizadores autenticados podem ver cumprimentos despachos"
  ON public.cumprimentos_despachos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores autenticados podem criar cumprimentos despachos"
  ON public.cumprimentos_despachos FOR INSERT
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Utilizadores podem atualizar cumprimentos despachos"
  ON public.cumprimentos_despachos FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores podem deletar cumprimentos despachos"
  ON public.cumprimentos_despachos FOR DELETE
  USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para saidas_expedientes
CREATE POLICY "Utilizadores autenticados podem ver saídas expedientes"
  ON public.saidas_expedientes FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores autenticados podem criar saídas expedientes"
  ON public.saidas_expedientes FOR INSERT
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Utilizadores podem atualizar saídas expedientes"
  ON public.saidas_expedientes FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores podem deletar saídas expedientes"
  ON public.saidas_expedientes FOR DELETE
  USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para cumprimentos_despacho_adfjr
CREATE POLICY "Utilizadores autenticados podem ver cumprimentos ADFJR"
  ON public.cumprimentos_despacho_adfjr FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores autenticados podem criar cumprimentos ADFJR"
  ON public.cumprimentos_despacho_adfjr FOR INSERT
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Utilizadores podem atualizar cumprimentos ADFJR"
  ON public.cumprimentos_despacho_adfjr FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores podem deletar cumprimentos ADFJR"
  ON public.cumprimentos_despacho_adfjr FOR DELETE
  USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

-- Triggers para atualizar updated_at
CREATE TRIGGER update_pedidos_reducao_emolumentos_updated_at
  BEFORE UPDATE ON public.pedidos_reducao_emolumentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expedientes_processuais_updated_at
  BEFORE UPDATE ON public.expedientes_processuais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tramitacao_processos_updated_at
  BEFORE UPDATE ON public.tramitacao_processos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cumprimentos_despachos_updated_at
  BEFORE UPDATE ON public.cumprimentos_despachos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saidas_expedientes_updated_at
  BEFORE UPDATE ON public.saidas_expedientes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cumprimentos_despacho_adfjr_updated_at
  BEFORE UPDATE ON public.cumprimentos_despacho_adfjr
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();