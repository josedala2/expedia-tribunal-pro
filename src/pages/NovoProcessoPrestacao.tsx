import { ArrowLeft, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const prestacaoSchema = z.object({
  entidade: z.string().min(3, "Nome da entidade é obrigatório"),
  naturezaEntidade: z.string().min(1, "Natureza da entidade é obrigatória"),
  exercicio: z.string().min(4, "Exercício/Ano é obrigatório"),
  periodoInicio: z.string().optional(),
  periodoFim: z.string().optional(),
  substituicaoResponsaveis: z.boolean().default(false),
  responsavel: z.string().min(3, "Nome do responsável é obrigatório"),
  cargo: z.string().min(2, "Cargo é obrigatório"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(9, "Telefone inválido"),
  portadorExpediente: z.string().optional(),
  urgencia: z.string().default("normal"),
  prorrogacaoPrazo: z.boolean().default(false),
  oficioProrrogacao: z.string().optional(),
  observacoes: z.string().optional(),
});

type PrestacaoForm = z.infer<typeof prestacaoSchema>;

interface NovoProcessoPrestacaoProps {
  onBack: () => void;
}

export const NovoProcessoPrestacao = ({ onBack }: NovoProcessoPrestacaoProps) => {
  const { toast } = useToast();
  const [substituicao, setSubstituicao] = useState(false);
  const [prorrogacao, setProrrogacao] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PrestacaoForm>({
    resolver: zodResolver(prestacaoSchema),
    defaultValues: {
      entidade: "",
      naturezaEntidade: "",
      exercicio: "",
      periodoInicio: "",
      periodoFim: "",
      substituicaoResponsaveis: false,
      responsavel: "",
      cargo: "",
      email: "",
      telefone: "",
      portadorExpediente: "",
      urgencia: "normal",
      prorrogacaoPrazo: false,
      oficioProrrogacao: "",
      observacoes: "",
    },
  });

  const onSubmit = (data: PrestacaoForm) => {
    console.log("Processo criado:", data);
    toast({
      title: "Processo de Prestação de Contas criado!",
      description: `Expediente da entidade ${data.entidade} registado com sucesso. Acta de recebimento será emitida.`,
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
          <h1 className="text-3xl font-bold text-foreground">Registo de Expediente de Prestação de Contas</h1>
          <p className="text-muted-foreground">Registo de novo processo de prestação de contas</p>
        </div>
      </div>

      <Card className="p-6 border-l-4 border-l-primary">
        <div className="flex items-start gap-3 mb-6">
          <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Prazos de Submissão:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Entidades da Administração Central e Local: até 30 de junho do ano seguinte</li>
              <li>Órgãos de Soberania: até 30 de setembro do ano seguinte</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados da Entidade */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Dados da Entidade</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="entidade">Nome da Entidade *</Label>
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
                {errors.entidade && <p className="text-sm text-destructive">{errors.entidade.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="naturezaEntidade">Natureza da Entidade *</Label>
                <Select onValueChange={(value) => setValue("naturezaEntidade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a natureza" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="Administração Central">Administração Central</SelectItem>
                    <SelectItem value="Administração Local">Administração Local</SelectItem>
                    <SelectItem value="Órgão de Soberania">Órgão de Soberania</SelectItem>
                    <SelectItem value="Instituto Público">Instituto Público</SelectItem>
                    <SelectItem value="Empresa Pública">Empresa Pública</SelectItem>
                    <SelectItem value="Autarquia">Autarquia</SelectItem>
                    <SelectItem value="Fundação Pública">Fundação Pública</SelectItem>
                  </SelectContent>
                </Select>
                {errors.naturezaEntidade && <p className="text-sm text-destructive">{errors.naturezaEntidade.message}</p>}
              </div>
            </div>
          </div>

          {/* Dados do Exercício */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-foreground">Período da Conta de Gerência</h3>
            
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="substituicao" 
                checked={substituicao}
                onCheckedChange={(checked) => {
                  setSubstituicao(checked as boolean);
                  setValue("substituicaoResponsaveis", checked as boolean);
                }}
              />
              <Label htmlFor="substituicao" className="font-normal cursor-pointer">
                Substituição total dos responsáveis da entidade (definir período específico)
              </Label>
            </div>

            {!substituicao ? (
              <div className="space-y-2">
                <Label htmlFor="exercicio">Ano de Exercício *</Label>
                <Select onValueChange={(value) => setValue("exercicio", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
                {errors.exercicio && <p className="text-sm text-destructive">{errors.exercicio.message}</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="periodoInicio">Data de Início do Período *</Label>
                  <Input 
                    id="periodoInicio" 
                    type="date"
                    {...register("periodoInicio")} 
                  />
                  {errors.periodoInicio && <p className="text-sm text-destructive">{errors.periodoInicio.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodoFim">Data de Fim do Período *</Label>
                  <Input 
                    id="periodoFim" 
                    type="date"
                    {...register("periodoFim")} 
                  />
                  {errors.periodoFim && <p className="text-sm text-destructive">{errors.periodoFim.message}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Dados do Responsável */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-foreground">Dados do Responsável pela Prestação de Contas</h3>
            
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
                <Label htmlFor="cargo">Cargo *</Label>
                <Input 
                  id="cargo" 
                  {...register("cargo")} 
                  placeholder="Ex: Diretor-Geral, Ministro"
                />
                {errors.cargo && <p className="text-sm text-destructive">{errors.cargo.message}</p>}
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

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input 
                  id="telefone" 
                  {...register("telefone")} 
                  placeholder="+244 900 000 000"
                />
                {errors.telefone && <p className="text-sm text-destructive">{errors.telefone.message}</p>}
              </div>
            </div>
          </div>

          {/* Dados do Expediente */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-foreground">Dados do Expediente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="portadorExpediente">Portador do Expediente</Label>
                <Input 
                  id="portadorExpediente" 
                  {...register("portadorExpediente")} 
                  placeholder="Nome do portador (opcional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgencia">Nível de Urgência *</Label>
                <Select onValueChange={(value) => setValue("urgencia", value)} defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="muito-urgente">Muito Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Prorrogação de Prazo */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="prorrogacao" 
                checked={prorrogacao}
                onCheckedChange={(checked) => {
                  setProrrogacao(checked as boolean);
                  setValue("prorrogacaoPrazo", checked as boolean);
                }}
              />
              <Label htmlFor="prorrogacao" className="font-normal cursor-pointer">
                Foi solicitada prorrogação de prazo para submissão das contas
              </Label>
            </div>

            {prorrogacao && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="oficioProrrogacao">Número do Ofício de Prorrogação *</Label>
                <Input 
                  id="oficioProrrogacao" 
                  {...register("oficioProrrogacao")} 
                  placeholder="Ex: OF/MINFIN/2024/001"
                />
                {errors.oficioProrrogacao && <p className="text-sm text-destructive">{errors.oficioProrrogacao.message}</p>}
                <p className="text-xs text-muted-foreground">
                  A cópia do ofício deve ser anexada na secção de documentos para evitar penalização.
                </p>
              </div>
            )}
          </div>

          {/* Documentos Obrigatórios */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-foreground">Documentos e Demonstrações</h3>
            <Card className="p-4 bg-muted/50">
              <p className="text-sm font-semibold mb-3">Checklist de Documentos Obrigatórios:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  Demonstrações numéricas das operações contabilísticas
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  Balanço patrimonial
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  Demonstração de resultados
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  Fluxo de caixa
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  Notas explicativas às demonstrações financeiras
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  Relatório de execução orçamental
                </li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Os documentos serão anexados após a criação do processo.
              </p>
            </Card>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Adicionais</Label>
            <Textarea 
              id="observacoes" 
              {...register("observacoes")} 
              placeholder="Observações ou informações complementares (opcional)"
              rows={4}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit">
              <FileText className="mr-2 h-4 w-4" />
              Registar Expediente
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
