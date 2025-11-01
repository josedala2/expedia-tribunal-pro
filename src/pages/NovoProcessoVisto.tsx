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

const vistoSchema = z.object({
  tipoVisto: z.string().min(1, "Tipo de visto é obrigatório"),
  entidade: z.string().min(3, "Nome da entidade é obrigatório"),
  programa: z.string().min(3, "Nome do programa é obrigatório"),
  valor: z.string().min(1, "Valor é obrigatório"),
  rubrica: z.string().min(1, "Rubrica orçamental é obrigatória"),
  fundamentacao: z.string().min(20, "Fundamentação deve ter no mínimo 20 caracteres").max(2000),
  documentos: z.string().optional(),
});

type VistoForm = z.infer<typeof vistoSchema>;

interface NovoProcessoVistoProps {
  onBack: () => void;
}

export const NovoProcessoVisto = ({ onBack }: NovoProcessoVistoProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<VistoForm>({
    resolver: zodResolver(vistoSchema)
  });

  const onSubmit = (data: VistoForm) => {
    console.log("Processo de visto criado:", data);
    toast({
      title: "Pedido de Visto registado!",
      description: `Processo da entidade ${data.entidade} em análise.`,
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
          <h1 className="text-3xl font-bold text-foreground">Novo Pedido de Visto</h1>
          <p className="text-muted-foreground">Controlo prévio ou sucessivo de despesas</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tipoVisto">Tipo de Visto *</Label>
              <Select onValueChange={(value) => setValue("tipoVisto", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visto Prévio">Visto Prévio</SelectItem>
                  <SelectItem value="Visto Sucessivo">Visto Sucessivo</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoVisto && <p className="text-sm text-destructive">{errors.tipoVisto.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="entidade">Entidade Requisitante *</Label>
              <Input 
                id="entidade" 
                {...register("entidade")} 
                placeholder="Nome da entidade"
              />
              {errors.entidade && <p className="text-sm text-destructive">{errors.entidade.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="programa">Programa/Projeto *</Label>
            <Input 
              id="programa" 
              {...register("programa")} 
              placeholder="Nome do programa ou projeto"
            />
            {errors.programa && <p className="text-sm text-destructive">{errors.programa.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor da Despesa (Kz) *</Label>
              <Input 
                id="valor" 
                {...register("valor")} 
                placeholder="0.00"
                type="number"
                step="0.01"
              />
              {errors.valor && <p className="text-sm text-destructive">{errors.valor.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rubrica">Rubrica Orçamental *</Label>
              <Input 
                id="rubrica" 
                {...register("rubrica")} 
                placeholder="Ex: 02.01.03"
              />
              {errors.rubrica && <p className="text-sm text-destructive">{errors.rubrica.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundamentacao">Fundamentação Legal *</Label>
            <Textarea 
              id="fundamentacao" 
              {...register("fundamentacao")} 
              placeholder="Descreva a fundamentação legal e técnica para a despesa"
              rows={6}
            />
            {errors.fundamentacao && <p className="text-sm text-destructive">{errors.fundamentacao.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentos">Documentos Anexos</Label>
            <Input 
              id="documentos" 
              type="file"
              multiple
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">Anexe os documentos comprovativos (PDF, DOCX)</p>
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              Submeter Pedido
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
