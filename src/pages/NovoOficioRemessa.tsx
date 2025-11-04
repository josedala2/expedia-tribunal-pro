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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const oficioSchema = z.object({
  processo: z.string().trim().min(1, "Número do processo é obrigatório").max(50, "Máximo 50 caracteres"),
  numero: z.string().trim().min(1, "Número do ofício é obrigatório").max(50, "Máximo 50 caracteres"),
  destinatario: z.string().trim().min(3, "Nome do destinatário deve ter no mínimo 3 caracteres").max(200, "Máximo 200 caracteres"),
  cargo: z.string().trim().min(2, "Cargo é obrigatório").max(100, "Máximo 100 caracteres"),
  entidade: z.string().trim().min(3, "Entidade é obrigatória").max(200, "Máximo 200 caracteres"),
  assunto: z.string().trim().min(5, "Assunto deve ter no mínimo 5 caracteres").max(300, "Máximo 300 caracteres"),
  conteudo: z.string().trim().min(20, "Conteúdo deve ter no mínimo 20 caracteres").max(5000, "Máximo 5000 caracteres"),
  referencia: z.string().trim().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  assinante: z.string().trim().min(3, "Nome do assinante é obrigatório").max(200, "Máximo 200 caracteres"),
  cargoAssinante: z.string().trim().min(2, "Cargo do assinante é obrigatório").max(100, "Máximo 100 caracteres"),
});

type OficioForm = z.infer<typeof oficioSchema>;

interface NovoOficioRemessaProps {
  onNavigate?: (view: string) => void;
}

export default function NovoOficioRemessa({ onNavigate }: NovoOficioRemessaProps) {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<OficioForm>({
    resolver: zodResolver(oficioSchema),
    defaultValues: {
      assinante: "Dr. João Silva",
      cargoAssinante: "Juiz Relator"
    }
  });

  const formData = watch();

  const onSubmit = (data: OficioForm) => {
    toast({
      title: "Ofício criado com sucesso",
      description: `Ofício nº ${data.numero} foi gerado e está pronto para envio.`
    });
    
    onNavigate?.("oficios-remessa");
  };

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

      <form onSubmit={handleSubmit(onSubmit)}>
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
                  {...register("processo")}
                />
                {errors.processo && (
                  <p className="text-sm text-destructive">{errors.processo.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número do Ofício *</Label>
                <Input
                  id="numero"
                  placeholder="Ex: OF-001/2024"
                  {...register("numero")}
                />
                {errors.numero && (
                  <p className="text-sm text-destructive">{errors.numero.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referencia">Referência (Opcional)</Label>
              <Input
                id="referencia"
                placeholder="Ex: Processo de Visto Prévio nº PROC-001/2024"
                {...register("referencia")}
              />
              {errors.referencia && (
                <p className="text-sm text-destructive">{errors.referencia.message}</p>
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Destinatário</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destinatario">Nome do Destinatário *</Label>
                  <Input
                    id="destinatario"
                    placeholder="Ex: Dr. Manuel Costa"
                    {...register("destinatario")}
                  />
                  {errors.destinatario && (
                    <p className="text-sm text-destructive">{errors.destinatario.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    placeholder="Ex: Diretor Nacional"
                    {...register("cargo")}
                  />
                  {errors.cargo && (
                    <p className="text-sm text-destructive">{errors.cargo.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="entidade">Entidade *</Label>
                  <EntitySelector
                    value={formData.entidade || ""}
                    onChange={(value) => setValue("entidade", value)}
                    label=""
                    required
                  />
                  {errors.entidade && (
                    <p className="text-sm text-destructive">{errors.entidade.message}</p>
                  )}
                </div>
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
                    {...register("assunto")}
                  />
                  {errors.assunto && (
                    <p className="text-sm text-destructive">{errors.assunto.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conteudo">Corpo do Texto *</Label>
                  <Textarea
                    id="conteudo"
                    rows={10}
                    placeholder="Escreva o conteúdo do ofício aqui..."
                    {...register("conteudo")}
                  />
                  {errors.conteudo && (
                    <p className="text-sm text-destructive">{errors.conteudo.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Assinatura</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assinante">Nome do Assinante *</Label>
                  <Input
                    id="assinante"
                    {...register("assinante")}
                  />
                  {errors.assinante && (
                    <p className="text-sm text-destructive">{errors.assinante.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cargoAssinante">Cargo do Assinante *</Label>
                  <Input
                    id="cargoAssinante"
                    {...register("cargoAssinante")}
                  />
                  {errors.cargoAssinante && (
                    <p className="text-sm text-destructive">{errors.cargoAssinante.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Pré-visualizar
              </Button>
              
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Gerar Ofício
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
            numero={formData.numero || ""}
            data={new Date().toISOString()}
            destinatario={formData.destinatario || ""}
            cargo={formData.cargo || ""}
            entidade={formData.entidade || ""}
            assunto={formData.assunto || ""}
            conteudo={formData.conteudo || ""}
            referencia={formData.referencia}
            assinante={formData.assinante || ""}
            cargoAssinante={formData.cargoAssinante || ""}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
