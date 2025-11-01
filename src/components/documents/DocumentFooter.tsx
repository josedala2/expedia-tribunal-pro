import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DocumentFooterProps {
  pageNumber?: number;
  totalPages?: number;
}

export const DocumentFooter = ({ pageNumber, totalPages }: DocumentFooterProps) => {
  return (
    <div className="mt-8 pt-4 border-t border-gray-300 text-sm text-gray-600">
      <div className="flex justify-between items-center">
        <div>
          <p>Tribunal de Contas da República de Angola</p>
          <p className="text-xs">Av. Comandante Valódia, Luanda - Angola</p>
        </div>
        {pageNumber && totalPages && (
          <div className="text-right">
            <p>Página {pageNumber} de {totalPages}</p>
          </div>
        )}
      </div>
    </div>
  );
};
