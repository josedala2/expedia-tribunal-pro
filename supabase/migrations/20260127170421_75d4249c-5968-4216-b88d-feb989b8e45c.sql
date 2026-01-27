-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admins gerenciam módulos" ON public.modulos_sistema;

-- Create separate policies for each operation
CREATE POLICY "Utilizadores autenticados podem atualizar módulos"
ON public.modulos_sistema
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem inserir módulos"
ON public.modulos_sistema
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar módulos"
ON public.modulos_sistema
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));