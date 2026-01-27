-- Criar tabela para tipos de expediente
CREATE TABLE public.tipos_expediente (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(50) NOT NULL DEFAULT 'geral',
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  criado_por UUID REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.tipos_expediente ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Utilizadores autenticados podem ver tipos de expediente"
ON public.tipos_expediente
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem gerir tipos de expediente"
ON public.tipos_expediente
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar timestamp
CREATE TRIGGER update_tipos_expediente_updated_at
BEFORE UPDATE ON public.tipos_expediente
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir tipos padrão
INSERT INTO public.tipos_expediente (codigo, nome, descricao, categoria) VALUES
('OF', 'Ofício', 'Correspondência oficial entre entidades', 'correspondencia'),
('REQ', 'Requerimento', 'Pedido formal de ação ou informação', 'solicitacao'),
('CIRC', 'Circular', 'Comunicação interna para múltiplos destinatários', 'comunicacao'),
('MEM', 'Memorando', 'Comunicação interna entre departamentos', 'comunicacao'),
('REL', 'Relatório', 'Documento informativo ou analítico', 'documento'),
('PAR', 'Parecer', 'Opinião técnica ou jurídica', 'documento'),
('NOT', 'Notificação', 'Comunicação formal de ato ou decisão', 'comunicacao'),
('DESP', 'Despacho', 'Decisão administrativa', 'decisao'),
('PROC', 'Processo', 'Conjunto de documentos para análise', 'processo'),
('OUT', 'Outros', 'Outros tipos de expediente', 'geral');