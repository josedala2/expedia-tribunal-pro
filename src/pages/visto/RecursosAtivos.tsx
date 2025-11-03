import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, FileText, Calendar, AlertTriangle, Clock, Filter } from "lucide-react";
import { useState } from "react";

type RecursoAtivo = {
  id: string;
  numeroRecurso: string;
  tipoRecurso: "ordinario" | "inconstitucionalidade";
  processoOriginal: string;
  recorrente: string;
  dataInterposicao: string;
  estado: string;
  prazoLimite: string;
  diasRestantes: number;
  decisaoOriginal: string;
  prioridade: "alta" | "media" | "baixa";
};

export default function RecursosAtivos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [filterPrioridade, setFilterPrioridade] = useState("todos");
  const [selectedRecurso, setSelectedRecurso] = useState<RecursoAtivo | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const recursosAtivos: RecursoAtivo[] = [
    {
      id: "1",
      numeroRecurso: "RO-2024-001",
      tipoRecurso: "ordinario",
      processoOriginal: "PV-2024-123",
      recorrente: "Ministério Público",
      dataInterposicao: "2024-10-15",
      estado: "plenario",
      prazoLimite: "2024-12-15",
      diasRestantes: 12,
      decisaoOriginal: "Recusa de Visto",
      prioridade: "alta",
    },
    {
      id: "2",
      numeroRecurso: "RO-2024-002",
      tipoRecurso: "ordinario",
      processoOriginal: "PV-2024-098",
      recorrente: "Entidade Pública",
      dataInterposicao: "2024-10-20",
      estado: "projeto",
      prazoLimite: "2024-12-20",
      diasRestantes: 17,
      decisaoOriginal: "Concessão de Visto",
      prioridade: "media",
    },
    {
      id: "3",
      numeroRecurso: "REI-2024-001",
      tipoRecurso: "inconstitucionalidade",
      processoOriginal: "PV-2024-045",
      recorrente: "Ministério Público",
      dataInterposicao: "2024-11-10",
      estado: "analise",
      prazoLimite: "2024-12-25",
      diasRestantes: 22,
      decisaoOriginal: "Recusa de Visto",
      prioridade: "alta",
    },
  ];

  const filteredRecursos = recursosAtivos.filter(recurso => {
    const matchesSearch =
      recurso.numeroRecurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.processoOriginal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.recorrente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = filterTipo === "todos" || recurso.tipoRecurso === filterTipo;
    const matchesPrioridade = filterPrioridade === "todos" || recurso.prioridade === filterPrioridade;
    
    return matchesSearch && matchesTipo && matchesPrioridade;
  });

  const recursosUrgentes = filteredRecursos.filter(r => r.diasRestantes <= 15);
  const recursosOrdinarios = filteredRecursos.filter(r => r.tipoRecurso === "ordinario");
  const recursosInconstitucionalidade = filteredRecursos.filter(r => r.tipoRecurso === "inconstitucionalidade");

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return <Badge className="bg-red-500">Alta Prioridade</Badge>;
      case "media":
        return <Badge variant="secondary">Média Prioridade</Badge>;
      case "baixa":
        return <Badge variant="outline">Baixa Prioridade</Badge>;
      default:
        return <Badge variant="outline">{prioridade}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    if (tipo === "ordinario") {
      return <Badge variant="default">Recurso Ordinário</Badge>;
    }
    return (
      <Badge className="bg-orange-500 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Inconstitucionalidade
      </Badge>
    );
  };

  const getDiasRestantesBadge = (dias: number) => {
    if (dias <= 5) {
      return <Badge className="bg-red-500">{dias} dias restantes</Badge>;
    } else if (dias <= 15) {
      return <Badge className="bg-yellow-500">{dias} dias restantes</Badge>;
    }
    return <Badge variant="outline">{dias} dias restantes</Badge>;
  };

  const handleViewDetails = (recurso: RecursoAtivo) => {
    setSelectedRecurso(recurso);
    setShowDetailDialog(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Recursos Ativos sobre Decisões de Processos de Visto</h1>
        <p className="text-muted-foreground">
          Visualização consolidada de todos os recursos em andamento
        </p>
      </div>

      {/* Resumo Estatístico */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Recursos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredRecursos.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-500" />
              Recursos Urgentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{recursosUrgentes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">≤ 15 dias para prazo limite</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recursos Ordinários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{recursosOrdinarios.length}</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Inconstitucionalidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{recursosInconstitucionalidade.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por número, processo ou recorrente..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Recurso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="ordinario">Recurso Ordinário</SelectItem>
                <SelectItem value="inconstitucionalidade">Inconstitucionalidade</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPrioridade} onValueChange={setFilterPrioridade}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Prioridades</SelectItem>
                <SelectItem value="alta">Alta Prioridade</SelectItem>
                <SelectItem value="media">Média Prioridade</SelectItem>
                <SelectItem value="baixa">Baixa Prioridade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabelas por Tipo */}
      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todos">Todos ({filteredRecursos.length})</TabsTrigger>
          <TabsTrigger value="urgentes">Urgentes ({recursosUrgentes.length})</TabsTrigger>
          <TabsTrigger value="ordinarios">Ordinários ({recursosOrdinarios.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Recursos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredRecursos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum recurso ativo encontrado</p>
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nº Recurso</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Processo Original</TableHead>
                        <TableHead>Recorrente</TableHead>
                        <TableHead>Decisão Original</TableHead>
                        <TableHead>Prazo</TableHead>
                        <TableHead>Prioridade</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecursos.map((recurso) => (
                        <TableRow key={recurso.id}>
                          <TableCell className="font-medium">{recurso.numeroRecurso}</TableCell>
                          <TableCell>{getTipoBadge(recurso.tipoRecurso)}</TableCell>
                          <TableCell>{recurso.processoOriginal}</TableCell>
                          <TableCell>{recurso.recorrente}</TableCell>
                          <TableCell>{recurso.decisaoOriginal}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {new Date(recurso.prazoLimite).toLocaleDateString("pt-PT")}
                              </div>
                              {getDiasRestantesBadge(recurso.diasRestantes)}
                            </div>
                          </TableCell>
                          <TableCell>{getPrioridadeBadge(recurso.prioridade)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDetails(recurso)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="urgentes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-500" />
                Recursos Urgentes (≤ 15 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recursosUrgentes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum recurso urgente no momento</p>
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nº Recurso</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Processo Original</TableHead>
                        <TableHead>Decisão Original</TableHead>
                        <TableHead>Prazo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recursosUrgentes.map((recurso) => (
                        <TableRow key={recurso.id} className="bg-red-50 dark:bg-red-950/20">
                          <TableCell className="font-medium">{recurso.numeroRecurso}</TableCell>
                          <TableCell>{getTipoBadge(recurso.tipoRecurso)}</TableCell>
                          <TableCell>{recurso.processoOriginal}</TableCell>
                          <TableCell>{recurso.decisaoOriginal}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <Calendar className="h-3 w-3" />
                                {new Date(recurso.prazoLimite).toLocaleDateString("pt-PT")}
                              </div>
                              {getDiasRestantesBadge(recurso.diasRestantes)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDetails(recurso)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ordinarios">
          <Card>
            <CardHeader>
              <CardTitle>Recursos Ordinários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              {recursosOrdinarios.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum recurso ordinário ativo</p>
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nº Recurso</TableHead>
                        <TableHead>Processo Original</TableHead>
                        <TableHead>Recorrente</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Prazo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recursosOrdinarios.map((recurso) => (
                        <TableRow key={recurso.id}>
                          <TableCell className="font-medium">{recurso.numeroRecurso}</TableCell>
                          <TableCell>{recurso.processoOriginal}</TableCell>
                          <TableCell>{recurso.recorrente}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{recurso.estado}</Badge>
                          </TableCell>
                          <TableCell>{getDiasRestantesBadge(recurso.diasRestantes)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDetails(recurso)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Detalhes */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Detalhes do Recurso Ativo
            </DialogTitle>
            <DialogDescription>
              {selectedRecurso?.numeroRecurso}
            </DialogDescription>
          </DialogHeader>
          {selectedRecurso && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Nº Recurso</Label>
                  <p className="font-medium">{selectedRecurso.numeroRecurso}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tipo de Recurso</Label>
                  <div className="mt-1">{getTipoBadge(selectedRecurso.tipoRecurso)}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Processo Original</Label>
                  <p className="font-medium">{selectedRecurso.processoOriginal}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Recorrente</Label>
                  <p className="font-medium">{selectedRecurso.recorrente}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Decisão Original</Label>
                  <p className="font-medium">{selectedRecurso.decisaoOriginal}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Estado Atual</Label>
                  <Badge variant="secondary" className="mt-1">{selectedRecurso.estado}</Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Data de Interposição</Label>
                  <p className="font-medium">
                    {new Date(selectedRecurso.dataInterposicao).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Prazo Limite</Label>
                  <div className="mt-1 space-y-1">
                    <p className="font-medium">
                      {new Date(selectedRecurso.prazoLimite).toLocaleDateString("pt-PT")}
                    </p>
                    {getDiasRestantesBadge(selectedRecurso.diasRestantes)}
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Prioridade</Label>
                  <div className="mt-1">{getPrioridadeBadge(selectedRecurso.prioridade)}</div>
                </div>
              </div>
              
              {selectedRecurso.diasRestantes <= 15 && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 dark:text-red-100">Atenção: Prazo Urgente</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Este recurso está próximo do prazo limite. Restam apenas {selectedRecurso.diasRestantes} dias
                        para conclusão do processo.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
