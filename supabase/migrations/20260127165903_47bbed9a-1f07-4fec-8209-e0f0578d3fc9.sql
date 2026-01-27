-- Create table for system modules configuration
CREATE TABLE public.modulos_sistema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR NOT NULL UNIQUE,
  nome VARCHAR NOT NULL,
  descricao TEXT,
  icone VARCHAR,
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.modulos_sistema ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Utilizadores autenticados veem módulos"
ON public.modulos_sistema
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins gerenciam módulos"
ON public.modulos_sistema
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default modules
INSERT INTO public.modulos_sistema (codigo, nome, descricao, icone, ativo, ordem) VALUES
('processos_visto', 'Processos de Visto', 'Gestão de processos de visto prévio', 'FileCheck', true, 1),
('fiscalizacao', 'Fiscalização', 'Fiscalização de contas e auditorias', 'Search', true, 2),
('prestacao_contas', 'Prestação de Contas', 'Gestão de prestação de contas', 'FileText', true, 3),
('multas', 'Processos de Multa', 'Gestão de processos de multa', 'AlertTriangle', true, 4),
('expedientes', 'Expedientes', 'Gestão de expedientes de entrada e saída', 'Mail', true, 5),
('portal_intranet', 'Portal Intranet', 'Portal do funcionário e gestão de RH', 'Users', true, 6),
('relatorios', 'Relatórios', 'Geração de relatórios e estatísticas', 'BarChart3', true, 7),
('documentos', 'Documentos', 'Gestão documental', 'FolderOpen', true, 8);

-- Trigger for updated_at
CREATE TRIGGER update_modulos_sistema_updated_at
BEFORE UPDATE ON public.modulos_sistema
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();