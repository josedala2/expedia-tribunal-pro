import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Upload, FileText, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OficioTemplate } from "@/components/documents/OficioTemplate";

interface NovoExpedienteSaidaProps {
  onNavigate?: (view: string) => void;
}

export default function NovoExpedienteSaida({ onNavigate }: NovoExpedienteSaidaProps) {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    processo: "",
    numero: "",
    tipo: "",
    destinatario: "",
    cargo: "",
    entidade: "",
    assunto: "",
    conteudo: "",
    meioEnvio: "",
    observacoes: "",
    responsavel: "João Silva",
    cargoResponsavel: "Escrivão"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Expediente registrado com sucesso",
      description: `Expediente nº ${formData.numero} foi criado e está pronto para envio.`
    });
    
    onNavigate?.("expedientes-saida");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.processo && formData.numero && formData.tipo && 
                      formData.destinatario && formData.entidade && formData.meioEnvio;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => onNavigate?.("expedientes-saida")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Novo Expediente de Saída</h1>
          <p className="text-muted-foreground">Registrar novo documento ou correspondência de saída</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Dados do Expediente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processo">Número do Processo *</Label>
                <Input
                  id="processo"
                  placeholder="Ex: PROC-001/2024"
                  value={formData.processo}
                  onChange={(e) => handleChange("processo", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numero">Número do Expediente *</Label>
                <Input
                  id="numero"
                  placeholder="Ex: EXP-S-001/2024"
                  value={formData.numero}
                  onChange={(e) => handleChange("numero", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Documento *</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleChange("tipo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oficio">Ofício</SelectItem>
                    <SelectItem value="notificacao">Notificação</SelectItem>
                    <SelectItem value="despacho">Despacho</SelectItem>
                    <SelectItem value="guia">Guia de Cobrança</SelectItem>
                    <SelectItem value="parecer">Parecer</SelectItem>
                    <SelectItem value="relatorio">Relatório</SelectItem>
                    <SelectItem value="termo">Termo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Destinatário</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destinatario">Nome do Destinatário *</Label>
                  <Input
                    id="destinatario"
                    placeholder="Ex: Dr. Manuel Costa"
                    value={formData.destinatario}
                    onChange={(e) => handleChange("destinatario", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    placeholder="Ex: Diretor Nacional"
                    value={formData.cargo}
                    onChange={(e) => handleChange("cargo", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="entidade">Entidade *</Label>
                  <Input
                    id="entidade"
                    placeholder="Ex: Ministério das Finanças"
                    value={formData.entidade}
                    onChange={(e) => handleChange("entidade", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Conteúdo</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assunto">Assunto</Label>
                  <Input
                    id="assunto"
                    placeholder="Ex: Remessa de documentação"
                    value={formData.assunto}
                    onChange={(e) => handleChange("assunto", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conteudo">Descrição/Conteúdo</Label>
                  <Textarea
                    id="conteudo"
                    placeholder="Digite o conteúdo ou descrição do documento..."
                    value={formData.conteudo}
                    onChange={(e) => handleChange("conteudo", e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Informações de Envio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meioEnvio">Meio de Envio *</Label>
                  <Select value={formData.meioEnvio} onValueChange={(value) => handleChange("meioEnvio", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o meio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="correio">Correio</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="mao-propria">Mão Própria</SelectItem>
                      <SelectItem value="mensageiro">Mensageiro</SelectItem>
                      <SelectItem value="fax">Fax</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input
                    id="responsavel"
                    value={formData.responsavel}
                    onChange={(e) => handleChange("responsavel", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Digite observações adicionais..."
                value={formData.observacoes}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Anexos</h3>
              <div className="space-y-2">
                <Label htmlFor="anexos">Documentos Anexos</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="anexos"
                    type="file"
                    multiple
                    className="flex-1"
                  />
                  <Button type="button" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Anexe os documentos que serão enviados junto com este expediente
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {formData.tipo === "oficio" && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowPreview(true)}
                  disabled={!formData.processo || !formData.numero}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Pré-visualizar
                </Button>
              )}
              <Button type="submit" disabled={!isFormValid}>
                <Send className="mr-2 h-4 w-4" />
                Registrar Expediente
              </Button>
              <Button type="button" variant="ghost" onClick={() => onNavigate?.("expedientes-saida")}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pré-visualização do Documento</DialogTitle>
          </DialogHeader>
          {formData.tipo === "oficio" && (
            <OficioTemplate
              data={{
                numero: formData.numero,
                destinatario: formData.destinatario,
                cargo: formData.cargo,
                entidade: formData.entidade,
                assunto: formData.assunto,
                conteudo: formData.conteudo,
                assinante: formData.responsavel,
                cargoAssinante: formData.cargoResponsavel,
                data: new Date()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
