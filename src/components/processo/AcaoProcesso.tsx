import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, AlertCircle, Users, FileText } from "lucide-react";

interface AcaoProcessoProps {
  processoId: string;
  etapaAtual: string;
}

export const AcaoProcesso = ({ processoId, etapaAtual }: AcaoProcessoProps) => {
  const [acao, setAcao] = useState<string>("");
  const [comentarios, setComentarios] = useState<string>("");
  const [responsavelDistribuicao, setResponsavelDistribuicao] = useState<string>("");
  const [justificativa, setJustificativa] = useState<string>("");

  const handleAcao = (tipoAcao: "aprovar" | "rejeitar" | "solicitar" | "distribuir" | "analisar") => {
    if (!comentarios.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, adicione comentários sobre sua decisão.",
        variant: "destructive",
      });
      return;
    }

    if (tipoAcao === "distribuir" && !responsavelDistribuicao.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione o responsável para distribuição.",
        variant: "destructive",
      });
      return;
    }

    // Aqui seria a lógica real de envio para o backend
    const acaoTexto = {
      aprovar: "aprovado e avançado",
      rejeitar: "rejeitado",
      solicitar: "devolvido para correção",
      distribuir: "distribuído",
      analisar: "encaminhado para análise"
    }[tipoAcao];

    toast({
      title: "Ação realizada com sucesso!",
      description: `Processo ${processoId} foi ${acaoTexto}.`,
    });

    setComentarios("");
    setAcao("");
    setResponsavelDistribuicao("");
    setJustificativa("");
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
          <p className="text-xs text-muted-foreground mt-1">
            Processo: {processoId}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipoAcao">Tipo de Ação *</Label>
            <Select value={acao} onValueChange={setAcao}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma ação" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="analisar">Analisar Processo</SelectItem>
                <SelectItem value="distribuir">Distribuir Processo</SelectItem>
                <SelectItem value="validar">Validar Relatório</SelectItem>
                <SelectItem value="solicitar-elementos">Solicitar Elementos em Falta</SelectItem>
                <SelectItem value="aprovar">Aprovar e Avançar</SelectItem>
                <SelectItem value="concessao-visto">Conceder Visto</SelectItem>
                <SelectItem value="recusa-visto">Recusar Visto</SelectItem>
                <SelectItem value="visto-tacito">Declarar Visto Tácito</SelectItem>
                <SelectItem value="homologar">Homologar Declaração de Conformidade</SelectItem>
                <SelectItem value="arquivar">Arquivar Processo</SelectItem>
                <SelectItem value="devolver">Devolver para Aperfeiçoamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {acao === "distribuir" && (
            <div className="space-y-2">
              <Label htmlFor="responsavel">Distribuir Para *</Label>
              <Select value={responsavelDistribuicao} onValueChange={setResponsavelDistribuicao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="divisao-1">1ª Divisão - Eng. Miguel Sousa</SelectItem>
                  <SelectItem value="divisao-2">2ª Divisão - Dra. Paula Santos</SelectItem>
                  <SelectItem value="seccao-sfp">Secção Fiscalização Preventiva - Dra. Paula Santos</SelectItem>
                  <SelectItem value="equipe-tecnica-1">Equipe Técnica 1 (Coordenador: Carlos Neto)</SelectItem>
                  <SelectItem value="equipe-tecnica-2">Equipe Técnica 2 (Coordenador: Rita Fernandes)</SelectItem>
                  <SelectItem value="tecnico-1">Técnico Jurista - Carlos Neto</SelectItem>
                  <SelectItem value="tecnico-2">Técnico Superior - Ana Costa</SelectItem>
                  <SelectItem value="tecnico-3">Técnico - Paulo Alves</SelectItem>
                  <SelectItem value="dst">DST - Dr. António Lima</SelectItem>
                  <SelectItem value="juiz-relator">Juiz Relator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comentarios">Comentários e Observações *</Label>
            <Textarea
              id="comentarios"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Adicione seus comentários sobre esta etapa do processo..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              Seus comentários serão registrados no histórico do processo.
            </p>
          </div>

          {(acao === "rejeitar" || acao === "solicitar") && (
            <div className="space-y-2">
              <Label htmlFor="justificativa">Justificativa Detalhada *</Label>
              <Textarea
                id="justificativa"
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                placeholder="Forneça uma justificativa detalhada para esta decisão..."
                className="min-h-[100px]"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {acao === "distribuir" && (
              <Button 
                onClick={() => handleAcao("distribuir")}
                disabled={!acao || !responsavelDistribuicao}
                className="w-full"
              >
                <Users className="mr-2 h-4 w-4" />
                Distribuir
              </Button>
            )}

            {acao === "analisar" && (
              <Button 
                onClick={() => handleAcao("analisar")}
                disabled={!acao}
                className="w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                Iniciar Análise
              </Button>
            )}

            {(acao === "aprovar" || acao === "despachar") && (
              <Button 
                onClick={() => handleAcao("aprovar")}
                disabled={!acao}
                className="w-full"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprovar e Avançar
              </Button>
            )}

            {acao === "solicitar" && (
              <Button 
                variant="outline"
                onClick={() => handleAcao("solicitar")}
                disabled={!acao || !justificativa}
                className="w-full"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Solicitar Correção
              </Button>
            )}

            {acao === "rejeitar" && (
              <Button 
                variant="destructive"
                onClick={() => handleAcao("rejeitar")}
                disabled={!acao || !justificativa}
                className="w-full"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Rejeitar
              </Button>
            )}
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-3 text-foreground">Próximas Etapas Possíveis</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              <span>Se distribuído: Processo encaminhado ao responsável selecionado</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <span>Se aprovado: Encaminhado para próxima etapa do workflow</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-warning"></div>
              <span>Se solicitar correção: Retorna à Entidade para ajustes</span>
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
