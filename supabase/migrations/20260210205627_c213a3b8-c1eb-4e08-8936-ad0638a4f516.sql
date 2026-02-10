
-- Add visto-specific fields to submissoes_entidade
ALTER TABLE public.submissoes_entidade
  ADD COLUMN IF NOT EXISTS tipo_visto text,
  ADD COLUMN IF NOT EXISTS natureza_visto text,
  ADD COLUMN IF NOT EXISTS entidade_contratante text,
  ADD COLUMN IF NOT EXISTS entidade_contratada text,
  ADD COLUMN IF NOT EXISTS nif_contratada text,
  ADD COLUMN IF NOT EXISTS objeto text,
  ADD COLUMN IF NOT EXISTS fonte_financiamento text,
  ADD COLUMN IF NOT EXISTS numero_contrato text,
  ADD COLUMN IF NOT EXISTS data_contrato date,
  ADD COLUMN IF NOT EXISTS observacoes text;

-- Create table for notifications to internal secretariat about new submissions
CREATE TABLE IF NOT EXISTS public.notificacoes_secretaria (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submissao_id uuid NOT NULL REFERENCES public.submissoes_entidade(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'nova_submissao',
  titulo text NOT NULL,
  mensagem text NOT NULL,
  lida boolean DEFAULT false,
  lida_por uuid,
  lida_em timestamptz,
  criado_em timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notificacoes_secretaria ENABLE ROW LEVEL SECURITY;

-- Only internal users (with roles) can see secretariat notifications
CREATE POLICY "Utilizadores internos podem ver notificações da secretaria"
ON public.notificacoes_secretaria FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid())
);

CREATE POLICY "Utilizadores internos podem atualizar notificações"
ON public.notificacoes_secretaria FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid())
);

-- System can insert notifications (via trigger)
CREATE POLICY "Sistema pode inserir notificações"
ON public.notificacoes_secretaria FOR INSERT
WITH CHECK (true);

-- Create trigger to auto-notify secretariat on new submission
CREATE OR REPLACE FUNCTION public.notify_secretaria_nova_submissao()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _entidade_nome text;
BEGIN
  SELECT nome INTO _entidade_nome FROM entidades_externas WHERE id = NEW.entidade_id;
  
  INSERT INTO notificacoes_secretaria (submissao_id, titulo, mensagem)
  VALUES (
    NEW.id,
    'Nova Submissão de Pedido de Visto',
    'A entidade ' || COALESCE(_entidade_nome, 'Desconhecida') || ' submeteu um novo pedido de visto (' || NEW.numero_referencia || '). Assunto: ' || NEW.assunto
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_secretaria_submissao
AFTER INSERT ON public.submissoes_entidade
FOR EACH ROW
EXECUTE FUNCTION public.notify_secretaria_nova_submissao();

-- Create function to accept submission (generates notification to entity + acta)
CREATE OR REPLACE FUNCTION public.aceitar_submissao_entidade(_submissao_id uuid, _user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sub record;
  _entidade_nome text;
  _numero_acta text;
BEGIN
  -- Get submission
  SELECT * INTO _sub FROM submissoes_entidade WHERE id = _submissao_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Submissão não encontrada'; END IF;
  
  -- Update status
  UPDATE submissoes_entidade SET status = 'aceite', atualizado_em = now() WHERE id = _submissao_id;
  
  -- Get entity name
  SELECT nome INTO _entidade_nome FROM entidades_externas WHERE id = _sub.entidade_id;
  
  -- Generate acta number
  _numero_acta := 'ACTA-REC/' || extract(year from now())::text || '/' || lpad((floor(random() * 9999) + 1)::text, 4, '0');
  
  -- Notify entity
  INSERT INTO notificacoes_entidade (entidade_id, titulo, mensagem, tipo, processo_referencia)
  VALUES (
    _sub.entidade_id,
    'Submissão Aceite - Acta de Recepção Gerada',
    'O seu pedido de visto (' || _sub.numero_referencia || ') foi aceite pela Secretaria do Tribunal de Contas. A Acta de Recepção nº ' || _numero_acta || ' foi gerada. O processo será tramitado internamente.',
    'informacao',
    _sub.numero_referencia
  );
  
  -- Mark secretariat notification as read
  UPDATE notificacoes_secretaria SET lida = true, lida_por = _user_id, lida_em = now() WHERE submissao_id = _submissao_id;
END;
$$;
