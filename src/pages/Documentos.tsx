import { ArrowLeft, FileText, Download, Upload, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DocumentosProps {
  onBack: () => void;
}

export const Documentos = ({ onBack }: DocumentosProps) => {
  const documentos = [
    { nome: "Regulamento Interno 2024.pdf", tipo: "PDF", tamanho: "2.5 MB", categoria: "Normativo", data: "15/01/2024" },
    { nome: "Manual de Procedimentos.docx", tipo: "DOCX", tamanho: "1.8 MB", categoria: "Manual", data: "10/01/2024" },
    { nome: "Modelo Relatório Auditoria.xlsx", tipo: "XLSX", tamanho: "450 KB", categoria: "Modelo", data: "08/01/2024" },
    { nome: "Lei Orgânica TC.pdf", tipo: "PDF", tamanho: "3.2 MB", categoria: "Legislação", data: "05/01/2024" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Biblioteca de Documentos
            </h1>
            <p className="text-muted-foreground">Gestão de documentos e modelos institucionais</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2">
          <Upload className="h-5 w-5" />
          Carregar Documento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-primary hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-primary">248</div>
          <div className="text-sm text-muted-foreground">Total de Documentos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-accent hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-accent">45</div>
          <div className="text-sm text-muted-foreground">Modelos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-success hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-success">120</div>
          <div className="text-sm text-muted-foreground">Normativos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-warning hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-warning">83</div>
          <div className="text-sm text-muted-foreground">Legislação</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar documentos..." className="pl-9" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentos.map((doc, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {doc.nome}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.tipo}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{doc.categoria}</Badge>
                </TableCell>
                <TableCell>{doc.tamanho}</TableCell>
                <TableCell>{doc.data}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Baixar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
