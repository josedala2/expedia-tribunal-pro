
-- Trigger to sync expediente status changes back to submissoes_entidade
CREATE OR REPLACE FUNCTION public.sync_expediente_to_submissao()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _sub record;
  _entidade_nome text;
  _numero_acta text;
BEGIN
  -- Only process expedientes linked to a submissão
  IF NEW.submissao_entidade_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Only process when status actually changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get the submission
  SELECT * INTO _sub FROM submissoes_entidade WHERE id = NEW.submissao_entidade_id;
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  -- Map expediente status to submissao status
  IF NEW.status = 'Recebido' AND _sub.status = 'submetido' THEN
    -- Generate acta number
    _numero_acta := 'ACTA-REC/' || extract(year from now())::text || '/' || lpad((floor(random() * 9999) + 1)::text, 4, '0');
    
    -- Update submission to aguarda_validacao_chefe
    UPDATE submissoes_entidade 
    SET status = 'aguarda_validacao_chefe', 
        numero_acta = _numero_acta, 
        atualizado_em = now() 
    WHERE id = NEW.submissao_entidade_id;

    -- Get entity name for notification
    SELECT nome INTO _entidade_nome FROM entidades_externas WHERE id = _sub.entidade_id;

    -- Notify entity
    INSERT INTO notificacoes_entidade (entidade_id, titulo, mensagem, tipo, processo_referencia)
    VALUES (
      _sub.entidade_id,
      'Submissão Aceite - Acta de Recepção Gerada',
      'O seu pedido de visto (' || _sub.numero_referencia || ') foi aceite pela Secretaria do Tribunal de Contas. A Acta de Recepção nº ' || _numero_acta || ' foi gerada.',
      'informacao',
      _sub.numero_referencia
    );

  ELSIF NEW.status = 'Aguarda Validação Chefe de Secretaria' THEN
    -- Already handled above or via RPC, just sync
    IF _sub.status = 'submetido' THEN
      _numero_acta := 'ACTA-REC/' || extract(year from now())::text || '/' || lpad((floor(random() * 9999) + 1)::text, 4, '0');
      UPDATE submissoes_entidade 
      SET status = 'aguarda_validacao_chefe', numero_acta = COALESCE(_sub.numero_acta, _numero_acta), atualizado_em = now() 
      WHERE id = NEW.submissao_entidade_id;
    END IF;

  ELSIF NEW.status = 'Em Análise' OR NEW.status = 'Em Tramitação' THEN
    UPDATE submissoes_entidade 
    SET status = 'em_analise', atualizado_em = now() 
    WHERE id = NEW.submissao_entidade_id;

  ELSIF NEW.status = 'Concluído' THEN
    UPDATE submissoes_entidade 
    SET status = 'aceite', atualizado_em = now() 
    WHERE id = NEW.submissao_entidade_id;

  ELSIF NEW.status IN ('Rejeitado', 'Devolvido') THEN
    UPDATE submissoes_entidade 
    SET status = 'rejeitado', atualizado_em = now() 
    WHERE id = NEW.submissao_entidade_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on expedientes
DROP TRIGGER IF EXISTS trg_sync_expediente_to_submissao ON public.expedientes;
CREATE TRIGGER trg_sync_expediente_to_submissao
  AFTER UPDATE ON public.expedientes
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_expediente_to_submissao();

-- Fix existing data: sync expedientes that were already accepted but portal wasn't updated
UPDATE submissoes_entidade se
SET status = 'aguarda_validacao_chefe',
    numero_acta = COALESCE(se.numero_acta, 'ACTA-REC/' || extract(year from now())::text || '/' || lpad((floor(random() * 9999) + 1)::text, 4, '0')),
    atualizado_em = now()
FROM expedientes e
WHERE e.submissao_entidade_id = se.id
  AND e.status IN ('Recebido', 'Aguarda Validação Chefe de Secretaria')
  AND se.status = 'submetido';
