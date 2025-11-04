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
  data: string;
  referencia?: string;
}

interface OficioTemplateProps {
  numero: string;
  data: string;
  destinatario: string;
  cargo: string;
  entidade: string;
  assunto: string;
  conteudo: string;
  referencia?: string;
  assinante: string;
  cargoAssinante: string;
  logoUrl?: string;
}

export const OficioTemplate = ({ 
  numero,
  data,
  destinatario,
  cargo,
  entidade,
  assunto,
  conteudo,
  referencia,
  assinante,
  cargoAssinante,
  logoUrl 
}: OficioTemplateProps) => {
  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" id="document-content">
      <DocumentHeader logoUrl={logoUrl} />

      <div className="mb-6">
        <div className="flex justify-between mb-4">
          <div>
            <p className="font-semibold">Ofício nº {numero}</p>
            {referencia && (
              <p className="text-sm text-gray-600">Ref: {referencia}</p>
            )}
          </div>
          <div className="text-right">
            <p>Luanda, {format(new Date(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold">A Sua Excelência</p>
          <p className="font-semibold">{destinatario}</p>
          <p>{cargo}</p>
          <p>{entidade}</p>
        </div>

        <div className="mb-6">
          <p className="font-semibold underline">Assunto: {assunto}</p>
        </div>

        <div className="mb-8 text-justify leading-relaxed whitespace-pre-line">
          {conteudo}
        </div>

        <div className="mb-4">
          <p>Com os melhores cumprimentos,</p>
        </div>

        <div className="mt-12">
          <div className="border-t border-gray-400 w-64 mx-auto"></div>
          <p className="text-center mt-2 font-semibold">{assinante}</p>
          <p className="text-center text-sm">{cargoAssinante}</p>
        </div>
      </div>

      <DocumentFooter pageNumber={1} totalPages={1} />
    </div>
  );
};
