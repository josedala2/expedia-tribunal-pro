import { ArrowLeft, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ConstituicaoAdvogadoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const ConstituicaoAdvogado = ({ onBack }: ConstituicaoAdvogadoProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Scale className="h-8 w-8 text-primary" />
            Constituição de Advogado
          </h1>
          <p className="text-muted-foreground">Registo de mandatário judicial com poderes especiais</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em desenvolvimento. Funcionalidade para o demandado constituir mandatário judicial mediante procuração passada há menos de 4 anos.
        </p>
      </Card>
    </div>
  );
};
