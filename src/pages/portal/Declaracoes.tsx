import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Download, Plus, CheckCircle, Clock, FileCheck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Declaracoes() {
  const [funcionario, setFuncionario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dialogSolicitar, setDialogSolicitar] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [observacoes, setObservacoes] = useState("");

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
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar declarações');
    } finally {
      setLoading(false);
    }
  };

  const solicitarDeclaracao = () => {
    if (!tipoSelecionado) {
      toast.error('Selecione o tipo de declaração');
      return;
    }

    toast.success('Solicitação enviada para aprovação');
    setDialogSolicitar(false);
    setTipoSelecionado("");
    setObservacoes("");
  };

  const tiposDeclaracao = [
    {
      id: 'servico',
      titulo: 'Declaração de Serviço',
      descricao: 'Atesta vínculo funcional com o Tribunal de Contas',
      tempoProcessamento: 'Imediato',
      requerAprovacao: false
    },
    {
      id: 'tempo_casa',
      titulo: 'Declaração de Tempo de Casa',
      descricao: 'Certifica o período de serviço na instituição',
      tempoProcessamento: '1 dia útil',
      requerAprovacao: true
    },
    {
      id: 'vencimento',
      titulo: 'Declaração de Vencimento',
      descricao: 'Comprova remuneração mensal ou anual',
      tempoProcessamento: '2 dias úteis',
      requerAprovacao: true
    },
    {
      id: 'ficha_funcional',
      titulo: 'Ficha Funcional Completa',
      descricao: 'Documento com histórico profissional completo',
      tempoProcessamento: '3 dias úteis',
      requerAprovacao: true
    },
    {
      id: 'irs',
      titulo: 'Declaração IRS',
      descricao: 'Para fins de declaração de imposto de renda',
      tempoProcessamento: '1 dia útil',
      requerAprovacao: true
    }
  ];

  // Mock data do histórico
  const historico = [
    {
      id: 1,
      tipo: 'Declaração de Serviço',
      datasolicitacao: '2025-01-15',
      status: 'aprovado',
      dataEmissao: '2025-01-15'
    },
    {
      id: 2,
      tipo: 'Declaração de Tempo de Casa',
      datasolicitacao: '2024-12-10',
      status: 'aprovado',
      dataEmissao: '2024-12-11'
    },
    {
      id: 3,
      tipo: 'Declaração de Vencimento',
      datasolicitacao: '2024-11-20',
      status: 'pendente',
      dataEmissao: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'default';
      case 'pendente': return 'secondary';
      case 'rejeitado': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pendente':
        return <Clock className="h-4 w-4 text-orange-500" />;
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
    <div className="bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Tipos de Declarações Disponíveis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Declarações Disponíveis</CardTitle>
            <CardDescription>Selecione o tipo de declaração que deseja solicitar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tiposDeclaracao.map((tipo) => (
                <Card key={tipo.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileCheck className="h-5 w-5 text-primary" strokeWidth={2.5} />
                          <h3 className="font-semibold">{tipo.titulo}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {tipo.descricao}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>⏱ {tipo.tempoProcessamento}</span>
                          {tipo.requerAprovacao && (
                            <Badge variant="outline" className="text-xs">
                              Requer aprovação
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Dialog open={dialogSolicitar && tipoSelecionado === tipo.id} onOpenChange={(open) => {
                      setDialogSolicitar(open);
                      if (open) setTipoSelecionado(tipo.id);
                    }}>
                      <DialogTrigger asChild>
                        <Button className="w-full gap-2">
                          <Plus className="h-4 w-4" />
                          Solicitar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Solicitar {tipo.titulo}</DialogTitle>
                          <DialogDescription>
                            {tipo.descricao}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
                            <p><strong>Tempo de processamento:</strong> {tipo.tempoProcessamento}</p>
                            {tipo.requerAprovacao && (
                              <p><strong>Status:</strong> Aguardará aprovação do RH</p>
                            )}
                          </div>
                          <div>
                            <Label>Observações (opcional)</Label>
                            <Textarea
                              value={observacoes}
                              onChange={(e) => setObservacoes(e.target.value)}
                              placeholder="Adicione informações adicionais se necessário..."
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDialogSolicitar(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={solicitarDeclaracao}>
                            Confirmar Solicitação
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Solicitações */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Solicitações</CardTitle>
            <CardDescription>Declarações solicitadas e emitidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de Declaração</TableHead>
                    <TableHead>Data Solicitação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Emissão</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historico.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Nenhuma solicitação encontrada</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    historico.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.tipo}</TableCell>
                        <TableCell>
                          {format(new Date(item.datasolicitacao), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <Badge variant={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.dataEmissao 
                            ? format(new Date(item.dataEmissao), 'dd/MM/yyyy')
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {item.status === 'aprovado' && (
                            <Button variant="outline" size="sm" className="gap-2">
                              <Download className="h-4 w-4" />
                              Baixar PDF
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
