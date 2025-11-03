import { ArrowLeft, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ContestacaoMultaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const ContestacaoMulta = ({ onBack }: ContestacaoMultaProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FileCheck className="h-8 w-8 text-primary" />
            Pedido de Contestação
          </h1>
          <p className="text-muted-foreground">Entrada e análise de contestação (prazo de 10 dias improrrogáveis)</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em desenvolvimento. Funcionalidade para o gestor dar entrada com pedido de contestação na SG do TC para análise do Juiz Relator.
        </p>
      </Card>
    </div>
  );
};
