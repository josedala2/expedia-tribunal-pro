import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";

interface RelatorioData {
  numero: string;
  tipo: string;
  processo: string;
  entidade: string;
  periodo: string;
  elaborador: string;
  data: Date;
  sumarioExecutivo: string;
  introducao: string;
  metodologia: string;
  constatacoes: string[];
  recomendacoes: string[];
  conclusao: string;
}

interface RelatorioTemplateProps {
  data: RelatorioData;
  logoUrl?: string;
}

export const RelatorioTemplate = ({ data, logoUrl }: RelatorioTemplateProps) => {
  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" id="document-content">
      <DocumentHeader logoUrl={logoUrl} />

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-2">RELATÓRIO {data.tipo.toUpperCase()}</h2>
        <p className="font-semibold">Nº {data.numero}</p>
      </div>

      <div className="mb-8 p-6 bg-gray-50 border border-gray-300 rounded">
        <div className="space-y-2">
          <p><span className="font-semibold">Processo:</span> {data.processo}</p>
          <p><span className="font-semibold">Entidade:</span> {data.entidade}</p>
          <p><span className="font-semibold">Período:</span> {data.periodo}</p>
          <p><span className="font-semibold">Data do Relatório:</span> {format(data.data, "dd/MM/yyyy")}</p>
          <p><span className="font-semibold">Elaborado por:</span> {data.elaborador}</p>
        </div>
      </div>

      <div className="mb-8 p-6 bg-blue-50 border-l-4 border-primary">
        <h3 className="font-bold text-lg mb-3">SUMÁRIO EXECUTIVO</h3>
        <p className="text-justify leading-relaxed">{data.sumarioExecutivo}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">1. INTRODUÇÃO</h3>
        <p className="text-justify leading-relaxed whitespace-pre-line">{data.introducao}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">2. METODOLOGIA</h3>
        <p className="text-justify leading-relaxed whitespace-pre-line">{data.metodologia}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">3. CONSTATAÇÕES</h3>
        <div className="space-y-4">
          {data.constatacoes.map((constatacao, index) => (
            <div key={index} className="pl-4 border-l-2 border-accent">
              <p className="font-semibold">3.{index + 1}</p>
              <p className="text-justify">{constatacao}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">4. RECOMENDAÇÕES</h3>
        <div className="space-y-3">
          {data.recomendacoes.map((recomendacao, index) => (
            <div key={index} className="flex gap-3">
              <span className="font-semibold flex-shrink-0">{index + 1}.</span>
              <p className="text-justify">{recomendacao}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-lg mb-3">5. CONCLUSÃO</h3>
        <p className="text-justify leading-relaxed whitespace-pre-line">{data.conclusao}</p>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <div className="border-t border-gray-400 w-64 mx-auto"></div>
        <p className="text-center mt-2 font-semibold">{data.elaborador}</p>
        <p className="text-center text-sm">Técnico Responsável</p>
        <p className="text-center text-sm text-gray-600 mt-2">
          {format(data.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      <DocumentFooter pageNumber={1} totalPages={1} />
    </div>
  );
};
