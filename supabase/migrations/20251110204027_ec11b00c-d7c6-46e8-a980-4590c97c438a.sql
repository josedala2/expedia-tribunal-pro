-- Criar tabela de ofícios de remessa
CREATE TABLE public.oficios_remessa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero CHARACTER VARYING NOT NULL,
  data_emissao DATE NOT NULL DEFAULT CURRENT_DATE,
  destinatario TEXT NOT NULL,
  assunto TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  remetente_nome TEXT NOT NULL,
  remetente_cargo TEXT NOT NULL,
  assinado BOOLEAN DEFAULT false,
  assinatura_digital TEXT,
  data_assinatura TIMESTAMP WITH TIME ZONE,
  status CHARACTER VARYING NOT NULL DEFAULT 'rascunho',
  criado_por UUID REFERENCES auth.users(id),
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.oficios_remessa ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver ofícios que criaram"
ON public.oficios_remessa
FOR SELECT
USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Usuários podem criar ofícios"
ON public.oficios_remessa
FOR INSERT
WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Usuários podem atualizar seus ofícios"
ON public.oficios_remessa
FOR UPDATE
USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Usuários podem deletar seus ofícios"
ON public.oficios_remessa
FOR DELETE
USING (auth.uid() = criado_por OR has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_oficios_remessa_updated_at
BEFORE UPDATE ON public.oficios_remessa
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Atualizar tabela oficio_anexos para referenciar oficios_remessa
ALTER TABLE public.oficio_anexos
ADD CONSTRAINT fk_oficio_remessa
FOREIGN KEY (oficio_id) 
REFERENCES public.oficios_remessa(id) 
ON DELETE CASCADE;

-- Índices para melhor performance
CREATE INDEX idx_oficios_remessa_criado_por ON public.oficios_remessa(criado_por);
CREATE INDEX idx_oficios_remessa_status ON public.oficios_remessa(status);
CREATE INDEX idx_oficios_remessa_data_emissao ON public.oficios_remessa(data_emissao DESC);