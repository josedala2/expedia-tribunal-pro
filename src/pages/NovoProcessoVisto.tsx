import { ArrowLeft, Save, FileText } from "lucide-react";
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
import { useState } from "react";
import { EntitySelector } from "@/components/ui/entity-selector";

const vistoSchema = z.object({
  tipoVisto: z.string().min(1, "Tipo de visto é obrigatório"),
  naturezaVisto: z.string().min(1, "Natureza do visto é obrigatória"),
  entidadeContratante: z.string().min(1, "Entidade contratante é obrigatória"),
  entidadeContratada: z.string().min(1, "Entidade contratada é obrigatória"),
  objeto: z.string().min(1, "Objeto do contrato é obrigatório"),
  valorContrato: z.string().min(1, "Valor do contrato é obrigatório"),
  fonteFinanciamento: z.string().min(1, "Fonte de financiamento é obrigatória"),
  numeroContrato: z.string().optional(),
  dataContrato: z.string().min(1, "Data do contrato é obrigatória"),
  observacoes: z.string().optional(),
});

type VistoForm = z.infer<typeof vistoSchema>;

interface NovoProcessoVistoProps {
  onBack: () => void;
}

export const NovoProcessoVisto = ({ onBack }: NovoProcessoVistoProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<VistoForm>({
    resolver: zodResolver(vistoSchema)
  });

  const onSubmit = (data: VistoForm) => {
    setIsSubmitting(true);
    console.log("Pedido de visto criado:", data);
    
    setTimeout(() => {
      toast({
        title: "Pedido de Visto Registado!",
        description: "O pedido de visto foi registado e será autuado pela Contadoria Geral.",
      });
      setIsSubmitting(false);
      onBack();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Novo Pedido de Visto
          </h1>
          <p className="text-muted-foreground">Registo de expediente para pedido de visto prévio ou sucessivo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Tipo e Natureza do Visto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tipoVisto">Tipo de Visto *</Label>
              <Select onValueChange={(value) => setValue("tipoVisto", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="previo">Visto Prévio</SelectItem>
                  <SelectItem value="sucessivo">Visto Sucessivo</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoVisto && <p className="text-sm text-destructive">{errors.tipoVisto.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="naturezaVisto">Natureza do Visto *</Label>
              <Select onValueChange={(value) => setValue("naturezaVisto", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a natureza" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="normal">Visto Normal (30 dias)</SelectItem>
                  <SelectItem value="urgencia">Visto Simplificado de Urgência (10 dias)</SelectItem>
                  <SelectItem value="urgente">Visto de Caráter Urgente (5 dias)</SelectItem>
                </SelectContent>
              </Select>
              {errors.naturezaVisto && <p className="text-sm text-destructive">{errors.naturezaVisto.message}</p>}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Partes Contratantes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EntitySelector
              value={watch("entidadeContratante")}
              onChange={(value) => setValue("entidadeContratante", value)}
              label="Entidade Contratante (Pública)"
              required
              error={errors.entidadeContratante?.message}
            />

            <div className="space-y-2">
              <Label htmlFor="entidadeContratada">Entidade Contratada *</Label>
              <Input
                id="entidadeContratada"
                {...register("entidadeContratada")}
                placeholder="Nome da empresa ou entidade contratada"
              />
              {errors.entidadeContratada && <p className="text-sm text-destructive">{errors.entidadeContratada.message}</p>}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Dados do Contrato</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="objeto">Objeto do Contrato *</Label>
              <Textarea
                id="objeto"
                {...register("objeto")}
                placeholder="Descreva o objeto do contrato..."
                className="min-h-[100px]"
              />
              {errors.objeto && <p className="text-sm text-destructive">{errors.objeto.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="valorContrato">Valor do Contrato (Kz) *</Label>
                <Input
                  id="valorContrato"
                  {...register("valorContrato")}
                  placeholder="Ex: 150.000.000"
                  type="text"
                />
                {errors.valorContrato && <p className="text-sm text-destructive">{errors.valorContrato.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroContrato">Nº do Contrato</Label>
                <Input
                  id="numeroContrato"
                  {...register("numeroContrato")}
                  placeholder="Ex: CT/2024/001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataContrato">Data do Contrato *</Label>
                <Input
                  id="dataContrato"
                  {...register("dataContrato")}
                  type="date"
                />
                {errors.dataContrato && <p className="text-sm text-destructive">{errors.dataContrato.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fonteFinanciamento">Fonte de Financiamento *</Label>
              <Select onValueChange={(value) => setValue("fonteFinanciamento", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a fonte" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="oge">Orçamento Geral do Estado (OGE)</SelectItem>
                  <SelectItem value="fundos-autonomos">Fundos Autónomos</SelectItem>
                  <SelectItem value="cooperacao">Cooperação Internacional</SelectItem>
                  <SelectItem value="credito-externo">Crédito Externo</SelectItem>
                  <SelectItem value="receitas-proprias">Receitas Próprias</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                A fonte de financiamento determina a divisão competente (1ª ou 2ª Divisão)
              </p>
              {errors.fonteFinanciamento && <p className="text-sm text-destructive">{errors.fonteFinanciamento.message}</p>}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Documentação Anexa</h3>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-2">
                Arraste e solte os documentos aqui ou clique para selecionar
              </p>
              <Button type="button" variant="outline" size="sm">
                Selecionar Documentos
              </Button>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-semibold text-foreground mb-2">Documentos Obrigatórios (Check List):</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Ofício de Solicitação de Visto</li>
                <li>Minuta do Contrato</li>
                <li>Cabimento Orçamental</li>
                <li>Proposta Adjudicação / Despacho de Adjudicação</li>
                <li>Programa de Concurso / Caderno de Encargos</li>
                <li>Documentos de Habilitação da Empresa</li>
                <li>Outros documentos específicos conforme o tipo de contrato</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Observações</h3>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Adicionais</Label>
            <Textarea
              id="observacoes"
              {...register("observacoes")}
              placeholder="Adicione observações relevantes ao pedido..."
              className="min-h-[80px]"
            />
          </div>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <Save className="h-4 w-4" />
            {isSubmitting ? "A Submeter..." : "Submeter Pedido de Visto"}
          </Button>
        </div>
      </form>
    </div>
  );
};
