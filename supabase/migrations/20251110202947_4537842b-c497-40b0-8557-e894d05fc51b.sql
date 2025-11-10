-- Create storage bucket for oficio attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'oficio-anexos',
  'oficio-anexos',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Create table for attachment metadata
CREATE TABLE public.oficio_anexos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  oficio_id UUID NOT NULL,
  nome_arquivo TEXT NOT NULL,
  tipo_arquivo TEXT NOT NULL,
  tamanho_arquivo INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  criado_por UUID REFERENCES auth.users(id),
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.oficio_anexos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for oficio_anexos table
CREATE POLICY "Users can view attachments they created"
ON public.oficio_anexos
FOR SELECT
USING (auth.uid() = criado_por);

CREATE POLICY "Users can insert their own attachments"
ON public.oficio_anexos
FOR INSERT
WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Users can delete their own attachments"
ON public.oficio_anexos
FOR DELETE
USING (auth.uid() = criado_por);

-- Storage policies for oficio-anexos bucket
CREATE POLICY "Users can upload their own attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'oficio-anexos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'oficio-anexos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'oficio-anexos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add index for better performance
CREATE INDEX idx_oficio_anexos_oficio_id ON public.oficio_anexos(oficio_id);
CREATE INDEX idx_oficio_anexos_criado_por ON public.oficio_anexos(criado_por);