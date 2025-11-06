import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock, User } from "lucide-react";
import { format } from "date-fns";

interface AprovacaoFeriasChefiaProps {
  onBack: () => void;
}

export default function AprovacaoFeriasChefia({ onBack }: AprovacaoFeriasChefiaProps) {
  const [feriasPendentes, setFeriasPendentes] = useState<any[]>([]);
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Buscar funcionário logado para saber a divisão
      const { data: funcionarioLogado } = await supabase
        .from('funcionarios')
        .select('unidade_organica, departamento')
        .eq('user_id', user.id)
        .single();

      if (!funcionarioLogado) return;

      // Carregar férias pendentes da mesma divisão/departamento
      const { data: feriasData } = await supabase
        .from('ferias')
        .select(`
          *,
          funcionarios:funcionario_id (
            nome_completo,
            numero_funcionario,
            unidade_organica,
            departamento,
            categoria,
            funcao_atual
          )
        `)
        .eq('status', 'pendente')
        .order('solicitado_em', { ascending: false });
      
      // Filtrar apenas funcionários da mesma unidade ou departamento
      const feriasFiltered = feriasData?.filter(f => 
        f.funcionarios?.unidade_organica === funcionarioLogado.unidade_organica ||
        f.funcionarios?.departamento === funcionarioLogado.departamento
      ) || [];

      setFeriasPendentes(feriasFiltered);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  };

  const aprovarFerias = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('ferias')
        .update({
          aprovado_chefia_por: user?.id,
          aprovado_chefia_em: new Date().toISOString(),
          status: 'aprovado_chefia'
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Férias aprovadas pela chefia. Aguardando aprovação do RH.');
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

      toast.success('Férias rejeitadas pela chefia');
      setDialogRejeitar(false);
      setMotivoRejeicao("");
      setItemSelecionado(null);
      carregarDados();
    } catch (error) {
      console.error('Erro ao rejeitar férias:', error);
      toast.error('Erro ao rejeitar férias');
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
              <h1 className="text-2xl font-bold">Aprovação de Férias - Chefia</h1>
              <p className="text-sm text-muted-foreground">
                Aprovar ou rejeitar solicitações de férias da equipe
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Solicitações Pendentes
                </CardTitle>
                <CardDescription>
                  {feriasPendentes.length} solicitação(ões) aguardando sua aprovação
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {feriasPendentes.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Cargo/Função</TableHead>
                    <TableHead>Período Solicitado</TableHead>
                    <TableHead>Dias</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Solicitado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feriasPendentes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">
                          Nenhuma solicitação pendente
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Todas as solicitações foram processadas
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    feriasPendentes.map((ferias) => (
                      <TableRow key={ferias.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p>{ferias.funcionarios?.nome_completo}</p>
                              <p className="text-xs text-muted-foreground">
                                {ferias.funcionarios?.numero_funcionario}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{ferias.funcionarios?.funcao_atual}</p>
                            <p className="text-xs text-muted-foreground">
                              {ferias.funcionarios?.unidade_organica}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(ferias.data_inicio), 'dd/MM/yyyy')}
                            {' → '}
                            {format(new Date(ferias.data_fim), 'dd/MM/yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {ferias.dias_solicitados} dias
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {ferias.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(ferias.solicitado_em), 'dd/MM/yyyy')}
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(ferias.solicitado_em), 'HH:mm')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => aprovarFerias(ferias.id)}
                              className="gap-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Aprovar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setItemSelecionado(ferias);
                                setDialogRejeitar(true);
                              }}
                              className="gap-1"
                            >
                              <XCircle className="h-4 w-4" />
                              Rejeitar
                            </Button>
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

      <Dialog open={dialogRejeitar} onOpenChange={(open) => {
        setDialogRejeitar(open);
        if (!open) {
          setMotivoRejeicao("");
          setItemSelecionado(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Solicitação de Férias</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição para {itemSelecionado?.funcionarios?.nome_completo}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Motivo da Rejeição *</Label>
              <Textarea
                value={motivoRejeicao}
                onChange={(e) => setMotivoRejeicao(e.target.value)}
                placeholder="Descreva o motivo da rejeição de forma clara e objetiva..."
                rows={4}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Este motivo será enviado ao funcionário
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDialogRejeitar(false);
                setMotivoRejeicao("");
                setItemSelecionado(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={rejeitarFerias}>
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
