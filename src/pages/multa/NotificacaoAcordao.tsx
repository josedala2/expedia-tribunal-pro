import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NotificacaoAcordaoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const NotificacaoAcordao = ({ onBack }: NotificacaoAcordaoProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Send className="h-8 w-8 text-primary" />
            Notificação do Acórdão
          </h1>
          <p className="text-muted-foreground">Junção e notificação do acórdão assinado aos demandados</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em desenvolvimento. Funcionalidade para o Relator ordenar junção aos autos e mandado de notificação aos demandados (absolvição ou condenação).
        </p>
      </Card>
    </div>
  );
};
