import { ArrowLeft, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DesencadearMultaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const DesencadearMulta = ({ onBack }: DesencadearMultaProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FileWarning className="h-8 w-8 text-primary" />
            Desencadear Processo Autónomo de Multa
          </h1>
          <p className="text-muted-foreground">Remeter autos ao Ministério Público para elaboração do requerimento inicial</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em desenvolvimento. Funcionalidade para o Juiz Relator desencadear o processo autónomo de multa.
        </p>
      </Card>
    </div>
  );
};
