-- Adicionar coluna para ligar expediente à submissão da entidade
ALTER TABLE public.expedientes ADD COLUMN submissao_entidade_id uuid REFERENCES public.submissoes_entidade(id);

-- Actualizar o trigger para guardar o ID da submissão
CREATE OR REPLACE FUNCTION public.criar_expediente_submissao_entidade()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _entidade_nome text;
  _numero_exp text;
BEGIN
  SELECT nome INTO _entidade_nome FROM entidades_externas WHERE id = NEW.entidade_id;
  
  _numero_exp := 'EXP-EXT/' || extract(year from now())::text || '/' || lpad((floor(random() * 99999) + 1)::text, 5, '0');

  INSERT INTO expedientes (
    numero, assunto, descricao, origem, destino, tipo, natureza, prioridade, status,
    entidade_externa, criado_por, submissao_entidade_id
  ) VALUES (
    _numero_exp,
    'Pedido de Visto - ' || NEW.assunto,
    'Submissão de pedido de visto pela entidade ' || COALESCE(_entidade_nome, 'Desconhecida') || '. Referência: ' || NEW.numero_referencia || '. Tipo: ' || COALESCE(NEW.tipo_processo, 'N/A') || '. Valor: ' || COALESCE(NEW.valor_contrato::text, 'N/A') || ' AOA.',
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

  RETURN NEW;
END;
$function$;

-- Actualizar expedientes existentes com a ligação correcta
UPDATE expedientes e
SET submissao_entidade_id = s.id
FROM submissoes_entidade s
WHERE e.numero LIKE 'EXP-EXT/%'
  AND e.assunto LIKE '%' || s.assunto || '%'
  AND e.submissao_entidade_id IS NULL;