import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Search, Filter, Inbox, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { AceitarExpedienteDialog } from "@/components/expedientes/AceitarExpedienteDialog";

interface ExpedientesProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const Expedientes = ({ onBack, onNavigate }: ExpedientesProps) => {
  const [expedientes, setExpedientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expedienteSelecionado, setExpedienteSelecionado] = useState<any>(null);
  const [showAceitarDialog, setShowAceitarDialog] = useState(false);

  useEffect(() => {
    loadExpedientes();
  }, []);

  const loadExpedientes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("expedientes")
      .select("*")
      .order("criado_em", { ascending: false });
    
    if (!error && data) {
      setExpedientes(data);
    }
    setLoading(false);
  };

  const filteredExpedientes = expedientes.filter((exp) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      exp.numero?.toLowerCase().includes(term) ||
      exp.assunto?.toLowerCase().includes(term) ||
      exp.origem?.toLowerCase().includes(term) ||
      exp.destino?.toLowerCase().includes(term)
    );
  });

  const stats = {
    emTramitacao: expedientes.filter((e) => e.status === "Em Tramitação" || e.status === "Enviado").length,
    pendentes: expedientes.filter((e) => e.status === "Pendente").length,
    concluidos: expedientes.filter((e) => e.status === "Concluído" || e.status === "Recebido").length,
    urgentes: expedientes.filter((e) => e.prioridade === "Urgente" || e.prioridade === "Alta").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluído":
      case "Recebido":
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
      case "Recebido":
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
            <div className="text-2xl font-bold text-accent">{stats.emTramitacao}</div>
            <Clock className="h-6 w-6 text-accent" />
          </div>
          <div className="text-sm text-muted-foreground">Em Tramitação</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-destructive hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-destructive">{stats.pendentes}</div>
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="text-sm text-muted-foreground">Pendentes</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-success hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-success">{stats.concluidos}</div>
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <div className="text-sm text-muted-foreground">Concluídos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-warning hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-warning">{stats.urgentes}</div>
            <Inbox className="h-6 w-6 text-warning" />
          </div>
          <div className="text-sm text-muted-foreground">Urgentes</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar por número, assunto ou departamento..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 border-border hover:bg-secondary">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
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
                <TableHead>Acções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpedientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nenhum expediente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpedientes.map((expediente) => (
                  <TableRow key={expediente.id}>
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
                    <TableCell className="text-sm">
                      {expediente.criado_em 
                        ? format(new Date(expediente.criado_em), "dd/MM/yyyy", { locale: pt }) 
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {!expediente.aceito_destinatario && expediente.status === "Pendente" && expediente.submissao_entidade_id && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => {
                              setExpedienteSelecionado(expediente);
                              setShowAceitarDialog(true);
                            }}
                          >
                            Aceitar
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="hover:bg-secondary"
                          onClick={() => onNavigate?.("detalhe-expediente")}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {expedienteSelecionado && (
        <AceitarExpedienteDialog
          open={showAceitarDialog}
          onOpenChange={setShowAceitarDialog}
          expediente={expedienteSelecionado}
          onAceito={loadExpedientes}
        />
      )}
    </div>
  );
};
