import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Clock, Plus, CheckCircle, XCircle, AlertCircle, FileDown, Calendar } from "lucide-react";
import { format } from "date-fns";

interface AssiduidadePontualidadeProps {
  onBack: () => void;
}

export default function AssiduidadePontualidade({ onBack }: AssiduidadePontualidadeProps) {
  const [pontosPendentes, setPontosPendentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogPonto, setDialogPonto] = useState(false);
  const [mesSelecionado, setMesSelecionado] = useState(format(new Date(), 'yyyy-MM'));

  const [formPonto, setFormPonto] = useState({
    data: format(new Date(), 'yyyy-MM-dd'),
    entrada_manha: "",
    saida_manha: "",
    entrada_tarde: "",
    saida_tarde: "",
    tipo: "normal",
    observacoes: "",
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      const { data: pontosData } = await supabase
        .from('registos_ponto')
        .select(`
          *,
          funcionarios:funcionario_id (
            nome_completo,
            numero_funcionario
          )
        `)
        .eq('validado', false)
        .order('data', { ascending: false });
      
      setPontosPendentes(pontosData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const validarPonto = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('registos_ponto')
        .update({
          validado: true,
          validado_por: user?.id,
          validado_em: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Ponto validado');
      carregarDados();
    } catch (error) {
      console.error('Erro ao validar ponto:', error);
      toast.error('Erro ao validar ponto');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  Assiduidade e Pontualidade
                </h1>
                <p className="text-sm text-muted-foreground">Acompanhar presença e frequência dos funcionários</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="month"
                value={mesSelecionado}
                onChange={(e) => setMesSelecionado(e.target.value)}
                className="w-[180px]"
              />
              <Button variant="outline" size="sm" className="gap-2">
                <FileDown className="h-4 w-4" />
                Exportar Relatório
              </Button>
              <Dialog open={dialogPonto} onOpenChange={setDialogPonto}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Registar Ponto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registar Ponto</DialogTitle>
                    <DialogDescription>Registar entrada/saída de funcionário</DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Data</Label>
                      <Input
                        type="date"
                        value={formPonto.data}
                        onChange={(e) => setFormPonto({...formPonto, data: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Entrada Manhã</Label>
                        <Input
                          type="time"
                          value={formPonto.entrada_manha}
                          onChange={(e) => setFormPonto({...formPonto, entrada_manha: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Saída Manhã</Label>
                        <Input
                          type="time"
                          value={formPonto.saida_manha}
                          onChange={(e) => setFormPonto({...formPonto, saida_manha: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Entrada Tarde</Label>
                        <Input
                          type="time"
                          value={formPonto.entrada_tarde}
                          onChange={(e) => setFormPonto({...formPonto, entrada_tarde: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Saída Tarde</Label>
                        <Input
                          type="time"
                          value={formPonto.saida_tarde}
                          onChange={(e) => setFormPonto({...formPonto, saida_tarde: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Tipo</Label>
                      <Select value={formPonto.tipo} onValueChange={(v) => setFormPonto({...formPonto, tipo: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="falta_justificada">Falta Justificada</SelectItem>
                          <SelectItem value="falta_injustificada">Falta Injustificada</SelectItem>
                          <SelectItem value="atraso">Atraso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Observações</Label>
                      <Textarea
                        value={formPonto.observacoes}
                        onChange={(e) => setFormPonto({...formPonto, observacoes: e.target.value})}
                        placeholder="Justificação ou observações..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogPonto(false)}>
                      Cancelar
                    </Button>
                    <Button>Registar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Registos Pendentes</CardDescription>
              <CardTitle className="text-3xl">{pontosPendentes.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Faltas do Mês</CardDescription>
              <CardTitle className="text-3xl text-red-600">0</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Atrasos do Mês</CardDescription>
              <CardTitle className="text-3xl text-orange-600">0</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Taxa de Presença</CardDescription>
              <CardTitle className="text-3xl text-green-600">98%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="pendentes" className="w-full">
          <TabsList>
            <TabsTrigger value="pendentes">Registos Pendentes</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="escalas">Escalas de Trabalho</TabsTrigger>
          </TabsList>

          <TabsContent value="pendentes">
            <Card>
              <CardHeader>
                <CardTitle>Registos de Ponto Pendentes de Validação</CardTitle>
                <CardDescription>Validar registos de assiduidade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Funcionário</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Entrada Manhã</TableHead>
                        <TableHead>Saída Tarde</TableHead>
                        <TableHead>Observações</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pontosPendentes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">Nenhum registo pendente</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        pontosPendentes.map((ponto) => (
                          <TableRow key={ponto.id}>
                            <TableCell className="font-medium">
                              <div>
                                <p>{ponto.funcionarios?.nome_completo}</p>
                                <p className="text-xs text-muted-foreground">
                                  {ponto.funcionarios?.numero_funcionario}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(ponto.data), 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell>
                              {ponto.entrada_manha ? format(new Date(ponto.entrada_manha), 'HH:mm') : '-'}
                            </TableCell>
                            <TableCell>
                              {ponto.saida_tarde ? format(new Date(ponto.saida_tarde), 'HH:mm') : '-'}
                            </TableCell>
                            <TableCell>
                              {ponto.observacoes ? (
                                <Badge variant="outline" className="gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Com observação
                                </Badge>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => validarPonto(ponto.id)}
                                className="gap-1"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Validar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Assiduidade</CardTitle>
                <CardDescription>Registos validados de assiduidade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Selecione o período para visualizar o histórico</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="escalas">
            <Card>
              <CardHeader>
                <CardTitle>Escalas de Trabalho</CardTitle>
                <CardDescription>Gerir horários e turnos de trabalho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
