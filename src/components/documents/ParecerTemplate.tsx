import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";

interface ParecerData {
  numero: string;
  processo: string;
  entidade: string;
  exercicio: string;
  tipo: string;
  relator: string;
  data: Date;
  introducao: string;
  analise: string;
  conclusao: string;
  parecer: "Favorável" | "Desfavorável" | "Com Ressalvas";
}

interface ParecerTemplateProps {
  data: ParecerData;
  logoUrl?: string;
}

export const ParecerTemplate = ({ data, logoUrl }: ParecerTemplateProps) => {
  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" id="document-content">
      <DocumentHeader logoUrl={logoUrl} />

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-2">PARECER TÉCNICO</h2>
        <p className="font-semibold">Nº {data.numero}</p>
      </div>

      <div className="mb-6 space-y-2">
        <p><span className="font-semibold">Processo:</span> {data.processo}</p>
        <p><span className="font-semibold">Entidade:</span> {data.entidade}</p>
        <p><span className="font-semibold">Exercício:</span> {data.exercicio}</p>
        <p><span className="font-semibold">Tipo:</span> {data.tipo}</p>
        <p><span className="font-semibold">Data:</span> {format(data.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">I. INTRODUÇÃO</h3>
        <p className="text-justify leading-relaxed whitespace-pre-line">{data.introducao}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">II. ANÁLISE</h3>
        <p className="text-justify leading-relaxed whitespace-pre-line">{data.analise}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">III. CONCLUSÃO</h3>
        <p className="text-justify leading-relaxed whitespace-pre-line">{data.conclusao}</p>
      </div>

      <div className="mb-8 p-4 bg-gray-50 border-l-4 border-primary">
        <p className="font-bold text-lg mb-2">PARECER:</p>
        <p className={`text-lg font-semibold ${
          data.parecer === "Favorável" ? "text-success" : 
          data.parecer === "Desfavorável" ? "text-destructive" : 
          "text-accent"
        }`}>
          {data.parecer}
        </p>
      </div>

      <div className="mt-12">
        <div className="border-t border-gray-400 w-64 mx-auto"></div>
        <p className="text-center mt-2 font-semibold">{data.relator}</p>
        <p className="text-center text-sm">Juiz Relator</p>
      </div>

      <DocumentFooter pageNumber={1} totalPages={1} />
    </div>
  );
};
