import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PedidoAclaracaoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const PedidoAclaracao = ({ onBack }: PedidoAclaracaoProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            Pedido de Aclaração
          </h1>
          <p className="text-muted-foreground">Reclamação para aclaração ou correção de erros materiais do acórdão</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em desenvolvimento. Funcionalidade para MP e/ou demandado apresentarem reclamação após comunicação do acórdão, concluso ao Juiz Relator para despacho de aclaração.
        </p>
      </Card>
    </div>
  );
};
