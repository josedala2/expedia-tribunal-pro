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
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SolicitacoesDeclaracoesProps {
  onBack: () => void;
}

export default function SolicitacoesDeclaracoes({ onBack }: SolicitacoesDeclaracoesProps) {
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogDetalhes, setDialogDetalhes] = useState(false);
  const [dialogAprovar, setDialogAprovar] = useState(false);
  const [dialogRejeitar, setDialogRejeitar] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<any>(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState("");
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('solicitacoes_declaracoes')
        .select(`
          *,
          funcionarios:funcionario_id (
            nome_completo,
            numero_funcionario,
            departamento
          )
        `)
        .order('solicitado_em', { ascending: false });

      if (error) throw error;
      setSolicitacoes(data || []);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      toast.error('Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  };

  const getTipoDeclaracaoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      'efeitos_legais': 'Declaração (Efeitos Legais)',
      'abertura_conta': 'Declaração (Abertura de Conta)',
      'atualizacao_dados': 'Declaração (Actualização de Dados)',
      'passaporte': 'Declaração (Emissão/Renovação de Passaporte)',
      'matricula': 'Declaração (Matrícula)',
      'visto': 'Declaração (Obtenção de Visto)',
      'credito_bancario': 'Declaração (Crédito Bancário)',
      'atualizacao_conta': 'Declaração (Actualização de Conta)',
      'avalista': 'Declaração (Avalista)'
    };
    return tipos[tipo] || tipo;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'default';
      case 'pendente':
        return 'secondary';
      case 'rejeitado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="h-4 w-4" />;
      case 'pendente':
        return <Clock className="h-4 w-4" />;
      case 'rejeitado':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const aprovarSolicitacao = async () => {
    if (!solicitacaoSelecionada) return;

    setProcessando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('solicitacoes_declaracoes')
        .update({
          status: 'aprovado',
          aprovado_por: user?.id,
          aprovado_em: new Date().toISOString(),
          processado_em: new Date().toISOString()
        })
        .eq('id', solicitacaoSelecionada.id);

      if (error) throw error;

      toast.success('Solicitação aprovada com sucesso');
      setDialogAprovar(false);
      setSolicitacaoSelecionada(null);
      carregarSolicitacoes();
    } catch (error) {
      console.error('Erro ao aprovar solicitação:', error);
      toast.error('Erro ao aprovar solicitação');
    } finally {
      setProcessando(false);
    }
  };

  const rejeitarSolicitacao = async () => {
    if (!solicitacaoSelecionada || !motivoRejeicao.trim()) {
      toast.error('Informe o motivo da rejeição');
      return;
    }

    setProcessando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('solicitacoes_declaracoes')
        .update({
          status: 'rejeitado',
          aprovado_por: user?.id,
          aprovado_em: new Date().toISOString(),
          processado_em: new Date().toISOString(),
          motivo_rejeicao: motivoRejeicao
        })
        .eq('id', solicitacaoSelecionada.id);

      if (error) throw error;

      toast.success('Solicitação rejeitada');
      setDialogRejeitar(false);
      setSolicitacaoSelecionada(null);
      setMotivoRejeicao("");
      carregarSolicitacoes();
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
      toast.error('Erro ao rejeitar solicitação');
    } finally {
      setProcessando(false);
    }
  };

  const solicitacoesPendentes = solicitacoes.filter(s => s.status === 'pendente');

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
              <h1 className="text-2xl font-bold">Solicitações de Declarações</h1>
              <p className="text-sm text-muted-foreground">Gerir solicitações de declarações dos funcionários</p>
            </div>
            {solicitacoesPendentes.length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {solicitacoesPendentes.length} Pendente{solicitacoesPendentes.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Solicitações</CardTitle>
            <CardDescription>Todas as solicitações de declarações</CardDescription>
          </CardHeader>
          <CardContent>
            {solicitacoes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">Nenhuma solicitação encontrada</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Tipo de Declaração</TableHead>
                    <TableHead>Data Solicitação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {solicitacoes.map((solicitacao) => (
                    <TableRow key={solicitacao.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{solicitacao.funcionarios?.nome_completo}</p>
                          <p className="text-sm text-muted-foreground">
                            Nº {solicitacao.funcionarios?.numero_funcionario}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getTipoDeclaracaoLabel(solicitacao.tipo_declaracao)}</TableCell>
                      <TableCell>
                        {format(new Date(solicitacao.solicitado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(solicitacao.status)} className="gap-1">
                          {getStatusIcon(solicitacao.status)}
                          {solicitacao.status === 'pendente' ? 'Pendente' : 
                           solicitacao.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSolicitacaoSelecionada(solicitacao);
                              setDialogDetalhes(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                          {solicitacao.status === 'pendente' && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => {
                                  setSolicitacaoSelecionada(solicitacao);
                                  setDialogAprovar(true);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSolicitacaoSelecionada(solicitacao);
                                  setDialogRejeitar(true);
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Rejeitar
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Dialog Detalhes */}
      <Dialog open={dialogDetalhes} onOpenChange={setDialogDetalhes}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
          </DialogHeader>
          {solicitacaoSelecionada && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Funcionário</Label>
                <p className="font-medium">{solicitacaoSelecionada.funcionarios?.nome_completo}</p>
                <p className="text-sm text-muted-foreground">
                  Nº {solicitacaoSelecionada.funcionarios?.numero_funcionario} • {solicitacaoSelecionada.funcionarios?.departamento}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tipo de Declaração</Label>
                <p className="font-medium">{getTipoDeclaracaoLabel(solicitacaoSelecionada.tipo_declaracao)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data de Solicitação</Label>
                <p className="font-medium">
                  {format(new Date(solicitacaoSelecionada.solicitado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge variant={getStatusColor(solicitacaoSelecionada.status)} className="gap-1">
                    {getStatusIcon(solicitacaoSelecionada.status)}
                    {solicitacaoSelecionada.status === 'pendente' ? 'Pendente' : 
                     solicitacaoSelecionada.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
                  </Badge>
                </div>
              </div>
              {solicitacaoSelecionada.observacoes && (
                <div>
                  <Label className="text-muted-foreground">Observações</Label>
                  <p className="mt-1 whitespace-pre-wrap">{solicitacaoSelecionada.observacoes}</p>
                </div>
              )}
              {solicitacaoSelecionada.motivo_rejeicao && (
                <div>
                  <Label className="text-muted-foreground">Motivo da Rejeição</Label>
                  <p className="mt-1 text-destructive">{solicitacaoSelecionada.motivo_rejeicao}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogDetalhes(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Aprovar */}
      <Dialog open={dialogAprovar} onOpenChange={setDialogAprovar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Solicitação</DialogTitle>
            <DialogDescription>
              Confirma a aprovação desta solicitação de declaração?
            </DialogDescription>
          </DialogHeader>
          {solicitacaoSelecionada && (
            <div className="py-4">
              <p><strong>Funcionário:</strong> {solicitacaoSelecionada.funcionarios?.nome_completo}</p>
              <p><strong>Declaração:</strong> {getTipoDeclaracaoLabel(solicitacaoSelecionada.tipo_declaracao)}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAprovar(false)}>
              Cancelar
            </Button>
            <Button onClick={aprovarSolicitacao} disabled={processando}>
              {processando ? "Processando..." : "Confirmar Aprovação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Rejeitar */}
      <Dialog open={dialogRejeitar} onOpenChange={setDialogRejeitar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Solicitação</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição desta solicitação
            </DialogDescription>
          </DialogHeader>
          {solicitacaoSelecionada && (
            <div className="space-y-4">
              <div>
                <p><strong>Funcionário:</strong> {solicitacaoSelecionada.funcionarios?.nome_completo}</p>
                <p><strong>Declaração:</strong> {getTipoDeclaracaoLabel(solicitacaoSelecionada.tipo_declaracao)}</p>
              </div>
              <div className="space-y-2">
                <Label>Motivo da Rejeição*</Label>
                <Textarea
                  placeholder="Explique o motivo da rejeição..."
                  value={motivoRejeicao}
                  onChange={(e) => setMotivoRejeicao(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogRejeitar(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={rejeitarSolicitacao} disabled={processando}>
              {processando ? "Processando..." : "Confirmar Rejeição"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
