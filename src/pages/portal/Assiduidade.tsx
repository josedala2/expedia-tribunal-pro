import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Clock, Calendar as CalendarIcon, CheckCircle, AlertCircle, FileEdit } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AssiduidadeProps {
  onBack: () => void;
}

export default function Assiduidade({ onBack }: AssiduidadeProps) {
  const [funcionario, setFuncionario] = useState<any>(null);
  const [registosPonto, setRegistosPonto] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [dialogCorrecao, setDialogCorrecao] = useState(false);
  const [registoSelecionado, setRegistoSelecionado] = useState<any>(null);
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    carregarDados();
  }, [mesAtual]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: funcData } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setFuncionario(funcData);

        if (funcData) {
          const inicio = startOfMonth(mesAtual);
          const fim = endOfMonth(mesAtual);

          const { data: pontosData } = await supabase
            .from('registos_ponto')
            .select('*')
            .eq('funcionario_id', funcData.id)
            .gte('data', format(inicio, 'yyyy-MM-dd'))
            .lte('data', format(fim, 'yyyy-MM-dd'))
            .order('data', { ascending: false });
          
          setRegistosPonto(pontosData || []);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar assiduidade');
    } finally {
      setLoading(false);
    }
  };

  const registarPonto = async () => {
    if (!funcionario) return;

    try {
      const hoje = format(new Date(), 'yyyy-MM-dd');
      const agora = new Date().toISOString();

      const { data: registoExistente } = await supabase
        .from('registos_ponto')
        .select('*')
        .eq('funcionario_id', funcionario.id)
        .eq('data', hoje)
        .single();

      if (!registoExistente) {
        // Primeiro registo do dia - entrada manhã
        const { error } = await supabase
          .from('registos_ponto')
          .insert({
            funcionario_id: funcionario.id,
            data: hoje,
            entrada_manha: agora,
            tipo: 'normal'
          });

        if (error) throw error;
        toast.success('Entrada da manhã registada!');
      } else if (!registoExistente.saida_manha) {
        // Saída manhã
        const { error } = await supabase
          .from('registos_ponto')
          .update({ saida_manha: agora })
          .eq('id', registoExistente.id);

        if (error) throw error;
        toast.success('Saída da manhã registada!');
      } else if (!registoExistente.entrada_tarde) {
        // Entrada tarde
        const { error } = await supabase
          .from('registos_ponto')
          .update({ entrada_tarde: agora })
          .eq('id', registoExistente.id);

        if (error) throw error;
        toast.success('Entrada da tarde registada!');
      } else if (!registoExistente.saida_tarde) {
        // Saída tarde
        const { error } = await supabase
          .from('registos_ponto')
          .update({ saida_tarde: agora })
          .eq('id', registoExistente.id);

        if (error) throw error;
        toast.success('Saída da tarde registada!');
      } else {
        toast.info('Todos os registos do dia já foram feitos');
        return;
      }

      carregarDados();
    } catch (error) {
      console.error('Erro ao registar ponto:', error);
      toast.error('Erro ao registar ponto');
    }
  };

  const solicitarCorrecao = async () => {
    if (!registoSelecionado || !observacoes.trim()) {
      toast.error('Preencha as observações');
      return;
    }

    try {
      const { error } = await supabase
        .from('registos_ponto')
        .update({
          observacoes: observacoes,
          validado: false
        })
        .eq('id', registoSelecionado.id);

      if (error) throw error;

      toast.success('Pedido de correção enviado');
      setDialogCorrecao(false);
      setObservacoes("");
      carregarDados();
    } catch (error) {
      console.error('Erro ao solicitar correção:', error);
      toast.error('Erro ao solicitar correção');
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'normal': return 'default';
      case 'ferias': return 'secondary';
      case 'licenca': return 'outline';
      case 'falta': return 'destructive';
      default: return 'default';
    }
  };

  const formatarHora = (timestamp: string | null) => {
    if (!timestamp) return '-';
    return format(new Date(timestamp), 'HH:mm');
  };

  const calcularHorasTrabalhadas = (registo: any) => {
    if (!registo.entrada_manha || !registo.saida_tarde) return '-';
    
    const entrada = new Date(registo.entrada_manha);
    const saida = new Date(registo.saida_tarde);
    const diff = saida.getTime() - entrada.getTime();
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${horas}h ${minutos}m`;
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
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Assiduidade e Ponto</h1>
              <p className="text-sm text-muted-foreground">Controle de presença e horas trabalhadas</p>
            </div>
            <Button onClick={registarPonto} className="gap-2">
              <Clock className="h-4 w-4" />
              Registar Ponto
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Resumo do Mês */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Dias Trabalhados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {registosPonto.filter(r => r.tipo === 'normal').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Faltas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {registosPonto.filter(r => r.tipo === 'falta').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Férias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {registosPonto.filter(r => r.tipo === 'ferias').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pendentes Validação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {registosPonto.filter(r => !r.validado).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seletor de Mês */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Espelho de Ponto</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1))}
                >
                  Anterior
                </Button>
                <span className="text-sm font-medium px-4">
                  {format(mesAtual, 'MMMM yyyy', { locale: ptBR })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1))}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Entrada Manhã</TableHead>
                    <TableHead>Saída Manhã</TableHead>
                    <TableHead>Entrada Tarde</TableHead>
                    <TableHead>Saída Tarde</TableHead>
                    <TableHead>Total Horas</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registosPonto.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Nenhum registo de ponto neste mês</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    registosPonto.map((registo) => (
                      <TableRow key={registo.id}>
                        <TableCell className="font-medium">
                          {format(new Date(registo.data), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>{formatarHora(registo.entrada_manha)}</TableCell>
                        <TableCell>{formatarHora(registo.saida_manha)}</TableCell>
                        <TableCell>{formatarHora(registo.entrada_tarde)}</TableCell>
                        <TableCell>{formatarHora(registo.saida_tarde)}</TableCell>
                        <TableCell>{calcularHorasTrabalhadas(registo)}</TableCell>
                        <TableCell>
                          <Badge variant={getTipoColor(registo.tipo)}>
                            {registo.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {registo.validado ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Validado
                            </Badge>
                          ) : (
                            <Badge variant="outline">Pendente</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Dialog open={dialogCorrecao && registoSelecionado?.id === registo.id} onOpenChange={(open) => {
                            setDialogCorrecao(open);
                            if (open) setRegistoSelecionado(registo);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <FileEdit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Solicitar Correção</DialogTitle>
                                <DialogDescription>
                                  Informe o motivo da correção para o registo de {format(new Date(registo.data), 'dd/MM/yyyy')}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Observações</Label>
                                  <Textarea
                                    value={observacoes}
                                    onChange={(e) => setObservacoes(e.target.value)}
                                    placeholder="Descreva a correção necessária..."
                                    rows={4}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogCorrecao(false)}>
                                  Cancelar
                                </Button>
                                <Button onClick={solicitarCorrecao}>
                                  Enviar Pedido
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}