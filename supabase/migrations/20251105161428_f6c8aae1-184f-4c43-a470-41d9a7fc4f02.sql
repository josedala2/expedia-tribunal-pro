-- Criar tabela de notícias e comunicados institucionais
CREATE TABLE IF NOT EXISTS public.noticias_comunicados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo VARCHAR NOT NULL CHECK (tipo IN ('noticia', 'comunicado', 'circular')),
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  prioridade VARCHAR NOT NULL DEFAULT 'normal' CHECK (prioridade IN ('baixa', 'normal', 'alta', 'urgente')),
  status VARCHAR NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado', 'arquivado')),
  anexos JSONB DEFAULT '[]'::jsonb,
  autor_id UUID REFERENCES auth.users(id),
  publicado_em TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de funcionários
CREATE TABLE IF NOT EXISTS public.funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  numero_funcionario VARCHAR UNIQUE NOT NULL,
  nome_completo TEXT NOT NULL,
  bi VARCHAR,
  nif VARCHAR,
  data_nascimento DATE,
  genero VARCHAR CHECK (genero IN ('masculino', 'feminino')),
  estado_civil VARCHAR,
  contacto_telefone VARCHAR,
  contacto_email VARCHAR,
  morada TEXT,
  categoria VARCHAR,
  carreira VARCHAR,
  nivel INTEGER,
  funcao_atual TEXT,
  unidade_organica VARCHAR,
  departamento VARCHAR,
  chefia_direta UUID REFERENCES public.funcionarios(id),
  data_admissao DATE,
  tipo_vinculo VARCHAR CHECK (tipo_vinculo IN ('efetivo', 'contrato', 'comissao')),
  situacao VARCHAR NOT NULL DEFAULT 'ativo' CHECK (situacao IN ('ativo', 'licenca', 'suspenso', 'reformado', 'exonerado')),
  iban VARCHAR,
  banco VARCHAR,
  documentos JSONB DEFAULT '[]'::jsonb,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de dependentes
CREATE TABLE IF NOT EXISTS public.dependentes_funcionario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  nome_completo TEXT NOT NULL,
  parentesco VARCHAR NOT NULL,
  data_nascimento DATE,
  bi VARCHAR,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de assiduidade/ponto
CREATE TABLE IF NOT EXISTS public.registos_ponto (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  entrada_manha TIMESTAMP WITH TIME ZONE,
  saida_manha TIMESTAMP WITH TIME ZONE,
  entrada_tarde TIMESTAMP WITH TIME ZONE,
  saida_tarde TIMESTAMP WITH TIME ZONE,
  tipo VARCHAR NOT NULL DEFAULT 'normal' CHECK (tipo IN ('normal', 'falta', 'ferias', 'licenca', 'justificada')),
  observacoes TEXT,
  validado BOOLEAN DEFAULT false,
  validado_por UUID REFERENCES auth.users(id),
  validado_em TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(funcionario_id, data)
);

-- Criar tabela de férias
CREATE TABLE IF NOT EXISTS public.ferias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  dias_solicitados INTEGER NOT NULL,
  tipo VARCHAR NOT NULL DEFAULT 'anuais' CHECK (tipo IN ('anuais', 'especiais', 'licenca')),
  status VARCHAR NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado_chefia', 'aprovado_rh', 'rejeitado', 'cancelado')),
  motivo_rejeicao TEXT,
  solicitado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  aprovado_chefia_por UUID REFERENCES auth.users(id),
  aprovado_chefia_em TIMESTAMP WITH TIME ZONE,
  aprovado_rh_por UUID REFERENCES auth.users(id),
  aprovado_rh_em TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de saldo de férias
CREATE TABLE IF NOT EXISTS public.saldo_ferias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL,
  dias_direito INTEGER NOT NULL DEFAULT 22,
  dias_gozados INTEGER NOT NULL DEFAULT 0,
  dias_pendentes INTEGER NOT NULL DEFAULT 0,
  dias_disponiveis INTEGER GENERATED ALWAYS AS (dias_direito - dias_gozados - dias_pendentes) STORED,
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(funcionario_id, ano)
);

-- Criar tabela de movimentações
CREATE TABLE IF NOT EXISTS public.movimentacoes_funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  tipo VARCHAR NOT NULL CHECK (tipo IN ('transferencia', 'promocao', 'nomeacao', 'exoneracao', 'reforma', 'substituicao')),
  unidade_origem VARCHAR,
  unidade_destino VARCHAR,
  categoria_origem VARCHAR,
  categoria_destino VARCHAR,
  data_movimentacao DATE NOT NULL,
  motivo TEXT,
  despacho_numero VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'concluido')),
  solicitado_por UUID REFERENCES auth.users(id),
  aprovado_por UUID REFERENCES auth.users(id),
  documentos JSONB DEFAULT '[]'::jsonb,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de remunerações
CREATE TABLE IF NOT EXISTS public.remuneracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INTEGER NOT NULL,
  vencimento_base DECIMAL(15,2) NOT NULL,
  subsidio_alimentacao DECIMAL(15,2) DEFAULT 0,
  subsidio_transporte DECIMAL(15,2) DEFAULT 0,
  subsidio_ferias DECIMAL(15,2) DEFAULT 0,
  subsidio_natal DECIMAL(15,2) DEFAULT 0,
  outros_subsidios DECIMAL(15,2) DEFAULT 0,
  total_vencimentos DECIMAL(15,2) GENERATED ALWAYS AS (
    vencimento_base + subsidio_alimentacao + subsidio_transporte + 
    subsidio_ferias + subsidio_natal + outros_subsidios
  ) STORED,
  desconto_irt DECIMAL(15,2) DEFAULT 0,
  desconto_inss DECIMAL(15,2) DEFAULT 0,
  outros_descontos DECIMAL(15,2) DEFAULT 0,
  total_descontos DECIMAL(15,2) GENERATED ALWAYS AS (
    desconto_irt + desconto_inss + outros_descontos
  ) STORED,
  liquido DECIMAL(15,2) GENERATED ALWAYS AS (
    vencimento_base + subsidio_alimentacao + subsidio_transporte + 
    subsidio_ferias + subsidio_natal + outros_subsidios -
    desconto_irt - desconto_inss - outros_descontos
  ) STORED,
  observacoes TEXT,
  processado BOOLEAN DEFAULT false,
  processado_em TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(funcionario_id, mes, ano)
);

-- Criar tabela de documentos oficiais
CREATE TABLE IF NOT EXISTS public.documentos_oficiais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria VARCHAR NOT NULL CHECK (categoria IN ('regulamento', 'circular', 'despacho', 'instrucao', 'formulario', 'relatorio')),
  titulo TEXT NOT NULL,
  descricao TEXT,
  numero_documento VARCHAR,
  data_documento DATE,
  url_arquivo TEXT,
  tamanho_arquivo BIGINT,
  tipo_arquivo VARCHAR,
  publicado BOOLEAN DEFAULT false,
  publicado_em TIMESTAMP WITH TIME ZONE,
  autor_id UUID REFERENCES auth.users(id),
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS public.logs_auditoria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  acao VARCHAR NOT NULL,
  tabela VARCHAR NOT NULL,
  registro_id UUID,
  dados_anteriores JSONB,
  dados_novos JSONB,
  ip_address VARCHAR,
  user_agent TEXT,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.noticias_comunicados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dependentes_funcionario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registos_ponto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ferias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saldo_ferias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remuneracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_oficiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_auditoria ENABLE ROW LEVEL SECURITY;

-- Políticas para notícias
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'noticias_comunicados' AND policyname = 'Ver notícias publicadas') THEN
    CREATE POLICY "Ver notícias publicadas" ON public.noticias_comunicados FOR SELECT USING (status = 'publicado' OR has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'noticias_comunicados' AND policyname = 'Admins gerenciam notícias') THEN
    CREATE POLICY "Admins gerenciam notícias" ON public.noticias_comunicados FOR ALL USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Políticas para funcionários
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funcionarios' AND policyname = 'Ver próprio perfil') THEN
    CREATE POLICY "Ver próprio perfil" ON public.funcionarios FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funcionarios' AND policyname = 'Admins gerenciam funcionários') THEN
    CREATE POLICY "Admins gerenciam funcionários" ON public.funcionarios FOR ALL USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Políticas para dependentes
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dependentes_funcionario' AND policyname = 'Ver próprios dependentes') THEN
    CREATE POLICY "Ver próprios dependentes" ON public.dependentes_funcionario FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.funcionarios f WHERE f.id = funcionario_id AND f.user_id = auth.uid()) OR has_role(auth.uid(), 'admin')
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dependentes_funcionario' AND policyname = 'Admins gerenciam dependentes') THEN
    CREATE POLICY "Admins gerenciam dependentes" ON public.dependentes_funcionario FOR ALL USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Políticas para ponto
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'registos_ponto' AND policyname = 'Ver próprio ponto') THEN
    CREATE POLICY "Ver próprio ponto" ON public.registos_ponto FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.funcionarios f WHERE f.id = funcionario_id AND f.user_id = auth.uid()) OR has_role(auth.uid(), 'admin')
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'registos_ponto' AND policyname = 'Registar ponto') THEN
    CREATE POLICY "Registar ponto" ON public.registos_ponto FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM public.funcionarios f WHERE f.id = funcionario_id AND f.user_id = auth.uid()) OR has_role(auth.uid(), 'admin')
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'registos_ponto' AND policyname = 'Admins validam ponto') THEN
    CREATE POLICY "Admins validam ponto" ON public.registos_ponto FOR UPDATE USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Políticas para férias
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ferias' AND policyname = 'Ver próprias férias') THEN
    CREATE POLICY "Ver próprias férias" ON public.ferias FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.funcionarios f WHERE f.id = funcionario_id AND f.user_id = auth.uid()) OR has_role(auth.uid(), 'admin')
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ferias' AND policyname = 'Solicitar férias') THEN
    CREATE POLICY "Solicitar férias" ON public.ferias FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM public.funcionarios f WHERE f.id = funcionario_id AND f.user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ferias' AND policyname = 'Admins aprovam férias') THEN
    CREATE POLICY "Admins aprovam férias" ON public.ferias FOR UPDATE USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Políticas para saldo de férias
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'saldo_ferias' AND policyname = 'Ver próprio saldo') THEN
    CREATE POLICY "Ver próprio saldo" ON public.saldo_ferias FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.funcionarios f WHERE f.id = funcionario_id AND f.user_id = auth.uid()) OR has_role(auth.uid(), 'admin')
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'saldo_ferias' AND policyname = 'Admins gerenciam saldo') THEN
    CREATE POLICY "Admins gerenciam saldo" ON public.saldo_ferias FOR ALL USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Políticas para movimentações
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'movimentacoes_funcionarios' AND policyname = 'Ver movimentações') THEN
    CREATE POLICY "Ver movimentações" ON public.movimentacoes_funcionarios FOR SELECT USING (status = 'concluido' OR has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'movimentacoes_funcionarios' AND policyname = 'Admins gerenciam movimentações') THEN
    CREATE POLICY "Admins gerenciam movimentações" ON public.movimentacoes_funcionarios FOR ALL USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Políticas para remunerações
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'remuneracoes' AND policyname = 'Ver própria remuneração') THEN
    CREATE POLICY "Ver própria remuneração" ON public.remuneracoes FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.funcionarios f WHERE f.id = funcionario_id AND f.user_id = auth.uid()) OR has_role(auth.uid(), 'admin')
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'remuneracoes' AND policyname = 'Admins gerenciam remunerações') THEN
    CREATE POLICY "Admins gerenciam remunerações" ON public.remuneracoes FOR ALL USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Políticas para documentos
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documentos_oficiais' AND policyname = 'Ver documentos publicados') THEN
    CREATE POLICY "Ver documentos publicados" ON public.documentos_oficiais FOR SELECT USING (publicado = true OR has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documentos_oficiais' AND policyname = 'Admins gerenciam documentos') THEN
    CREATE POLICY "Admins gerenciam documentos" ON public.documentos_oficiais FOR ALL USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Políticas para logs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'logs_auditoria' AND policyname = 'Admins veem logs') THEN
    CREATE POLICY "Admins veem logs" ON public.logs_auditoria FOR SELECT USING (has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'logs_auditoria' AND policyname = 'Sistema cria logs') THEN
    CREATE POLICY "Sistema cria logs" ON public.logs_auditoria FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Triggers
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_noticias_comunicados_updated_at') THEN
    CREATE TRIGGER update_noticias_comunicados_updated_at BEFORE UPDATE ON public.noticias_comunicados FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_funcionarios_updated_at') THEN
    CREATE TRIGGER update_funcionarios_updated_at BEFORE UPDATE ON public.funcionarios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ferias_updated_at') THEN
    CREATE TRIGGER update_ferias_updated_at BEFORE UPDATE ON public.ferias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_movimentacoes_updated_at') THEN
    CREATE TRIGGER update_movimentacoes_updated_at BEFORE UPDATE ON public.movimentacoes_funcionarios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_documentos_oficiais_updated_at') THEN
    CREATE TRIGGER update_documentos_oficiais_updated_at BEFORE UPDATE ON public.documentos_oficiais FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Índices
CREATE INDEX IF NOT EXISTS idx_funcionarios_user_id ON public.funcionarios(user_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_situacao ON public.funcionarios(situacao);
CREATE INDEX IF NOT EXISTS idx_funcionarios_unidade ON public.funcionarios(unidade_organica);
CREATE INDEX IF NOT EXISTS idx_registos_ponto_funcionario_data ON public.registos_ponto(funcionario_id, data);
CREATE INDEX IF NOT EXISTS idx_ferias_funcionario_ano ON public.ferias(funcionario_id, ano);
CREATE INDEX IF NOT EXISTS idx_ferias_status ON public.ferias(status);
CREATE INDEX IF NOT EXISTS idx_remuneracoes_funcionario_periodo ON public.remuneracoes(funcionario_id, ano, mes);
CREATE INDEX IF NOT EXISTS idx_logs_auditoria_user_criado ON public.logs_auditoria(user_id, criado_em);
CREATE INDEX IF NOT EXISTS idx_noticias_status_publicado ON public.noticias_comunicados(status, publicado_em);