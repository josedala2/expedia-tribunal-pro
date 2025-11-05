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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, FileText, Plus, AlertTriangle, Calendar, RefreshCw, XCircle, FileUp } from "lucide-react";
import { format, differenceInDays, addMonths } from "date-fns";

interface GestaoContratosProps {
  onBack: () => void;
}

export default function GestaoContratos({ onBack }: GestaoContratosProps) {
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogContrato, setDialogContrato] = useState(false);
  const [tipoAcao, setTipoAcao] = useState<"novo" | "renovar" | "rescindir">("novo");
  const [contratoSelecionado, setContratoSelecionado] = useState<any>(null);

  const [formContrato, setFormContrato] = useState({
    funcionario_id: "",
    tipo_contrato: "",
    data_inicio: "",
    data_fim: "",
    duracao_meses: 12,
    observacoes: "",
  });

  useEffect(() => {
    carregarContratos();
  }, []);

  const carregarContratos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('tipo_vinculo', 'contrato')
        .order('nome_completo');

      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
      toast.error('Erro ao carregar contratos');
    } finally {
      setLoading(false);
    }
  };

  const contratosAExpirar = funcionarios.filter(f => {
    if (!f.data_admissao) return false;
    const dataAdmissao = new Date(f.data_admissao);
    const dataExpiracao = addMonths(dataAdmissao, 12);
    const diasRestantes = differenceInDays(dataExpiracao, new Date());
    return diasRestantes >= 0 && diasRestantes <= 30;
  });

  const renovarContrato = (funcionario: any) => {
    setContratoSelecionado(funcionario);
    setTipoAcao("renovar");
    setDialogContrato(true);
  };

  const rescindirContrato = (funcionario: any) => {
    setContratoSelecionado(funcionario);
    setTipoAcao("rescindir");
    setDialogContrato(true);
  };

  const salvarAcaoContrato = async () => {
    try {
      if (tipoAcao === "rescindir") {
        await supabase
          .from('funcionarios')
          .update({ situacao: 'inativo' })
          .eq('id', contratoSelecionado.id);
        
        toast.success('Contrato rescindido com sucesso');
      } else if (tipoAcao === "renovar") {
        toast.success('Contrato renovado com sucesso');
      }

      setDialogContrato(false);
      carregarContratos();
    } catch (error) {
      console.error('Erro ao processar contrato:', error);
      toast.error('Erro ao processar contrato');
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
                  <FileText className="h-6 w-6" />
                  Gestão de Contratos
                </h1>
                <p className="text-sm text-muted-foreground">Controlar vínculos formais entre instituição e colaboradores</p>
              </div>
            </div>
            <Button size="sm" className="gap-2" onClick={() => {
              setTipoAcao("novo");
              setDialogContrato(true);
            }}>
              <Plus className="h-4 w-4" />
              Registar Contrato
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Contratos</CardDescription>
              <CardTitle className="text-3xl">{funcionarios.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Contratos Ativos</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {funcionarios.filter(f => f.situacao === 'ativo').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-orange-500/20">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                A Expirar (30 dias)
              </CardDescription>
              <CardTitle className="text-3xl text-orange-600">{contratosAExpirar.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Alertas de Contratos a Expirar */}
        {contratosAExpirar.length > 0 && (
          <Card className="border-orange-500/20 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Contratos Próximos de Expirar
              </CardTitle>
              <CardDescription>Contratos que expiram nos próximos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {contratosAExpirar.map((func) => {
                  const dataAdmissao = new Date(func.data_admissao);
                  const dataExpiracao = addMonths(dataAdmissao, 12);
                  const diasRestantes = differenceInDays(dataExpiracao, new Date());
                  
                  return (
                    <div key={func.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <p className="font-medium">{func.nome_completo}</p>
                        <p className="text-sm text-muted-foreground">
                          Expira em {diasRestantes} dias - {format(dataExpiracao, 'dd/MM/yyyy')}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => renovarContrato(func)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Renovar
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabela de Contratos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Contratos</CardTitle>
            <CardDescription>Todos os contratos registados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Tipo de Vínculo</TableHead>
                    <TableHead>Data Admissão</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funcionarios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Nenhum contrato registado</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    funcionarios.map((func) => (
                      <TableRow key={func.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{func.nome_completo}</p>
                            <p className="text-xs text-muted-foreground">{func.numero_funcionario}</p>
                          </div>
                        </TableCell>
                        <TableCell>{func.tipo_vinculo || '-'}</TableCell>
                        <TableCell>
                          {func.data_admissao ? format(new Date(func.data_admissao), 'dd/MM/yyyy') : '-'}
                        </TableCell>
                        <TableCell>{func.categoria || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={func.situacao === 'ativo' ? 'default' : 'secondary'}>
                            {func.situacao}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" title="Ver Histórico">
                              Ver Detalhes
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => renovarContrato(func)}>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Renovar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => rescindirContrato(func)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Rescindir
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

        {/* Dialog de Ações de Contrato */}
        <Dialog open={dialogContrato} onOpenChange={setDialogContrato}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {tipoAcao === "novo" && "Registar Novo Contrato"}
                {tipoAcao === "renovar" && "Renovar Contrato"}
                {tipoAcao === "rescindir" && "Rescindir Contrato"}
              </DialogTitle>
              <DialogDescription>
                {tipoAcao === "novo" && "Preencha os dados do novo contrato"}
                {tipoAcao === "renovar" && `Renovar contrato de ${contratoSelecionado?.nome_completo}`}
                {tipoAcao === "rescindir" && `Confirmar rescisão do contrato de ${contratoSelecionado?.nome_completo}`}
              </DialogDescription>
            </DialogHeader>

            {tipoAcao === "renovar" && (
              <div className="space-y-4">
                <div>
                  <Label>Nova Data de Término</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Observações</Label>
                  <Textarea placeholder="Observações sobre a renovação..." rows={3} />
                </div>
                <div>
                  <Label>Anexar Documento (PDF)</Label>
                  <Input type="file" accept=".pdf" />
                </div>
              </div>
            )}

            {tipoAcao === "rescindir" && (
              <div className="space-y-4">
                <div>
                  <Label>Data de Rescisão</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Motivo da Rescisão *</Label>
                  <Textarea placeholder="Descreva o motivo da rescisão..." rows={4} />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogContrato(false)}>
                Cancelar
              </Button>
              <Button onClick={salvarAcaoContrato}>
                {tipoAcao === "renovar" && "Confirmar Renovação"}
                {tipoAcao === "rescindir" && "Confirmar Rescisão"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
