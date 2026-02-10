
-- Tabela principal das entidades externas
CREATE TABLE public.entidades_externas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  sigla TEXT,
  nif TEXT UNIQUE,
  endereco TEXT,
  telefone TEXT,
  email TEXT,
  website TEXT,
  tipo_entidade TEXT NOT NULL DEFAULT 'Órgão Público',
  provincia TEXT,
  municipio TEXT,
  responsavel_nome TEXT,
  responsavel_cargo TEXT,
  responsavel_email TEXT,
  responsavel_telefone TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada', 'suspensa')),
  motivo_rejeicao TEXT,
  aprovada_por UUID,
  aprovada_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.entidades_externas ENABLE ROW LEVEL SECURITY;

-- Tabela de utilizadores das entidades (ligação user <-> entidade)
CREATE TABLE public.utilizadores_entidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entidade_id UUID REFERENCES public.entidades_externas(id) ON DELETE CASCADE NOT NULL,
  nome_completo TEXT NOT NULL,
  cargo TEXT,
  telefone TEXT,
  is_responsavel BOOLEAN DEFAULT false,
  activo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.utilizadores_entidade ENABLE ROW LEVEL SECURITY;

-- Submissões de processos pelas entidades
CREATE TABLE public.submissoes_entidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entidade_id UUID REFERENCES public.entidades_externas(id) NOT NULL,
  submetido_por UUID REFERENCES auth.users(id) NOT NULL,
  tipo_processo TEXT NOT NULL,
  numero_referencia TEXT NOT NULL,
  assunto TEXT NOT NULL,
  descricao TEXT,
  valor_contrato NUMERIC,
  documentos JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'submetido' CHECK (status IN ('submetido', 'em_analise', 'aceite', 'rejeitado', 'devolvido')),
  motivo_devolucao TEXT,
  processo_interno_id TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.submissoes_entidade ENABLE ROW LEVEL SECURITY;

-- Notificações para entidades
CREATE TABLE public.notificacoes_entidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entidade_id UUID REFERENCES public.entidades_externas(id) NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'info' CHECK (tipo IN ('info', 'despacho', 'notificacao', 'oficio', 'urgente')),
  processo_referencia TEXT,
  lida BOOLEAN DEFAULT false,
  lida_por UUID,
  lida_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notificacoes_entidade ENABLE ROW LEVEL SECURITY;

-- Emolumentos/pagamentos das entidades
CREATE TABLE public.pagamentos_entidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entidade_id UUID REFERENCES public.entidades_externas(id) NOT NULL,
  submissao_id UUID REFERENCES public.submissoes_entidade(id),
  descricao TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  referencia_pagamento TEXT,
  data_vencimento DATE,
  data_pagamento TIMESTAMPTZ,
  comprovativo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido', 'anulado')),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pagamentos_entidade ENABLE ROW LEVEL SECURITY;

-- Triggers de updated_at
CREATE TRIGGER update_entidades_externas_updated_at BEFORE UPDATE ON public.entidades_externas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_utilizadores_entidade_updated_at BEFORE UPDATE ON public.utilizadores_entidade FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_submissoes_entidade_updated_at BEFORE UPDATE ON public.submissoes_entidade FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pagamentos_entidade_updated_at BEFORE UPDATE ON public.pagamentos_entidade FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS: Entidades externas - utilizadores da entidade podem ver a sua
CREATE POLICY "Utilizadores podem ver a sua entidade" ON public.entidades_externas FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.utilizadores_entidade ue WHERE ue.entidade_id = id AND ue.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin'))
);

CREATE POLICY "Admins podem gerir entidades" ON public.entidades_externas FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Entidades podem registar-se" ON public.entidades_externas FOR INSERT WITH CHECK (true);

-- RLS: Utilizadores entidade
CREATE POLICY "Utilizadores podem ver colegas da entidade" ON public.utilizadores_entidade FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.utilizadores_entidade ue2 WHERE ue2.user_id = auth.uid() AND ue2.entidade_id = entidade_id)
  OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Podem criar ligação ao registar" ON public.utilizadores_entidade FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins gerem utilizadores entidade" ON public.utilizadores_entidade FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- RLS: Submissões
CREATE POLICY "Entidade vê as suas submissões" ON public.submissoes_entidade FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.utilizadores_entidade ue WHERE ue.user_id = auth.uid() AND ue.entidade_id = entidade_id)
  OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Entidade pode submeter" ON public.submissoes_entidade FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.utilizadores_entidade ue WHERE ue.user_id = auth.uid() AND ue.entidade_id = entidade_id AND ue.activo = true)
  AND EXISTS (SELECT 1 FROM public.entidades_externas ee WHERE ee.id = entidade_id AND ee.status = 'aprovada')
);

CREATE POLICY "Admins gerem submissões" ON public.submissoes_entidade FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- RLS: Notificações
CREATE POLICY "Entidade vê notificações" ON public.notificacoes_entidade FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.utilizadores_entidade ue WHERE ue.user_id = auth.uid() AND ue.entidade_id = entidade_id)
  OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Entidade pode marcar como lida" ON public.notificacoes_entidade FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.utilizadores_entidade ue WHERE ue.user_id = auth.uid() AND ue.entidade_id = entidade_id)
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.utilizadores_entidade ue WHERE ue.user_id = auth.uid() AND ue.entidade_id = entidade_id)
);

CREATE POLICY "Admins gerem notificações" ON public.notificacoes_entidade FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- RLS: Pagamentos
CREATE POLICY "Entidade vê pagamentos" ON public.pagamentos_entidade FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.utilizadores_entidade ue WHERE ue.user_id = auth.uid() AND ue.entidade_id = entidade_id)
  OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Entidade pode atualizar comprovativo" ON public.pagamentos_entidade FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.utilizadores_entidade ue WHERE ue.user_id = auth.uid() AND ue.entidade_id = entidade_id)
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.utilizadores_entidade ue WHERE ue.user_id = auth.uid() AND ue.entidade_id = entidade_id)
);

CREATE POLICY "Admins gerem pagamentos" ON public.pagamentos_entidade FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
