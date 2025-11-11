-- Adicionar coluna para tipo de atribuição de roles
ALTER TABLE public.user_roles
ADD COLUMN tipo_atribuicao varchar(20) DEFAULT 'manual' CHECK (tipo_atribuicao IN ('manual', 'automatico', 'herdado'));

-- Adicionar coluna para rastrear origem da role herdada/automática
ALTER TABLE public.user_roles
ADD COLUMN origem_atribuicao text;

-- Adicionar índice para melhor performance
CREATE INDEX idx_user_roles_tipo ON public.user_roles(tipo_atribuicao);

COMMENT ON COLUMN public.user_roles.tipo_atribuicao IS 'Tipo de atribuição: manual (atribuída por admin), automatico (sistema), herdado (de grupo/perfil)';
COMMENT ON COLUMN public.user_roles.origem_atribuicao IS 'Descrição da origem quando tipo é automatico ou herdado';