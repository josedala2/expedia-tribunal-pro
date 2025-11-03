import { ArrowLeft, Printer } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ActaRecepcaoTemplate, ActaRecepcaoData } from "@/components/documents/ActaRecepcaoTemplate";
import { EntitySelector } from "@/components/ui/entity-selector";
import { DocumentChecklist } from "@/components/ui/document-checklist";

const expedienteSchema = z.object({
  natureza: z.enum(["interno", "externo"]),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  assunto: z.string().min(5, "Assunto deve ter no mínimo 5 caracteres").max(200, "Assunto muito longo"),
  origem: z.string().min(1, "Origem é obrigatória"),
  destino: z.string().min(1, "Destino é obrigatório"),
  prioridade: z.string().min(1, "Prioridade é obrigatória"),
  descricao: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres").max(2000, "Descrição muito longa"),
  respostaA: z.string().optional(),
  entidadeExterna: z.string().optional(),
  emailExterno: z.string().email("Email inválido").optional().or(z.literal("")),
  telefoneExterno: z.string().optional(),
});

type ExpedienteForm = z.infer<typeof expedienteSchema>;

interface NovoExpedienteProps {
  onBack: () => void;
}

export const NovoExpediente = ({ onBack }: NovoExpedienteProps) => {
  const { toast } = useToast();
  const [natureza, setNatureza] = useState<"interno" | "externo">("interno");
  const [isResposta, setIsResposta] = useState(false);
  const [showActa, setShowActa] = useState(false);
  const [actaData, setActaData] = useState<ActaRecepcaoData | null>(null);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ExpedienteForm>({
    resolver: zodResolver(expedienteSchema),
    defaultValues: {
      natureza: "interno"
    }
  });

  const gerarNumeroExpediente = () => {
    const ano = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 9000) + 1000;
    return `EXP/${ano}/${numero}`;
  };

  const gerarNumeroActa = () => {
    const ano = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 9000) + 1000;
    return `ACTA/${ano}/${numero}`;
  };

  const imprimirActa = () => {
    window.print();
  };

  const onSubmit = (data: ExpedienteForm) => {
    console.log("Expediente criado:", data);
    const tipoExp = data.natureza === "externo" ? "externo" : "interno";
    
    // Se for expediente externo e NÃO for resposta, gera a acta
    if (data.natureza === "externo" && !isResposta) {
      const numeroExpediente = gerarNumeroExpediente();
      const numeroActa = gerarNumeroActa();
      const urlVerificacao = `${window.location.origin}/verificar-expediente?exp=${numeroExpediente}`;
      
      const novaActa: ActaRecepcaoData = {
        numeroExpediente,
        numeroActa,
        tipo: data.tipo,
        assunto: data.assunto,
        entidade: data.entidadeExterna || "N/A",
        remetente: data.origem,
        email: data.emailExterno,
        telefone: data.telefoneExterno,
        dataRecepcao: new Date().toISOString(),
        recebidoPor: "Sistema de Gestão de Processos",
        urlVerificacao,
      };
      
      setActaData(novaActa);
      setShowActa(true);
    } else {
      toast({
        title: "Expediente criado com sucesso!",
        description: `${data.tipo} ${tipoExp} registado no sistema.`,
      });
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Novo Expediente</h1>
          <p className="text-muted-foreground">Registo de expediente interno ou externo</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Natureza do Expediente */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <Label className="text-base font-semibold">Natureza do Expediente *</Label>
            <RadioGroup
              value={natureza}
              onValueChange={(value: "interno" | "externo") => {
                setNatureza(value);
                setValue("natureza", value);
              }}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="interno" id="interno" />
                <Label htmlFor="interno" className="cursor-pointer font-normal">Expediente Interno</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="externo" id="externo" />
                <Label htmlFor="externo" className="cursor-pointer font-normal">Expediente Externo</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground">
              {natureza === "interno" 
                ? "Comunicação entre departamentos do Tribunal de Contas" 
                : "Comunicação com entidades externas ao Tribunal de Contas"}
            </p>
          </div>

          {/* É Resposta a Expediente? */}
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isResposta"
                checked={isResposta}
                onChange={(e) => setIsResposta(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <Label htmlFor="isResposta" className="cursor-pointer font-medium">
                Este expediente é resposta a outro expediente?
              </Label>
            </div>

            {isResposta && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="respostaA">Nº do Expediente Original *</Label>
                <Input 
                  id="respostaA" 
                  {...register("respostaA")} 
                  placeholder="Ex: EXP/2024/001"
                />
                <p className="text-xs text-muted-foreground">
                  Informe o número do expediente ao qual está respondendo
                </p>
              </div>
            )}
          </div>

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
                  <SelectItem value="Nota Técnica">Nota Técnica</SelectItem>
                  <SelectItem value="Resposta">Resposta</SelectItem>
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

          {/* Campos específicos para Expediente Externo */}
          {natureza === "externo" && (
            <div className="space-y-4 p-4 bg-accent/10 border border-accent rounded-lg">
              <h3 className="font-semibold text-accent">Dados da Entidade Externa</h3>
              
              <EntitySelector
                value={watch("entidadeExterna")}
                onChange={(value) => setValue("entidadeExterna", value)}
                label="Nome da Entidade/Instituição"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailExterno">Email de Contacto</Label>
                  <Input 
                    id="emailExterno" 
                    type="email"
                    {...register("emailExterno")} 
                    placeholder="contacto@entidade.gov.ao"
                  />
                  {errors.emailExterno && <p className="text-sm text-destructive">{errors.emailExterno.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefoneExterno">Telefone de Contacto</Label>
                  <Input 
                    id="telefoneExterno" 
                    {...register("telefoneExterno")} 
                    placeholder="+244 900 000 000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Origem e Destino */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="origem">
                {natureza === "externo" ? "Remetente" : "Departamento de Origem"} *
              </Label>
              {natureza === "interno" ? (
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
              ) : (
                <Input 
                  id="origem" 
                  {...register("origem")} 
                  placeholder="Nome do remetente externo"
                />
              )}
              {errors.origem && <p className="text-sm text-destructive">{errors.origem.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino">
                {natureza === "externo" ? "Destinatário" : "Departamento de Destino"} *
              </Label>
              {natureza === "interno" ? (
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
              ) : (
                <Input 
                  id="destino" 
                  {...register("destino")} 
                  placeholder="Nome do destinatário externo"
                />
              )}
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

          <DocumentChecklist
            documents={[
              "Ofício original",
              "Memorando",
              "Despacho",
              "Circular",
              "Informação técnica",
              "Nota de expediente",
              "Resposta a expediente anterior",
              "Documentos de suporte/comprovação"
            ]}
            label="Documentos e Anexos"
          />

          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              Criar Expediente
            </Button>
          </div>
        </form>
      </Card>

      {/* Dialog para mostrar a Acta de Recepção */}
      <Dialog open={showActa} onOpenChange={setShowActa}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Acta de Recepção Gerada</DialogTitle>
          </DialogHeader>
          
          {actaData && <ActaRecepcaoTemplate data={actaData} />}
          
          <div className="flex gap-4 justify-end pt-4 border-t print:hidden">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowActa(false);
                toast({
                  title: "Expediente criado com sucesso!",
                  description: "Acta de recepção gerada.",
                });
                onBack();
              }}
            >
              Fechar
            </Button>
            <Button onClick={imprimirActa} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir Acta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
