-- Criar bucket para documentos de processos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'processo-documentos',
  'processo-documentos',
  false,
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/zip'
  ]
);

-- Criar tabela para metadados dos documentos dos processos
CREATE TABLE IF NOT EXISTS public.processo_documentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  processo_numero VARCHAR NOT NULL,
  nome_arquivo TEXT NOT NULL,
  tipo_documento VARCHAR NOT NULL,
  descricao TEXT,
  tamanho_arquivo BIGINT NOT NULL,
  tipo_mime VARCHAR NOT NULL,
  storage_path TEXT NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pendente',
  uploaded_by UUID REFERENCES auth.users(id),
  validado_por UUID REFERENCES auth.users(id),
  validado_em TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_processo_documentos_processo ON public.processo_documentos(processo_numero);
CREATE INDEX idx_processo_documentos_tipo ON public.processo_documentos(tipo_documento);
CREATE INDEX idx_processo_documentos_status ON public.processo_documentos(status);
CREATE INDEX idx_processo_documentos_uploaded_by ON public.processo_documentos(uploaded_by);

-- Trigger para atualizar timestamp
CREATE TRIGGER update_processo_documentos_updated_at
  BEFORE UPDATE ON public.processo_documentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.processo_documentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para a tabela
CREATE POLICY "Usuários autenticados podem visualizar documentos"
  ON public.processo_documentos
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem inserir documentos"
  ON public.processo_documentos
  FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Admins podem atualizar documentos"
  ON public.processo_documentos
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Usuários podem deletar seus próprios documentos"
  ON public.processo_documentos
  FOR DELETE
  USING (auth.uid() = uploaded_by OR has_role(auth.uid(), 'admin'::app_role));

-- Políticas de Storage para o bucket processo-documentos
CREATE POLICY "Usuários autenticados podem ver documentos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'processo-documentos');

CREATE POLICY "Usuários autenticados podem fazer upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'processo-documentos');

CREATE POLICY "Usuários podem deletar seus próprios arquivos ou admins"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'processo-documentos' AND (
      auth.uid()::text = (storage.foldername(name))[1] OR
      has_role(auth.uid(), 'admin'::app_role)
    )
  );