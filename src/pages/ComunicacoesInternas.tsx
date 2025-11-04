import { ArrowLeft, MessagesSquare, Send, Inbox, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AceitarExpedienteDialog } from "@/components/expedientes/AceitarExpedienteDialog";

interface ComunicacoesInternasProps {
  onBack: () => void;
}

export const ComunicacoesInternas = ({ onBack }: ComunicacoesInternasProps) => {
  const { toast } = useToast();
  const [expedientes, setExpedientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [expedienteSelecionado, setExpedienteSelecionado] = useState<any>(null);
  const [showAceitarDialog, setShowAceitarDialog] = useState(false);

  useEffect(() => {
    carregarExpedientes();
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUserProfile(data);
      }
    } catch (error: any) {
      // Erro ao carregar perfil
    }
  };

  const carregarExpedientes = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Buscar perfil do usuário para saber a secção
      const { data: profile } = await supabase
        .from('profiles')
        .select('seccao')
        .eq('id', user.id)
        .single();

      // Buscar expedientes internos onde o destino corresponde à secção do usuário
      const { data, error } = await supabase
        .from('expedientes')
        .select('*')
        .eq('natureza', 'interno')
        .or(`destino.eq.${profile?.seccao},destino.eq.Todos os Departamentos`)
        .order('criado_em', { ascending: false });

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as comunicações internas.",
          variant: "destructive"
        });
        return;
      }

      setExpedientes(data || []);
    } catch (error: any) {
      // Erro ao carregar expedientes
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString('pt-BR');
  };

  const handleAceitarExpediente = (expediente: any) => {
    setExpedienteSelecionado(expediente);
    setShowAceitarDialog(true);
  };

  const handleExpedienteAceito = () => {
    carregarExpedientes();
  };

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
              <div className="text-2xl font-bold text-primary">
                {expedientes.filter(e => e.status === "Enviado").length}
              </div>
              <div className="text-sm text-muted-foreground">Enviadas</div>
            </div>
            <Send className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-accent hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-accent">
                {expedientes.filter(e => e.status === "Lido").length}
              </div>
              <div className="text-sm text-muted-foreground">Recebidas</div>
            </div>
            <Inbox className="h-8 w-8 text-accent" />
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-warning hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-warning">
                {expedientes.filter(e => e.status === "Pendente").length}
              </div>
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
            {loading ? (
              <p className="text-center text-muted-foreground">Carregando...</p>
            ) : expedientes.length === 0 ? (
              <p className="text-center text-muted-foreground">Nenhuma comunicação interna encontrada.</p>
            ) : (
              expedientes.map((exp) => (
                <Card key={exp.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{exp.assunto}</h3>
                        <Badge variant={
                          exp.prioridade === "Urgente" ? "destructive" :
                          exp.prioridade === "Alta" ? "default" : "secondary"
                        }>
                          {exp.prioridade}
                        </Badge>
                        <Badge variant="outline">{exp.status}</Badge>
                        {exp.assinado && (
                          <Badge variant="default" className="bg-green-600">Assinado</Badge>
                        )}
                        {exp.aceito_destinatario && (
                          <Badge variant="default" className="bg-blue-600">Aceito</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>De:</strong> {exp.origem}</p>
                        <p><strong>Para:</strong> {exp.destino}</p>
                        <p><strong>Data:</strong> {formatarData(exp.criado_em)}</p>
                        <p><strong>Tipo:</strong> {exp.tipo}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!exp.aceito_destinatario && exp.status !== "Recebido" && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleAceitarExpediente(exp)}
                          className="bg-primary hover:bg-primary-hover"
                        >
                          Aceitar Recepção
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="enviadas" className="space-y-4">
            {expedientes.filter(e => e.status === "Enviado").length === 0 ? (
              <p className="text-center text-muted-foreground">Nenhuma comunicação enviada.</p>
            ) : (
              expedientes.filter(e => e.status === "Enviado").map((exp) => (
                <Card key={exp.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{exp.assunto}</h3>
                        <Badge variant={
                          exp.prioridade === "Urgente" ? "destructive" :
                          exp.prioridade === "Alta" ? "default" : "secondary"
                        }>
                          {exp.prioridade}
                        </Badge>
                        {exp.assinado && (
                          <Badge variant="default" className="bg-green-600">Assinado</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>Para:</strong> {exp.destino}</p>
                        <p><strong>Data:</strong> {formatarData(exp.criado_em)}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="recebidas" className="space-y-4">
            {expedientes.filter(e => e.status === "Lido" || e.status === "Pendente").length === 0 ? (
              <p className="text-center text-muted-foreground">Nenhuma comunicação recebida.</p>
            ) : (
              expedientes.filter(e => e.status === "Lido" || e.status === "Pendente").map((exp) => (
                <Card key={exp.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{exp.assunto}</h3>
                        <Badge variant={
                          exp.prioridade === "Urgente" ? "destructive" :
                          exp.prioridade === "Alta" ? "default" : "secondary"
                        }>
                          {exp.prioridade}
                        </Badge>
                        <Badge variant="outline">{exp.status}</Badge>
                        {exp.assinado && (
                          <Badge variant="default" className="bg-green-600">Assinado</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>De:</strong> {exp.origem}</p>
                        <p><strong>Data:</strong> {formatarData(exp.criado_em)}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Dialog para aceitar expediente */}
      {expedienteSelecionado && (
        <AceitarExpedienteDialog
          open={showAceitarDialog}
          onOpenChange={setShowAceitarDialog}
          expediente={expedienteSelecionado}
          onAceito={handleExpedienteAceito}
        />
      )}
    </div>
  );
};
