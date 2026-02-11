import { useState, useEffect } from "react";
import { ArrowLeft, Search, Filter, Eye, Trash2, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface TramitacaoPrestacaoContasProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const TramitacaoPrestacaoContas = ({ onBack, onNavigate }: TramitacaoPrestacaoContasProps) => {
  const [processos, setProcessos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProcessos();
  }, []);

  const loadProcessos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("processos_prestacao_contas")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar processos");
    }
    setProcessos(data || []);
    setLoading(false);
  };

  const handleView = (id: string) => {
    toast.info(`A visualizar processo ${id}`);
    onNavigate?.("detalhe-prestacao");
  };

  const handleChangeStatus = async (id: string, novaEtapa: string) => {
    const { error } = await supabase
      .from("processos_prestacao_contas")
      .update({ etapa_atual: novaEtapa })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao alterar etapa");
    } else {
      toast.success(`Etapa alterada para: ${novaEtapa}`);
      loadProcessos();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("processos_prestacao_contas")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao eliminar processo");
    } else {
      toast.success("Processo eliminado com sucesso!");
      loadProcessos();
    }
  };

  const getStatusColor = (diasRestantes: number) => {
    if (diasRestantes <= 10) return "bg-destructive text-white";
    if (diasRestantes <= 30) return "bg-accent text-white";
    return "bg-success text-white";
  };

  const filtered = processos.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.numero_processo?.toLowerCase().includes(q) ||
      p.entidade_nome?.toLowerCase().includes(q) ||
      p.juiz_relator?.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: processos.length,
    analise: processos.filter((p) => p.etapa_atual === "Análise de Contas").length,
    validacao: processos.filter((p) => p.etapa_atual?.includes("Validação")).length,
    decisao: processos.filter((p) => p.etapa_atual === "Decisão").length,
    critico: processos.filter((p) => (p.dias_restantes || 90) <= 10).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tramitação de Prestação de Contas</h1>
            <p className="text-muted-foreground">Acompanhamento das etapas de tramitação</p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Processos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Análise de Contas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.analise}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Validação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.validacao}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Decisão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.decisao}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prazo Crítico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.critico}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por número do processo, entidade ou juiz relator..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Processos em Tramitação</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhum processo de prestação de contas encontrado.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Processo</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Ano Gerência</TableHead>
                  <TableHead>Etapa Atual</TableHead>
                  <TableHead>Divisão</TableHead>
                  <TableHead>Juiz Relator</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Dias Restantes</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((processo) => (
                  <TableRow key={processo.id}>
                    <TableCell className="font-medium font-mono">{processo.numero_processo}</TableCell>
                    <TableCell>{processo.entidade_nome}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {processo.ano_gerencia || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                        {processo.etapa_atual}
                      </Badge>
                    </TableCell>
                    <TableCell>{processo.divisao || "-"}</TableCell>
                    <TableCell>{processo.juiz_relator || "Não atribuído"}</TableCell>
                    <TableCell>{processo.prazo_dias} dias</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(processo.dias_restantes || 90)}>
                        {processo.dias_restantes || 90} dias
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleView(processo.numero_processo)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" title="Alterar etapa">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card">
                            <DropdownMenuLabel>Alterar Etapa</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Análise de Contas")}>
                              Análise de Contas
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Validação Chefe Divisão")}>
                              Validação Chefe Divisão
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Controle de Qualidade")}>
                              Controle de Qualidade
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Decisão")}>
                              Decisão
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              title="Eliminar"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja eliminar o processo {processo.numero_processo}? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(processo.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
