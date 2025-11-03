import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { QRCodeSVG } from "qrcode.react";

export interface ActaRecepcaoData {
  numeroExpediente: string;
  tipo: string;
  assunto: string;
  entidade: string;
  dataEmissao: string;
  numeroPaginas?: string;
  responsavelEntregaNome: string;
  responsavelEntregaCargo?: string;
  responsavelEntregaInstituicao?: string;
  responsavelRecepcaoNome: string;
  responsavelRecepcaoCargo?: string;
  responsavelRecepcaoDepartamento?: string;
  dataRecepcao: string;
  local: string;
  observacoes?: string;
}

interface ActaRecepcaoTemplateProps {
  data: ActaRecepcaoData;
  logoUrl?: string;
}

export const ActaRecepcaoTemplate = ({ data, logoUrl }: ActaRecepcaoTemplateProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 print:p-12 space-y-6 text-black">
      <DocumentHeader logoUrl={logoUrl} />

      <div className="text-center space-y-2 my-6">
        <h2 className="text-2xl font-bold uppercase">Acta de Recepção de Documento</h2>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <p className="text-justify">
          Aos <strong>{format(new Date(data.dataRecepcao), "dd", { locale: ptBR })}</strong> dias do mês de{" "}
          <strong>{format(new Date(data.dataRecepcao), "MMMM", { locale: ptBR })}</strong> do ano de{" "}
          <strong>{format(new Date(data.dataRecepcao), "yyyy", { locale: ptBR })}</strong>, nas instalações do{" "}
          <strong>Tribunal de Contas da República de Angola</strong>, sito em{" "}
          <strong>{data.local}</strong>, procedeu-se à recepção formal do documento abaixo identificado.
        </p>

        {/* Identificação do Documento */}
        <div className="space-y-2 pl-4">
          <p><span className="font-semibold">Tipo de documento:</span> {data.tipo}</p>
          <p><span className="font-semibold">Número / Referência:</span> {data.numeroExpediente}</p>
          <p><span className="font-semibold">Assunto / Título:</span> {data.assunto}</p>
          <p><span className="font-semibold">Origem / Entidade remetente:</span> {data.entidade}</p>
          <p><span className="font-semibold">Data de emissão:</span> {format(new Date(data.dataEmissao), "dd/MM/yyyy", { locale: ptBR })}</p>
          {data.numeroPaginas && (
            <p><span className="font-semibold">Número de páginas / volumes:</span> {data.numeroPaginas}</p>
          )}
        </div>

        {/* Responsável pela Entrega */}
        <div className="space-y-3">
          <h3 className="font-bold text-base">Responsável pela Entrega</h3>
          <div className="pl-4 space-y-2">
            <p><span className="font-semibold">Nome:</span> {data.responsavelEntregaNome}</p>
            {data.responsavelEntregaCargo && (
              <p><span className="font-semibold">Cargo / Função:</span> {data.responsavelEntregaCargo}</p>
            )}
            {data.responsavelEntregaInstituicao && (
              <p><span className="font-semibold">Instituição:</span> {data.responsavelEntregaInstituicao}</p>
            )}
            <p><span className="font-semibold">Assinatura:</span> _________________________________</p>
          </div>
        </div>

        {/* Recepcionou Pelo Tribunal */}
        <div className="space-y-3">
          <h3 className="font-bold text-base">Recepcionou Pelo Tribunal</h3>
          <div className="pl-4 space-y-2">
            <p><span className="font-semibold">Nome:</span> {data.responsavelRecepcaoNome}</p>
            {data.responsavelRecepcaoCargo && (
              <p><span className="font-semibold">Cargo / Função:</span> {data.responsavelRecepcaoCargo}</p>
            )}
            {data.responsavelRecepcaoDepartamento && (
              <p><span className="font-semibold">Departamento:</span> {data.responsavelRecepcaoDepartamento}</p>
            )}
            <p><span className="font-semibold">Assinatura:</span> _________________________________</p>
          </div>
        </div>

        {/* Observações */}
        <div className="space-y-3">
          <h3 className="font-bold text-base">Observações</h3>
          <div className="pl-4">
            <p className="text-justify">{data.observacoes || "(Sem observações)"}</p>
          </div>
        </div>

        {/* Conclusão */}
        <div className="space-y-4 pt-4">
          <p className="text-justify">
            Nada mais havendo a tratar, foi lavrada a presente acta, que depois de lida e achada conforme, 
            vai ser assinada pelos intervenientes acima identificados, para efeitos legais.
          </p>
        </div>

        {/* Local e Data */}
        <div className="pt-6 space-y-2">
          <p><span className="font-semibold">Local:</span> {data.local}</p>
          <p><span className="font-semibold">Data:</span> {format(new Date(data.dataRecepcao), "dd/MM/yyyy", { locale: ptBR })}</p>
        </div>

        <div className="pt-12 grid grid-cols-2 gap-8">
          <div className="text-center space-y-4">
            <div className="border-t-2 border-black pt-2">
              <p className="font-semibold">O Responsável pela Entrega</p>
              <p className="text-xs">(Assinatura e carimbo, se aplicável)</p>
            </div>
          </div>
          <div className="text-center space-y-4">
            <div className="border-t-2 border-black pt-2">
              <p className="font-semibold">O Responsável pela Recepção</p>
              <p className="text-xs">(Assinatura e carimbo, se aplicável)</p>
            </div>
          </div>
        </div>
      </div>

      <DocumentFooter />

      <div className="text-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
        <p>Documento de Recepção | Tribunal de Contas da República de Angola</p>
        <p>Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
      </div>
    </div>
  );
};
