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

const prestacaoSchema = z.object({
  entidade: z.string().min(3, "Nome da entidade deve ter no mínimo 3 caracteres"),
  exercicio: z.string().regex(/^\d{4}$/, "Ano de exercício inválido"),
  tipoEntidade: z.string().min(1, "Tipo de entidade é obrigatório"),
  responsavel: z.string().min(3, "Nome do responsável é obrigatório"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(9, "Telefone inválido"),
  observacoes: z.string().max(1000, "Observações muito longas").optional(),
});

type PrestacaoForm = z.infer<typeof prestacaoSchema>;

interface NovoProcessoPrestacaoProps {
  onBack: () => void;
}

export const NovoProcessoPrestacao = ({ onBack }: NovoProcessoPrestacaoProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<PrestacaoForm>({
    resolver: zodResolver(prestacaoSchema)
  });

  const onSubmit = (data: PrestacaoForm) => {
    console.log("Processo criado:", data);
    toast({
      title: "Processo de Prestação de Contas criado!",
      description: `Processo da entidade ${data.entidade} registado.`,
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
          <h1 className="text-3xl font-bold text-foreground">Novo Processo de Prestação de Contas</h1>
          <p className="text-muted-foreground">Registo de novo processo</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="entidade">Nome da Entidade *</Label>
              <Input 
                id="entidade" 
                {...register("entidade")} 
                placeholder="Ex: Ministério da Educação"
              />
              {errors.entidade && <p className="text-sm text-destructive">{errors.entidade.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoEntidade">Tipo de Entidade *</Label>
              <Select onValueChange={(value) => setValue("tipoEntidade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ministério">Ministério</SelectItem>
                  <SelectItem value="Governo Provincial">Governo Provincial</SelectItem>
                  <SelectItem value="Instituto Público">Instituto Público</SelectItem>
                  <SelectItem value="Empresa Pública">Empresa Pública</SelectItem>
                  <SelectItem value="Autarquia">Autarquia</SelectItem>
                  <SelectItem value="Fundação">Fundação</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoEntidade && <p className="text-sm text-destructive">{errors.tipoEntidade.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exercicio">Ano de Exercício *</Label>
            <Input 
              id="exercicio" 
              {...register("exercicio")} 
              placeholder="2024"
              maxLength={4}
            />
            {errors.exercicio && <p className="text-sm text-destructive">{errors.exercicio.message}</p>}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Dados do Responsável</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="responsavel">Nome Completo *</Label>
                <Input 
                  id="responsavel" 
                  {...register("responsavel")} 
                  placeholder="Nome do responsável"
                />
                {errors.responsavel && <p className="text-sm text-destructive">{errors.responsavel.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email"
                  {...register("email")} 
                  placeholder="email@entidade.gov.ao"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input 
                id="telefone" 
                {...register("telefone")} 
                placeholder="+244 900 000 000"
              />
              {errors.telefone && <p className="text-sm text-destructive">{errors.telefone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea 
              id="observacoes" 
              {...register("observacoes")} 
              placeholder="Observações adicionais (opcional)"
              rows={4}
            />
            {errors.observacoes && <p className="text-sm text-destructive">{errors.observacoes.message}</p>}
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              Criar Processo
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
