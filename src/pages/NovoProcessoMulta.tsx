import { ArrowLeft, Save, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { EntitySelector } from "@/components/ui/entity-selector";
import { DocumentChecklist } from "@/components/ui/document-checklist";

const processoMultaSchema = z.object({
  numeroProcesso: z.string().trim().min(1, "Número do processo é obrigatório").max(50),
  entidade: z.string().trim().min(1, "Entidade é obrigatória").max(200),
  tipoInfracao: z.string().min(1, "Tipo de infração é obrigatório"),
  descricaoInfracao: z.string().trim().min(1, "Descrição da infração é obrigatória").max(2000),
  valorMulta: z.string().trim().min(1, "Valor da multa é obrigatório"),
  dataInfracao: z.string().min(1, "Data da infração é obrigatória"),
  dataAutuacao: z.string().min(1, "Data de autuação é obrigatória"),
  fundamentoLegal: z.string().trim().min(1, "Fundamento legal é obrigatório").max(500),
  prazoNomeacaoAdvogado: z.string().min(1, "Prazo para nomeação de advogado é obrigatório"),
  prazoPagamento: z.string().min(1, "Prazo para pagamento é obrigatório"),
  observacoes: z.string().max(1000).optional(),
});

type ProcessoMultaForm = z.infer<typeof processoMultaSchema>;

interface NovoProcessoMultaProps {
  onBack: () => void;
}

export const NovoProcessoMulta = ({ onBack }: NovoProcessoMultaProps) => {
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProcessoMultaForm>({
    resolver: zodResolver(processoMultaSchema),
  });

  const onSubmit = (data: ProcessoMultaForm) => {
    toast({
      title: "Processo de Multa Criado",
      description: `Processo ${data.numeroProcesso} registado com sucesso.`,
    });
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-primary" />
            Novo Processo de Multa
          </h1>
          <p className="text-muted-foreground">Registo de novo processo sancionatório</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6">
          <div className="space-y-6">
            {/* Identificação do Processo */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Identificação do Processo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroProcesso">Número do Processo *</Label>
                  <Input
                    id="numeroProcesso"
                    placeholder="PM/2024/001"
                    {...register("numeroProcesso")}
                  />
                  {errors.numeroProcesso && (
                    <p className="text-sm text-destructive">{errors.numeroProcesso.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataAutuacao">Data de Autuação *</Label>
                  <Input
                    id="dataAutuacao"
                    type="date"
                    {...register("dataAutuacao")}
                  />
                  {errors.dataAutuacao && (
                    <p className="text-sm text-destructive">{errors.dataAutuacao.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Dados da Entidade */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Dados da Entidade/Demandado</h3>
              <div className="space-y-4">
                <EntitySelector
                  value={watch("entidade")}
                  onChange={(value) => setValue("entidade", value)}
                  label="Nome da Entidade/Pessoa"
                  required
                  error={errors.entidade?.message}
                />
              </div>
            </div>

            {/* Infração */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Dados da Infração</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoInfracao">Tipo de Infração *</Label>
                  <Select onValueChange={(value) => setValue("tipoInfracao", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="irregularidades-contabilisticas">Irregularidades Contabilísticas</SelectItem>
                      <SelectItem value="atraso-prestacao-contas">Atraso na Prestação de Contas</SelectItem>
                      <SelectItem value="desvio-fundos">Desvio de Fundos Públicos</SelectItem>
                      <SelectItem value="falta-documentacao">Falta de Documentação</SelectItem>
                      <SelectItem value="uso-indevido">Uso Indevido de Recursos</SelectItem>
                      <SelectItem value="outra">Outra Infração</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipoInfracao && (
                    <p className="text-sm text-destructive">{errors.tipoInfracao.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataInfracao">Data da Infração *</Label>
                  <Input
                    id="dataInfracao"
                    type="date"
                    {...register("dataInfracao")}
                  />
                  {errors.dataInfracao && (
                    <p className="text-sm text-destructive">{errors.dataInfracao.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="descricaoInfracao">Descrição Detalhada da Infração *</Label>
                  <Textarea
                    id="descricaoInfracao"
                    placeholder="Descreva detalhadamente os factos que constituem a infração..."
                    rows={4}
                    {...register("descricaoInfracao")}
                  />
                  {errors.descricaoInfracao && (
                    <p className="text-sm text-destructive">{errors.descricaoInfracao.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fundamentoLegal">Fundamento Legal *</Label>
                  <Textarea
                    id="fundamentoLegal"
                    placeholder="Base legal e normativa aplicável (Lei, Decreto, Artigos, etc.)"
                    rows={3}
                    {...register("fundamentoLegal")}
                  />
                  {errors.fundamentoLegal && (
                    <p className="text-sm text-destructive">{errors.fundamentoLegal.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Valores e Prazos */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Valores e Prazos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorMulta">Valor da Multa (Kz) *</Label>
                  <Input
                    id="valorMulta"
                    placeholder="5.000.000"
                    {...register("valorMulta")}
                  />
                  {errors.valorMulta && (
                    <p className="text-sm text-destructive">{errors.valorMulta.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prazoNomeacaoAdvogado">Prazo Nomeação Advogado (dias) *</Label>
                  <Input
                    id="prazoNomeacaoAdvogado"
                    type="number"
                    placeholder="15"
                    {...register("prazoNomeacaoAdvogado")}
                  />
                  {errors.prazoNomeacaoAdvogado && (
                    <p className="text-sm text-destructive">{errors.prazoNomeacaoAdvogado.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prazoPagamento">Prazo Pagamento (dias) *</Label>
                  <Input
                    id="prazoPagamento"
                    type="number"
                    placeholder="30"
                    {...register("prazoPagamento")}
                  />
                  {errors.prazoPagamento && (
                    <p className="text-sm text-destructive">{errors.prazoPagamento.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Documentos */}
            <div>
              <DocumentChecklist
                documents={[
                  "Auto de infração",
                  "Notificação de autuação",
                  "Comprovantes da infração",
                  "Documentação legal de suporte",
                  "Relatório de fiscalização",
                  "Despacho de aplicação da multa",
                  "Ofício de notificação à entidade"
                ]}
                label="Documentos do Processo de Multa"
              />
            </div>

            {/* Observações */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Observações Adicionais</h3>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais relevantes..."
                  rows={3}
                  {...register("observacoes")}
                />
                {errors.observacoes && (
                  <p className="text-sm text-destructive">{errors.observacoes.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6 justify-end">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover gap-2">
              <Save className="h-4 w-4" />
              Registar Processo
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
