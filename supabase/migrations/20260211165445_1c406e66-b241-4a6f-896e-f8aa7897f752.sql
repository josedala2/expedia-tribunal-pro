
-- Tabela para processos de prestação de contas
CREATE TABLE public.processos_prestacao_contas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_processo VARCHAR NOT NULL UNIQUE,
  entidade_id UUID REFERENCES public.entidades_externas(id),
  entidade_nome TEXT NOT NULL,
  submissao_id UUID REFERENCES public.submissoes_entidade(id),
  ano_gerencia VARCHAR,
  assunto TEXT NOT NULL,
  descricao TEXT,
  valor_conta NUMERIC,
  fonte_financiamento TEXT,
  data_referencia DATE,
  etapa_atual VARCHAR DEFAULT 'Registo',
  status VARCHAR DEFAULT 'Em Termos',
  juiz_relator VARCHAR,
  divisao VARCHAR,
  prazo_dias INTEGER DEFAULT 90,
  dias_restantes INTEGER DEFAULT 90,
  observacoes TEXT,
  documentos JSONB DEFAULT '[]'::jsonb,
  criado_por UUID,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.processos_prestacao_contas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilizadores internos podem ver processos PC"
  ON public.processos_prestacao_contas FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM utilizadores_entidade ue WHERE ue.user_id = auth.uid() AND ue.entidade_id = processos_prestacao_contas.entidade_id)
  );

CREATE POLICY "Utilizadores internos podem criar processos PC"
  ON public.processos_prestacao_contas FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizadores internos podem atualizar processos PC"
  ON public.processos_prestacao_contas FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid())
  );

CREATE POLICY "Admins podem deletar processos PC"
  ON public.processos_prestacao_contas FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar atualizado_em
CREATE TRIGGER update_processos_pc_updated_at
  BEFORE UPDATE ON public.processos_prestacao_contas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Sequência para numeração
CREATE SEQUENCE IF NOT EXISTS processos_pc_seq START 1;

-- Função para gerar número PC/YYYY/NNN
CREATE OR REPLACE FUNCTION public.gerar_numero_processo_pc()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _ano TEXT;
  _seq INT;
BEGIN
  _ano := extract(year from now())::text;
  _seq := nextval('processos_pc_seq');
  RETURN 'PC/' || _ano || '/' || lpad(_seq::text, 3, '0');
END;
$$;

-- Actualizar o trigger de criação de expediente para também criar processo PC
CREATE OR REPLACE FUNCTION public.criar_expediente_submissao_entidade()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _entidade_nome text;
  _numero_exp text;
  _numero_pc text;
BEGIN
  SELECT nome INTO _entidade_nome FROM entidades_externas WHERE id = NEW.entidade_id;
  
  _numero_exp := 'EXP-EXT/' || extract(year from now())::text || '/' || lpad((floor(random() * 99999) + 1)::text, 5, '0');

  -- Criar expediente
  INSERT INTO expedientes (
    numero, assunto, descricao, origem, destino, tipo, natureza, prioridade, status,
    entidade_externa, criado_por, submissao_entidade_id
  ) VALUES (
    _numero_exp,
    CASE WHEN NEW.tipo_processo = 'Prestação de Contas' 
      THEN 'Prestação de Contas - ' || NEW.assunto
      ELSE 'Pedido de Visto - ' || NEW.assunto
    END,
    'Submissão pela entidade ' || COALESCE(_entidade_nome, 'Desconhecida') || '. Referência: ' || NEW.numero_referencia || '. Tipo: ' || COALESCE(NEW.tipo_processo, 'N/A') || '. Valor: ' || COALESCE(NEW.valor_contrato::text, 'N/A') || ' AOA.',
    COALESCE(_entidade_nome, 'Entidade Externa'),
    'Expedientes Internos e Externos',
    'Ofício',
    'externo',
    'Normal',
    'Pendente',
    _entidade_nome,
    NEW.criado_por,
    NEW.id
  );

  -- Se for Prestação de Contas, criar processo PC
  IF NEW.tipo_processo = 'Prestação de Contas' THEN
    _numero_pc := gerar_numero_processo_pc();
    
    INSERT INTO processos_prestacao_contas (
      numero_processo, entidade_id, entidade_nome, submissao_id,
      ano_gerencia, assunto, descricao, valor_conta,
      fonte_financiamento, data_referencia, documentos, criado_por
    ) VALUES (
      _numero_pc,
      NEW.entidade_id,
      COALESCE(_entidade_nome, 'Desconhecida'),
      NEW.id,
      extract(year from COALESCE(NEW.data_contrato, now()))::text,
      NEW.assunto,
      NEW.observacoes,
      NEW.valor_contrato,
      NEW.fonte_financiamento,
      NEW.data_contrato,
      COALESCE(NEW.documentos, '[]'::jsonb),
      NEW.criado_por
    );
    
    -- Actualizar a submissão com o número do processo
    UPDATE submissoes_entidade 
    SET numero_processo_interno = _numero_pc
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Adicionar coluna para guardar o número do processo interno na submissão
ALTER TABLE public.submissoes_entidade 
  ADD COLUMN IF NOT EXISTS numero_processo_interno VARCHAR;
