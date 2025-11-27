import { ArrowLeft, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { EntitySelector } from "@/components/ui/entity-selector";
import { DocumentChecklist } from "@/components/ui/document-checklist";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useProcessosVisto } from "@/hooks/useProcessosVisto";
import { generateContractNumber, validateName, validateNIF, validateDateNotFuture } from "@/lib/validations";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const vistoSchema = z.object({
  tipoVisto: z.string().min(1, "O tipo de visto é obrigatório"),
  naturezaVisto: z.string().min(1, "A natureza do visto é obrigatória"),
  entidadeContratante: z.string().min(1, "A entidade contratante é obrigatória"),
  entidadeContratada: z.string().min(2, "O nome da entidade contratada deve ter pelo menos 2 caracteres")
    .refine((val) => validateName(val).valid, {
      message: "Nome da entidade inválido. Não são permitidos valores como 'null' ou apenas números."
    }),
  nifContratada: z.string().regex(/^\d{9}$/, "O NIF deve ter exactamente 9 dígitos"),
  objecto: z.string().min(10, "O objecto do contrato deve ter pelo menos 10 caracteres"),
  valorContrato: z.string().min(1, "O valor do contrato é obrigatório"),
  fonteFinanciamento: z.string().min(1, "A fonte de financiamento é obrigatória"),
  numeroContrato: z.string().optional(),
  dataContrato: z.string().min(1, "A data do contrato é obrigatória")
    .refine((val) => validateDateNotFuture(val).valid, {
      message: "A data do contrato não pode ser superior à data actual"
    }),
  observacoes: z.string().optional(),
});

type VistoForm = z.infer<typeof vistoSchema>;

interface NovoProcessoVistoProps {
  onBack: () => void;
}

export const NovoProcessoVisto = ({ onBack }: NovoProcessoVistoProps) => {
  const { createProcesso } = useProcessosVisto();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [numeroContratoGerado, setNumeroContratoGerado] = useState("");
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm<VistoForm>({
    resolver: zodResolver(vistoSchema),
    mode: "onBlur"
  });

  // Gerar número de contrato automaticamente
  useEffect(() => {
    const numero = generateContractNumber();
    setNumeroContratoGerado(numero);
    setValue("numeroContrato", numero);
  }, [setValue]);

  const onSubmit = async (data: VistoForm) => {
    setIsSubmitting(true);
    
    try {
      const numeroProcesso = `VP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
      
      const processoData = {
        numero: numeroProcesso,
        tipo: data.tipoVisto === 'previo' ? 'Visto Prévio' : 'Visto Sucessivo',
        natureza: data.naturezaVisto,
        entidade_contratante: data.entidadeContratante,
        entidade_adjudicataria: data.entidadeContratada,
        objeto: data.objecto,
        valor_contrato: parseFloat(data.valorContrato),
        fonte_financiamento: data.fonteFinanciamento,
        observacoes: data.observacoes,
        status: 'Aguardando Análise',
        prioridade: 'Normal',
      };
      
      await createProcesso.mutateAsync(processoData);
      
      toast.success("Pedido de visto submetido com sucesso!", {
        description: `Número do processo: ${numeroProcesso}`,
        action: {
          label: "Ver Lista",
          onClick: () => onBack()
        }
      });
      
      onBack();
    } catch (error: any) {
      toast.error("Erro ao submeter o pedido", {
        description: error?.message || "Ocorreu um erro inesperado. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (Object.keys(errors).length > 0 || watch("entidadeContratante") || watch("objecto")) {
      if (window.confirm("Tem a certeza que deseja cancelar? Os dados introduzidos serão perdidos.")) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
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

      {/* Indicador de etapas fixo */}
      <div className="sticky top-0 z-10 bg-background pb-4 pt-2 border-b">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {["Tipo de Visto", "Partes", "Contrato", "Documentos"].map((step, index) => (
            <div 
              key={step} 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all group-hover:scale-110 ${
                index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {index + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${
                index === 0 ? "text-primary font-medium" : "text-muted-foreground"
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Tipo e Natureza do Visto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tipoVisto">Tipo de Visto *</Label>
              <Select onValueChange={(value) => setValue("tipoVisto", value)}>
                <SelectTrigger className={errors.tipoVisto ? "border-destructive" : ""}>
                  <SelectValue placeholder="Seleccione o tipo" />
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
                <SelectTrigger className={errors.naturezaVisto ? "border-destructive" : ""}>
                  <SelectValue placeholder="Seleccione a natureza" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="normal">Visto Normal (30 dias)</SelectItem>
                  <SelectItem value="urgencia">Visto Simplificado de Urgência (10 dias)</SelectItem>
                  <SelectItem value="urgente">Visto de Carácter Urgente (5 dias)</SelectItem>
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

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="entidadeContratada">Entidade Contratada *</Label>
                <Input
                  id="entidadeContratada"
                  {...register("entidadeContratada")}
                  placeholder="Nome da empresa ou entidade contratada"
                  className={errors.entidadeContratada ? "border-destructive" : ""}
                />
                {errors.entidadeContratada && <p className="text-sm text-destructive">{errors.entidadeContratada.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nifContratada">NIF da Entidade Contratada *</Label>
                <Input
                  id="nifContratada"
                  {...register("nifContratada")}
                  placeholder="000000000"
                  maxLength={9}
                  className={errors.nifContratada ? "border-destructive" : ""}
                />
                {errors.nifContratada && <p className="text-sm text-destructive">{errors.nifContratada.message}</p>}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Dados do Contrato</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="objecto">Objecto do Contrato *</Label>
              <Textarea
                id="objecto"
                {...register("objecto")}
                placeholder="Descreva o objecto do contrato..."
                className={`min-h-[100px] ${errors.objecto ? "border-destructive" : ""}`}
              />
              {errors.objecto && <p className="text-sm text-destructive">{errors.objecto.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="valorContrato">Valor do Contrato *</Label>
                <CurrencyInput
                  id="valorContrato"
                  value={watch("valorContrato")}
                  onChange={(value) => setValue("valorContrato", value)}
                  placeholder="0"
                  className={errors.valorContrato ? "border-destructive" : ""}
                />
                {errors.valorContrato && <p className="text-sm text-destructive">{errors.valorContrato.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroContrato">Nº do Contrato (Automático)</Label>
                <Input
                  id="numeroContrato"
                  value={numeroContratoGerado}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Gerado automaticamente pelo sistema</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataContrato">Data do Contrato *</Label>
                <Input
                  id="dataContrato"
                  {...register("dataContrato")}
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  className={errors.dataContrato ? "border-destructive" : ""}
                />
                {errors.dataContrato && <p className="text-sm text-destructive">{errors.dataContrato.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fonteFinanciamento">Fonte de Financiamento *</Label>
              <Select onValueChange={(value) => setValue("fonteFinanciamento", value)}>
                <SelectTrigger className={errors.fonteFinanciamento ? "border-destructive" : ""}>
                  <SelectValue placeholder="Seleccione a fonte" />
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
          <DocumentChecklist
            documents={[
              "Ofício de Solicitação de Visto",
              "Minuta do Contrato",
              "Cabimento Orçamental",
              "Proposta de Adjudicação / Despacho de Adjudicação",
              "Programa de Concurso / Caderno de Encargos",
              "Documentos de Habilitação da Empresa",
              "Certidão Negativa de Dívidas Fiscais",
              "Declaração de Regularidade com Segurança Social",
            ]}
            requiredDocuments={[
              "Ofício de Solicitação de Visto",
              "Minuta do Contrato",
              "Cabimento Orçamental",
            ]}
            label="Documentação Anexa ao Pedido de Visto"
          />
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

        <div className="flex gap-4 justify-end sticky bottom-4 bg-background py-4 border-t">
          <Button type="button" variant="outline" onClick={handleCancel}>
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
