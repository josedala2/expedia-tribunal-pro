import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Calendar as CalendarIcon, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FeriasProps {
  onBack: () => void;
}

export default function Ferias({ onBack }: FeriasProps) {
  const [funcionario, setFuncionario] = useState<any>(null);
  const [saldoFerias, setSaldoFerias] = useState<any>(null);
  const [ferias, setFerias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogNovo, setDialogNovo] = useState(false);
  
  // Form
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [tipoFerias, setTipoFerias] = useState("anuais");

  useEffect(() => {
    carregarDados();
  }, []);

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
          const anoAtual = new Date().getFullYear();

          // Carregar saldo
          const { data: saldoData } = await supabase
            .from('saldo_ferias')
            .select('*')
            .eq('funcionario_id', funcData.id)
            .eq('ano', anoAtual)
            .single();
          
          setSaldoFerias(saldoData);

          // Carregar histórico de férias
          const { data: feriasData } = await supabase
            .from('ferias')
            .select('*')
            .eq('funcionario_id', funcData.id)
            .order('solicitado_em', { ascending: false });
          
          setFerias(feriasData || []);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar férias');
    } finally {
      setLoading(false);
    }
  };

  const calcularDias = () => {
    if (!dataInicio || !dataFim) return 0;
    return differenceInDays(new Date(dataFim), new Date(dataInicio)) + 1;
  };

  const solicitarFerias = async () => {
    if (!funcionario || !dataInicio || !dataFim) {
      toast.error('Preencha todos os campos');
      return;
    }

    const dias = calcularDias();
    
    if (dias <= 0) {
      toast.error('Data fim deve ser posterior à data início');
      return;
    }

    if (saldoFerias && dias > saldoFerias.dias_disponiveis) {
      toast.error(`Saldo insuficiente. Disponível: ${saldoFerias.dias_disponiveis} dias`);
      return;
    }

    try {
      const { error } = await supabase
        .from('ferias')
        .insert({
          funcionario_id: funcionario.id,
          ano: new Date().getFullYear(),
          data_inicio: dataInicio,
          data_fim: dataFim,
          dias_solicitados: dias,
          tipo: tipoFerias,
          status: 'pendente'
        });

      if (error) throw error;

      // Atualizar saldo
      if (saldoFerias) {
        await supabase
          .from('saldo_ferias')
          .update({ 
            dias_pendentes: saldoFerias.dias_pendentes + dias 
          })
          .eq('id', saldoFerias.id);
      }

      toast.success('Férias solicitadas com sucesso');
      setDialogNovo(false);
      setDataInicio("");
      setDataFim("");
      setTipoFerias("anuais");
      carregarDados();
    } catch (error) {
      console.error('Erro ao solicitar férias:', error);
      toast.error('Erro ao solicitar férias');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado_rh': return 'default';
      case 'aprovado_chefia': return 'secondary';
      case 'pendente': return 'outline';
      case 'rejeitado': return 'destructive';
      case 'cancelado': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado_rh':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'aprovado_chefia':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'pendente':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'rejeitado':
      case 'cancelado':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
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
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Gestão de Férias</h1>
              <p className="text-sm text-muted-foreground">Solicitação e consulta de férias</p>
            </div>
            <Dialog open={dialogNovo} onOpenChange={setDialogNovo}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Solicitar Férias/Licenças
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Solicitação de Férias</DialogTitle>
                  <DialogDescription>
                    Preencha as datas desejadas para as férias
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Data Início</Label>
                    <Input
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Data Fim</Label>
                    <Input
                      type="date"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Tipo de Férias</Label>
                    <Select value={tipoFerias} onValueChange={setTipoFerias}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anuais">Férias Anuais</SelectItem>
                        <SelectItem value="especiais">Férias Especiais</SelectItem>
                        <SelectItem value="licenca">Licença</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {dataInicio && dataFim && (
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm">
                        <span className="font-semibold">Total de dias:</span> {calcularDias()}
                      </p>
                      {saldoFerias && (
                        <p className="text-sm mt-1">
                          <span className="font-semibold">Saldo disponível:</span> {saldoFerias.dias_disponiveis} dias
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogNovo(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={solicitarFerias}>
                    Solicitar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Saldo de Férias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Dias de Direito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {saldoFerias?.dias_direito || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Dias Gozados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {saldoFerias?.dias_gozados || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Dias Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {saldoFerias?.dias_pendentes || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Dias Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {saldoFerias?.dias_disponiveis || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Férias */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Solicitações</CardTitle>
            <CardDescription>Todas as suas solicitações de férias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Dias</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Solicitado em</TableHead>
                    <TableHead>Aprovações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ferias.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Nenhuma solicitação de férias</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    ferias.map((feria) => (
                      <TableRow key={feria.id}>
                        <TableCell className="font-medium">
                          {format(new Date(feria.data_inicio), 'dd/MM/yyyy')} - {format(new Date(feria.data_fim), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>{feria.dias_solicitados} dias</TableCell>
                        <TableCell>
                          <Badge variant="outline">{feria.tipo}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(feria.status)}
                            <Badge variant={getStatusColor(feria.status)}>
                              {feria.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(feria.solicitado_em), 'dd/MM/yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {feria.aprovado_chefia_em && (
                              <div className="text-xs text-muted-foreground">
                                Chefia: {format(new Date(feria.aprovado_chefia_em), 'dd/MM/yyyy')}
                              </div>
                            )}
                            {feria.aprovado_rh_em && (
                              <div className="text-xs text-muted-foreground">
                                RH: {format(new Date(feria.aprovado_rh_em), 'dd/MM/yyyy')}
                              </div>
                            )}
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
      </main>
    </div>
  );
}