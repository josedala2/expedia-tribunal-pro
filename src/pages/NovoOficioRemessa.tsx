import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Send, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OficioTemplate } from "@/components/documents/OficioTemplate";
import { EntitySelector } from "@/components/ui/entity-selector";

interface NovoOficioRemessaProps {
  onNavigate?: (view: string) => void;
}

export default function NovoOficioRemessa({ onNavigate }: NovoOficioRemessaProps) {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    processo: "",
    numero: "",
    destinatario: "",
    cargo: "",
    entidade: "",
    assunto: "",
    conteudo: "",
    referencia: "",
    assinante: "Dr. João Silva",
    cargoAssinante: "Juiz Relator"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Ofício criado com sucesso",
      description: `Ofício nº ${formData.numero} foi gerado e está pronto para envio.`
    });
    
    onNavigate?.("oficios-remessa");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.processo && formData.numero && formData.destinatario && 
                      formData.cargo && formData.entidade && formData.assunto && formData.conteudo;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => onNavigate?.("oficios-remessa")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Novo Ofício de Remessa</h1>
          <p className="text-muted-foreground">Criar novo ofício para remessa de processo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Dados do Ofício</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="numero">Número do Ofício *</Label>
                <Input
                  id="numero"
                  placeholder="Ex: OF-001/2024"
                  value={formData.numero}
                  onChange={(e) => handleChange("numero", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referencia">Referência (Opcional)</Label>
              <Input
                id="referencia"
                placeholder="Ex: Processo de Visto Prévio nº PROC-001/2024"
                value={formData.referencia}
                onChange={(e) => handleChange("referencia", e.target.value)}
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Destinatário</h3>
              <div className="grid grid-cols-1 gap-4">
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
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    placeholder="Ex: Diretor Nacional"
                    value={formData.cargo}
                    onChange={(e) => handleChange("cargo", e.target.value)}
                    required
                  />
                </div>
                
                <EntitySelector
                  value={formData.entidade}
                  onChange={(value) => handleChange("entidade", value)}
                  label="Entidade"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Conteúdo do Ofício</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assunto">Assunto *</Label>
                  <Input
                    id="assunto"
                    placeholder="Ex: Remessa de processo para análise"
                    value={formData.assunto}
                    onChange={(e) => handleChange("assunto", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conteudo">Corpo do Ofício *</Label>
                  <Textarea
                    id="conteudo"
                    placeholder="Digite o conteúdo do ofício..."
                    value={formData.conteudo}
                    onChange={(e) => handleChange("conteudo", e.target.value)}
                    className="min-h-[200px]"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Descreva o motivo da remessa e as informações relevantes sobre o processo
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Assinatura</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assinante">Nome do Assinante</Label>
                  <Input
                    id="assinante"
                    value={formData.assinante}
                    onChange={(e) => handleChange("assinante", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cargoAssinante">Cargo do Assinante</Label>
                  <Input
                    id="cargoAssinante"
                    value={formData.cargoAssinante}
                    onChange={(e) => handleChange("cargoAssinante", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPreview(true)}
                disabled={!isFormValid}
              >
                <Eye className="mr-2 h-4 w-4" />
                Pré-visualizar
              </Button>
              <Button type="submit" disabled={!isFormValid}>
                <Send className="mr-2 h-4 w-4" />
                Gerar Ofício
              </Button>
              <Button type="button" variant="ghost" onClick={() => onNavigate?.("oficios-remessa")}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pré-visualização do Ofício</DialogTitle>
          </DialogHeader>
          <OficioTemplate
            data={{
              numero: formData.numero,
              destinatario: formData.destinatario,
              cargo: formData.cargo,
              entidade: formData.entidade,
              assunto: formData.assunto,
              conteudo: formData.conteudo,
              assinante: formData.assinante,
              cargoAssinante: formData.cargoAssinante,
              data: new Date(),
              referencia: formData.referencia || undefined
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
