import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, XCircle, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function SolicitacaoDocumentos() {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [observacoes, setObservacoes] = useState("");

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

  const solicitarDocumento = () => {
    if (!tipoSelecionado) {
      toast.error("Selecione um tipo de documento");
      return;
    }

    toast.success("Solicitação enviada com sucesso!");
    setDialogAberto(false);
    setTipoSelecionado("");
    setObservacoes("");
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
          <CardTitle>Documentos Disponíveis</CardTitle>
          <CardDescription>Selecione o tipo de documento que deseja solicitar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiposDocumento.map((tipo) => (
              <Card key={tipo.id} className="hover:border-primary transition-colors">
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
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{tipo.prazo}</span>
                  </div>
                  <Dialog open={dialogAberto && tipoSelecionado === tipo.id} onOpenChange={(open) => {
                    if (!open) {
                      setDialogAberto(false);
                      setTipoSelecionado("");
                      setObservacoes("");
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => {
                          setTipoSelecionado(tipo.id);
                          setDialogAberto(true);
                        }}
                      >
                        Solicitar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{tipo.titulo}</DialogTitle>
                        <DialogDescription>{tipo.descricao}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Prazo de Processamento</p>
                          <p className="text-sm text-muted-foreground">{tipo.prazo}</p>
                        </div>
                        {tipo.requerAprovacao && (
                          <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                              Este documento requer aprovação do departamento de RH antes da emissão.
                            </p>
                          </div>
                        )}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Observações (opcional)</label>
                          <Textarea
                            placeholder="Adicione informações adicionais sobre a solicitação..."
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setDialogAberto(false);
                            setTipoSelecionado("");
                            setObservacoes("");
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={solicitarDocumento}>
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
