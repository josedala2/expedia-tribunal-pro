import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Eye, Send } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface NovoDespachoPromocaoProps {
  onBack: () => void;
}

export default function NovoDespachoPromocao({ onBack }: NovoDespachoPromocaoProps) {
  const [formData, setFormData] = useState({
    processoNumero: "PV-2024-0123",
    entidade: "Ministério da Educação",
    decisaoJuiz: "Visto Concedido",
    dataDecisao: "15/10/2024",
    fundamentacao: "",
    parecerMP: "",
    observacoes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fundamentacao || !formData.parecerMP) {
      toast.error("Preencha a fundamentação e o parecer do Ministério Público");
      return;
    }

    toast.success("Despacho de promoção elaborado com sucesso!");
    toast.info("Autos remetidos ao Juiz Relator para conhecimento");
    setTimeout(() => onBack(), 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVerDecisao = () => {
    toast.info("Abrindo decisão do Juiz Relator");
  };

  const handleVerGuia = () => {
    toast.info("Abrindo guia de cobrança");
  };

  const handleVerProcesso = () => {
    toast.info("Abrindo processo completo");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Novo Despacho de Promoção</h1>
          <p className="text-muted-foreground mt-1">
            Ministério Público - Elaboração de promoção sobre decisão do Juiz Relator
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Informações do Processo</CardTitle>
                <CardDescription>
                  Dados do processo e decisão do Juiz Relator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Número do Processo</Label>
                    <Input value={formData.processoNumero} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>Entidade</Label>
                    <Input value={formData.entidade} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>Decisão do Juiz Relator</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-sm">
                        {formData.decisaoJuiz}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Data da Decisão</Label>
                    <Input value={formData.dataDecisao} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Despacho de Promoção</CardTitle>
                <CardDescription>
                  Elabore a promoção do Ministério Público sobre a decisão
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fundamentacao">Fundamentação Legal *</Label>
                  <Textarea
                    id="fundamentacao"
                    placeholder="Descreva a fundamentação legal e normativa que embasa o parecer do Ministério Público..."
                    value={formData.fundamentacao}
                    onChange={(e) => handleChange("fundamentacao", e.target.value)}
                    rows={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Inclua referências às leis, decretos e regulamentos aplicáveis
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parecerMP">Parecer do Ministério Público *</Label>
                  <Textarea
                    id="parecerMP"
                    placeholder="Apresente o parecer conclusivo do Ministério Público sobre a decisão do Juiz Relator..."
                    value={formData.parecerMP}
                    onChange={(e) => handleChange("parecerMP", e.target.value)}
                    rows={8}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Manifeste concordância, discordância ou ressalvas sobre a decisão
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações Complementares</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Adicione observações ou considerações complementares (opcional)..."
                    value={formData.observacoes}
                    onChange={(e) => handleChange("observacoes", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm">
                  <h4 className="font-semibold mb-2">Procedimento após Emissão:</h4>
                  <p className="text-muted-foreground">
                    Após a elaboração da promoção, os autos serão automaticamente remetidos à 
                    CG-SFP e, posteriormente, ao Juiz Relator para conhecimento da promoção do 
                    Ministério Público.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={onBack}>
                Cancelar
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Emitir Despacho de Promoção
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos do Processo</CardTitle>
              <CardDescription>
                Acesse os documentos relacionados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleVerProcesso}
              >
                <FileText className="h-4 w-4 mr-2" />
                Ver Processo Completo
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleVerDecisao}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Decisão do Juiz
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleVerGuia}
              >
                <FileText className="h-4 w-4 mr-2" />
                Ver Guia de Cobrança
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orientações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Analise cuidadosamente a decisão do Juiz Relator</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Verifique a conformidade com a legislação vigente</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Revise a guia de cobrança quando aplicável</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Fundamente adequadamente o parecer</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Seja claro e objetivo na manifestação</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-sm">Atenção</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              O despacho de promoção é uma peça fundamental no processo. Certifique-se de 
              analisar todos os documentos antes de emitir o parecer.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
