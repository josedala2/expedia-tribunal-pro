import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ConfiancaProcessoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const ConfiancaProcesso = ({ onBack }: ConfiancaProcessoProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Eye className="h-8 w-8 text-primary" />
            Pedido de Confiança ao Processo
          </h1>
          <p className="text-muted-foreground">Consulta ao processo pelo MP, demandado ou advogado (prazo de 5 dias)</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em desenvolvimento. Funcionalidade para solicitar e processar pedidos de confiança ao processo mediante pagamento de guia.
        </p>
      </Card>
    </div>
  );
};
