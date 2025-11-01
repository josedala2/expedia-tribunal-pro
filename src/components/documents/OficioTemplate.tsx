import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";

interface OficioData {
  numero: string;
  destinatario: string;
  cargo: string;
  entidade: string;
  assunto: string;
  conteudo: string;
  assinante: string;
  cargoAssinante: string;
  data: Date;
  referencia?: string;
}

interface OficioTemplateProps {
  data: OficioData;
  logoUrl?: string;
}

export const OficioTemplate = ({ data, logoUrl }: OficioTemplateProps) => {
  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" id="document-content">
      <DocumentHeader logoUrl={logoUrl} />

      <div className="mb-6">
        <div className="flex justify-between mb-4">
          <div>
            <p className="font-semibold">Ofício nº {data.numero}</p>
            {data.referencia && (
              <p className="text-sm text-gray-600">Ref: {data.referencia}</p>
            )}
          </div>
          <div className="text-right">
            <p>Luanda, {format(data.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold">A Sua Excelência</p>
          <p className="font-semibold">{data.destinatario}</p>
          <p>{data.cargo}</p>
          <p>{data.entidade}</p>
        </div>

        <div className="mb-6">
          <p className="font-semibold underline">Assunto: {data.assunto}</p>
        </div>

        <div className="mb-8 text-justify leading-relaxed whitespace-pre-line">
          {data.conteudo}
        </div>

        <div className="mb-4">
          <p>Com os melhores cumprimentos,</p>
        </div>

        <div className="mt-12">
          <div className="border-t border-gray-400 w-64 mx-auto"></div>
          <p className="text-center mt-2 font-semibold">{data.assinante}</p>
          <p className="text-center text-sm">{data.cargoAssinante}</p>
        </div>
      </div>

      <DocumentFooter pageNumber={1} totalPages={1} />
    </div>
  );
};
