import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Plus, Eye, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface OficioRemessa {
  id: string;
  numero: string;
  processo: string;
  entidade: string;
  destinatario: string;
  assunto: string;
  dataEmissao: Date;
  status: "pendente" | "enviado" | "recebido";
}

const mockOficios: OficioRemessa[] = [
  {
    id: "1",
    numero: "OF-001/2024",
    processo: "PROC-001/2024",
    entidade: "Ministério das Finanças",
    destinatario: "Diretor Nacional",
    assunto: "Remessa de processo para análise",
    dataEmissao: new Date(2024, 0, 15),
    status: "enviado"
  },
  {
    id: "2",
    numero: "OF-002/2024",
    processo: "PROC-002/2024",
    entidade: "Governo Provincial de Luanda",
    destinatario: "Governador Provincial",
    assunto: "Remessa de documentação complementar",
    dataEmissao: new Date(2024, 0, 20),
    status: "recebido"
  }
];

interface OficiosRemessaProps {
  onNavigate?: (view: string, data?: any) => void;
}

export default function OficiosRemessa({ onNavigate }: OficiosRemessaProps) {
  const [search, setSearch] = useState("");
  const [oficios] = useState<OficioRemessa[]>(mockOficios);

  const filteredOficios = oficios.filter(
    (oficio) =>
      oficio.numero.toLowerCase().includes(search.toLowerCase()) ||
      oficio.processo.toLowerCase().includes(search.toLowerCase()) ||
      oficio.entidade.toLowerCase().includes(search.toLowerCase()) ||
      oficio.destinatario.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ofícios de Remessa</h1>
          <p className="text-muted-foreground">Gestão de ofícios de remessa de processos</p>
        </div>
        <Button onClick={() => onNavigate?.("novo-oficio-remessa")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Ofício
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ofícios Emitidos</CardTitle>
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
                  <TableHead>Entidade</TableHead>
                  <TableHead>Destinatário</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOficios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      Nenhum ofício encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOficios.map((oficio) => (
                    <TableRow key={oficio.id}>
                      <TableCell className="font-medium">{oficio.numero}</TableCell>
                      <TableCell>{oficio.processo}</TableCell>
                      <TableCell>{oficio.entidade}</TableCell>
                      <TableCell>{oficio.destinatario}</TableCell>
                      <TableCell className="max-w-xs truncate">{oficio.assunto}</TableCell>
                      <TableCell>{format(oficio.dataEmissao, "dd/MM/yyyy")}</TableCell>
                      <TableCell>{getStatusBadge(oficio.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Baixar PDF">
                            <Download className="h-4 w-4" />
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

      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="font-medium">Ofício de Remessa</p>
                <p className="text-muted-foreground">
                  Documento oficial para remeter processos ou documentos a outras entidades
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="font-medium">Finalidade</p>
                <p className="text-muted-foreground">
                  Utilizado para envio formal de processos, pareceres, decisões e documentos complementares
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="font-medium">Registro e Controle</p>
                <p className="text-muted-foreground">
                  Todos os ofícios são registrados e controlados para garantir rastreabilidade
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
