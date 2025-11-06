import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Edit, Trash2, CalendarIcon, Eye, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ContagemTempoServico from "@/components/pensionistas/ContagemTempoServico";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface CadastroAposentadosProps {
  onBack: () => void;
}

// Schema de validação
const pensionistaSchema = z.object({
  // Dados Pessoais
  nome_completo: z.string().trim().min(1, "Nome completo é obrigatório").max(255),
  bi: z.string().trim().max(50).optional().or(z.literal("")),
  nif: z.string().trim().max(50).optional().or(z.literal("")),
  data_nascimento: z.date().optional(),
  genero: z.string().optional(),
  estado_civil: z.string().optional(),
  contacto_telefone: z.string().trim().max(50).optional().or(z.literal("")),
  contacto_email: z.string().trim().email("Email inválido").max(255).optional().or(z.literal("")),
  morada: z.string().trim().max(500).optional().or(z.literal("")),
  
  // Dados da Aposentadoria
  tipo_aposentadoria: z.string().min(1, "Tipo de aposentadoria é obrigatório"),
  data_aposentadoria: z.date({
    required_error: "Data de aposentadoria é obrigatória",
  }),
  motivo_aposentadoria: z.string().trim().max(500).optional().or(z.literal("")),
  tempo_servico_anos: z.number().int().min(0).optional(),
  tempo_servico_meses: z.number().int().min(0).max(11).optional(),
  
  // Dados Financeiros
  valor_pensao: z.number().min(0).optional(),
  banco: z.string().trim().max(100).optional().or(z.literal("")),
  iban: z.string().trim().max(50).optional().or(z.literal("")),
  
  // Observações
  observacoes: z.string().trim().max(1000).optional().or(z.literal("")),
});

const historicoSchema = z.object({
  cargo: z.string().trim().min(1, "Cargo é obrigatório").max(255),
  unidade_organica: z.string().trim().max(100).optional().or(z.literal("")),
  departamento: z.string().trim().max(100).optional().or(z.literal("")),
  categoria: z.string().trim().max(100).optional().or(z.literal("")),
  data_inicio: z.date({
    required_error: "Data de início é obrigatória",
  }),
  data_fim: z.date().optional(),
  observacoes: z.string().trim().max(500).optional().or(z.literal("")),
});

type PensionistaFormData = z.infer<typeof pensionistaSchema>;
type HistoricoFormData = z.infer<typeof historicoSchema>;

interface Pensionista {
  id: string;
  numero_pensionista: string;
  nome_completo: string;
  tipo_aposentadoria: string;
  data_aposentadoria: string;
  valor_pensao: number | null;
  status: string;
}

interface HistoricoFuncional {
  id?: string;
  cargo: string;
  unidade_organica?: string;
  departamento?: string;
  categoria?: string;
  data_inicio: Date;
  data_fim?: Date;
  observacoes?: string;
}

export default function CadastroAposentados({ onBack }: CadastroAposentadosProps) {
  const { toast } = useToast();
  const [pensionistas, setPensionistas] = useState<Pensionista[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPensionista, setEditingPensionista] = useState<Pensionista | null>(null);
  const [historicoItems, setHistoricoItems] = useState<HistoricoFuncional[]>([]);
  const [isHistoricoDialogOpen, setIsHistoricoDialogOpen] = useState(false);
  const [contagemDialogOpen, setContagemDialogOpen] = useState(false);
  const [selectedPensionistaHistorico, setSelectedPensionistaHistorico] = useState<any>(null);

  const form = useForm<PensionistaFormData>({
    resolver: zodResolver(pensionistaSchema),
    defaultValues: {
      nome_completo: "",
      bi: "",
      nif: "",
      genero: "",
      estado_civil: "",
      contacto_telefone: "",
      contacto_email: "",
      morada: "",
      tipo_aposentadoria: "",
      motivo_aposentadoria: "",
      tempo_servico_anos: 0,
      tempo_servico_meses: 0,
      valor_pensao: 0,
      banco: "",
      iban: "",
      observacoes: "",
    },
  });

  const historicoForm = useForm<HistoricoFormData>({
    resolver: zodResolver(historicoSchema),
    defaultValues: {
      cargo: "",
      unidade_organica: "",
      departamento: "",
      categoria: "",
      observacoes: "",
    },
  });

  useEffect(() => {
    fetchPensionistas();
  }, []);

  const fetchPensionistas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pensionistas")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      setPensionistas(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar pensionistas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNumeroPensionista = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `PENS-${year}-${random}`;
  };

  const handleAddHistorico = (data: HistoricoFormData) => {
    const newHistorico: HistoricoFuncional = {
      cargo: data.cargo,
      unidade_organica: data.unidade_organica || undefined,
      departamento: data.departamento || undefined,
      categoria: data.categoria || undefined,
      data_inicio: data.data_inicio,
      data_fim: data.data_fim || undefined,
      observacoes: data.observacoes || undefined,
    };
    setHistoricoItems([...historicoItems, newHistorico]);
    historicoForm.reset();
    setIsHistoricoDialogOpen(false);
    toast({
      title: "Histórico adicionado",
      description: "Registo de histórico funcional adicionado com sucesso",
    });
  };

  const handleRemoveHistorico = (index: number) => {
    setHistoricoItems(historicoItems.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PensionistaFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const pensionistaData = {
        numero_pensionista: editingPensionista?.numero_pensionista || generateNumeroPensionista(),
        nome_completo: data.nome_completo,
        bi: data.bi || null,
        nif: data.nif || null,
        data_nascimento: data.data_nascimento?.toISOString().split('T')[0] || null,
        genero: data.genero || null,
        estado_civil: data.estado_civil || null,
        contacto_telefone: data.contacto_telefone || null,
        contacto_email: data.contacto_email || null,
        morada: data.morada || null,
        tipo_aposentadoria: data.tipo_aposentadoria,
        data_aposentadoria: data.data_aposentadoria.toISOString().split('T')[0],
        motivo_aposentadoria: data.motivo_aposentadoria || null,
        tempo_servico_anos: data.tempo_servico_anos || null,
        tempo_servico_meses: data.tempo_servico_meses || null,
        valor_pensao: data.valor_pensao || null,
        banco: data.banco || null,
        iban: data.iban || null,
        observacoes: data.observacoes || null,
        criado_por: user?.id,
      };

      if (editingPensionista) {
        const { error } = await supabase
          .from("pensionistas")
          .update(pensionistaData)
          .eq("id", editingPensionista.id);

        if (error) throw error;

        toast({
          title: "Pensionista atualizado",
          description: "Registo atualizado com sucesso",
        });
      } else {
        const { data: newPensionista, error } = await supabase
          .from("pensionistas")
          .insert(pensionistaData)
          .select()
          .single();

        if (error) throw error;

        // Inserir histórico funcional
        if (historicoItems.length > 0 && newPensionista) {
          const historicoData = historicoItems.map((item) => ({
            pensionista_id: newPensionista.id,
            cargo: item.cargo,
            unidade_organica: item.unidade_organica || null,
            departamento: item.departamento || null,
            categoria: item.categoria || null,
            data_inicio: item.data_inicio.toISOString().split('T')[0],
            data_fim: item.data_fim?.toISOString().split('T')[0] || null,
            observacoes: item.observacoes || null,
          }));

          const { error: historicoError } = await supabase
            .from("historico_funcional_pensionista")
            .insert(historicoData);

          if (historicoError) throw historicoError;
        }

        toast({
          title: "Pensionista registado",
          description: "Novo pensionista adicionado com sucesso",
        });
      }

      setIsDialogOpen(false);
      form.reset();
      setHistoricoItems([]);
      setEditingPensionista(null);
      fetchPensionistas();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (pensionista: Pensionista) => {
    setEditingPensionista(pensionista);
    form.reset({
      nome_completo: pensionista.nome_completo,
      tipo_aposentadoria: pensionista.tipo_aposentadoria,
      data_aposentadoria: new Date(pensionista.data_aposentadoria),
      valor_pensao: pensionista.valor_pensao || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este pensionista?")) return;

    try {
      const { error } = await supabase.from("pensionistas").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Pensionista excluído",
        description: "Registo excluído com sucesso",
      });
      fetchPensionistas();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredPensionistas = pensionistas.filter((p) => {
    const matchesSearch =
      p.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.numero_pensionista.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todos" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive"; label: string }> = {
      ativo: { variant: "default", label: "Ativo" },
      suspenso: { variant: "secondary", label: "Suspenso" },
      falecido: { variant: "destructive", label: "Falecido" },
    };
    const config = variants[status] || variants.ativo;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome ou número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="suspenso">Suspenso</SelectItem>
              <SelectItem value="falecido">Falecido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => { setEditingPensionista(null); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pensionista
        </Button>
      </div>

      {/* Card de Ações Rápidas */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Contagem de Tempo de Serviço
          </CardTitle>
          <CardDescription>
            Calcule o tempo de serviço e verifique requisitos mínimos para aposentação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Selecione um pensionista na tabela abaixo e clique no botão de relógio para visualizar o cálculo detalhado do tempo de serviço, baseado no histórico funcional registado.
          </p>
          <div className="flex gap-4 items-center">
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-background rounded-lg">
                <p className="text-2xl font-bold">{pensionistas.length}</p>
                <p className="text-xs text-muted-foreground">Total Pensionistas</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <p className="text-2xl font-bold">
                  {pensionistas.filter(p => p.status === 'ativo').length}
                </p>
                <p className="text-xs text-muted-foreground">Ativos</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <p className="text-2xl font-bold">15 anos</p>
                <p className="text-xs text-muted-foreground">Requisito Mínimo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pensionistas</CardTitle>
          <CardDescription>Gerir registos de pensionistas e reformados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data Aposentadoria</TableHead>
                <TableHead>Valor Pensão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredPensionistas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Nenhum pensionista encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredPensionistas.map((pensionista) => (
                  <TableRow key={pensionista.id}>
                    <TableCell className="font-medium">{pensionista.numero_pensionista}</TableCell>
                    <TableCell>{pensionista.nome_completo}</TableCell>
                    <TableCell>{pensionista.tipo_aposentadoria}</TableCell>
                    <TableCell>{format(new Date(pensionista.data_aposentadoria), "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      {pensionista.valor_pensao ? `${pensionista.valor_pensao.toLocaleString()} CVE` : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(pensionista.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={async () => {
                            const { data } = await supabase
                              .from("pensionistas")
                              .select("*, historico_funcional_pensionista(*)")
                              .eq("id", pensionista.id)
                              .single();
                            setSelectedPensionistaHistorico(data);
                            setContagemDialogOpen(true);
                          }}
                          title="Contagem de Tempo de Serviço"
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(pensionista)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(pensionista.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Formulário */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPensionista ? "Editar Pensionista" : "Novo Pensionista"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do pensionista. Os campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="pessoais" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
                  <TabsTrigger value="aposentadoria">Aposentadoria</TabsTrigger>
                  <TabsTrigger value="historico">Histórico Funcional</TabsTrigger>
                </TabsList>

                {/* Tab: Dados Pessoais */}
                <TabsContent value="pessoais" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nome_completo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome completo do pensionista" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BI</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Número do BI" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nif"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIF</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Número do NIF" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="data_nascimento"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Nascimento</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecionar data</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="genero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Género</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="masculino">Masculino</SelectItem>
                              <SelectItem value="feminino">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estado_civil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado Civil</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                              <SelectItem value="casado">Casado(a)</SelectItem>
                              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contacto_telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Número de telefone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contacto_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="email@exemplo.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="morada"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Morada</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Endereço completo" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Tab: Dados da Aposentadoria */}
                <TabsContent value="aposentadoria" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tipo_aposentadoria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Aposentadoria *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="aposentadoria_idade">Aposentadoria por Idade</SelectItem>
                              <SelectItem value="aposentadoria_invalidez">Aposentadoria por Invalidez</SelectItem>
                              <SelectItem value="pensao_sobrevivencia">Pensão de Sobrevivência</SelectItem>
                              <SelectItem value="reforma_antecipada">Reforma Antecipada</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="data_aposentadoria"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Aposentadoria *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecionar data</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="motivo_aposentadoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivo da Aposentadoria</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Descreva o motivo da aposentadoria" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tempo_servico_anos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempo de Serviço (Anos)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tempo_servico_meses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempo de Serviço (Meses)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="valor_pensao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor da Pensão (CVE)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="banco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banco</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nome do banco" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="iban"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IBAN</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="CV00 0000 0000 0000 0000 0000 0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Observações adicionais" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Tab: Histórico Funcional */}
                <TabsContent value="historico" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Adicione os cargos e funções anteriores do pensionista
                    </p>
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsHistoricoDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Cargo
                    </Button>
                  </div>

                  {historicoItems.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cargo</TableHead>
                          <TableHead>Unidade</TableHead>
                          <TableHead>Período</TableHead>
                          <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {historicoItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.cargo}</TableCell>
                            <TableCell>{item.unidade_organica || "-"}</TableCell>
                            <TableCell>
                              {format(item.data_inicio, "dd/MM/yyyy")}
                              {item.data_fim ? ` - ${format(item.data_fim, "dd/MM/yyyy")}` : " - Presente"}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveHistorico(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum histórico funcional adicionado
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPensionista ? "Atualizar" : "Registar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Histórico Funcional */}
      <Dialog open={isHistoricoDialogOpen} onOpenChange={setIsHistoricoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Histórico Funcional</DialogTitle>
            <DialogDescription>Preencha os dados do cargo anterior</DialogDescription>
          </DialogHeader>

          <Form {...historicoForm}>
            <form onSubmit={historicoForm.handleSubmit(handleAddHistorico)} className="space-y-4">
              <FormField
                control={historicoForm.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do cargo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={historicoForm.control}
                  name="unidade_organica"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade Orgânica</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome da unidade" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={historicoForm.control}
                  name="departamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome do departamento" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={historicoForm.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Categoria profissional" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={historicoForm.control}
                  name="data_inicio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Início *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecionar</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={historicoForm.control}
                  name="data_fim"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Fim</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecionar</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={historicoForm.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Observações sobre o cargo" rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsHistoricoDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Adicionar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {selectedPensionistaHistorico && (
        <ContagemTempoServico
          open={contagemDialogOpen}
          onOpenChange={setContagemDialogOpen}
          historicoFuncional={selectedPensionistaHistorico.historico_funcional_pensionista || []}
          pensionistaNome={selectedPensionistaHistorico.nome_completo}
        />
      )}
    </div>
  );
}
