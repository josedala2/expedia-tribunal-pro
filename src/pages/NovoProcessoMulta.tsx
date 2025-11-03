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
                <div className="space-y-2">
                  <Label htmlFor="entidade">Nome da Entidade/Pessoa *</Label>
                  <Select onValueChange={(value) => setValue("entidade", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a entidade" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px]">
                      <SelectItem value="A. Presidente da República">A. Presidente da República</SelectItem>
                      <SelectItem value="Presidência da República">Presidência da República</SelectItem>
                      <SelectItem value="Casa Civil">Casa Civil</SelectItem>
                      <SelectItem value="Casa Militar">Casa Militar</SelectItem>
                      <SelectItem value="Gabinete do Presidente da República">Gabinete do Presidente da República</SelectItem>
                      <SelectItem value="Gabinete da Primeira-Dama">Gabinete da Primeira-Dama</SelectItem>
                      
                      <SelectItem value="B. Assembleia Nacional">B. Assembleia Nacional</SelectItem>
                      <SelectItem value="Gabinete do Presidente da Assembleia Nacional">Gabinete do Presidente da Assembleia Nacional</SelectItem>
                      <SelectItem value="Secretariado-Geral da Assembleia Nacional">Secretariado-Geral da Assembleia Nacional</SelectItem>
                      
                      <SelectItem value="C. Governo - Vice-Presidência">C. Governo - Vice-Presidência</SelectItem>
                      <SelectItem value="Vice-Presidência da República">Vice-Presidência da República</SelectItem>
                      <SelectItem value="Conselho de Ministros">Conselho de Ministros</SelectItem>
                      
                      <SelectItem value="Ministério da Administração do Território (MAT)">Ministério da Administração do Território (MAT)</SelectItem>
                      <SelectItem value="Ministério das Finanças (MINFIN)">Ministério das Finanças (MINFIN)</SelectItem>
                      <SelectItem value="Ministério da Economia e Planeamento (MEP)">Ministério da Economia e Planeamento (MEP)</SelectItem>
                      <SelectItem value="Ministério dos Recursos Minerais, Petróleo e Gás (MIREMPET)">Ministério dos Recursos Minerais, Petróleo e Gás (MIREMPET)</SelectItem>
                      <SelectItem value="Ministério da Energia e Águas (MINEA)">Ministério da Energia e Águas (MINEA)</SelectItem>
                      <SelectItem value="Ministério da Agricultura e Florestas (MINAGRIF)">Ministério da Agricultura e Florestas (MINAGRIF)</SelectItem>
                      <SelectItem value="Ministério das Pescas e Recursos Marinhos (MINPRM)">Ministério das Pescas e Recursos Marinhos (MINPRM)</SelectItem>
                      <SelectItem value="Ministério da Indústria e Comércio (MINDCOM)">Ministério da Indústria e Comércio (MINDCOM)</SelectItem>
                      <SelectItem value="Ministério das Obras Públicas, Urbanismo e Habitação (MINOPUH)">Ministério das Obras Públicas, Urbanismo e Habitação (MINOPUH)</SelectItem>
                      <SelectItem value="Ministério dos Transportes (MINTRANS)">Ministério dos Transportes (MINTRANS)</SelectItem>
                      <SelectItem value="Ministério das Telecomunicações, Tecnologias de Informação e Comunicação Social (MINTTICS)">Ministério das Telecomunicações, Tecnologias de Informação e Comunicação Social (MINTTICS)</SelectItem>
                      <SelectItem value="Ministério da Educação (MED)">Ministério da Educação (MED)</SelectItem>
                      <SelectItem value="Ministério do Ensino Superior, Ciência, Tecnologia e Inovação (MESCTI)">Ministério do Ensino Superior, Ciência, Tecnologia e Inovação (MESCTI)</SelectItem>
                      <SelectItem value="Ministério da Saúde (MINSA)">Ministério da Saúde (MINSA)</SelectItem>
                      <SelectItem value="Ministério da Cultura e Turismo (MINCULTUR)">Ministério da Cultura e Turismo (MINCULTUR)</SelectItem>
                      <SelectItem value="Ministério da Administração Pública, Trabalho e Segurança Social (MAPTSS)">Ministério da Administração Pública, Trabalho e Segurança Social (MAPTSS)</SelectItem>
                      <SelectItem value="Ministério da Justiça e dos Direitos Humanos (MINJUSDH)">Ministério da Justiça e dos Direitos Humanos (MINJUSDH)</SelectItem>
                      <SelectItem value="Ministério do Interior (MININT)">Ministério do Interior (MININT)</SelectItem>
                      <SelectItem value="Ministério da Defesa Nacional, Antigos Combatentes e Veteranos da Pátria (MDNACVP)">Ministério da Defesa Nacional, Antigos Combatentes e Veteranos da Pátria (MDNACVP)</SelectItem>
                      <SelectItem value="Ministério do Ambiente (MINAMB)">Ministério do Ambiente (MINAMB)</SelectItem>
                      <SelectItem value="Ministério da Juventude e Desportos (MINJUD)">Ministério da Juventude e Desportos (MINJUD)</SelectItem>
                      <SelectItem value="Ministério das Relações Exteriores (MIREX)">Ministério das Relações Exteriores (MIREX)</SelectItem>
                      
                      <SelectItem value="D. Tribunais Superiores">D. Tribunais Superiores</SelectItem>
                      <SelectItem value="Tribunal Constitucional">Tribunal Constitucional</SelectItem>
                      <SelectItem value="Tribunal Supremo">Tribunal Supremo</SelectItem>
                      <SelectItem value="Tribunal de Contas">Tribunal de Contas</SelectItem>
                      <SelectItem value="Tribunal Militar Supremo">Tribunal Militar Supremo</SelectItem>
                      
                      <SelectItem value="E. Procuradoria-Geral da República (PGR)">E. Procuradoria-Geral da República (PGR)</SelectItem>
                      <SelectItem value="Procuradoria-Geral da República">Procuradoria-Geral da República</SelectItem>
                      
                      <SelectItem value="F. Outros Órgãos de Soberania">F. Outros Órgãos de Soberania</SelectItem>
                      <SelectItem value="Comissão Nacional Eleitoral (CNE)">Comissão Nacional Eleitoral (CNE)</SelectItem>
                      <SelectItem value="Conselho de Segurança Nacional">Conselho de Segurança Nacional</SelectItem>
                      <SelectItem value="Provedoria de Justiça">Provedoria de Justiça</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.entidade && (
                    <p className="text-sm text-destructive">{errors.entidade.message}</p>
                  )}
                </div>
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
