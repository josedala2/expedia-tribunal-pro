import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, Upload, Send, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface CumprimentoDespachoDetailProps {
  onBack: () => void;
}

export default function CumprimentoDespachoDetail({ onBack }: CumprimentoDespachoDetailProps) {
  const [formData, setFormData] = useState({
    despachoNumero: "DES-2024-001",
    processoNumero: "PV-2024-0123",
    entidade: "Ministério da Educação",
    tipoDespacho: "Geração de Cobrança",
    juizRelator: "Dr. António Silva",
    dataDespacho: "20/10/2024",
    tipoTermo: "",
    observacoes: "",
    destinatario: "",
    anexos: [] as File[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipoTermo) {
      toast.error("Selecione o tipo de termo a ser gerado");
      return;
    }

    toast.success("Despacho cumprido com sucesso!");
    toast.info("Documentos remetidos ao destinatário");
    setTimeout(() => onBack(), 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      toast.success(`${files.length} arquivo(s) anexado(s)`);
    }
  };

  const handleVerDespacho = () => {
    toast.info("Abrindo despacho do Juiz Relator");
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
          <h1 className="text-3xl font-bold">Cumprimento de Despacho</h1>
          <p className="text-muted-foreground mt-1">
            Escrivão dos Autos - Execução de mandado judicial
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Despacho</CardTitle>
              <CardDescription>
                Detalhes do despacho a ser cumprido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número do Despacho</Label>
                  <Input value={formData.despachoNumero} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Processo</Label>
                  <Input value={formData.processoNumero} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Entidade</Label>
                  <Input value={formData.entidade} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Despacho</Label>
                  <div className="flex items-center h-10">
                    <Badge variant="secondary" className="text-sm">
                      {formData.tipoDespacho}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Juiz Relator</Label>
                  <Input value={formData.juizRelator} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Data do Despacho</Label>
                  <Input value={formData.dataDespacho} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Cumprimento do Mandado</CardTitle>
                <CardDescription>
                  Elabore os documentos necessários para cumprimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoTermo">Tipo de Documento a Gerar *</Label>
                  <Select
                    value={formData.tipoTermo}
                    onValueChange={(value) => handleChange("tipoTermo", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="termo-juntada">Termo de Juntada</SelectItem>
                      <SelectItem value="termo-recebimento">Termo de Recebimento</SelectItem>
                      <SelectItem value="termo-conclusao">Termo de Conclusão</SelectItem>
                      <SelectItem value="termo-notificacao">Termo de Notificação</SelectItem>
                      <SelectItem value="oficio-solicitacao">Ofício de Solicitação de Elementos</SelectItem>
                      <SelectItem value="oficio-remessa">Ofício de Remessa</SelectItem>
                      <SelectItem value="certidao-visto">Certidão de Concessão de Visto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destinatario">Destinatário *</Label>
                  <Select
                    value={formData.destinatario}
                    onValueChange={(value) => handleChange("destinatario", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o destinatário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="juiz-relator">Juiz Relator</SelectItem>
                      <SelectItem value="ministerio-publico">Ministério Público</SelectItem>
                      <SelectItem value="entidade">Entidade Pública</SelectItem>
                      <SelectItem value="diretor-tecnico">Director dos Serviços Técnicos</SelectItem>
                      <SelectItem value="cg-sfp">CG-SFP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações e Conteúdo *</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Descreva o conteúdo do documento e observações relevantes..."
                    value={formData.observacoes}
                    onChange={(e) => handleChange("observacoes", e.target.value)}
                    rows={8}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anexos">Anexar Documentos</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arraste arquivos ou clique para selecionar
                    </p>
                    <Input
                      id="anexos"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("anexos")?.click()}
                    >
                      Selecionar Arquivos
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm">
                  <h4 className="font-semibold mb-2">Fluxo após Cumprimento:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Documento será gerado automaticamente</li>
                    <li>• Submissão ao destinatário selecionado</li>
                    <li>• Registro nos autos do processo</li>
                    <li>• Notificação automática das partes envolvidas</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={onBack}>
                Cancelar
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Cumprir Despacho
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Relacionados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleVerDespacho}
              >
                <FileText className="h-4 w-4 mr-2" />
                Ver Despacho do Juiz
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleVerProcesso}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Processo Completo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tipos de Termos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">Termo de Juntada</p>
                <p className="text-xs">Junção de documentos aos autos</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Termo de Recebimento</p>
                <p className="text-xs">Recebimento de elementos solicitados</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Termo de Conclusão</p>
                <p className="text-xs">Remessa dos autos ao Juiz Relator</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Termo de Notificação</p>
                <p className="text-xs">Notificação de decisões</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-sm">Atenção</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Verifique cuidadosamente todas as informações antes de gerar o documento. 
              Certifique-se de que o destinatário está correto.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
