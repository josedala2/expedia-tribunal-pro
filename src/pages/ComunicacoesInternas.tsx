import { ArrowLeft, MessagesSquare, Send, Inbox, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ComunicacoesInternasProps {
  onBack: () => void;
}

export const ComunicacoesInternas = ({ onBack }: ComunicacoesInternasProps) => {
  const comunicacoes = [
    { 
      id: "1", 
      assunto: "Reunião Mensal de Coordenação", 
      remetente: "Gabinete do Presidente",
      destinatario: "Todos os Departamentos",
      data: "20/03/2024",
      status: "Enviada",
      prioridade: "Normal"
    },
    { 
      id: "2", 
      assunto: "Atualização de Procedimentos Internos", 
      remetente: "Departamento Jurídico",
      destinatario: "Departamento de Fiscalização",
      data: "19/03/2024",
      status: "Lida",
      prioridade: "Alta"
    },
    { 
      id: "3", 
      assunto: "Solicitação de Apoio Técnico", 
      remetente: "Departamento de Auditoria",
      destinatario: "Tecnologias de Informação",
      data: "18/03/2024",
      status: "Pendente",
      prioridade: "Urgente"
    },
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
              <MessagesSquare className="h-8 w-8 text-primary" />
              Comunicações Internas
            </h1>
            <p className="text-muted-foreground">Gestão de comunicações entre departamentos</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2">
          <Plus className="h-5 w-5" />
          Nova Comunicação
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-l-4 border-l-primary hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">45</div>
              <div className="text-sm text-muted-foreground">Enviadas</div>
            </div>
            <Send className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-accent hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-accent">12</div>
              <div className="text-sm text-muted-foreground">Recebidas</div>
            </div>
            <Inbox className="h-8 w-8 text-accent" />
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-warning hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-warning">8</div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </div>
            <Users className="h-8 w-8 text-warning" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="todas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="enviadas">Enviadas</TabsTrigger>
            <TabsTrigger value="recebidas">Recebidas</TabsTrigger>
          </TabsList>

          <TabsContent value="todas" className="space-y-4">
            {comunicacoes.map((com) => (
              <Card key={com.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{com.assunto}</h3>
                      <Badge variant={
                        com.prioridade === "Urgente" ? "destructive" :
                        com.prioridade === "Alta" ? "default" : "secondary"
                      }>
                        {com.prioridade}
                      </Badge>
                      <Badge variant="outline">{com.status}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>De:</strong> {com.remetente}</p>
                      <p><strong>Para:</strong> {com.destinatario}</p>
                      <p><strong>Data:</strong> {com.data}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="enviadas" className="space-y-4">
            {comunicacoes.filter(c => c.status === "Enviada").map((com) => (
              <Card key={com.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{com.assunto}</h3>
                      <Badge variant={
                        com.prioridade === "Urgente" ? "destructive" :
                        com.prioridade === "Alta" ? "default" : "secondary"
                      }>
                        {com.prioridade}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Para:</strong> {com.destinatario}</p>
                      <p><strong>Data:</strong> {com.data}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recebidas" className="space-y-4">
            {comunicacoes.filter(c => c.status === "Lida" || c.status === "Pendente").map((com) => (
              <Card key={com.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{com.assunto}</h3>
                      <Badge variant={
                        com.prioridade === "Urgente" ? "destructive" :
                        com.prioridade === "Alta" ? "default" : "secondary"
                      }>
                        {com.prioridade}
                      </Badge>
                      <Badge variant="outline">{com.status}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>De:</strong> {com.remetente}</p>
                      <p><strong>Data:</strong> {com.data}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
