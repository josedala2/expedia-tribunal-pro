import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, FileText, Plus, AlertTriangle, Calendar } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface GestaoContratosProps {
  onBack: () => void;
}

export default function GestaoContratos({ onBack }: GestaoContratosProps) {
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
                  <FileText className="h-6 w-6" />
                  Gestão de Contratos
                </h1>
                <p className="text-sm text-muted-foreground">Controlar vínculos formais entre instituição e colaboradores</p>
              </div>
            </div>
            <Button size="sm" className="gap-2">
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
              <CardTitle className="text-3xl text-orange-600">0</CardTitle>
            </CardHeader>
          </Card>
        </div>

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
                            <Button variant="ghost" size="sm">Ver Detalhes</Button>
                            <Button variant="outline" size="sm">Renovar</Button>
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
