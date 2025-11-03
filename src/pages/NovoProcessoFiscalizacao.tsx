import { ArrowLeft, FileText, AlertCircle, Calendar } from "lucide-react";
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
import { EntitySelector } from "@/components/ui/entity-selector";
import { DocumentChecklist } from "@/components/ui/document-checklist";

const fiscalizacaoSchema = z.object({
  remetente: z.string().min(1, "Remetente é obrigatório"),
  trimestre: z.string().min(1, "Trimestre é obrigatório"),
  anoReferencia: z.string().min(4, "Ano de referência é obrigatório"),
  dataRecebimento: z.string().min(1, "Data de recebimento é obrigatória"),
  responsavelMinFin: z.string().min(3, "Nome do responsável é obrigatório"),
  cargoResponsavel: z.string().min(2, "Cargo é obrigatório"),
  emailResponsavel: z.string().email("Email inválido"),
  telefoneResponsavel: z.string().min(9, "Telefone inválido"),
  numeroOficio: z.string().optional(),
  observacoes: z.string().optional(),
});

type FiscalizacaoForm = z.infer<typeof fiscalizacaoSchema>;

interface NovoProcessoFiscalizacaoProps {
  onBack: () => void;
}

export const NovoProcessoFiscalizacao = ({ onBack }: NovoProcessoFiscalizacaoProps) => {
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FiscalizacaoForm>({
    resolver: zodResolver(fiscalizacaoSchema),
    defaultValues: {
      remetente: "",
      trimestre: "",
      anoReferencia: "",
      dataRecebimento: "",
      responsavelMinFin: "",
      cargoResponsavel: "",
      emailResponsavel: "",
      telefoneResponsavel: "",
      numeroOficio: "",
      observacoes: "",
    },
  });

  const onSubmit = (data: FiscalizacaoForm) => {
    console.log("Processo de Fiscalização OGE criado:", data);
    toast({
      title: "Processo de Fiscalização OGE registado!",
      description: `Relatório trimestral do ${data.trimestre} registado com sucesso. Acta de recebimento será emitida.`,
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
          <h1 className="text-3xl font-bold text-foreground">Registo de Fiscalização da Execução do OGE</h1>
          <p className="text-muted-foreground">Registo de relatório trimestral de execução orçamental</p>
        </div>
      </div>

      <Card className="p-6 border-l-4 border-l-primary">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Informações Importantes:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Relatórios trimestrais devem ser remetidos no prazo de 45 dias após o fim do período</li>
              <li>O TC emite parecer trimestral enviado à Assembleia Nacional</li>
              <li>Acompanhamento em tempo real da execução do OGE incluindo Segurança Social</li>
              <li>Prazo de análise e emissão de parecer: 60 dias após recebimento</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados do Relatório */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Dados do Relatório Trimestral</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EntitySelector
                value={watch("remetente")}
                onChange={(value) => setValue("remetente", value)}
                label="Entidade Remetente"
                required
                error={errors.remetente?.message}
              />

              <div className="space-y-2">
                <Label htmlFor="numeroOficio">Número do Ofício</Label>
                <Input 
                  id="numeroOficio" 
                  {...register("numeroOficio")} 
                  placeholder="Ex: OF/MINFIN/2024/001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trimestre">Trimestre de Referência *</Label>
                <Select onValueChange={(value) => setValue("trimestre", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o trimestre" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="1º Trimestre">1º Trimestre (Janeiro - Março)</SelectItem>
                    <SelectItem value="2º Trimestre">2º Trimestre (Abril - Junho)</SelectItem>
                    <SelectItem value="3º Trimestre">3º Trimestre (Julho - Setembro)</SelectItem>
                    <SelectItem value="4º Trimestre">4º Trimestre (Outubro - Dezembro)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.trimestre && <p className="text-sm text-destructive">{errors.trimestre.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="anoReferencia">Ano de Referência *</Label>
                <Select onValueChange={(value) => setValue("anoReferencia", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                  </SelectContent>
                </Select>
                {errors.anoReferencia && <p className="text-sm text-destructive">{errors.anoReferencia.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataRecebimento">Data de Recebimento no TC *</Label>
                <Input 
                  id="dataRecebimento" 
                  type="date"
                  {...register("dataRecebimento")} 
                />
                {errors.dataRecebimento && <p className="text-sm text-destructive">{errors.dataRecebimento.message}</p>}
              </div>
            </div>
          </div>

          {/* Dados do Responsável */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2 pb-2 border-b">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Dados do Responsável pelo Relatório</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="responsavelMinFin">Nome Completo *</Label>
                <Input 
                  id="responsavelMinFin" 
                  {...register("responsavelMinFin")} 
                  placeholder="Nome do responsável"
                />
                {errors.responsavelMinFin && <p className="text-sm text-destructive">{errors.responsavelMinFin.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargoResponsavel">Cargo *</Label>
                <Input 
                  id="cargoResponsavel" 
                  {...register("cargoResponsavel")} 
                  placeholder="Ex: Ministro, Diretor Nacional"
                />
                {errors.cargoResponsavel && <p className="text-sm text-destructive">{errors.cargoResponsavel.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailResponsavel">Email *</Label>
                <Input 
                  id="emailResponsavel" 
                  type="email"
                  {...register("emailResponsavel")} 
                  placeholder="email@minfin.gov.ao"
                />
                {errors.emailResponsavel && <p className="text-sm text-destructive">{errors.emailResponsavel.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefoneResponsavel">Telefone *</Label>
                <Input 
                  id="telefoneResponsavel" 
                  {...register("telefoneResponsavel")} 
                  placeholder="+244 900 000 000"
                />
                {errors.telefoneResponsavel && <p className="text-sm text-destructive">{errors.telefoneResponsavel.message}</p>}
              </div>
            </div>
          </div>

          {/* Documentos Obrigatórios */}
          <div className="space-y-4 pt-4 border-t">
            <DocumentChecklist
              documents={[
                "Relatório de Execução Orçamental do Trimestre",
                "Demonstrações financeiras consolidadas",
                "Relatório de receitas e despesas públicas",
                "Balanço de execução por órgão/entidade",
                "Relatório de dívida pública",
                "Análise de desvios orçamentais",
                "Relatório de execução da Segurança Social (se aplicável)",
                "Mapas orçamentais comparativos",
                "Documentos de suporte e justificativas"
              ]}
              label="Documentos e Anexos do Relatório Trimestral"
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Adicionais</Label>
            <Textarea 
              id="observacoes" 
              {...register("observacoes")} 
              placeholder="Informações complementares sobre o relatório (opcional)"
              rows={4}
            />
          </div>

          {/* Informações do Processo */}
          <Card className="p-4 bg-accent/10 border-accent">
            <p className="text-sm font-semibold text-accent-foreground mb-2">Próximas Etapas Após Registo:</p>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Autuação do processo pela Contadoria Geral</li>
              <li>Distribuição automática ao Juiz Relator e Juiz Adjunto</li>
              <li>Apreciação pelo Presidente da 2ª Câmara</li>
              <li>Emissão de parecer pela 3ª Divisão (prazo: 45-60 dias)</li>
              <li>Controle de qualidade pelo DST</li>
              <li>Análise e decisão pelos Juízes</li>
              <li>Comunicação à Assembleia Nacional</li>
            </ol>
          </Card>

          {/* Botões */}
          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit">
              <FileText className="mr-2 h-4 w-4" />
              Registar Processo
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
