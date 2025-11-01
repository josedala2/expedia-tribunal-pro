import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";

interface DespachoData {
  numero: string;
  processo: string;
  tipo: string;
  origem: string;
  destino: string;
  data: Date;
  conteudo: string;
  determinacoes: string[];
  prazo?: string;
  assinante: string;
  cargoAssinante: string;
}

interface DespachoTemplateProps {
  data: DespachoData;
  logoUrl?: string;
}

export const DespachoTemplate = ({ data, logoUrl }: DespachoTemplateProps) => {
  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" id="document-content">
      <DocumentHeader logoUrl={logoUrl} />

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-2">DESPACHO</h2>
        <p className="font-semibold">Nº {data.numero}</p>
      </div>

      <div className="mb-6">
        <p className="text-right">Luanda, {format(data.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
      </div>

      <div className="mb-6 space-y-2">
        <p><span className="font-semibold">Processo:</span> {data.processo}</p>
        <p><span className="font-semibold">Tipo:</span> {data.tipo}</p>
        <p><span className="font-semibold">Origem:</span> {data.origem}</p>
        <p><span className="font-semibold">Destino:</span> {data.destino}</p>
      </div>

      <div className="mb-8 p-6 bg-gray-50 border-l-4 border-primary">
        <h3 className="font-bold text-lg mb-4">DESPACHO</h3>
        <p className="text-justify leading-relaxed whitespace-pre-line mb-6">{data.conteudo}</p>

        {data.determinacoes.length > 0 && (
          <div>
            <p className="font-semibold mb-3">Assim sendo, determino:</p>
            <ol className="list-decimal list-inside space-y-2">
              {data.determinacoes.map((determinacao, index) => (
                <li key={index} className="text-justify">{determinacao}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {data.prazo && (
        <div className="mb-8 p-4 bg-yellow-50 border-2 border-yellow-400 rounded">
          <p className="font-bold">PRAZO PARA CUMPRIMENTO:</p>
          <p className="mt-2 text-lg font-semibold text-destructive">{data.prazo}</p>
        </div>
      )}

      <div className="mb-6">
        <p className="font-semibold">Disposições Finais:</p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
          <li>Dê-se conhecimento aos interessados</li>
          <li>Cumpra-se e publique-se</li>
          <li>Arquive-se após cumprimento</li>
        </ul>
      </div>

      <div className="mt-12">
        <div className="border-t border-gray-400 w-64 mx-auto"></div>
        <p className="text-center mt-2 font-semibold">{data.assinante}</p>
        <p className="text-center text-sm">{data.cargoAssinante}</p>
      </div>

      <DocumentFooter pageNumber={1} totalPages={1} />
    </div>
  );
};
