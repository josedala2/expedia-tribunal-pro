-- Renomear campos da tabela profiles para padronizar com outras tabelas
ALTER TABLE public.profiles RENAME COLUMN created_at TO criado_em;
ALTER TABLE public.profiles RENAME COLUMN updated_at TO atualizado_em;