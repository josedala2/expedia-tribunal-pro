import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Circle } from "lucide-react";

const timelineEvents = [
  {
    id: 1,
    stage: "Registo de Entrada",
    status: "completed",
    user: "Secretaria Geral",
    date: "2025-03-15 09:30",
    description: "Processo registado e autuado com sucesso",
  },
  {
    id: 2,
    stage: "Digitalização",
    status: "completed",
    user: "Maria Silva",
    date: "2025-03-15 10:15",
    description: "Documentos digitalizados e anexados ao processo",
  },
  {
    id: 3,
    stage: "Validação da Secretaria",
    status: "completed",
    user: "Pedro Santos",
    date: "2025-03-15 11:00",
    description: "Documentação validada e encaminhada para divisão competente",
  },
  {
    id: 4,
    stage: "Verificação de Documento",
    status: "completed",
    user: "Ana Costa",
    date: "2025-03-16 14:30",
    description: "Verificação preliminar concluída sem irregularidades",
  },
  {
    id: 5,
    stage: "Análise Técnica",
    status: "current",
    user: "João Silva",
    date: "2025-03-17 08:00",
    description: "Análise técnica em andamento",
  },
  {
    id: 6,
    stage: "Validação do Chefe de Secção",
    status: "pending",
    user: "-",
    date: "-",
    description: "Aguardando conclusão da análise técnica",
  },
  {
    id: 7,
    stage: "Validação do Chefe de Divisão",
    status: "pending",
    user: "-",
    date: "-",
    description: "Pendente",
  },
  {
    id: 8,
    stage: "Controle de Qualidade",
    status: "pending",
    user: "-",
    date: "-",
    description: "Pendente",
  },
  {
    id: 9,
    stage: "Decisão",
    status: "pending",
    user: "-",
    date: "-",
    description: "Pendente",
  },
];

export const ProcessTimeline = () => {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Tramitação do Processo</CardTitle>
        <p className="text-sm text-muted-foreground">Histórico completo de etapas</p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border"></div>
          <div className="space-y-6">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="relative flex gap-4 group">
                <div className="relative z-10 flex-shrink-0">
                  {event.status === "completed" && (
                    <div className="h-10 w-10 rounded-full bg-success flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  )}
                  {event.status === "current" && (
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center animate-pulse">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                  )}
                  {event.status === "pending" && (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 pb-6">
                  <div className="bg-card border border-border rounded-lg p-4 group-hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{event.stage}</h4>
                          {event.status === "completed" && (
                            <Badge className="bg-success/10 text-success border-success/20">
                              Concluído
                            </Badge>
                          )}
                          {event.status === "current" && (
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              Em Andamento
                            </Badge>
                          )}
                          {event.status === "pending" && (
                            <Badge variant="outline" className="text-muted-foreground">
                              Pendente
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">{event.user}</p>
                        <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
