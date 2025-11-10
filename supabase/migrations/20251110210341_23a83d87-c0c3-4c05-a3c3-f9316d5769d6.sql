-- Corrigir search_path da função search_documentos
DROP FUNCTION IF EXISTS search_documentos(text);

CREATE OR REPLACE FUNCTION search_documentos(search_query text)
RETURNS TABLE (
  id uuid,
  processo_numero varchar,
  nome_arquivo text,
  tipo_documento varchar,
  texto_extraido text,
  rank real
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;