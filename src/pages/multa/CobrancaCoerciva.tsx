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
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-primary" />Cobrança Coerciva
          </h1>
        </div>
      </div>
      <Card className="p-6"><p className="text-muted-foreground">Extração de certidões para execução</p></Card>
    </div>
  );
};
