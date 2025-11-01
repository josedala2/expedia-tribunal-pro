import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";

interface NotificacaoData {
  numero: string;
  processo: string;
  destinatario: string;
  entidade: string;
  assunto: string;
  tipo: "Decisão" | "Despacho" | "Intimação" | "Convocação";
  conteudo: string;
  prazoResposta?: string;
  data: Date;
  assinante: string;
  cargoAssinante: string;
}

interface NotificacaoTemplateProps {
  data: NotificacaoData;
  logoUrl?: string;
}

export const NotificacaoTemplate = ({ data, logoUrl }: NotificacaoTemplateProps) => {
  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" id="document-content">
      <DocumentHeader logoUrl={logoUrl} />

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-2">NOTIFICAÇÃO DE {data.tipo.toUpperCase()}</h2>
        <p className="font-semibold">Nº {data.numero}</p>
      </div>

      <div className="mb-6">
        <p className="text-right">Luanda, {format(data.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
      </div>

      <div className="mb-6">
        <p className="font-semibold">Ao(À) Ilustríssimo(a) Senhor(a)</p>
        <p className="font-semibold">{data.destinatario}</p>
        <p>{data.entidade}</p>
      </div>

      <div className="mb-6">
        <p><span className="font-semibold">Processo:</span> {data.processo}</p>
        <p><span className="font-semibold">Assunto:</span> {data.assunto}</p>
      </div>

      <div className="mb-8 p-6 bg-gray-50 border-l-4 border-primary">
        <h3 className="font-bold text-lg mb-4">NOTIFICAÇÃO</h3>
        <p className="text-justify leading-relaxed whitespace-pre-line">{data.conteudo}</p>
      </div>

      {data.prazoResposta && (
        <div className="mb-8 p-4 bg-yellow-50 border-2 border-yellow-400 rounded">
          <p className="font-bold text-destructive">IMPORTANTE:</p>
          <p className="mt-2">O prazo para cumprimento desta notificação é de <span className="font-bold">{data.prazoResposta}</span>, contados a partir da data de recebimento.</p>
        </div>
      )}

      <div className="mb-8">
        <p className="font-semibold mb-4">Disposições Finais:</p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>O não cumprimento desta notificação poderá resultar em sanções previstas na legislação</li>
          <li>Para esclarecimentos, contacte a Contadoria Geral da República</li>
          <li>Este documento tem força legal conforme Lei Orgânica do Tribunal de Contas</li>
        </ul>
      </div>

      <div className="mt-12">
        <div className="border-t border-gray-400 w-64 mx-auto"></div>
        <p className="text-center mt-2 font-semibold">{data.assinante}</p>
        <p className="text-center text-sm">{data.cargoAssinante}</p>
      </div>

      <div className="mt-8 border-t-2 border-gray-300 pt-4">
        <p className="text-sm font-semibold mb-2">RECIBO DE NOTIFICAÇÃO</p>
        <div className="flex justify-between text-sm">
          <div className="w-1/2">
            <p className="mb-8">Nome: ___________________________________</p>
            <p>Assinatura: ________________________________</p>
          </div>
          <div className="w-1/3">
            <p>Data: ____/____/________</p>
          </div>
        </div>
      </div>

      <DocumentFooter pageNumber={1} totalPages={1} />
    </div>
  );
};
