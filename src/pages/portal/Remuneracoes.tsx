import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, DollarSign, Download, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RemuneracoesProps {
  onBack: () => void;
}

export default function Remuneracoes({ onBack }: RemuneracoesProps) {
  const [funcionario, setFuncionario] = useState<any>(null);
  const [remuneracoes, setRemuneracoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear().toString());
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, [anoSelecionado]);

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
          const { data: remData } = await supabase
            .from('remuneracoes')
            .select('*')
            .eq('funcionario_id', funcData.id)
            .eq('ano', parseInt(anoSelecionado))
            .order('mes', { ascending: false });
          
          setRemuneracoes(remData || []);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar remunerações');
    } finally {
      setLoading(false);
    }
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor);
  };

  const getMesNome = (mes: number) => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[mes - 1];
  };

  const gerarAnos = () => {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    for (let i = anoAtual; i >= anoAtual - 5; i--) {
      anos.push(i.toString());
    }
    return anos;
  };

  const remuneracaoSelecionada = mesSelecionado 
    ? remuneracoes.find(r => r.mes === parseInt(mesSelecionado))
    : null;

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
              <h1 className="text-2xl font-bold">Remunerações</h1>
              <p className="text-sm text-muted-foreground">Consulta de recibos de vencimento</p>
            </div>
            <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gerarAnos().map((ano) => (
                  <SelectItem key={ano} value={ano}>{ano}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Lista de Meses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Períodos Disponíveis</CardTitle>
              <CardDescription>Selecione um mês para ver detalhes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {remuneracoes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Nenhuma remuneração registada em {anoSelecionado}
                    </p>
                  </div>
                ) : (
                  remuneracoes.map((rem) => (
                    <Button
                      key={rem.id}
                      variant={mesSelecionado === rem.mes.toString() ? "default" : "outline"}
                      className="w-full justify-between"
                      onClick={() => setMesSelecionado(rem.mes.toString())}
                    >
                      <span>{getMesNome(rem.mes)} {rem.ano}</span>
                      <Badge variant={rem.processado ? "default" : "secondary"}>
                        {rem.processado ? "Processado" : "Pendente"}
                      </Badge>
                    </Button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Remuneração */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Detalhes do Recibo</CardTitle>
                  <CardDescription>
                    {remuneracaoSelecionada 
                      ? `${getMesNome(remuneracaoSelecionada.mes)} ${remuneracaoSelecionada.ano}`
                      : 'Selecione um período'}
                  </CardDescription>
                </div>
                {remuneracaoSelecionada && (
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Baixar PDF
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!remuneracaoSelecionada ? (
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Selecione um período na lista ao lado
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Vencimentos */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <h3 className="font-semibold">Vencimentos</h3>
                    </div>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Vencimento Base</TableCell>
                          <TableCell className="text-right">
                            {formatarValor(parseFloat(remuneracaoSelecionada.vencimento_base))}
                          </TableCell>
                        </TableRow>
                        {parseFloat(remuneracaoSelecionada.subsidio_alimentacao) > 0 && (
                          <TableRow>
                            <TableCell className="font-medium">Subsídio de Alimentação</TableCell>
                            <TableCell className="text-right">
                              {formatarValor(parseFloat(remuneracaoSelecionada.subsidio_alimentacao))}
                            </TableCell>
                          </TableRow>
                        )}
                        {parseFloat(remuneracaoSelecionada.subsidio_transporte) > 0 && (
                          <TableRow>
                            <TableCell className="font-medium">Subsídio de Transporte</TableCell>
                            <TableCell className="text-right">
                              {formatarValor(parseFloat(remuneracaoSelecionada.subsidio_transporte))}
                            </TableCell>
                          </TableRow>
                        )}
                        {parseFloat(remuneracaoSelecionada.subsidio_ferias) > 0 && (
                          <TableRow>
                            <TableCell className="font-medium">Subsídio de Férias</TableCell>
                            <TableCell className="text-right">
                              {formatarValor(parseFloat(remuneracaoSelecionada.subsidio_ferias))}
                            </TableCell>
                          </TableRow>
                        )}
                        {parseFloat(remuneracaoSelecionada.subsidio_natal) > 0 && (
                          <TableRow>
                            <TableCell className="font-medium">Subsídio de Natal</TableCell>
                            <TableCell className="text-right">
                              {formatarValor(parseFloat(remuneracaoSelecionada.subsidio_natal))}
                            </TableCell>
                          </TableRow>
                        )}
                        {parseFloat(remuneracaoSelecionada.outros_subsidios) > 0 && (
                          <TableRow>
                            <TableCell className="font-medium">Outros Subsídios</TableCell>
                            <TableCell className="text-right">
                              {formatarValor(parseFloat(remuneracaoSelecionada.outros_subsidios))}
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow className="bg-green-500/10">
                          <TableCell className="font-bold">Total Vencimentos</TableCell>
                          <TableCell className="text-right font-bold text-green-600">
                            {formatarValor(parseFloat(remuneracaoSelecionada.total_vencimentos))}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Descontos */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">Descontos</h3>
                    </div>
                    <Table>
                      <TableBody>
                        {parseFloat(remuneracaoSelecionada.desconto_irt) > 0 && (
                          <TableRow>
                            <TableCell className="font-medium">IRT</TableCell>
                            <TableCell className="text-right">
                              {formatarValor(parseFloat(remuneracaoSelecionada.desconto_irt))}
                            </TableCell>
                          </TableRow>
                        )}
                        {parseFloat(remuneracaoSelecionada.desconto_inss) > 0 && (
                          <TableRow>
                            <TableCell className="font-medium">INSS</TableCell>
                            <TableCell className="text-right">
                              {formatarValor(parseFloat(remuneracaoSelecionada.desconto_inss))}
                            </TableCell>
                          </TableRow>
                        )}
                        {parseFloat(remuneracaoSelecionada.outros_descontos) > 0 && (
                          <TableRow>
                            <TableCell className="font-medium">Outros Descontos</TableCell>
                            <TableCell className="text-right">
                              {formatarValor(parseFloat(remuneracaoSelecionada.outros_descontos))}
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow className="bg-red-500/10">
                          <TableCell className="font-bold">Total Descontos</TableCell>
                          <TableCell className="text-right font-bold text-red-600">
                            {formatarValor(parseFloat(remuneracaoSelecionada.total_descontos))}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Líquido */}
                  <Card className="bg-primary/10 border-primary">
                    <CardContent className="py-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Valor Líquido a Receber</p>
                          <p className="text-3xl font-bold text-primary">
                            {formatarValor(parseFloat(remuneracaoSelecionada.liquido))}
                          </p>
                        </div>
                        <DollarSign className="h-12 w-12 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Observações */}
                  {remuneracaoSelecionada.observacoes && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Observações:</p>
                      <p className="text-sm text-muted-foreground">
                        {remuneracaoSelecionada.observacoes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}