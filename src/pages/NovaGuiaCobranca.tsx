import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calculator } from "lucide-react";
import { toast } from "sonner";
import { EntitySelector } from "@/components/ui/entity-selector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const guiaCobrancaSchema = z.object({
  processo: z.string().trim().min(1, "Número do processo é obrigatório").max(50, "Máximo 50 caracteres"),
  entidade: z.string().trim().min(3, "Nome da entidade é obrigatório").max(200, "Máximo 200 caracteres"),
  nif: z.string().trim().regex(/^\d{9,14}$/, "NIF deve conter entre 9 e 14 dígitos"),
  endereco: z.string().trim().min(10, "Endereço deve ter no mínimo 10 caracteres").max(300, "Máximo 300 caracteres"),
  tipoVisto: z.enum(["concedido", "recusado", "tacito"], { required_error: "Tipo de visto é obrigatório" }),
  valorContrato: z.string().trim().min(1, "Valor do contrato é obrigatório").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Valor deve ser um número positivo"),
  descricao: z.string().trim().min(10, "Descrição deve ter no mínimo 10 caracteres").max(1000, "Máximo 1000 caracteres"),
});

type GuiaCobrancaForm = z.infer<typeof guiaCobrancaSchema>;

interface NovaGuiaCobrancaProps {
  onBack: () => void;
}

export default function NovaGuiaCobranca({ onBack }: NovaGuiaCobrancaProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<GuiaCobrancaForm>({
    resolver: zodResolver(guiaCobrancaSchema)
  });

  const formData = watch();
  const [emolumentosCalculados, setEmolumentosCalculados] = useState<number | null>(null);

  const handleCalcularEmolumentos = () => {
    const valor = parseFloat(formData.valorContrato || "0");
    
    if (!valor || !formData.tipoVisto) {
      toast.error("Preencha o valor do contrato e o tipo de visto");
      return;
    }

    let emolumentos = 0;
    const salarioMinimo = 70000;

    switch (formData.tipoVisto) {
      case "concedido":
        emolumentos = valor * 0.01;
        break;
      case "recusado":
      case "tacito":
        emolumentos = salarioMinimo / 2;
        break;
      default:
        toast.error("Tipo de visto inválido");
        return;
    }

    setEmolumentosCalculados(emolumentos);
    toast.success(`Emolumentos calculados: ${formatCurrency(emolumentos)}`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value);
  };

  const onSubmit = (data: GuiaCobrancaForm) => {
    if (!emolumentosCalculados) {
      toast.error("Calcule os emolumentos antes de gerar a guia");
      return;
    }

    toast.success("Guia de cobrança gerada com sucesso!");
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
          <h1 className="text-3xl font-bold">Nova Guia de Cobrança</h1>
          <p className="text-muted-foreground mt-1">
            Preencha os dados para gerar uma nova guia de cobrança
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Processo</CardTitle>
            <CardDescription>
              Dados do processo de visto prévio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processo">Número do Processo *</Label>
                <Input id="processo" placeholder="Ex: PV-2024-0123" {...register("processo")} />
                {errors.processo && <p className="text-sm text-destructive">{errors.processo.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoVisto">Tipo de Visto *</Label>
                <Select value={formData.tipoVisto} onValueChange={(value) => setValue("tipoVisto", value as any)}>
                  <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concedido">Visto Concedido</SelectItem>
                    <SelectItem value="recusado">Visto Recusado</SelectItem>
                    <SelectItem value="tacito">Visto Tácito</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoVisto && <p className="text-sm text-destructive">{errors.tipoVisto.message}</p>}
              </div>

              <div className="space-y-2">
                <EntitySelector value={formData.entidade || ""} onChange={(value) => setValue("entidade", value)} required />
                {errors.entidade && <p className="text-sm text-destructive">{errors.entidade.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nif">NIF *</Label>
                <Input id="nif" placeholder="Número de Identificação Fiscal" {...register("nif")} />
                {errors.nif && <p className="text-sm text-destructive">{errors.nif.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco">Endereço *</Label>
                <Input id="endereco" placeholder="Endereço completo da entidade" {...register("endereco")} />
                {errors.endereco && <p className="text-sm text-destructive">{errors.endereco.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Cálculo de Emolumentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorContrato">Valor do Contrato (AOA) *</Label>
                <Input id="valorContrato" type="number" placeholder="0.00" {...register("valorContrato")} />
                {errors.valorContrato && <p className="text-sm text-destructive">{errors.valorContrato.message}</p>}
              </div>

              <div className="space-y-2 flex items-end">
                <Button type="button" onClick={handleCalcularEmolumentos} className="w-full" variant="outline">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calcular Emolumentos
                </Button>
              </div>
            </div>

            {emolumentosCalculados !== null && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <span className="font-semibold">Emolumentos: {formatCurrency(emolumentosCalculados)}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea id="descricao" placeholder="Descrição" {...register("descricao")} rows={3} />
              {errors.descricao && <p className="text-sm text-destructive">{errors.descricao.message}</p>}
            </div>

            <Button type="submit" className="w-full">Gerar Guia de Cobrança</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
