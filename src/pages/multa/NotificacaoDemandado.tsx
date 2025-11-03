import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NotificacaoDemandadoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const NotificacaoDemandado = ({ onBack }: NotificacaoDemandadoProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Notificação ao Demandado
          </h1>
          <p className="text-muted-foreground">Juiz Relator ordena notificação para contestação ou pagamento voluntário (10 dias)</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em desenvolvimento. Funcionalidade para notificar o demandado para contestar no prazo legal ou pagar voluntariamente a multa e emolumentos.
        </p>
      </Card>
    </div>
  );
};
