import { ArrowLeft, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AcordaoMultaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const AcordaoMulta = ({ onBack }: AcordaoMultaProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Gavel className="h-8 w-8 text-primary" />
            Resolução/Acórdão
          </h1>
          <p className="text-muted-foreground">Elaboração e assinatura de acórdão pela 2ª Câmara</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em desenvolvimento. Funcionalidade para o Juiz Relator elaborar acórdão e submeter à apreciação e assinatura dos Conselheiros da 2ª Câmara.
        </p>
      </Card>
    </div>
  );
};
