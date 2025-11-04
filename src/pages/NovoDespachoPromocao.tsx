import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Eye, Send } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const despachoPromocaoSchema = z.object({
  processoNumero: z.string().trim().min(1, "Número do processo é obrigatório"),
  entidade: z.string().trim().min(3, "Nome da entidade é obrigatório"),
  decisaoJuiz: z.string().trim().min(1, "Decisão do juiz é obrigatória"),
  dataDecisao: z.string().trim().min(1, "Data da decisão é obrigatória"),
  fundamentacao: z.string().trim().min(20, "Fundamentação deve ter no mínimo 20 caracteres").max(5000, "Máximo 5000 caracteres"),
  parecerMP: z.string().trim().min(20, "Parecer do MP deve ter no mínimo 20 caracteres").max(5000, "Máximo 5000 caracteres"),
  observacoes: z.string().trim().max(1000, "Máximo 1000 caracteres").optional().or(z.literal("")),
});

type DespachoPromocaoForm = z.infer<typeof despachoPromocaoSchema>;

interface NovoDespachoPromocaoProps {
  onBack: () => void;
}

export default function NovoDespachoPromocao({ onBack }: NovoDespachoPromocaoProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<DespachoPromocaoForm>({
    resolver: zodResolver(despachoPromocaoSchema),
    defaultValues: {
      processoNumero: "PV-2024-0123",
      entidade: "Ministério da Educação",
      decisaoJuiz: "Visto Concedido",
      dataDecisao: "15/10/2024",
    }
  });

  const formData = watch();

  const onSubmit = (data: DespachoPromocaoForm) => {
    toast.success("Despacho de promoção elaborado com sucesso!");
    toast.info("Autos remetidos ao Juiz Relator para conhecimento");
    setTimeout(() => onBack(), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Despacho de Promoção</h1>
          <p className="text-muted-foreground">Parecer do Ministério Público sobre a decisão</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Processo</CardTitle>
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
                <Badge variant="secondary">{formData.decisaoJuiz}</Badge>
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fundamentacao">Fundamentação Legal *</Label>
              <Textarea id="fundamentacao" placeholder="Fundamentação..." {...register("fundamentacao")} rows={6} />
              {errors.fundamentacao && <p className="text-sm text-destructive">{errors.fundamentacao.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parecerMP">Parecer do Ministério Público *</Label>
              <Textarea id="parecerMP" placeholder="Parecer..." {...register("parecerMP")} rows={8} />
              {errors.parecerMP && <p className="text-sm text-destructive">{errors.parecerMP.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações Complementares</Label>
              <Textarea id="observacoes" placeholder="Observações..." {...register("observacoes")} rows={4} />
            </div>

            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Enviar Despacho
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
