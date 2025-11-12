-- Tabela de Configurações Administrativas
CREATE TABLE public.admin_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timezone varchar NOT NULL DEFAULT 'Africa/Luanda',
  locale varchar NOT NULL DEFAULT 'pt-PT',
  modo_manutencao boolean NOT NULL DEFAULT false,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabela de Calendário Judicial
CREATE TABLE public.calendario_judicial (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feriado date NOT NULL,
  descricao text NOT NULL,
  considera_para_slas boolean NOT NULL DEFAULT false,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  criado_por uuid REFERENCES auth.users(id)
);

-- Tabela de Regras de Distribuição
CREATE TABLE public.regras_distribuicao (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_processo varchar NOT NULL CHECK (tipo_processo IN ('Visto','PrestacaoContas','PrestacaoContasSoberania','AutonomoMulta','FiscalizacaoOGE','Recurso')),
  criterio varchar NOT NULL CHECK (criterio IN ('LetraJuiz','Carga','NaturezaEntidade','FonteFinanciamento')),
  parametros jsonb,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabela de Mapa de Letra de Juiz
CREATE TABLE public.mapa_letra_juiz (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  letra varchar NOT NULL,
  juiz_relator_perfil_id uuid REFERENCES public.perfis_utilizador(id),
  juiz_adjunto_perfil_id uuid REFERENCES public.perfis_utilizador(id),
  vigencia jsonb,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabela de Regras de SLA
CREATE TABLE public.sla_regras (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_processo varchar NOT NULL,
  urgencia varchar NOT NULL CHECK (urgencia IN ('normal','simplificado_urgencia','urgente')),
  prazo_dias integer NOT NULL,
  suspende_por_solicitacao boolean NOT NULL DEFAULT true,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabela de Emolumentos
CREATE TABLE public.emolumentos_tabela (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_processo varchar NOT NULL,
  formula text NOT NULL,
  minimo numeric NOT NULL,
  maximo_pct numeric,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabela de Templates de Documentos
CREATE TABLE public.doc_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome varchar NOT NULL,
  tipo varchar NOT NULL CHECK (tipo IN ('capa','oficio','guia','despacho')),
  formato varchar NOT NULL CHECK (formato IN ('docx','pdf')),
  placeholders text[],
  versao varchar NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabela de Templates de Notificação
CREATE TABLE public.notificacao_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evento varchar NOT NULL,
  canal varchar NOT NULL CHECK (canal IN ('email','sms','inapp')),
  assunto text,
  corpo text NOT NULL,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabela de Regras de Retenção
CREATE TABLE public.retencao_regras (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_processo varchar NOT NULL,
  anos_retencao integer NOT NULL,
  politica varchar NOT NULL CHECK (politica IN ('arquivar','anonimizar','eliminar')),
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabela de Configurações de Integração
CREATE TABLE public.integration_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome varchar NOT NULL,
  tipo varchar NOT NULL CHECK (tipo IN ('SMTP','SSO','API','Webhook')),
  config jsonb NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabela de Feature Flags
CREATE TABLE public.feature_flags (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chave varchar NOT NULL UNIQUE,
  descricao text NOT NULL,
  ativo boolean NOT NULL DEFAULT false,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS Policies para admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam configurações"
ON public.admin_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores veem configurações"
ON public.admin_settings
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies para calendario_judicial
ALTER TABLE public.calendario_judicial ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam calendário"
ON public.calendario_judicial
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores veem calendário"
ON public.calendario_judicial
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies para regras_distribuicao
ALTER TABLE public.regras_distribuicao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam regras de distribuição"
ON public.regras_distribuicao
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores veem regras de distribuição"
ON public.regras_distribuicao
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies para mapa_letra_juiz
ALTER TABLE public.mapa_letra_juiz ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam mapa de letras"
ON public.mapa_letra_juiz
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores veem mapa de letras"
ON public.mapa_letra_juiz
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies para sla_regras
ALTER TABLE public.sla_regras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam regras SLA"
ON public.sla_regras
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores veem regras SLA"
ON public.sla_regras
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies para emolumentos_tabela
ALTER TABLE public.emolumentos_tabela ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam emolumentos"
ON public.emolumentos_tabela
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores veem emolumentos"
ON public.emolumentos_tabela
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies para doc_templates
ALTER TABLE public.doc_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam templates de documentos"
ON public.doc_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores veem templates de documentos"
ON public.doc_templates
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies para notificacao_templates
ALTER TABLE public.notificacao_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam templates de notificação"
ON public.notificacao_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores veem templates de notificação"
ON public.notificacao_templates
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies para retencao_regras
ALTER TABLE public.retencao_regras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam regras de retenção"
ON public.retencao_regras
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores veem regras de retenção"
ON public.retencao_regras
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies para integration_config
ALTER TABLE public.integration_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam integrações"
ON public.integration_config
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies para feature_flags
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam feature flags"
ON public.feature_flags
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Utilizadores veem feature flags"
ON public.feature_flags
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regras_distribuicao_updated_at
BEFORE UPDATE ON public.regras_distribuicao
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mapa_letra_juiz_updated_at
BEFORE UPDATE ON public.mapa_letra_juiz
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sla_regras_updated_at
BEFORE UPDATE ON public.sla_regras
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emolumentos_tabela_updated_at
BEFORE UPDATE ON public.emolumentos_tabela
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doc_templates_updated_at
BEFORE UPDATE ON public.doc_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notificacao_templates_updated_at
BEFORE UPDATE ON public.notificacao_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_retencao_regras_updated_at
BEFORE UPDATE ON public.retencao_regras
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_integration_config_updated_at
BEFORE UPDATE ON public.integration_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at
BEFORE UPDATE ON public.feature_flags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();