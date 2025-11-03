import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function RecursoOrdinario() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Recurso Ordinário</h1>
        <p className="text-muted-foreground">
          Gestão de processos de recurso ordinário
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Recursos Ordinários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Total de Recursos</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-muted-foreground">Em Análise</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">4</div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-muted-foreground">Concluídos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registos de Recursos Ordinários</CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Recurso
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-6 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-4">Registar Novo Recurso Ordinário</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Número do Processo Original</Label>
                  <Input placeholder="Ex: PV-2024-001" />
                </div>
                <div>
                  <Label>Data de Interposição</Label>
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
                      <SelectItem value="registo">Registo e Autuação</SelectItem>
                      <SelectItem value="plenario">Plenário da Câmara</SelectItem>
                      <SelectItem value="projeto">Projeto de Acórdão</SelectItem>
                      <SelectItem value="vista">Vista aos Membros</SelectItem>
                      <SelectItem value="resolucao">Resolução Plenária</SelectItem>
                      <SelectItem value="notificacao">Notificação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Fundamento do Recurso</Label>
                  <Textarea placeholder="Descreva os fundamentos" rows={4} />
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
                <SelectItem value="analise">Em Análise</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="concluido">Concluídos</SelectItem>
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
                  <TableHead>Data Interposição</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">RO-2024-001</TableCell>
                  <TableCell>PV-2024-123</TableCell>
                  <TableCell>Ministério Público</TableCell>
                  <TableCell>15/10/2024</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Plenário da Câmara</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">RO-2024-002</TableCell>
                  <TableCell>PV-2024-098</TableCell>
                  <TableCell>Entidade Pública</TableCell>
                  <TableCell>20/10/2024</TableCell>
                  <TableCell>
                    <Badge>Projeto de Acórdão</Badge>
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
