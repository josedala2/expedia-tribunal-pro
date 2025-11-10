import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Eye, Download, Trash2, FileText, Search, Send, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OficioRemessaPrestacao {
  id: string;
  numero: string;
  processo: string;
  entidade: string;
  anoGerencia: string;
  tipoOficio: "Decisão Final" | "Solicitação Elementos" | "Guia Cobrança" | "Notificação";
  destinatario: string;
  cargoDestinatario: string;
  assunto: string;
  dataEmissao: Date;
  dataEnvio?: Date;
  status: "Elaborado" | "Assinado" | "Enviado" | "Recebido";
  assinadoPor?: string;
}

interface OficiosRemessaPrestacaoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const OficiosRemessaPrestacao = ({ onBack, onNavigate }: OficiosRemessaPrestacaoProps) => {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const queryClient = useQueryClient();

  // Buscar ofícios da base de dados
  const { data: oficios = [], isLoading } = useQuery({
    queryKey: ['oficios-remessa'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('oficios_remessa')
        .select('*')
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Mutation para deletar ofício
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('oficios_remessa')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oficios-remessa'] });
      toast.success("Ofício eliminado com sucesso");
    },
    onError: (error) => {
      console.error("Error deleting:", error);
      toast.error("Erro ao eliminar ofício");
    },
  });

  const [oficiosMock] = useState<OficioRemessaPrestacao[]>([
    {
      id: "1",
      numero: "OF-PC-2024-001",
      processo: "PC-2024-001",
      entidade: "Ministério da Educação",
      anoGerencia: "2023",
      tipoOficio: "Decisão Final",
      destinatario: "Dr. João Silva",
      cargoDestinatario: "Ministro da Educação",
      assunto: "Remessa de Decisão - Contas em Termos",
      dataEmissao: new Date(2024, 2, 20),
      dataEnvio: new Date(2024, 2, 21),
      status: "Recebido",
      assinadoPor: "Juiz Conselheiro António Ferreira",
    },
    {
      id: "2",
      numero: "OF-PC-2024-002",
      processo: "PC-2024-002",
      entidade: "Governo Provincial de Luanda",
      anoGerencia: "2023",
      tipoOficio: "Solicitação Elementos",
      destinatario: "Dra. Maria Santos",
      cargoDestinatario: "Governadora Provincial",
      assunto: "Solicitação de Elementos Complementares",
      dataEmissao: new Date(2024, 3, 10),
      status: "Enviado",
      assinadoPor: "Diretor dos Serviços Técnicos",
    },
    {
      id: "3",
      numero: "OF-PC-2024-003",
      processo: "PC-2024-003",
      entidade: "Assembleia Nacional",
      anoGerencia: "2023",
      tipoOficio: "Guia Cobrança",
      destinatario: "Dr. Pedro Costa",
      cargoDestinatario: "Presidente da Assembleia Nacional",
      assunto: "Remessa de Guia de Cobrança de Emolumentos",
      dataEmissao: new Date(2024, 3, 15),
      status: "Assinado",
      assinadoPor: "Juiz Conselheiro João Silva",
    },
  ]);

  const statusColors = {
    "Elaborado": "bg-gray-500 text-white",
    "Assinado": "bg-blue-500 text-white",
    "Enviado": "bg-yellow-500 text-white",
    "Recebido": "bg-green-500 text-white",
  };

  const tipoOficioColors = {
    "Decisão Final": "border-green-500 text-green-700",
    "Solicitação Elementos": "border-yellow-500 text-yellow-700",
    "Guia Cobrança": "border-blue-500 text-blue-700",
    "Notificação": "border-purple-500 text-purple-700",
  };

  // Filtrar ofícios
  const filteredOficios = oficios.filter((oficio) => {
    const matchesSearch = 
      oficio.numero.toLowerCase().includes(search.toLowerCase()) ||
      oficio.destinatario.toLowerCase().includes(search.toLowerCase()) ||
      oficio.assunto.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || oficio.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleNovoOficio = () => {
    if (onNavigate) {
      onNavigate("novo-oficio-remessa-prestacao");
    }
  };

  const handleView = (numero: string) => {
    toast.info(`Visualizando ofício ${numero}`);
  };

  const handleDownload = (numero: string) => {
    toast.success(`Download do ofício ${numero} iniciado`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleEnviar = (numero: string) => {
    toast.success(`Ofício ${numero} enviado com sucesso`);
  };

  const totalOficios = oficios.length;
  const oficiosRascunho = oficios.filter(o => o.status === "rascunho").length;
  const oficiosAssinados = oficios.filter(o => o.status === "assinado").length;
  const oficiosEnviados = oficios.filter(o => o.status === "enviado").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ofícios de Remessa - Prestação de Contas</h1>
            <p className="text-muted-foreground mt-1">
              Gestão de ofícios de remessa para processos de prestação de contas
            </p>
          </div>
        </div>
        <Button onClick={handleNovoOficio}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Ofício
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Ofícios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalOficios}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rascunhos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{oficiosRascunho}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assinados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{oficiosAssinados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{oficiosEnviados}</div>
          </CardContent>
        </Card>
      </div>

      {/* Informações sobre Ofícios de Remessa */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Ofícios de Remessa</CardTitle>
          <CardDescription>
            Informações sobre os diferentes tipos de ofícios emitidos em prestação de contas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Decisão Final</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Remessa da decisão do Juiz Relator</li>
                    <li>• Notificação de contas em termos ou não</li>
                    <li>• Inclui relatório síntese anexado</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Solicitação de Elementos</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Pedido de documentos complementares</li>
                    <li>• Esclarecimentos sobre as contas</li>
                    <li>• Define prazo para resposta</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Guia de Cobrança</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Remessa de guia de emolumentos</li>
                    <li>• Detalhamento dos valores devidos</li>
                    <li>• Prazo de pagamento definido</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Notificação</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Comunicações gerais sobre o processo</li>
                    <li>• Avisos de prazos e diligências</li>
                    <li>• Confirmações de recebimento</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pesquisa e Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, destinatário ou assunto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="assinado">Assinado</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Ofícios */}
      <Card>
        <CardHeader>
          <CardTitle>Ofícios Emitidos</CardTitle>
          <CardDescription>
            Lista de todos os ofícios de remessa emitidos para processos de prestação de contas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Ofício</TableHead>
                <TableHead>Destinatário</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead className="text-center">Data Emissão</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredOficios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhum ofício encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredOficios.map((oficio) => (
                  <TableRow key={oficio.id}>
                    <TableCell className="font-medium">{oficio.numero}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{oficio.destinatario}</div>
                        <div className="text-xs text-muted-foreground">{oficio.remetente_cargo}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm">{oficio.assunto}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      {format(new Date(oficio.data_emissao), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={
                        oficio.status === "rascunho" ? "bg-gray-500 text-white" :
                        oficio.status === "assinado" ? "bg-blue-500 text-white" :
                        "bg-green-500 text-white"
                      }>
                        {oficio.status === "rascunho" ? "Rascunho" :
                         oficio.status === "assinado" ? "Assinado" : "Enviado"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(oficio.numero)}
                          title="Visualizar ofício"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(oficio.numero)}
                          title="Descarregar PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {oficio.status === "assinado" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEnviar(oficio.numero)}
                            title="Enviar ofício"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {oficio.status === "rascunho" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(oficio.id)}
                            title="Eliminar ofício"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja eliminar este ofício? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};