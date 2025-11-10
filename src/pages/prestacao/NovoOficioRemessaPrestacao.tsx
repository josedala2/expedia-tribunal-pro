import { useState } from "react";
import { ArrowLeft, FileText, Eye, FileSignature } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { OficioTemplate } from "@/components/documents/OficioTemplate";
import { AssinarOficioDialog } from "@/components/oficios/AssinarOficioDialog";
import { AnexosUpload } from "@/components/oficios/AnexosUpload";

const formSchema = z.object({
  processo: z.string().min(1, { message: "Selecione um processo" }),
  tipoOficio: z.enum(["Decisão Final", "Solicitação Elementos", "Guia Cobrança", "Notificação"], {
    required_error: "Selecione o tipo de ofício",
  }),
  destinatario: z.string()
    .trim()
    .min(3, { message: "Nome do destinatário deve ter pelo menos 3 caracteres" })
    .max(200, { message: "Nome do destinatário não pode exceder 200 caracteres" }),
  cargoDestinatario: z.string()
    .trim()
    .min(3, { message: "Cargo deve ter pelo menos 3 caracteres" })
    .max(200, { message: "Cargo não pode exceder 200 caracteres" }),
  entidadeDestinatario: z.string()
    .trim()
    .min(3, { message: "Entidade deve ter pelo menos 3 caracteres" })
    .max(200, { message: "Entidade não pode exceder 200 caracteres" }),
  endereco: z.string()
    .trim()
    .min(5, { message: "Endereço deve ter pelo menos 5 caracteres" })
    .max(300, { message: "Endereço não pode exceder 300 caracteres" }),
  assunto: z.string()
    .trim()
    .min(10, { message: "Assunto deve ter pelo menos 10 caracteres" })
    .max(300, { message: "Assunto não pode exceder 300 caracteres" }),
  conteudo: z.string()
    .trim()
    .min(50, { message: "Conteúdo deve ter pelo menos 50 caracteres" })
    .max(5000, { message: "Conteúdo não pode exceder 5000 caracteres" }),
  dataEmissao: z.date({
    required_error: "Selecione a data de emissão",
  }),
  prazoResposta: z.number()
    .min(0, { message: "Prazo não pode ser negativo" })
    .max(365, { message: "Prazo não pode exceder 365 dias" })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NovoOficioRemessaPrestacaoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

const TEMPLATES = {
  "Decisão Final": {
    assunto: "Remessa de Decisão - Processo de Prestação de Contas",
    conteudo: `Excelentíssimo(a) Senhor(a) [CARGO],

Tenho a honra de remeter a Vossa Excelência, em anexo, a decisão proferida pelo Tribunal de Contas no âmbito do processo de Prestação de Contas n.º [PROCESSO], referente ao exercício económico de [ANO].

Após análise técnica e apreciação do processo, o Tribunal decidiu que as contas apresentadas estão [DECISÃO].

Solicitamos que Vossa Excelência tome conhecimento da decisão e adote as medidas necessárias em conformidade com o determinado.

Subscrevo-me com elevada consideração e apreço.`,
  },
  "Solicitação Elementos": {
    assunto: "Solicitação de Elementos Complementares - Prestação de Contas",
    conteudo: `Excelentíssimo(a) Senhor(a) [CARGO],

No âmbito da análise do processo de Prestação de Contas n.º [PROCESSO], referente ao exercício económico de [ANO], o Tribunal de Contas verificou a necessidade de elementos complementares para a correta e cabal apreciação das contas apresentadas.

Solicitamos, no prazo de [PRAZO] dias úteis, a remessa dos seguintes documentos e esclarecimentos:

[LISTA DE DOCUMENTOS]

A não apresentação dos elementos solicitados no prazo indicado poderá comprometer a análise das contas, com as consequências previstas na legislação em vigor.

Subscrevo-me com elevada consideração e apreço.`,
  },
  "Guia Cobrança": {
    assunto: "Remessa de Guia de Cobrança de Emolumentos",
    conteudo: `Excelentíssimo(a) Senhor(a) [CARGO],

Nos termos da legislação em vigor, remeto a Vossa Excelência, em anexo, a Guia de Cobrança de Emolumentos n.º [GUIA], referente ao processo de Prestação de Contas n.º [PROCESSO].

O pagamento dos emolumentos devidos deverá ser efetuado no prazo de [PRAZO] dias úteis, conforme estabelecido na legislação aplicável.

Para efeitos de pagamento, a guia em anexo contém todas as informações necessárias, incluindo os dados bancários e o montante a liquidar.

Subscrevo-me com elevada consideração e apreço.`,
  },
  "Notificação": {
    assunto: "Notificação - Processo de Prestação de Contas",
    conteudo: `Excelentíssimo(a) Senhor(a) [CARGO],

Vimos por este meio notificar Vossa Excelência de que [MOTIVO DA NOTIFICAÇÃO].

Esta notificação tem como objetivo [OBJETIVO], no âmbito do processo de Prestação de Contas n.º [PROCESSO].

Solicitamos que Vossa Excelência tome conhecimento e adote as providências que se mostrarem necessárias.

Subscrevo-me com elevada consideração e apreço.`,
  },
};

const PROCESSOS_MOCK = [
  { id: "PC-2024-001", entidade: "Ministério da Educação", ano: "2023" },
  { id: "PC-2024-002", entidade: "Governo Provincial de Luanda", ano: "2023" },
  { id: "PC-2024-003", entidade: "Assembleia Nacional", ano: "2023" },
];

export const NovoOficioRemessaPrestacao = ({ onBack, onNavigate }: NovoOficioRemessaPrestacaoProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showAssinaturaDialog, setShowAssinaturaDialog] = useState(false);
  const [assinatura, setAssinatura] = useState<string | null>(null);
  const [anexos, setAnexos] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      processo: "",
      tipoOficio: undefined,
      destinatario: "",
      cargoDestinatario: "",
      entidadeDestinatario: "",
      endereco: "",
      assunto: "",
      conteudo: "",
      dataEmissao: new Date(),
      prazoResposta: undefined,
    },
  });

  const tipoOficio = form.watch("tipoOficio");
  const processoSelecionado = form.watch("processo");

  const handleTipoOficioChange = (tipo: FormValues["tipoOficio"]) => {
    const template = TEMPLATES[tipo];
    if (template) {
      form.setValue("assunto", template.assunto);
      form.setValue("conteudo", template.conteudo);
    }
  };

  const onSubmit = (data: FormValues) => {
    if (!assinatura) {
      toast.error("Por favor, assine o ofício antes de submeter");
      return;
    }
    console.log("Form data:", data);
    console.log("Assinatura:", assinatura);
    console.log("Anexos:", anexos);
    toast.success("Ofício criado e assinado com sucesso!");
    onBack();
  };

  const handleAssinadoComSucesso = (assinaturaDigital: string) => {
    setAssinatura(assinaturaDigital);
    toast.success("Ofício assinado! Pode agora submeter o formulário.");
  };

  const handlePreview = () => {
    const values = form.getValues();
    const processo = PROCESSOS_MOCK.find(p => p.id === values.processo);
    
    setPreviewData({
      numero: `OF-PC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      data: values.dataEmissao.toISOString(),
      destinatario: values.destinatario,
      cargo: values.cargoDestinatario,
      entidade: values.entidadeDestinatario,
      endereco: values.endereco,
      assunto: values.assunto,
      conteudo: values.conteudo,
      processo: values.processo,
      processoEntidade: processo?.entidade || "",
      assinante: "Juiz Conselheiro Presidente",
      cargoAssinante: "Presidente do Tribunal de Contas",
    });
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Novo Ofício de Remessa</h1>
          <p className="text-muted-foreground mt-1">
            Criar novo ofício de remessa para processo de prestação de contas
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações do Processo */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Processo</CardTitle>
              <CardDescription>
                Selecione o processo e o tipo de ofício a emitir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="processo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processo de Prestação de Contas</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um processo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROCESSOS_MOCK.map((processo) => (
                          <SelectItem key={processo.id} value={processo.id}>
                            {processo.id} - {processo.entidade} ({processo.ano})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipoOficio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Ofício</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleTipoOficioChange(value as FormValues["tipoOficio"]);
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de ofício" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Decisão Final">Decisão Final</SelectItem>
                        <SelectItem value="Solicitação Elementos">Solicitação de Elementos</SelectItem>
                        <SelectItem value="Guia Cobrança">Guia de Cobrança</SelectItem>
                        <SelectItem value="Notificação">Notificação</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      O template do ofício será preenchido automaticamente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataEmissao"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Emissão</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2020-01-01")
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Destinatário */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Destinatário</CardTitle>
              <CardDescription>
                Informações sobre o destinatário do ofício
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="destinatario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Destinatário</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Dr. João Silva" {...field} maxLength={200} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cargoDestinatario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ministro da Educação" {...field} maxLength={200} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entidadeDestinatario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ministério da Educação" {...field} maxLength={200} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Av. Principal, Luanda - Angola" {...field} maxLength={300} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Conteúdo do Ofício */}
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo do Ofício</CardTitle>
              <CardDescription>
                Assunto e corpo do ofício (pode editar o template)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="assunto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assunto</FormLabel>
                    <FormControl>
                      <Input placeholder="Assunto do ofício" {...field} maxLength={300} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="conteudo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Corpo do ofício"
                        className="min-h-[300px] font-mono text-sm"
                        {...field}
                        maxLength={5000}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value.length} / 5000 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(tipoOficio === "Solicitação Elementos" || tipoOficio === "Guia Cobrança") && (
                <FormField
                  control={form.control}
                  name="prazoResposta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo de Resposta (dias)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ex: 15"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Prazo para resposta ou pagamento (se aplicável)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Anexos */}
          <AnexosUpload 
            anexos={anexos}
            onAnexosChange={setAnexos}
          />

          {/* Ações */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Pré-visualizar
              </Button>
              <Button 
                type="button" 
                variant={assinatura ? "secondary" : "default"}
                onClick={() => setShowAssinaturaDialog(true)}
              >
                <FileSignature className="h-4 w-4 mr-2" />
                {assinatura ? "Assinado ✓" : "Assinar Ofício"}
              </Button>
              <Button type="submit" disabled={!assinatura}>
                <FileText className="h-4 w-4 mr-2" />
                Criar Ofício
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Preview */}
      {previewData && (
        <DocumentViewer
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title={`Pré-visualização - Ofício ${previewData.numero}`}
        >
          <OficioTemplate
            numero={previewData.numero}
            data={previewData.data}
            destinatario={previewData.destinatario}
            cargo={previewData.cargo}
            entidade={previewData.entidade}
            assunto={previewData.assunto}
            conteudo={previewData.conteudo}
            assinante={previewData.assinante}
            cargoAssinante={previewData.cargoAssinante}
            referencia={previewData.processo}
            logoUrl="/logo-tc.png"
          />
        </DocumentViewer>
      )}

      {/* Assinatura Digital Dialog */}
      {previewData && (
        <AssinarOficioDialog
          open={showAssinaturaDialog}
          onOpenChange={setShowAssinaturaDialog}
          oficio={{
            numero: previewData.numero,
            tipo: form.watch("tipoOficio") || "Ofício",
            destinatario: previewData.destinatario,
          }}
          onAssinado={handleAssinadoComSucesso}
        />
      )}
    </div>
  );
};