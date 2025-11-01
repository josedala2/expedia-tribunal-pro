import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const expedienteSchema = z.object({
  tipo: z.string().min(1, "Tipo é obrigatório"),
  assunto: z.string().min(5, "Assunto deve ter no mínimo 5 caracteres").max(200, "Assunto muito longo"),
  origem: z.string().min(1, "Origem é obrigatória"),
  destino: z.string().min(1, "Destino é obrigatório"),
  prioridade: z.string().min(1, "Prioridade é obrigatória"),
  descricao: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres").max(2000, "Descrição muito longa"),
});

type ExpedienteForm = z.infer<typeof expedienteSchema>;

interface NovoExpedienteProps {
  onBack: () => void;
}

export const NovoExpediente = ({ onBack }: NovoExpedienteProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ExpedienteForm>({
    resolver: zodResolver(expedienteSchema)
  });

  const onSubmit = (data: ExpedienteForm) => {
    console.log("Expediente criado:", data);
    toast({
      title: "Expediente criado com sucesso!",
      description: `${data.tipo} registado no sistema.`,
    });
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Novo Expediente Interno</h1>
          <p className="text-muted-foreground">Preencha os dados do expediente</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Expediente *</Label>
              <Select onValueChange={(value) => setValue("tipo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Memorando">Memorando</SelectItem>
                  <SelectItem value="Ofício">Ofício</SelectItem>
                  <SelectItem value="Despacho">Despacho</SelectItem>
                  <SelectItem value="Circular">Circular</SelectItem>
                  <SelectItem value="Informação">Informação</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo && <p className="text-sm text-destructive">{errors.tipo.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade *</Label>
              <Select onValueChange={(value) => setValue("prioridade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
              {errors.prioridade && <p className="text-sm text-destructive">{errors.prioridade.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assunto">Assunto *</Label>
            <Input 
              id="assunto" 
              {...register("assunto")} 
              placeholder="Digite o assunto do expediente"
            />
            {errors.assunto && <p className="text-sm text-destructive">{errors.assunto.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="origem">Departamento de Origem *</Label>
              <Select onValueChange={(value) => setValue("origem", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gabinete do Presidente">Gabinete do Presidente</SelectItem>
                  <SelectItem value="Departamento Jurídico">Departamento Jurídico</SelectItem>
                  <SelectItem value="Departamento de Fiscalização">Departamento de Fiscalização</SelectItem>
                  <SelectItem value="Departamento de Auditoria">Departamento de Auditoria</SelectItem>
                  <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                  <SelectItem value="Tecnologias de Informação">Tecnologias de Informação</SelectItem>
                </SelectContent>
              </Select>
              {errors.origem && <p className="text-sm text-destructive">{errors.origem.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino">Departamento de Destino *</Label>
              <Select onValueChange={(value) => setValue("destino", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gabinete do Presidente">Gabinete do Presidente</SelectItem>
                  <SelectItem value="Departamento Jurídico">Departamento Jurídico</SelectItem>
                  <SelectItem value="Departamento de Fiscalização">Departamento de Fiscalização</SelectItem>
                  <SelectItem value="Departamento de Auditoria">Departamento de Auditoria</SelectItem>
                  <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                  <SelectItem value="Tecnologias de Informação">Tecnologias de Informação</SelectItem>
                  <SelectItem value="Todos os Departamentos">Todos os Departamentos</SelectItem>
                  <SelectItem value="Arquivo Geral">Arquivo Geral</SelectItem>
                </SelectContent>
              </Select>
              {errors.destino && <p className="text-sm text-destructive">{errors.destino.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição/Conteúdo *</Label>
            <Textarea 
              id="descricao" 
              {...register("descricao")} 
              placeholder="Digite o conteúdo do expediente"
              rows={8}
            />
            {errors.descricao && <p className="text-sm text-destructive">{errors.descricao.message}</p>}
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              Criar Expediente
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
