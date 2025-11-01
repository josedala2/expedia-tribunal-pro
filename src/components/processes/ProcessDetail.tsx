import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, FileText, Clock, User, Building } from "lucide-react";
import { ProcessTimeline } from "./ProcessTimeline";
import { ProcessDocuments } from "./ProcessDocuments";
import { ProcessActions } from "./ProcessActions";

interface ProcessDetailProps {
  processId: string;
  onBack: () => void;
}

const processDetails = {
  id: "PC-2025-001",
  type: "Prestação de Contas",
  entity: "Ministério da Educação",
  status: "Em Análise",
  currentStage: "Análise Técnica",
  responsible: "João Silva",
  division: "Contadoria Geral",
  section: "Secção de Fiscalização Sucessiva",
  date: "2025-03-15",
  priority: "Alta",
  description: "Prestação de contas referente ao exercício económico de 2024 do Ministério da Educação, incluindo relatórios de execução orçamental e demonstrações financeiras.",
};

export const ProcessDetail = ({ processId, onBack }: ProcessDetailProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground">{processDetails.id}</h2>
            <p className="text-muted-foreground mt-1">{processDetails.type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button>Ações do Processo</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <p className="font-semibold text-foreground">{processDetails.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Etapa Atual</p>
                <p className="font-semibold text-foreground">{processDetails.currentStage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <User className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Responsável</p>
                <p className="font-semibold text-foreground">{processDetails.responsible}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Building className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entidade</p>
                <p className="font-semibold text-foreground text-sm">{processDetails.entity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="actions">Ações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Informações do Processo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Divisão</p>
                  <p className="text-foreground mt-1">{processDetails.division}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Secção</p>
                  <p className="text-foreground mt-1">{processDetails.section}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Entrada</p>
                  <p className="text-foreground mt-1">{processDetails.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prioridade</p>
                  <Badge className="mt-1 bg-destructive/10 text-destructive border-destructive/20">
                    {processDetails.priority}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                <p className="text-foreground mt-2 leading-relaxed">{processDetails.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <ProcessTimeline />
        </TabsContent>

        <TabsContent value="documents">
          <ProcessDocuments />
        </TabsContent>

        <TabsContent value="actions">
          <ProcessActions />
        </TabsContent>
      </Tabs>
    </div>
  );
};
