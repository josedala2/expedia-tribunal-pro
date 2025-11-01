import { format } from "date-fns";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";

interface TermoNotificacaoData {
  processo: string;
  entidade: string;
  destinatario: string;
  cargoDestinatario: string;
  tipoDecisao: string;
  conteudoNotificacao: string;
  prazoResposta?: number;
  observacoes?: string;
  escrivao: string;
  dataNotificacao: Date;
}

interface TermoNotificacaoTemplateProps {
  data: TermoNotificacaoData;
  logoUrl?: string;
}

export const TermoNotificacaoTemplate = ({ data, logoUrl }: TermoNotificacaoTemplateProps) => {
  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" id="document-content">
      <DocumentHeader logoUrl={logoUrl} />

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold">TERMO DE NOTIFICAÇÃO</h2>
        <p className="text-sm text-gray-600 mt-2">Processo nº {data.processo}</p>
      </div>

      <div className="mb-6 text-justify leading-relaxed">
        <p className="mb-4">
          Aos <strong>{format(data.dataNotificacao, "dd")}</strong> dias do mês de{" "}
          <strong>{format(data.dataNotificacao, "MMMM")}</strong> do ano de{" "}
          <strong>{format(data.dataNotificacao, "yyyy")}</strong>, nesta cidade de Luanda, 
          República de Angola, na sede do Tribunal de Contas da República de Angola, 
          na Contadoria Geral da República, eu, <strong>{data.escrivao}</strong>, 
          Escrivão dos Autos, procedo à notificação do(a) <strong>{data.destinatario}</strong>,{" "}
          <strong>{data.cargoDestinatario}</strong>, nos seguintes termos:
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-3 text-lg border-b pb-2">TIPO DE DECISÃO</h3>
        <p className="text-justify leading-relaxed">
          <strong>{data.tipoDecisao}</strong>
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-3 text-lg border-b pb-2">CONTEÚDO DA NOTIFICAÇÃO</h3>
        <p className="text-justify leading-relaxed whitespace-pre-line">
          {data.conteudoNotificacao}
        </p>
      </div>

      {data.prazoResposta && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded">
          <h4 className="font-bold mb-2">PRAZO PARA RESPOSTA</h4>
          <p className="text-sm">
            O notificado dispõe do prazo de <strong>{data.prazoResposta} dias</strong> para 
            apresentar resposta, recurso ou cumprimento do determinado, contados a partir 
            da data desta notificação.
          </p>
        </div>
      )}

      {data.observacoes && (
        <div className="mb-6">
          <h3 className="font-bold mb-3 text-lg border-b pb-2">OBSERVAÇÕES</h3>
          <p className="text-justify leading-relaxed whitespace-pre-line">
            {data.observacoes}
          </p>
        </div>
      )}

      <div className="mb-6">
        <p className="text-justify leading-relaxed">
          A presente notificação refere-se ao processo <strong>{data.processo}</strong>, 
          da entidade <strong>{data.entidade}</strong>, e é efetuada nos termos da 
          legislação em vigor.
        </p>
      </div>

      <div className="mt-12">
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center">
            <p className="mb-1">Luanda, {format(data.dataNotificacao, "dd 'de' MMMM 'de' yyyy")}</p>
            <div className="mt-8 pt-4 border-t border-gray-400">
              <p className="font-semibold">{data.escrivao}</p>
              <p className="text-sm">Escrivão dos Autos</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="mb-1 text-sm text-gray-600">Ciente em ___/___/______</p>
            <div className="mt-8 pt-4 border-t border-gray-400">
              <p className="font-semibold">{data.destinatario}</p>
              <p className="text-sm">{data.cargoDestinatario}</p>
            </div>
          </div>
        </div>
      </div>

      <DocumentFooter pageNumber={1} totalPages={1} />
    </div>
  );
};
