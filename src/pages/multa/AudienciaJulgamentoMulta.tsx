import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AudienciaJulgamentoMultaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const AudienciaJulgamentoMulta = ({ onBack }: AudienciaJulgamentoMultaProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Audiência de Julgamento
          </h1>
          <p className="text-muted-foreground">Marcação e registo de audiência presidida pelo Presidente da 2ª Câmara</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em desenvolvimento. Funcionalidade para marcar audiência, emitir notificações e registar alegações (máximo 20 minutos por parte).
        </p>
      </Card>
    </div>
  );
};
