import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RequerimentoInicialMultaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const RequerimentoInicialMulta = ({ onBack }: RequerimentoInicialMultaProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Elaboração do Requerimento Inicial
          </h1>
          <p className="text-muted-foreground">Ministério Público elabora o requerimento inicial do processo de multa</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em desenvolvimento. Funcionalidade para o Ministério Público elaborar o requerimento inicial com identificação do demandado, razões de facto e direito, e montantes.
        </p>
      </Card>
    </div>
  );
};
