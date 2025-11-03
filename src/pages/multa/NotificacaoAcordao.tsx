import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface NotificacaoAcordaoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const NotificacaoAcordao = ({ onBack }: NotificacaoAcordaoProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Send className="h-8 w-8 text-primary" />Notificação do Acórdão
          </h1>
        </div>
      </div>
      <Card className="p-6"><p className="text-muted-foreground">Gestão de notificações de acórdãos aos demandados</p></Card>
    </div>
  );
};
