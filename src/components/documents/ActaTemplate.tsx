import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";

interface Participante {
  nome: string;
  cargo: string;
}

interface ActaData {
  numero: string;
  tipo: string;
  data: Date;
  horaInicio: string;
  horaFim: string;
  local: string;
  participantes: Participante[];
  assuntos: string[];
  deliberacoes: string[];
  observacoes?: string;
  secretario: string;
  presidente: string;
}

interface ActaTemplateProps {
  data: ActaData;
  logoUrl?: string;
}

export const ActaTemplate = ({ data, logoUrl }: ActaTemplateProps) => {
  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" id="document-content">
      <DocumentHeader logoUrl={logoUrl} />

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-2">ACTA DE {data.tipo.toUpperCase()}</h2>
        <p className="font-semibold">Nº {data.numero}</p>
      </div>

      <div className="mb-6">
        <p><span className="font-semibold">Data:</span> {format(data.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
        <p><span className="font-semibold">Horário:</span> {data.horaInicio} às {data.horaFim}</p>
        <p><span className="font-semibold">Local:</span> {data.local}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">PARTICIPANTES</h3>
        <ul className="list-none space-y-2">
          {data.participantes.map((participante, index) => (
            <li key={index}>
              <span className="font-semibold">{participante.nome}</span> - {participante.cargo}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">ORDEM DO DIA</h3>
        <ol className="list-decimal list-inside space-y-2">
          {data.assuntos.map((assunto, index) => (
            <li key={index}>{assunto}</li>
          ))}
        </ol>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">DELIBERAÇÕES</h3>
        <div className="space-y-4">
          {data.deliberacoes.map((deliberacao, index) => (
            <div key={index} className="pl-4 border-l-2 border-primary">
              <p className="font-semibold">Deliberação {index + 1}:</p>
              <p className="text-justify">{deliberacao}</p>
            </div>
          ))}
        </div>
      </div>

      {data.observacoes && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3">OBSERVAÇÕES</h3>
          <p className="text-justify">{data.observacoes}</p>
        </div>
      )}

      <div className="mb-8">
        <p>Nada mais havendo a tratar, foi encerrada a reunião às {data.horaFim}, lavrando-se a presente acta que vai assinada por todos os presentes.</p>
      </div>

      <div className="mt-12 space-y-8">
        <div>
          <div className="border-t border-gray-400 w-64 mx-auto"></div>
          <p className="text-center mt-2 font-semibold">{data.secretario}</p>
          <p className="text-center text-sm">Secretário</p>
        </div>

        <div>
          <div className="border-t border-gray-400 w-64 mx-auto"></div>
          <p className="text-center mt-2 font-semibold">{data.presidente}</p>
          <p className="text-center text-sm">Presidente</p>
        </div>
      </div>

      <DocumentFooter pageNumber={1} totalPages={1} />
    </div>
  );
};
