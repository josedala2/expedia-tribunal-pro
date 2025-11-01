import { format } from "date-fns";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";

interface TermoJuntadaData {
  processo: string;
  entidade: string;
  documentosJuntados: string[];
  observacoes: string;
  escrivao: string;
  dataJuntada: Date;
}

interface TermoJuntadaTemplateProps {
  data: TermoJuntadaData;
  logoUrl?: string;
}

export const TermoJuntadaTemplate = ({ data, logoUrl }: TermoJuntadaTemplateProps) => {
  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" id="document-content">
      <DocumentHeader logoUrl={logoUrl} />

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold">TERMO DE JUNTADA</h2>
        <p className="text-sm text-gray-600 mt-2">Processo nº {data.processo}</p>
      </div>

      <div className="mb-6 text-justify leading-relaxed">
        <p className="mb-4">
          Aos <strong>{format(data.dataJuntada, "dd")}</strong> dias do mês de{" "}
          <strong>{format(data.dataJuntada, "MMMM")}</strong> do ano de{" "}
          <strong>{format(data.dataJuntada, "yyyy")}</strong>, nesta cidade de Luanda, 
          República de Angola, na sede do Tribunal de Contas da República de Angola, 
          na Contadoria Geral da República, eu, <strong>{data.escrivao}</strong>, 
          Escrivão dos Autos, faço juntar aos presentes autos do processo em epígrafe, 
          os seguintes documentos:
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-3 text-lg border-b pb-2">DOCUMENTOS JUNTADOS</h3>
        <ul className="space-y-2">
          {data.documentosJuntados.map((doc, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="font-semibold">{index + 1}.</span>
              <span>{doc}</span>
            </li>
          ))}
        </ul>
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
          Os documentos acima identificados passam a integrar os autos do processo{" "}
          <strong>{data.processo}</strong>, referente à entidade <strong>{data.entidade}</strong>.
        </p>
      </div>

      <div className="mt-12 text-center">
        <p className="mb-1">Luanda, {format(data.dataJuntada, "dd 'de' MMMM 'de' yyyy")}</p>
        <div className="mt-8 pt-4 border-t border-gray-400 inline-block px-8">
          <p className="font-semibold">{data.escrivao}</p>
          <p className="text-sm">Escrivão dos Autos</p>
        </div>
      </div>

      <DocumentFooter pageNumber={1} totalPages={1} />
    </div>
  );
};
