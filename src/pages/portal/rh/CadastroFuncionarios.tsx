import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Plus, Search, FileDown, FileUp, Edit, Archive, Users } from "lucide-react";
import { format } from "date-fns";

interface CadastroFuncionariosProps {
  onBack: () => void;
}

export default function CadastroFuncionarios({ onBack }: CadastroFuncionariosProps) {
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  useEffect(() => {
    carregarFuncionarios();
  }, [statusFilter]);

  const carregarFuncionarios = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('funcionarios')
        .select('*')
        .order('nome_completo');

      if (statusFilter !== "todos") {
        query = query.eq('situacao', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      toast.error('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const funcionariosFiltrados = funcionarios.filter(func =>
    func.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.numero_funcionario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.bi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Cadastro e Administração de Funcionários
                </h1>
                <p className="text-sm text-muted-foreground">Gerir registo e atualização de dados do pessoal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileUp className="h-4 w-4" />
                Importar
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileDown className="h-4 w-4" />
                Exportar
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Funcionário
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por nome, número ou BI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                  <SelectItem value="suspensao">Em Suspensão</SelectItem>
                  <SelectItem value="licenca">Em Licença</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Funcionário</TableHead>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>BI</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Unidade Orgânica</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funcionariosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          {searchTerm ? 'Nenhum funcionário encontrado' : 'Nenhum funcionário cadastrado'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    funcionariosFiltrados.map((func) => (
                      <TableRow key={func.id}>
                        <TableCell className="font-medium">{func.numero_funcionario}</TableCell>
                        <TableCell>{func.nome_completo}</TableCell>
                        <TableCell>{func.bi || '-'}</TableCell>
                        <TableCell>{func.funcao_atual || '-'}</TableCell>
                        <TableCell>{func.unidade_organica || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={func.situacao === 'ativo' ? 'default' : 'secondary'}>
                            {func.situacao}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Archive className="h-4 w-4" />
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
    </div>
  );
}
