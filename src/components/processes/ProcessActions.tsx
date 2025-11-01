import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  MessageSquare, 
  UserPlus,
  FileOutput
} from "lucide-react";

export const ProcessActions = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Ações Disponíveis</CardTitle>
          <p className="text-sm text-muted-foreground">Execute ações no processo atual</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start gap-3 h-12 bg-success hover:bg-success/90 text-white">
            <CheckCircle className="h-5 w-5" />
            Aprovar e Avançar
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 h-12">
            <ArrowRight className="h-5 w-5" />
            Encaminhar para Validação
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 h-12">
            <UserPlus className="h-5 w-5" />
            Atribuir Responsável
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 h-12">
            <FileOutput className="h-5 w-5" />
            Solicitar Documentação
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 h-12 border-destructive/50 text-destructive hover:bg-destructive/10">
            <XCircle className="h-5 w-5" />
            Devolver com Pendências
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Adicionar Observação</CardTitle>
          <p className="text-sm text-muted-foreground">Registre comentários sobre o processo</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="observation">Observação</Label>
            <Textarea
              id="observation"
              placeholder="Digite suas observações sobre o processo..."
              className="min-h-32 resize-none"
            />
          </div>
          <Button className="w-full gap-2">
            <MessageSquare className="h-4 w-4" />
            Adicionar Observação
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border lg:col-span-2">
        <CardHeader>
          <CardTitle>Histórico de Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                user: "João Silva",
                date: "2025-03-17 10:30",
                text: "Análise técnica em andamento. Documentação financeira está conforme os requisitos estabelecidos.",
              },
              {
                user: "Ana Costa",
                date: "2025-03-16 14:45",
                text: "Verificação preliminar concluída. Todos os documentos necessários foram apresentados pela entidade.",
              },
              {
                user: "Pedro Santos",
                date: "2025-03-15 11:15",
                text: "Processo validado pela secretaria e encaminhado para a divisão competente.",
              },
            ].map((obs, index) => (
              <div key={index} className="p-4 rounded-lg border border-border bg-secondary/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">{obs.user}</p>
                  <p className="text-sm text-muted-foreground">{obs.date}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{obs.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
