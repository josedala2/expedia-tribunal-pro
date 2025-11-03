import { ArrowLeft, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PagamentoVoluntarioMultaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const PagamentoVoluntarioMulta = ({ onBack }: PagamentoVoluntarioMultaProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Coins className="h-8 w-8 text-primary" />
            Pagamento Voluntário
          </h1>
          <p className="text-muted-foreground">Registo e comprovação de pagamento voluntário da multa</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em desenvolvimento. Funcionalidade para processar pagamento voluntário, vista ao MP e ordenar extinção da ação e arquivamento.
        </p>
      </Card>
    </div>
  );
};
