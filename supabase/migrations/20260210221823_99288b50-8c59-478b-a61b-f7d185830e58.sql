
CREATE OR REPLACE FUNCTION public.criar_expediente_submissao_entidade()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _entidade_nome text;
  _numero_exp text;
BEGIN
  SELECT nome INTO _entidade_nome FROM entidades_externas WHERE id = NEW.entidade_id;
  
  _numero_exp := 'EXP-EXT/' || extract(year from now())::text || '/' || lpad((floor(random() * 99999) + 1)::text, 5, '0');

  INSERT INTO expedientes (
    numero, assunto, descricao, origem, destino, tipo, natureza, prioridade, status,
    entidade_externa, criado_por
  ) VALUES (
    _numero_exp,
    'Pedido de Visto - ' || NEW.assunto,
    'Submissão de pedido de visto pela entidade ' || COALESCE(_entidade_nome, 'Desconhecida') || '. Referência: ' || NEW.numero_referencia || '. Tipo: ' || COALESCE(NEW.tipo_processo, 'N/A') || '. Valor: ' || COALESCE(NEW.valor_contrato::text, 'N/A') || ' AOA.',
    COALESCE(_entidade_nome, 'Entidade Externa'),
    'Secretaria do Juiz Presidente',
    'Ofício',
    'externo',
    'Normal',
    'Pendente',
    _entidade_nome,
    NEW.criado_por
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_criar_expediente_submissao
AFTER INSERT ON public.submissoes_entidade
FOR EACH ROW
EXECUTE FUNCTION public.criar_expediente_submissao_entidade();
