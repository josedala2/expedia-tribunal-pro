import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Download, Send, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ExpedienteSaida {
  id: string;
  numero: string;
  processo: string;
  entidade: string;
  tipo: "oficio" | "notificacao" | "despacho" | "guia";
  destinatario: string;
  dataSaida: Date;
  status: "pendente" | "enviado" | "recebido";
  responsavel: string;
}

const mockExpedientes: ExpedienteSaida[] = [
  {
    id: "1",
    numero: "EXP-S-001/2024",
    processo: "PROC-001/2024",
    entidade: "Ministério das Finanças",
    tipo: "oficio",
    destinatario: "Diretor Nacional",
    dataSaida: new Date(2024, 0, 15),
    status: "enviado",
    responsavel: "João Silva"
  },
  {
    id: "2",
    numero: "EXP-S-002/2024",
    processo: "PROC-002/2024",
    entidade: "Governo Provincial de Luanda",
    tipo: "notificacao",
    destinatario: "Governador Provincial",
    dataSaida: new Date(2024, 0, 20),
    status: "recebido",
    responsavel: "Maria Santos"
  }
];

interface ExpedientesSaidaProps {
  onNavigate?: (view: string, data?: any) => void;
}

export default function ExpedientesSaida({ onNavigate }: ExpedientesSaidaProps) {
  const [search, setSearch] = useState("");
  const [expedientes] = useState<ExpedienteSaida[]>(mockExpedientes);

  const filteredExpedientes = expedientes.filter(
    (exp) =>
      exp.numero.toLowerCase().includes(search.toLowerCase()) ||
      exp.processo.toLowerCase().includes(search.toLowerCase()) ||
      exp.entidade.toLowerCase().includes(search.toLowerCase()) ||
      exp.destinatario.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pendente: { label: "Pendente", variant: "secondary" },
      enviado: { label: "Enviado", variant: "default" },
      recebido: { label: "Recebido", variant: "outline" }
    };
    const config = variants[status] || variants.pendente;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTipoBadge = (tipo: string) => {
    const tipos: Record<string, string> = {
      oficio: "Ofício",
      notificacao: "Notificação",
      despacho: "Despacho",
      guia: "Guia de Cobrança"
    };
    return <Badge variant="outline">{tipos[tipo] || tipo}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Expedientes de Saída</h1>
          <p className="text-muted-foreground">Gestão de documentos e correspondências enviadas</p>
        </div>
        <Button onClick={() => onNavigate?.("novo-expediente-saida")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Expediente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expedientes Registrados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, processo, entidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Destinatário</TableHead>
                  <TableHead>Data Saída</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpedientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      Nenhum expediente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpedientes.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell className="font-medium">{exp.numero}</TableCell>
                      <TableCell>{exp.processo}</TableCell>
                      <TableCell>{getTipoBadge(exp.tipo)}</TableCell>
                      <TableCell>{exp.entidade}</TableCell>
                      <TableCell>{exp.destinatario}</TableCell>
                      <TableCell>{format(exp.dataSaida, "dd/MM/yyyy")}</TableCell>
                      <TableCell>{getStatusBadge(exp.status)}</TableCell>
                      <TableCell>{exp.responsavel}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Baixar">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Reenviar">
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Excluir">
                            <Trash2 className="h-4 w-4" />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {expedientes.filter(e => e.status === "pendente").length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {expedientes.filter(e => e.status === "enviado").length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recebidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {expedientes.filter(e => e.status === "recebido").length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
