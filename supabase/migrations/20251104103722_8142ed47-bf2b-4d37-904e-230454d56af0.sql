-- =====================================================
-- CORREÇÃO OWASP A01: Broken Access Control
-- =====================================================

-- 1. Remover política insegura que permite ver todos os expedientes
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar expedientes" ON public.expedientes;

-- 2. Criar função para verificar se utilizador pode aceder ao expediente
CREATE OR REPLACE FUNCTION public.user_can_access_expediente(expediente_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.expedientes e
    LEFT JOIN public.profiles p ON p.id = user_id
    WHERE e.id = expediente_id
    AND (
      -- Criador do expediente
      e.criado_por = user_id
      -- Ou é admin
      OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_id AND role = 'admin'::app_role)
      -- Ou a sua secção/divisão está envolvida (origem ou destino)
      OR e.origem = p.seccao
      OR e.destino = p.seccao
      OR e.origem = p.divisao
      OR e.destino = p.divisao
    )
  )
$$;

-- 3. Criar novas políticas RLS seguras
CREATE POLICY "Utilizadores podem ver expedientes relevantes"
ON public.expedientes
FOR SELECT
TO authenticated
USING (public.user_can_access_expediente(id, auth.uid()));

-- 4. Política para admins verem tudo
CREATE POLICY "Admins podem ver todos os expedientes"
ON public.expedientes
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 5. Melhorar política de UPDATE para incluir destinatários
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios expedientes" ON public.expedientes;

CREATE POLICY "Utilizadores podem atualizar expedientes acessíveis"
ON public.expedientes
FOR UPDATE
TO authenticated
USING (
  auth.uid() = criado_por
  OR public.user_can_access_expediente(id, auth.uid())
)
WITH CHECK (
  auth.uid() = criado_por
  OR public.user_can_access_expediente(id, auth.uid())
);

-- 6. Criar view segura para dados de contacto externos (apenas para admins e proprietários)
CREATE OR REPLACE VIEW public.expedientes_contactos_externos AS
SELECT 
  e.id,
  e.numero,
  e.entidade_externa,
  CASE 
    WHEN e.criado_por = auth.uid() 
      OR public.has_role(auth.uid(), 'admin'::app_role) 
    THEN e.email_externo
    ELSE NULL
  END as email_externo,
  CASE 
    WHEN e.criado_por = auth.uid() 
      OR public.has_role(auth.uid(), 'admin'::app_role) 
    THEN e.telefone_externo
    ELSE NULL
  END as telefone_externo
FROM public.expedientes e;

-- 7. Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_expedientes_criado_por ON public.expedientes(criado_por);
CREATE INDEX IF NOT EXISTS idx_expedientes_origem ON public.expedientes(origem);
CREATE INDEX IF NOT EXISTS idx_expedientes_destino ON public.expedientes(destino);

-- =====================================================
-- COMENTÁRIOS DE SEGURANÇA
-- =====================================================
COMMENT ON FUNCTION public.user_can_access_expediente IS 
'Função de segurança que verifica se um utilizador pode aceder a um expediente baseado em: 
1. Ser o criador
2. Ter role de admin
3. Sua secção/divisão estar envolvida como origem ou destino';

COMMENT ON POLICY "Utilizadores podem ver expedientes relevantes" ON public.expedientes IS
'Permite acesso apenas a expedientes onde o utilizador está envolvido ou tem permissão';

COMMENT ON VIEW public.expedientes_contactos_externos IS
'View segura que oculta contactos externos de parceiros exceto para criadores e admins';