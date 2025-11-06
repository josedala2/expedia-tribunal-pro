import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Clock, CheckCircle, XCircle, Download, AlertCircle, FilePlus, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

export default function SolicitacaoDocumentos() {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [etapa, setEtapa] = useState(1); // 1: selecionar funcionário, 2: selecionar documento
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [buscaFuncionario, setBuscaFuncionario] = useState("");
  const [carregando, setCarregando] = useState(false);

  const tiposDocumento = [
    {
      id: "efeitos_legais",
      titulo: "Declaração (Efeitos Legais)",
      descricao: "Para fins legais e administrativos diversos",
      prazo: "2-3 dias úteis",
      requerAprovacao: true
    },
    {
      id: "abertura_conta",
      titulo: "Declaração (Abertura de Conta)",
      descricao: "Para abertura de conta bancária",
      prazo: "1-2 dias úteis",
      requerAprovacao: true
    },
    {
      id: "atualizacao_dados",
      titulo: "Declaração (Actualização de Dados)",
      descricao: "Para atualização de dados cadastrais",
      prazo: "1 dia útil",
      requerAprovacao: false
    },
    {
      id: "passaporte",
      titulo: "Declaração (Emissão/Renovação de Passaporte)",
      descricao: "Para emissão ou renovação de passaporte",
      prazo: "2-3 dias úteis",
      requerAprovacao: true
    },
    {
      id: "matricula",
      titulo: "Declaração (Matrícula)",
      descricao: "Para matrícula escolar ou académica",
      prazo: "1-2 dias úteis",
      requerAprovacao: false
    },
    {
      id: "visto",
      titulo: "Declaração (Obtenção de Visto)",
      descricao: "Para solicitação de visto internacional",
      prazo: "2-3 dias úteis",
      requerAprovacao: true
    },
    {
      id: "credito_bancario",
      titulo: "Declaração (Crédito Bancário)",
      descricao: "Para solicitação de crédito bancário",
      prazo: "2-3 dias úteis",
      requerAprovacao: true
    },
    {
      id: "atualizacao_conta",
      titulo: "Declaração (Actualização de Conta)",
      descricao: "Para atualização de dados bancários",
      prazo: "1-2 dias úteis",
      requerAprovacao: false
    },
    {
      id: "avalista",
      titulo: "Declaração (Avalista)",
      descricao: "Para servir como avalista em contratos",
      prazo: "3-5 dias úteis",
      requerAprovacao: true
    }
  ];

  const historico = [
    {
      id: "1",
      tipo: "Declaração (Abertura de Conta)",
      dataSolicitacao: "2024-01-15",
      status: "aprovado",
      dataProcessamento: "2024-01-17"
    },
    {
      id: "2",
      tipo: "Declaração (Crédito Bancário)",
      dataSolicitacao: "2024-01-10",
      status: "pendente",
      dataProcessamento: null
    },
    {
      id: "3",
      tipo: "Declaração (Matrícula)",
      dataSolicitacao: "2024-01-05",
      status: "aprovado",
      dataProcessamento: "2024-01-06"
    }
  ];

  useEffect(() => {
    if (dialogAberto) {
      carregarFuncionarios();
    }
  }, [dialogAberto]);

  const carregarFuncionarios = async () => {
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('id, numero_funcionario, nome_completo, departamento')
        .eq('situacao', 'ativo')
        .order('nome_completo');

      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      toast.error('Erro ao carregar lista de funcionários');
    } finally {
      setCarregando(false);
    }
  };

  const funcionariosFiltrados = funcionarios.filter(f => 
    f.nome_completo.toLowerCase().includes(buscaFuncionario.toLowerCase()) ||
    f.numero_funcionario.toLowerCase().includes(buscaFuncionario.toLowerCase())
  );

  const funcionarioSelecionadoObj = funcionarios.find(f => f.id === funcionarioSelecionado);

  const avancarParaDocumento = () => {
    if (!funcionarioSelecionado) {
      toast.error("Selecione um funcionário");
      return;
    }
    setEtapa(2);
  };

  const voltarParaFuncionario = () => {
    setEtapa(1);
    setTipoSelecionado("");
  };

  const solicitarDocumento = () => {
    if (!funcionarioSelecionado) {
      toast.error("Selecione um funcionário");
      return;
    }
    if (!tipoSelecionado) {
      toast.error("Selecione um tipo de documento");
      return;
    }

    toast.success("Solicitação enviada com sucesso!");
    fecharDialog();
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setEtapa(1);
    setFuncionarioSelecionado("");
    setTipoSelecionado("");
    setObservacoes("");
    setBuscaFuncionario("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado":
        return "default";
      case "pendente":
        return "secondary";
      case "rejeitado":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aprovado":
        return <CheckCircle className="h-4 w-4" />;
      case "pendente":
        return <Clock className="h-4 w-4" />;
      case "rejeitado":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Solicitação de Documentos</CardTitle>
              <CardDescription>Solicite declarações e documentos oficiais</CardDescription>
            </div>
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <FilePlus className="h-4 w-4" />
                  Solicitar Documento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {etapa === 1 ? "Selecionar Funcionário" : "Selecionar Tipo de Documento"}
                  </DialogTitle>
                  <DialogDescription>
                    {etapa === 1 
                      ? "Escolha o funcionário para o qual deseja solicitar o documento"
                      : "Escolha o tipo de documento que deseja solicitar"}
                  </DialogDescription>
                </DialogHeader>

                {etapa === 1 ? (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Buscar Funcionário</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Digite o nome ou número do funcionário..."
                          value={buscaFuncionario}
                          onChange={(e) => setBuscaFuncionario(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    {carregando ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {funcionariosFiltrados.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            Nenhum funcionário encontrado
                          </p>
                        ) : (
                          funcionariosFiltrados.map((func) => (
                            <Card
                              key={func.id}
                              className={`cursor-pointer transition-colors hover:border-primary ${
                                funcionarioSelecionado === func.id ? "border-primary bg-primary/5" : ""
                              }`}
                              onClick={() => setFuncionarioSelecionado(func.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{func.nome_completo}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Nº {func.numero_funcionario} • {func.departamento || "N/A"}
                                    </p>
                                  </div>
                                  {funcionarioSelecionado === func.id && (
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    {funcionarioSelecionadoObj && (
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground mb-1">Funcionário Selecionado</p>
                          <p className="font-medium">{funcionarioSelecionadoObj.nome_completo}</p>
                          <p className="text-sm text-muted-foreground">
                            Nº {funcionarioSelecionadoObj.numero_funcionario}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-2">
                      <Label>Tipo de Documento</Label>
                      <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de documento" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposDocumento.map((tipo) => (
                            <SelectItem key={tipo.id} value={tipo.id}>
                              {tipo.titulo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {tipoSelecionado && (
                      <>
                        {(() => {
                          const tipoDoc = tiposDocumento.find(t => t.id === tipoSelecionado);
                          return tipoDoc ? (
                            <>
                              <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm font-medium">{tipoDoc.descricao}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>Prazo: {tipoDoc.prazo}</span>
                                </div>
                                {tipoDoc.requerAprovacao && (
                                  <div className="flex items-start gap-2 pt-2">
                                    <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                    <p className="text-xs text-muted-foreground">
                                      Requer aprovação do departamento de RH
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label>Observações (opcional)</Label>
                                <Textarea
                                  placeholder="Adicione informações adicionais sobre a solicitação..."
                                  value={observacoes}
                                  onChange={(e) => setObservacoes(e.target.value)}
                                  rows={4}
                                />
                              </div>
                            </>
                          ) : null;
                        })()}
                      </>
                    )}
                  </div>
                )}

                <DialogFooter>
                  {etapa === 1 ? (
                    <>
                      <Button variant="outline" onClick={fecharDialog}>
                        Cancelar
                      </Button>
                      <Button onClick={avancarParaDocumento}>
                        Continuar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={voltarParaFuncionario}>
                        Voltar
                      </Button>
                      <Button onClick={solicitarDocumento}>
                        Confirmar Solicitação
                      </Button>
                    </>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiposDocumento.map((tipo) => (
              <Card key={tipo.id} className="border-muted">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-6 w-6 text-primary" />
                    {tipo.requerAprovacao && (
                      <Badge variant="outline" className="text-xs">
                        Requer aprovação
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base">{tipo.titulo}</CardTitle>
                  <CardDescription className="text-sm">{tipo.descricao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{tipo.prazo}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Solicitações</CardTitle>
          <CardDescription>Acompanhe o status das suas solicitações</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Documento</TableHead>
                <TableHead>Data de Solicitação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Processamento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historico.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.tipo}</TableCell>
                  <TableCell>
                    {format(new Date(item.dataSolicitacao), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.status)} className="gap-1">
                      {getStatusIcon(item.status)}
                      {item.status === "aprovado" ? "Aprovado" : item.status === "pendente" ? "Pendente" : "Rejeitado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.dataProcessamento
                      ? format(new Date(item.dataProcessamento), "dd/MM/yyyy", { locale: ptBR })
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.status === "aprovado" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success("Download iniciado")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
