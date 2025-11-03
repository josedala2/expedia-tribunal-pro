import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Search, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function RecursoInconstitucionalidade() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Recurso Extraordinário de Inconstitucionalidade</h1>
        <p className="text-muted-foreground">
          Gestão de recursos extraordinários de inconstitucionalidade
        </p>
      </div>

      <Card className="border-orange-200 dark:border-orange-900">
        <CardHeader className="bg-orange-50 dark:bg-orange-950/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-orange-900 dark:text-orange-100">
              Recurso de Caráter Extraordinário
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Este tipo de recurso tem natureza extraordinária e requer análise e decisão do Presidente do Tribunal de Contas.
            A apresentação deve fundamentar questões de inconstitucionalidade.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Recursos de Inconstitucionalidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Total de Recursos</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-muted-foreground">Em Análise</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-muted-foreground">Aguardando Decisão</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-muted-foreground">Concluídos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registos de Recursos de Inconstitucionalidade</CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Recurso
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-6 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-4">Registar Novo Recurso Extraordinário</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Número do Processo Original</Label>
                  <Input placeholder="Ex: PV-2024-001" />
                </div>
                <div>
                  <Label>Data de Apresentação</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Recorrente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp">Ministério Público</SelectItem>
                      <SelectItem value="entidade">Entidade Pública</SelectItem>
                      <SelectItem value="contratada">Entidade Contratada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apresentacao">Apresentação</SelectItem>
                      <SelectItem value="analise">Análise Presidente</SelectItem>
                      <SelectItem value="decisao">Decisão Presidente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Questão de Inconstitucionalidade</Label>
                  <Textarea 
                    placeholder="Descreva a questão de inconstitucionalidade invocada" 
                    rows={4} 
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Fundamentação Legal</Label>
                  <Textarea 
                    placeholder="Indique os fundamentos legais e constitucionais" 
                    rows={4} 
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button>Registar Recurso</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar por processo..." className="pl-9" />
            </div>
            <Select defaultValue="todos">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="apresentacao">Apresentação</SelectItem>
                <SelectItem value="analise">Em Análise</SelectItem>
                <SelectItem value="decisao">Aguardando Decisão</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Recurso</TableHead>
                  <TableHead>Processo Original</TableHead>
                  <TableHead>Recorrente</TableHead>
                  <TableHead>Data Apresentação</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">REI-2024-001</TableCell>
                  <TableCell>PV-2024-045</TableCell>
                  <TableCell>Ministério Público</TableCell>
                  <TableCell>10/11/2024</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Análise Presidente</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
