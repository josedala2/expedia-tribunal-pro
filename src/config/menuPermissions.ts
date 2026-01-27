import { Permissao } from "@/hooks/usePermissions";

/**
 * Mapeamento de grupos de menu para permissões requeridas
 * Se o utilizador tiver pelo menos uma das permissões listadas, verá o grupo/item
 */

// Grupos de menu e suas permissões
export const grupoPermissoes: Record<string, Permissao[]> = {
  "dashboard-group": [], // Dashboard visível para todos autenticados
  "portal-intranet-group": [], // Portal Intranet visível para todos
  "expedientes-group": ["expediente.validar", "expediente.aprovar", "expediente.devolver"],
  "prestacao-contas-group": ["processo.ver", "processo.editar", "processo.autuar", "relatorio.criar"],
  "visto-group": ["processo.ver", "processo.editar", "processo.autuar", "processo.distribuir", "decisao.proferir"],
  "fiscalizacao-group": ["processo.ver", "relatorio.criar", "relatorio.editar", "relatorio.validar"],
  "multas-group": ["processo.criar", "processo.autuar", "decisao.proferir", "notificacao.executar"],
  "admin-config-group": [], // Apenas admins - verificação especial
};

// Itens de menu específicos e suas permissões
export const itemPermissoes: Record<string, Permissao[]> = {
  // Dashboard
  "dashboard": [],
  
  // Portal Intranet
  "portal-intranet": [],
  "gestao-noticias": [],
  "gestao-rh": [], // Verificação de admin
  "rh-cadastro-funcionarios": [],
  "rh-gestao-contratos": [],
  "rh-assiduidade-pontualidade": [],
  "rh-gestao-ferias-licencas": [],
  "aprovacao-ferias-chefia": [],
  "rh-formacao-desenvolvimento": [],
  "rh-gestao-remuneracoes": [],
  "rh-gestao-documental-rh": [],
  "rh-gestao-pensionistas": [],
  "rh-relatorios-estatisticas-rh": [],
  "rh-solicitacoes-declaracoes": [],
  
  // Expedientes
  "expedientes": ["expediente.validar", "expediente.aprovar", "expediente.devolver"],
  
  // Prestação de Contas
  "prestacao-contas": ["processo.ver"],
  "expediente-prestacao": ["expediente.validar", "documento.anexar"],
  "tramitacao-prestacao": ["processo.ver", "processo.editar"],
  "cumprimento-despachos-prestacao": ["processo.editar", "expediente.validar"],
  "cobranca-emolumentos-prestacao": ["processo.ver"],
  "despacho-promocao-prestacao": ["decisao.proferir", "promocao.emitir"],
  "oficios-remessa-prestacao": ["oficio.emitir"],
  "saida-expediente-prestacao": ["expediente.aprovar"],
  "prestacao-soberania": ["processo.ver.todos"],
  
  // Processos de Visto
  "visto": ["processo.ver", "processo.criar"],
  "expediente-processual": ["expediente.validar", "documento.anexar"],
  "tramitacao-visto": ["processo.ver", "processo.editar"],
  "cumprimento-despachos": ["processo.editar", "expediente.validar"],
  "saida-expediente-visto": ["expediente.aprovar"],
  "interposicao-recurso": ["processo.ver", "documento.anexar"],
  "pedido-reducao-emolumentos": ["processo.ver", "documento.anexar"],
  "conclusao-autos-cgsfp": ["processo.submeter.juiz", "cq.executar"],
  "analise-decisao-juiz": ["decisao.proferir", "decisao.coadjuvar"],
  "promocao-mp": ["promocao.emitir", "vista.mp.abrir"],
  "analise-decisao-final-juiz": ["decisao.proferir"],
  "cumprimento-despacho-adfjr": ["processo.editar"],
  "recursos-ativos": ["processo.ver", "decisao.proferir"],
  
  // Recurso Ordinário
  "recurso-ordinario": ["processo.ver", "decisao.proferir"],
  "recurso-ordinario-registo": ["processo.autuar"],
  "recurso-ordinario-plenario": ["decisao.proferir", "decisao.coadjuvar"],
  "recurso-ordinario-projeto": ["decisao.proferir"],
  "recurso-ordinario-vista": ["decisao.coadjuvar"],
  "recurso-ordinario-resolucao": ["decisao.proferir"],
  "recurso-ordinario-notificacao": ["notificacao.executar", "oficio.emitir"],
  
  // Recurso Inconstitucionalidade
  "recurso-inconstitucionalidade": ["processo.ver", "decisao.proferir"],
  "recurso-inconstitucionalidade-apresentacao": ["processo.criar", "documento.anexar"],
  "recurso-inconstitucionalidade-analise": ["decisao.proferir"],
  
  // Visto - Outros
  "cobranca-emolumentos": ["processo.ver"],
  "despacho-promocao": ["decisao.proferir", "promocao.emitir"],
  "cumprimento-despachos-geral": ["processo.editar", "expediente.validar"],
  "oficios-remessa": ["oficio.emitir"],
  "expedientes-saida": ["expediente.aprovar"],
  
  // Fiscalização
  "fiscalizacao": ["processo.ver", "relatorio.criar"],
  "expediente-fiscalizacao": ["expediente.validar", "documento.anexar"],
  "tramitacao-fiscalizacao": ["processo.ver", "processo.editar"],
  "parecer-trimestral": ["relatorio.criar", "relatorio.editar"],
  "saida-expediente-fiscalizacao": ["expediente.aprovar"],
  
  // Multas
  "multas": ["processo.ver"],
  "desencadear-multa": ["processo.criar", "processo.autuar"],
  "requerimento-inicial-multa": ["processo.editar", "documento.anexar"],
  "notificacao-demandado": ["notificacao.executar"],
  "pagamento-voluntario-multa": ["processo.ver"],
  "pagamento-prestacoes": ["processo.ver"],
  "contestacao-multa": ["processo.ver", "documento.anexar"],
  "constituicao-advogado": ["processo.ver"],
  "confianca-processo": ["processo.ver"],
  "audiencia-julgamento-multa": ["decisao.proferir"],
  "acordao-multa": ["decisao.proferir"],
  "notificacao-acordao": ["notificacao.executar"],
  "pedido-aclaracao": ["processo.ver", "documento.anexar"],
  "cobranca-coerciva": ["notificacao.executar", "certidao.emitir"],
  
  // Administração (apenas admins)
  "admin-config": [],
  "admin-settings": [],
  "calendario-judicial": [],
  "regras-distribuicao": [],
  "mapa-letra-juiz": [],
  "sla-regras": [],
  "emolumentos-tabela": [],
  "doc-templates": [],
  "notificacao-templates": [],
  "retencao-regras": [],
  "integration-config": [],
  "feature-flags": [],
};

// Perfis que têm acesso a menus específicos (alternativo às permissões)
export const perfilMenuAccess: Record<string, string[]> = {
  "gestao-rh": ["Presidente do TC", "Secretaria Geral", "Chefe SG"],
  "admin-config-group": ["Presidente do TC"],
};

// Grupos que requerem ser admin
export const adminOnlyGroups = ["admin-config-group"];

// Itens que requerem ser admin
export const adminOnlyItems = [
  "admin-config", "admin-settings", "calendario-judicial", 
  "regras-distribuicao", "mapa-letra-juiz", "sla-regras",
  "emolumentos-tabela", "doc-templates", "notificacao-templates",
  "retencao-regras", "integration-config", "feature-flags",
  "gestao-rh", "rh-cadastro-funcionarios", "rh-gestao-contratos",
  "rh-assiduidade-pontualidade", "rh-gestao-ferias-licencas",
  "rh-formacao-desenvolvimento", "rh-gestao-remuneracoes",
  "rh-gestao-documental-rh", "rh-gestao-pensionistas",
  "rh-relatorios-estatisticas-rh", "rh-solicitacoes-declaracoes"
];
