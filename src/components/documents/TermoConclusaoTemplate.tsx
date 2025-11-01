import { format } from "date-fns";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";

interface TermoConclusaoData {
  processo: string;
  entidade: string;
  destinatario: string;
  cargoDestinatario: string;
  motivo: string;
  observacoes?: string;
  escrivao: string;
  dataConclusao: Date;
}

interface TermoConclusaoTemplateProps {
  data: TermoConclusaoData;
  logoUrl?: string;
}

export const TermoConclusaoTemplate = ({ data, logoUrl }: TermoConclusaoTemplateProps) => {
  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" id="document-content">
      <DocumentHeader logoUrl={logoUrl} />

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold">TERMO DE CONCLUSÃO</h2>
        <p className="text-sm text-gray-600 mt-2">Processo nº {data.processo}</p>
      </div>

      <div className="mb-6 text-justify leading-relaxed">
        <p className="mb-4">
          Aos <strong>{format(data.dataConclusao, "dd")}</strong> dias do mês de{" "}
          <strong>{format(data.dataConclusao, "MMMM")}</strong> do ano de{" "}
          <strong>{format(data.dataConclusao, "yyyy")}</strong>, nesta cidade de Luanda, 
          República de Angola, na sede do Tribunal de Contas da República de Angola, 
          na Contadoria Geral da República, eu, <strong>{data.escrivao}</strong>, 
          Escrivão dos Autos, faço estes autos conclusos ao(à) <strong>{data.destinatario}</strong>,{" "}
          <strong>{data.cargoDestinatario}</strong>.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-3 text-lg border-b pb-2">MOTIVO DA CONCLUSÃO</h3>
        <p className="text-justify leading-relaxed">
          {data.motivo}
        </p>
      </div>

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
          Os presentes autos referem-se ao processo <strong>{data.processo}</strong>, 
          da entidade <strong>{data.entidade}</strong>, e são remetidos para apreciação 
          e decisão.
        </p>
      </div>

      <div className="mt-12 text-center">
        <p className="mb-1">Luanda, {format(data.dataConclusao, "dd 'de' MMMM 'de' yyyy")}</p>
        <div className="mt-8 pt-4 border-t border-gray-400 inline-block px-8">
          <p className="font-semibold">{data.escrivao}</p>
          <p className="text-sm">Escrivão dos Autos</p>
        </div>
      </div>

      <DocumentFooter pageNumber={1} totalPages={1} />
    </div>
  );
};
