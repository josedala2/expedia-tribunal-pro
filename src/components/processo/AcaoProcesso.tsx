import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, ArrowLeft, FileText } from "lucide-react";

interface AcaoProcessoProps {
  processoId: string;
  etapaAtual: string;
}

export const AcaoProcesso = ({ processoId, etapaAtual }: AcaoProcessoProps) => {
  const { toast } = useToast();
  const [acao, setAcao] = useState("");
  const [comentarios, setComentarios] = useState("");

  const handleAcao = (tipoAcao: "aprovar" | "rejeitar" | "solicitar") => {
    if (!comentarios.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, adicione comentários sobre a ação.",
        variant: "destructive",
      });
      return;
    }

    const acaoTexto = {
      aprovar: "aprovada",
      rejeitar: "rejeitada",
      solicitar: "solicitada",
    }[tipoAcao];

    toast({
      title: `Ação ${acaoTexto} com sucesso!`,
      description: `A etapa "${etapaAtual}" foi ${acaoTexto}.`,
    });

    setComentarios("");
    setAcao("");
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Ações do Processo
          </h3>
          <p className="text-sm text-muted-foreground">
            Etapa Atual: <span className="font-semibold text-foreground">{etapaAtual}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipoAcao">Tipo de Ação</Label>
            <Select value={acao} onValueChange={setAcao}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analise">Análise Técnica</SelectItem>
                <SelectItem value="verificacao">Verificação de Documentos</SelectItem>
                <SelectItem value="aprovacao">Aprovação</SelectItem>
                <SelectItem value="rejeicao">Rejeição</SelectItem>
                <SelectItem value="solicitar-correcao">Solicitar Correção</SelectItem>
                <SelectItem value="encaminhar">Encaminhar para Revisão</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentarios">Comentários / Pareceres *</Label>
            <Textarea
              id="comentarios"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Descreva o parecer técnico, justificativas e recomendações..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Mínimo de 20 caracteres
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => handleAcao("aprovar")}
              className="flex-1 bg-success hover:bg-success/90 gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              Aprovar e Avançar
            </Button>

            <Button
              onClick={() => handleAcao("solicitar")}
              variant="outline"
              className="flex-1 gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Solicitar Correção
            </Button>

            <Button
              onClick={() => handleAcao("rejeitar")}
              variant="destructive"
              className="flex-1 gap-2"
            >
              <XCircle className="h-5 w-5" />
              Rejeitar
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-3 text-foreground">Próximas Etapas Possíveis</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              <span>Se aprovado: Encaminhado para Chefe de Divisão</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-warning"></div>
              <span>Se solicitar correção: Retorna à Entidade</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-destructive"></div>
              <span>Se rejeitado: Processo arquivado com justificativa</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
