export type StatusProcesso = 
  | "Recebido"
  | "Em Análise"
  | "Em Verificação"
  | "Aguardando Aprovação"
  | "Aprovado"
  | "Rejeitado"
  | "Pendente Correção"
  | "Arquivado";

export type TipoProcesso =
  | "Prestação de Contas"
  | "Visto Prévio"
  | "Visto Sucessivo"
  | "Fiscalização OGE"
  | "Autónomo de Multa"
  | "Expediente";

export interface EtapaTramitacao {
  id: string;
  etapa: string;
  responsavel: string;
  dataInicio: string;
  dataFim?: string;
  status: "Em Andamento" | "Concluído" | "Pendente";
  observacoes?: string;
  decisao?: "Aprovado" | "Rejeitado" | "Retornar";
}

export interface Processo {
  id: string;
  numero: string;
  tipo: TipoProcesso;
  entidade: string;
  responsavel: string;
  status: StatusProcesso;
  prioridade: "Normal" | "Alta" | "Urgente";
  dataAbertura: string;
  prazo: string;
  valor?: string;
  descricao: string;
  etapaAtual: string;
  tramitacao: EtapaTramitacao[];
  documentos: Documento[];
}

export interface Documento {
  id: string;
  nome: string;
  tipo: string;
  tamanho: string;
  dataUpload: string;
  uploadPor: string;
}

export interface AcaoProcesso {
  id: string;
  tipo: "Análise" | "Aprovação" | "Rejeição" | "Solicitação" | "Decisão";
  descricao: string;
  responsavel: string;
  data: string;
  comentarios: string;
}
