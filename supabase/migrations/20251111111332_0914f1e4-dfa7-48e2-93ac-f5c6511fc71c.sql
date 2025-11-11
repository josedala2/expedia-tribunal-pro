-- Criar tipo enum para permissões
CREATE TYPE public.permissao_sistema AS ENUM (
  'processo.criar',
  'processo.ver',
  'processo.editar',
  'processo.autuar',
  'processo.distribuir',
  'processo.ver.todos',
  'processo.submeter.juiz',
  'expediente.validar',
  'expediente.aprovar',
  'expediente.devolver',
  'documento.anexar',
  'relatorio.criar',
  'relatorio.editar',
  'relatorio.validar',
  'cq.executar',
  'oficio.emitir',
  'decisao.proferir',
  'decisao.coadjuvar',
  'prazo.suspender',
  'vista.mp.abrir',
  'promocao.emitir',
  'notificacao.executar',
  'certidao.emitir'
);

-- Tabela de Áreas Funcionais
CREATE TABLE public.areas_funcionais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_area VARCHAR NOT NULL UNIQUE,
  descricao TEXT,
  unidades_internas TEXT[],
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  actualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Perfis de Utilizador
CREATE TABLE public.perfis_utilizador (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_perfil VARCHAR NOT NULL UNIQUE,
  descricao TEXT,
  permissoes permissao_sistema[],
  area_funcional_id UUID REFERENCES public.areas_funcionais(id),
  activo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  actualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de atribuição de perfis a utilizadores
CREATE TABLE public.utilizador_perfis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  perfil_id UUID REFERENCES public.perfis_utilizador(id) ON DELETE CASCADE NOT NULL,
  atribuido_por UUID REFERENCES auth.users(id),
  atribuido_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, perfil_id)
);

-- Enable RLS
ALTER TABLE public.areas_funcionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis_utilizador ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utilizador_perfis ENABLE ROW LEVEL SECURITY;

-- Função para verificar se utilizador tem permissão específica
CREATE OR REPLACE FUNCTION public.user_has_permission(_user_id UUID, _permission permissao_sistema)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.utilizador_perfis up
    JOIN public.perfis_utilizador p ON p.id = up.perfil_id
    WHERE up.user_id = _user_id
      AND p.activo = true
      AND _permission = ANY(p.permissoes)
  )
$$;

-- Função para obter permissões do utilizador
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id UUID)
RETURNS permissao_sistema[]
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ARRAY_AGG(DISTINCT perm)::permissao_sistema[]
  FROM public.utilizador_perfis up
  JOIN public.perfis_utilizador p ON p.id = up.perfil_id
  CROSS JOIN UNNEST(p.permissoes) AS perm
  WHERE up.user_id = _user_id
    AND p.activo = true
$$;

-- RLS Policies para areas_funcionais
CREATE POLICY "Admins gerem áreas funcionais"
ON public.areas_funcionais
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores autenticados vêem áreas"
ON public.areas_funcionais
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies para perfis_utilizador
CREATE POLICY "Admins gerem perfis"
ON public.perfis_utilizador
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores autenticados vêem perfis"
ON public.perfis_utilizador
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies para utilizador_perfis
CREATE POLICY "Admins gerem atribuições de perfis"
ON public.utilizador_perfis
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores vêem próprios perfis"
ON public.utilizador_perfis
FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Inserir áreas funcionais
INSERT INTO public.areas_funcionais (nome_area, descricao, unidades_internas) VALUES
('Secretaria-Geral (SG)', 'Entrada, triagem e encaminhamento de expedientes.', '{}'),
('Contadoria Geral (CG)', 'Registo e autuação de processos.', '{}'),
('Direcção dos Serviços Técnicos (DST)', 'Controle de qualidade e remessa a Juízes.', '{}'),
('Divisões Técnicas', 'Análise e elaboração de relatórios técnicos.', ARRAY['1.ª','2.ª','3.ª','4.ª','5.ª','6.ª','8.ª']),
('Câmaras', 'Deliberação colegial.', ARRAY['1.ª Câmara','2.ª Câmara']),
('Ministério Público (MP)', 'Promoção e fiscalização de legalidade.', '{}'),
('Secção de Fiscalização Preventiva (SFP)', 'Gestão dos processos de visto.', '{}'),
('Secção de Custas e Emolumentos (SCE)', 'Cálculo e cobrança de emolumentos.', '{}');

-- Inserir perfis de utilizador
INSERT INTO public.perfis_utilizador (nome_perfil, descricao, permissoes) VALUES
('Representante da Entidade', 'Submete processos, consulta estado e responde notificações.', ARRAY['processo.criar','processo.ver']::permissao_sistema[]),
('Técnico SG', 'Triagem, digitalização e validação de expedientes.', ARRAY['processo.editar','expediente.validar','documento.anexar']::permissao_sistema[]),
('Chefe SG', 'Validação final de expedientes.', ARRAY['expediente.aprovar','expediente.devolver']::permissao_sistema[]),
('Contadoria Geral', 'Registo e autuação de processos.', ARRAY['processo.autuar','processo.distribuir']::permissao_sistema[]),
('Chefe de Divisão', 'Distribuição e validação de relatórios.', ARRAY['processo.distribuir','relatorio.validar']::permissao_sistema[]),
('Chefe de Secção', 'Distribuição e validação preliminar.', ARRAY['processo.distribuir','relatorio.validar']::permissao_sistema[]),
('Técnico', 'Análise técnica e pareceres.', ARRAY['relatorio.criar','relatorio.editar']::permissao_sistema[]),
('Director dos Serviços Técnicos (DST)', 'Controle de qualidade, ofícios e remessa a Juízes.', ARRAY['cq.executar','oficio.emitir','processo.submeter.juiz']::permissao_sistema[]),
('Juiz Relator', 'Despachos e decisões.', ARRAY['decisao.proferir','prazo.suspender','vista.mp.abrir']::permissao_sistema[]),
('Juiz Adjunto', 'Co-decisão e vista.', ARRAY['decisao.coadjuvar']::permissao_sistema[]),
('Presidente da 1.ª Câmara', 'Supervisão do processo de visto.', ARRAY['processo.ver.todos']::permissao_sistema[]),
('Presidente da 2.ª Câmara', 'Supervisão de prestação de contas e OGE.', ARRAY['processo.ver.todos']::permissao_sistema[]),
('Presidente do TC', 'Supervisão geral.', ARRAY['processo.ver.todos']::permissao_sistema[]),
('Ministério Público', 'Promoção e fiscalização de legalidade.', ARRAY['promocao.emitir','processo.ver.todos']::permissao_sistema[]),
('Oficial de Diligências', 'Notificações e certidões.', ARRAY['notificacao.executar','certidao.emitir']::permissao_sistema[]);

-- Trigger para actualizar actualizado_em
CREATE TRIGGER update_areas_funcionais_updated_at
BEFORE UPDATE ON public.areas_funcionais
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_perfis_utilizador_updated_at
BEFORE UPDATE ON public.perfis_utilizador
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();