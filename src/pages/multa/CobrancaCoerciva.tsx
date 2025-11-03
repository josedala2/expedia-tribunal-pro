import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CobrancaCoercivaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const CobrancaCoerciva = ({ onBack }: CobrancaCoercivaProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-primary" />
            Execução/Cobrança Coerciva
          </h1>
          <p className="text-muted-foreground">Extração de certidões para cobrança coerciva após não pagamento</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em desenvolvimento. Funcionalidade para o Juiz Relator ordenar extração de certidões e remessa ao MP para cobrança coerciva.
        </p>
      </Card>
    </div>
  );
};
