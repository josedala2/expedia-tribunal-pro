-- Criar perfil "Secretaria do Juiz Presidente" com permissões para receber e distribuir expedientes
INSERT INTO public.perfis_utilizador (nome_perfil, descricao, permissoes, activo)
VALUES (
  'Secretaria do Juiz Presidente',
  'Responsável por receber todos os expedientes que entram no tribunal e distribuir para as áreas competentes',
  ARRAY[
    'expediente.validar',
    'expediente.aprovar',
    'expediente.devolver',
    'processo.ver',
    'processo.ver.todos',
    'processo.editar',
    'processo.distribuir',
    'documento.anexar',
    'oficio.emitir'
  ]::permissao_sistema[],
  true
)
ON CONFLICT (nome_perfil) DO UPDATE SET
  descricao = EXCLUDED.descricao,
  permissoes = EXCLUDED.permissoes,
  activo = EXCLUDED.activo;