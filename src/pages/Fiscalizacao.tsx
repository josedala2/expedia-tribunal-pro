import { ArrowLeft, Plus, Search, Filter, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FiscalizacaoProps {
  onBack: () => void;
}

export const Fiscalizacao = ({ onBack }: FiscalizacaoProps) => {
  const processos = [
    { numero: "FOGE/2024/001", orgao: "Ministério da Saúde", programa: "Programa Nacional de Saúde", status: "Em Fiscalização", auditor: "Dr. João Silva" },
    { numero: "FOGE/2024/002", orgao: "Ministério da Educação", programa: "Expansão Escolar", status: "Relatório Preliminar", auditor: "Dra. Maria Santos" },
    { numero: "FOGE/2024/003", orgao: "MINAGRI", programa: "Desenvolvimento Rural", status: "Concluído", auditor: "Eng. Carlos Neto" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <FileBarChart className="h-8 w-8 text-primary" />
              Fiscalização da Execução do OGE
            </h1>
            <p className="text-muted-foreground">Acompanhamento e controlo da execução orçamental</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2">
          <Plus className="h-5 w-5" />
          Nova Fiscalização
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="text-2xl font-bold text-primary">15</div>
          <div className="text-sm text-muted-foreground uppercase">Em Fiscalização</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-accent">
          <div className="text-2xl font-bold text-accent">8</div>
          <div className="text-sm text-muted-foreground uppercase">Relatório Preliminar</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-success">
          <div className="text-2xl font-bold text-success">42</div>
          <div className="text-sm text-muted-foreground uppercase">Concluídos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-warning">
          <div className="text-2xl font-bold text-warning">6</div>
          <div className="text-sm text-muted-foreground uppercase">Com Irregularidades</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar por número ou órgão..." className="pl-9" />
          </div>
          <Button variant="outline" className="gap-2 border-accent text-accent hover:bg-accent/10">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Processo</TableHead>
              <TableHead>Órgão</TableHead>
              <TableHead>Programa</TableHead>
              <TableHead>Auditor Responsável</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processos.map((processo) => (
              <TableRow key={processo.numero}>
                <TableCell className="font-medium">{processo.numero}</TableCell>
                <TableCell>{processo.orgao}</TableCell>
                <TableCell>{processo.programa}</TableCell>
                <TableCell>{processo.auditor}</TableCell>
                <TableCell>
                  <Badge 
                    variant={processo.status === "Concluído" ? "default" : "secondary"}
                    className={processo.status === "Concluído" ? "bg-success" : ""}
                  >
                    {processo.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="text-accent border-accent hover:bg-accent/10">
                    Ver Detalhes
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
