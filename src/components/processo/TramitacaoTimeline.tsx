import { CheckCircle, Clock, XCircle, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EtapaTramitacao } from "@/types/processo";

interface TramitacaoTimelineProps {
  tramitacao: EtapaTramitacao[];
}

export const TramitacaoTimeline = ({ tramitacao }: TramitacaoTimelineProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluído":
        return <CheckCircle className="h-6 w-6 text-success" />;
      case "Em Andamento":
        return <Clock className="h-6 w-6 text-accent animate-pulse" />;
      case "Pendente":
        return <Circle className="h-6 w-6 text-muted-foreground" />;
      default:
        return <XCircle className="h-6 w-6 text-destructive" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-success";
      case "Em Andamento":
        return "bg-accent";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-4">
      {tramitacao.map((etapa, index) => (
        <Card key={etapa.id} className="p-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex-shrink-0">
                {getStatusIcon(etapa.status)}
              </div>
              {index < tramitacao.length - 1 && (
                <div className="w-0.5 h-full bg-border mt-2"></div>
              )}
            </div>

            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">{etapa.etapa}</h4>
                  <p className="text-sm text-muted-foreground">
                    Responsável: {etapa.responsavel}
                  </p>
                </div>
                <Badge variant="secondary" className={getStatusColor(etapa.status)}>
                  {etapa.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                <div>
                  <span className="text-muted-foreground">Data Início:</span>
                  <p className="font-medium">{etapa.dataInicio}</p>
                </div>
                {etapa.dataFim && (
                  <div>
                    <span className="text-muted-foreground">Data Fim:</span>
                    <p className="font-medium">{etapa.dataFim}</p>
                  </div>
                )}
              </div>

              {etapa.decisao && (
                <div className="mt-3">
                  <Badge 
                    variant={etapa.decisao === "Aprovado" ? "default" : "destructive"}
                    className={etapa.decisao === "Aprovado" ? "bg-success" : ""}
                  >
                    {etapa.decisao}
                  </Badge>
                </div>
              )}

              {etapa.observacoes && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Observações: </span>
                    {etapa.observacoes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
