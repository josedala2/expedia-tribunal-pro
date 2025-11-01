import { ArrowLeft, Plus, Search, Filter, Inbox, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ExpedientesProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const Expedientes = ({ onBack, onNavigate }: ExpedientesProps) => {
  const expedientes = [
    { 
      numero: "EXP/2024/001", 
      tipo: "Memorando", 
      assunto: "Solicitação de Documentos", 
      origem: "Gabinete do Presidente",
      destino: "Departamento Jurídico",
      status: "Em Tramitação",
      prioridade: "Normal",
      data: "15/01/2024"
    },
    { 
      numero: "EXP/2024/002", 
      tipo: "Ofício", 
      assunto: "Resposta ao Ministério das Finanças", 
      origem: "Departamento de Fiscalização",
      destino: "Gabinete do Presidente",
      status: "Pendente",
      prioridade: "Urgente",
      data: "16/01/2024"
    },
    { 
      numero: "EXP/2024/003", 
      tipo: "Despacho", 
      assunto: "Aprovação de Relatório Trimestral", 
      origem: "Departamento de Auditoria",
      destino: "Arquivo Geral",
      status: "Concluído",
      prioridade: "Normal",
      data: "14/01/2024"
    },
    { 
      numero: "EXP/2024/004", 
      tipo: "Circular", 
      assunto: "Normas de Procedimentos Internos", 
      origem: "Recursos Humanos",
      destino: "Todos os Departamentos",
      status: "Em Tramitação",
      prioridade: "Alta",
      data: "17/01/2024"
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluído":
        return <CheckCircle className="h-4 w-4" />;
      case "Pendente":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-success";
      case "Pendente":
        return "bg-destructive";
      default:
        return "bg-accent";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "Urgente":
        return "bg-destructive";
      case "Alta":
        return "bg-warning";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Inbox className="h-8 w-8 text-primary" />
              Expedientes Internos e Externos
            </h1>
            <p className="text-muted-foreground">Gestão de comunicações e documentos internos e externos</p>
          </div>
        </div>
        <Button 
          className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2"
          onClick={() => onNavigate?.("novo-expediente")}
        >
          <Plus className="h-5 w-5" />
          Novo Expediente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-accent hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-accent">24</div>
            <Clock className="h-6 w-6 text-accent" />
          </div>
          <div className="text-sm text-muted-foreground">Em Tramitação</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-destructive hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-destructive">8</div>
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="text-sm text-muted-foreground">Pendentes</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-success hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-success">156</div>
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <div className="text-sm text-muted-foreground">Concluídos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-warning hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-warning">12</div>
            <Inbox className="h-6 w-6 text-warning" />
          </div>
          <div className="text-sm text-muted-foreground">Urgentes</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar por número, assunto ou departamento..." className="pl-9" />
          </div>
          <Button variant="outline" className="gap-2 border-border hover:bg-secondary">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Expediente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expedientes.map((expediente) => (
              <TableRow key={expediente.numero}>
                <TableCell className="font-medium">{expediente.numero}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-primary text-primary">
                    {expediente.tipo}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{expediente.assunto}</TableCell>
                <TableCell className="text-sm">{expediente.origem}</TableCell>
                <TableCell className="text-sm">{expediente.destino}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getPrioridadeColor(expediente.prioridade)}>
                    {expediente.prioridade}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="default" 
                    className={`${getStatusColor(expediente.status)} gap-1`}
                  >
                    {getStatusIcon(expediente.status)}
                    {expediente.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{expediente.data}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hover:bg-secondary"
                    onClick={() => onNavigate?.("detalhe-expediente")}
                  >
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Inbox className="h-5 w-5 text-primary" />
            Tipos de Expediente
          </h3>
          <div className="space-y-3">
            {[
              { tipo: "Memorandos", quantidade: 45, cor: "bg-primary" },
              { tipo: "Ofícios", quantidade: 32, cor: "bg-accent" },
              { tipo: "Despachos", quantidade: 28, cor: "bg-success" },
              { tipo: "Circulares", quantidade: 15, cor: "bg-warning" },
            ].map((item) => (
              <div key={item.tipo} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${item.cor}`}></div>
                  <span className="text-sm">{item.tipo}</span>
                </div>
                <span className="text-sm font-semibold">{item.quantidade}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Tempo Médio de Tramitação
          </h3>
          <div className="space-y-3">
            {[
              { tipo: "Memorando", tempo: "2 dias", progresso: 85 },
              { tipo: "Ofício", tempo: "3 dias", progresso: 70 },
              { tipo: "Despacho", tempo: "1 dia", progresso: 95 },
              { tipo: "Circular", tempo: "4 dias", progresso: 60 },
            ].map((item) => (
              <div key={item.tipo} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.tipo}</span>
                  <span className="font-semibold">{item.tempo}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${item.progresso}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
