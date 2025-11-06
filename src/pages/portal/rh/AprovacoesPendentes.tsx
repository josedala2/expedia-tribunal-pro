import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock, AlertCircle, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GestaoRHProps {
  onBack: () => void;
}

export default function GestaoRH({ onBack }: GestaoRHProps) {
  const [feriasPendentes, setFeriasPendentes] = useState<any[]>([]);
  const [pontosPendentes, setPontosPendentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogRejeitar, setDialogRejeitar] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<any>(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar férias aprovadas pela chefia, aguardando aprovação RH
      const { data: feriasData } = await supabase
        .from('ferias')
        .select(`
          *,
          funcionarios:funcionario_id (
            nome_completo,
            numero_funcionario,
            unidade_organica,
            departamento,
            categoria
          )
        `)
        .eq('status', 'aprovado_chefia')
        .order('aprovado_chefia_em', { ascending: false });
      
      setFeriasPendentes(feriasData || []);

      // Carregar pontos pendentes validação
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

  const aprovarFeriasRH = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Atualizar status para aprovado_rh
      const { error } = await supabase
        .from('ferias')
        .update({
          aprovado_rh_por: user?.id,
          aprovado_rh_em: new Date().toISOString(),
          status: 'aprovado_rh'
        })
        .eq('id', id);

      if (error) throw error;

      // Atualizar saldo ao aprovar pelo RH
      const ferias = feriasPendentes.find(f => f.id === id);
      if (ferias) {
        const { data: saldo } = await supabase
          .from('saldo_ferias')
          .select('*')
          .eq('funcionario_id', ferias.funcionario_id)
          .eq('ano', ferias.ano)
          .single();

        if (saldo) {
          await supabase
            .from('saldo_ferias')
            .update({
              dias_gozados: saldo.dias_gozados + ferias.dias_solicitados,
              dias_pendentes: saldo.dias_pendentes - ferias.dias_solicitados
            })
            .eq('id', saldo.id);
        }
      }

      toast.success('Férias aprovadas pelo RH. Funcionário será notificado.');
      carregarDados();
    } catch (error) {
      console.error('Erro ao aprovar férias:', error);
      toast.error('Erro ao aprovar férias');
    }
  };

  const rejeitarFerias = async () => {
    if (!itemSelecionado || !motivoRejeicao.trim()) {
      toast.error('Informe o motivo da rejeição');
      return;
    }

    try {
      const { error } = await supabase
        .from('ferias')
        .update({
          status: 'rejeitado',
          motivo_rejeicao: motivoRejeicao
        })
        .eq('id', itemSelecionado.id);

      if (error) throw error;

      // Devolver dias ao saldo
      const { data: saldo } = await supabase
        .from('saldo_ferias')
        .select('*')
        .eq('funcionario_id', itemSelecionado.funcionario_id)
        .eq('ano', itemSelecionado.ano)
        .single();

      if (saldo) {
        await supabase
          .from('saldo_ferias')
          .update({
            dias_pendentes: saldo.dias_pendentes - itemSelecionado.dias_solicitados
          })
          .eq('id', saldo.id);
      }

      toast.success('Férias rejeitadas');
      setDialogRejeitar(false);
      setMotivoRejeicao("");
      carregarDados();
    } catch (error) {
      console.error('Erro ao rejeitar férias:', error);
      toast.error('Erro ao rejeitar férias');
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Aprovação Final - RH</h1>
              <p className="text-sm text-muted-foreground">Aprovar férias já validadas pela chefia</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="ferias" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="ferias" className="gap-2">
              <Calendar className="h-4 w-4" />
              Férias Pendentes ({feriasPendentes.length})
            </TabsTrigger>
            <TabsTrigger value="ponto" className="gap-2">
              <Clock className="h-4 w-4" />
              Pontos Pendentes ({pontosPendentes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ferias">
            <Card>
              <CardHeader>
                <CardTitle>Férias Aprovadas pela Chefia</CardTitle>
                <CardDescription>Aprovar finalmente ou rejeitar pedidos já validados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Funcionário</TableHead>
                        <TableHead>Unidade/Categoria</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Dias</TableHead>
                        <TableHead>Aprovado Chefia</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feriasPendentes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">Nenhuma solicitação pendente</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        feriasPendentes.map((ferias) => (
                          <TableRow key={ferias.id}>
                            <TableCell className="font-medium">
                              <div>
                                <p>{ferias.funcionarios?.nome_completo}</p>
                                <p className="text-xs text-muted-foreground">
                                  {ferias.funcionarios?.numero_funcionario}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="font-medium">{ferias.funcionarios?.unidade_organica}</p>
                                <p className="text-xs text-muted-foreground">{ferias.funcionarios?.categoria}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(ferias.data_inicio), 'dd/MM')} - {format(new Date(ferias.data_fim), 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{ferias.dias_solicitados} dias</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <Badge variant="outline" className="gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  Aprovado
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {format(new Date(ferias.aprovado_chefia_em), 'dd/MM/yyyy HH:mm')}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => aprovarFeriasRH(ferias.id)}
                                  className="gap-1"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Aprovar RH
                                </Button>
                                <Dialog open={dialogRejeitar && itemSelecionado?.id === ferias.id} onOpenChange={(open) => {
                                  setDialogRejeitar(open);
                                  if (open) setItemSelecionado(ferias);
                                }}>
                                  <DialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="gap-1">
                                      <XCircle className="h-4 w-4" />
                                      Rejeitar
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Rejeitar Férias</DialogTitle>
                                      <DialogDescription>
                                        Informe o motivo da rejeição
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div>
                                      <Label>Motivo</Label>
                                      <Textarea
                                        value={motivoRejeicao}
                                        onChange={(e) => setMotivoRejeicao(e.target.value)}
                                        placeholder="Descreva o motivo da rejeição..."
                                        rows={4}
                                      />
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setDialogRejeitar(false)}>
                                        Cancelar
                                      </Button>
                                      <Button variant="destructive" onClick={rejeitarFerias}>
                                        Confirmar Rejeição
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
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

          <TabsContent value="ponto">
            <Card>
              <CardHeader>
                <CardTitle>Registos de Ponto</CardTitle>
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
                                <div className="max-w-xs">
                                  <Badge variant="outline" className="gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    Com observação
                                  </Badge>
                                  <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {ponto.observacoes}
                                  </p>
                                </div>
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
        </Tabs>
      </main>
    </div>
  );
}
