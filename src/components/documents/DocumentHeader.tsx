import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DocumentHeaderProps {
  logoUrl?: string;
  showLogo?: boolean;
}

export const DocumentHeader = ({ logoUrl, showLogo = true }: DocumentHeaderProps) => {
  return (
    <div className="text-center mb-8 pb-4 border-b-2 border-gray-800">
      {showLogo && logoUrl && (
        <img src={logoUrl} alt="Logo" className="mx-auto mb-4 h-20" />
      )}
      <h1 className="text-xl font-bold mb-1">REPÚBLICA DE ANGOLA</h1>
      <h2 className="text-lg font-semibold mb-1">TRIBUNAL DE CONTAS</h2>
      <h3 className="text-base font-medium">Contadoria Geral da República</h3>
    </div>
  );
};
