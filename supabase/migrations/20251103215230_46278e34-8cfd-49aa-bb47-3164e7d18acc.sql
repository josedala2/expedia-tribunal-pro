-- Adicionar campos para assinatura do destinatário
ALTER TABLE public.expedientes 
ADD COLUMN IF NOT EXISTS aceito_destinatario BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS assinatura_destinatario TEXT,
ADD COLUMN IF NOT EXISTS data_aceite_destinatario TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS nome_destinatario_assinatura TEXT;