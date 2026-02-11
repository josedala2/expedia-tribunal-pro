
CREATE OR REPLACE FUNCTION public.criar_expediente_submissao_entidade()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _entidade_nome text;
  _numero_exp text;
  _numero_pc text;
BEGIN
  SELECT nome INTO _entidade_nome FROM entidades_externas WHERE id = NEW.entidade_id;
  
  _numero_exp := 'EXP-EXT/' || extract(year from now())::text || '/' || lpad((floor(random() * 99999) + 1)::text, 5, '0');

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
    NEW.submetido_por,
    NEW.id
  );

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
      NEW.submetido_por
    );
    
    UPDATE submissoes_entidade 
    SET numero_processo_interno = _numero_pc
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$function$;
