-- Adicionar coluna para texto extraído via OCR
ALTER TABLE processo_documentos 
ADD COLUMN texto_extraido text,
ADD COLUMN ocr_processado boolean DEFAULT false,
ADD COLUMN ocr_processado_em timestamp with time zone;

-- Criar índice para busca de texto
CREATE INDEX idx_processo_documentos_texto_extraido ON processo_documentos USING gin(to_tsvector('portuguese', texto_extraido));

-- Função para busca de texto
CREATE OR REPLACE FUNCTION search_documentos(search_query text)
RETURNS TABLE (
  id uuid,
  processo_numero varchar,
  nome_arquivo text,
  tipo_documento varchar,
  texto_extraido text,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pd.id,
    pd.processo_numero,
    pd.nome_arquivo,
    pd.tipo_documento,
    pd.texto_extraido,
    ts_rank(to_tsvector('portuguese', pd.texto_extraido), plainto_tsquery('portuguese', search_query)) as rank
  FROM processo_documentos pd
  WHERE to_tsvector('portuguese', pd.texto_extraido) @@ plainto_tsquery('portuguese', search_query)
    AND pd.ocr_processado = true
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;