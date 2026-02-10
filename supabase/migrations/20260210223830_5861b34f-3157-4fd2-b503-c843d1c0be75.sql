
CREATE OR REPLACE FUNCTION public.aceitar_submissao_entidade(_submissao_id uuid, _user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  _sub record;
  _entidade_nome text;
  _numero_acta text;
BEGIN
  -- Get submission
  SELECT * INTO _sub FROM submissoes_entidade WHERE id = _submissao_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Submissão não encontrada'; END IF;
  
  -- Update status to awaiting validation
  UPDATE submissoes_entidade SET status = 'aguarda_validacao_chefe', atualizado_em = now() WHERE id = _submissao_id;
  
  -- Get entity name
  SELECT nome INTO _entidade_nome FROM entidades_externas WHERE id = _sub.entidade_id;
  
  -- Generate acta number
  _numero_acta := 'ACTA-REC/' || extract(year from now())::text || '/' || lpad((floor(random() * 9999) + 1)::text, 4, '0');
  
  -- Update corresponding expediente status
  UPDATE expedientes 
  SET status = 'Aguarda Validação Chefe de Secretaria', atualizado_em = now()
  WHERE entidade_externa = _entidade_nome 
    AND assunto LIKE '%' || _sub.assunto || '%'
    AND status = 'Pendente';
  
  -- Notify entity
  INSERT INTO notificacoes_entidade (entidade_id, titulo, mensagem, tipo, processo_referencia)
  VALUES (
    _sub.entidade_id,
    'Submissão Aceite - Acta de Recepção Gerada',
    'O seu pedido de visto (' || _sub.numero_referencia || ') foi aceite pela Secretaria do Tribunal de Contas. A Acta de Recepção nº ' || _numero_acta || ' foi gerada. O processo aguarda validação da Chefe de Secretaria.',
    'informacao',
    _sub.numero_referencia
  );
  
  -- Mark secretariat notification as read
  UPDATE notificacoes_secretaria SET lida = true, lida_por = _user_id, lida_em = now() WHERE submissao_id = _submissao_id;
END;
$$;
