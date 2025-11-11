-- Adicionar campo de hierarquia para vincular secções a divisões
ALTER TABLE public.organizacao_estrutura 
ADD COLUMN divisao_pai_id uuid REFERENCES public.organizacao_estrutura(id) ON DELETE SET NULL;

-- Criar índice para melhorar performance de consultas
CREATE INDEX idx_organizacao_estrutura_divisao_pai ON public.organizacao_estrutura(divisao_pai_id);

-- Adicionar constraint para garantir que apenas secções podem ter divisão pai
ALTER TABLE public.organizacao_estrutura 
ADD CONSTRAINT check_hierarquia 
CHECK (
  (tipo = 'seccao' AND divisao_pai_id IS NOT NULL) OR 
  (tipo = 'seccao' AND divisao_pai_id IS NULL) OR 
  (tipo = 'divisao' AND divisao_pai_id IS NULL)
);