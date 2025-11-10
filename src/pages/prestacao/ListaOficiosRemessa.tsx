import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye, Edit, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Oficio {
  id: string;
  numero: string;
  data_emissao: string;
  destinatario: string;
  assunto: string;
  status: string;
  assinado: boolean;
  criado_em: string;
}

export default function ListaOficiosRemessa() {
  const navigate = useNavigate();
  const [oficios, setOficios] = useState<Oficio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchOficios();
  }, []);

  const fetchOficios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("oficios_remessa")
        .select("*")
        .order("data_emissao", { ascending: false });

      if (error) throw error;
      setOficios(data || []);
    } catch (error) {
      console.error("Erro ao carregar ofícios:", error);
      toast.error("Erro ao carregar ofícios");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("oficios_remessa")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast.success("Ofício excluído com sucesso");
      fetchOficios();
      setDeleteId(null);
    } catch (error) {
      console.error("Erro ao excluir ofício:", error);
      toast.error("Erro ao excluir ofício");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      rascunho: "secondary",
      enviado: "default",
      arquivado: "outline",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredOficios = oficios.filter((oficio) => {
    const matchesSearch =
      oficio.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oficio.destinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oficio.assunto.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "todos" || oficio.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ofícios de Remessa</h1>
          <p className="text-muted-foreground mt-1">
            Gerir ofícios de remessa da prestação de contas
          </p>
        </div>
        <Button onClick={() => navigate("/prestacao/novo-oficio-remessa")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Ofício
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtrar e pesquisar ofícios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por número, destinatário ou assunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : filteredOficios.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Nenhum ofício encontrado
              </p>
              <Button onClick={() => navigate("/prestacao/novo-oficio-remessa")}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Ofício
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Destinatário</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assinado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOficios.map((oficio) => (
                  <TableRow key={oficio.id}>
                    <TableCell className="font-medium">{oficio.numero}</TableCell>
                    <TableCell>
                      {format(new Date(oficio.data_emissao), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{oficio.destinatario}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {oficio.assunto}
                    </TableCell>
                    <TableCell>{getStatusBadge(oficio.status)}</TableCell>
                    <TableCell>
                      {oficio.assinado ? (
                        <Badge variant="default">Sim</Badge>
                      ) : (
                        <Badge variant="outline">Não</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/prestacao/oficio-remessa/${oficio.id}`)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/prestacao/editar-oficio-remessa/${oficio.id}`)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(oficio.id)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este ofício? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
