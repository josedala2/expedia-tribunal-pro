import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PagamentoPrestacoesProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const PagamentoPrestacoes = ({ onBack }: PagamentoPrestacoesProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            Pagamento em Prestações
          </h1>
          <p className="text-muted-foreground">Gestão de pedido de pagamento parcelado (até 6 prestações trimestrais)</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em desenvolvimento. Funcionalidade para solicitar e gerir pagamento em até seis prestações trimestrais com juros de mora.
        </p>
      </Card>
    </div>
  );
};
