import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { QRCodeSVG } from "qrcode.react";

export interface ActaRecepcaoData {
  numeroExpediente: string;
  numeroActa: string;
  tipo: string;
  assunto: string;
  entidade: string;
  remetente: string;
  email?: string;
  telefone?: string;
  dataRecepcao: string;
  recebidoPor: string;
  urlVerificacao: string;
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
        <h2 className="text-2xl font-bold uppercase">Acta de Recepção de Expediente Externo</h2>
        <h3 className="text-xl font-bold">ACTA Nº {data.numeroActa}</h3>
        <p className="text-sm">Expediente Nº {data.numeroExpediente}</p>
      </div>

      <div className="space-y-4 text-sm leading-relaxed">
        <p className="text-justify">
          Aos <strong>{format(new Date(data.dataRecepcao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</strong>, 
          no Tribunal de Contas da República de Angola, foi recepcionado o seguinte expediente externo:
        </p>

        <div className="border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-semibold text-gray-700">Tipo de Expediente:</p>
              <p>{data.tipo}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Data de Recepção:</p>
              <p>{format(new Date(data.dataRecepcao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-700">Assunto:</p>
            <p className="text-justify">{data.assunto}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-semibold text-gray-700">Entidade Remetente:</p>
              <p>{data.entidade}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Representante:</p>
              <p>{data.remetente}</p>
            </div>
          </div>

          {(data.email || data.telefone) && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              {data.email && (
                <div>
                  <p className="font-semibold text-gray-700">Email:</p>
                  <p className="text-xs">{data.email}</p>
                </div>
              )}
              {data.telefone && (
                <div>
                  <p className="font-semibold text-gray-700">Telefone:</p>
                  <p>{data.telefone}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-justify">
          O expediente foi devidamente registado no sistema de gestão documental do Tribunal de Contas 
          e encontra-se em fase de análise e tramitação interna.
        </p>

        <div className="border border-gray-300 rounded-lg p-4 bg-blue-50">
          <p className="font-semibold text-center mb-3">VERIFICAÇÃO E ACOMPANHAMENTO</p>
          <p className="text-justify text-xs mb-4">
            Para acompanhar o estado da sua solicitação, utilize o código QR abaixo ou acesse o sistema 
            através do link fornecido. Guarde esta acta para referência futura.
          </p>
          
          <div className="flex flex-col items-center space-y-2">
            <QRCodeSVG 
              value={data.urlVerificacao} 
              size={120}
              level="H"
              includeMargin={true}
            />
            <p className="text-xs text-center text-gray-600 break-all max-w-xs">
              {data.urlVerificacao}
            </p>
          </div>
        </div>

        <div className="pt-6">
          <p className="text-sm">
            <strong>Recebido por:</strong> {data.recebidoPor}
          </p>
          <p className="text-sm text-gray-600">
            Funcionário responsável pela recepção de expedientes externos
          </p>
        </div>
      </div>

      <div className="mt-8 pt-4">
        <p className="text-center text-xs text-gray-600 italic">
          Este documento foi gerado automaticamente pelo Sistema de Gestão de Processos do Tribunal de Contas.
        </p>
      </div>

      <DocumentFooter />

      <div className="text-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
        <p>Documento de Recepção | Tribunal de Contas da República de Angola</p>
        <p>Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
      </div>
    </div>
  );
};
