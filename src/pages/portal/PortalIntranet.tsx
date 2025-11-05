import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Newspaper, FileText, Users, Calendar, DollarSign, 
  Clock, TrendingUp, AlertCircle, Bell 
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PortalIntranet() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [funcionario, setFuncionario] = useState<any>(null);
  const [saldoFerias, setSaldoFerias] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar perfil do funcionário
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: func } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setFuncionario(func);

        // Carregar saldo de férias
        if (func) {
          const { data: saldo } = await supabase
            .from('saldo_ferias')
            .select('*')
            .eq('funcionario_id', func.id)
            .eq('ano', new Date().getFullYear())
            .single();
          
          setSaldoFerias(saldo);
        }
      }

      // Carregar notícias publicadas
      const { data: noticiasData } = await supabase
        .from('noticias_comunicados')
        .select('*')
        .eq('status', 'publicado')
        .order('publicado_em', { ascending: false })
        .limit(5);
      
      setNoticias(noticiasData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do portal');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (situacao: string) => {
    switch (situacao) {
      case 'ativo': return 'bg-green-500';
      case 'licenca': return 'bg-yellow-500';
      case 'suspenso': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'destructive';
      case 'alta': return 'default';
      case 'normal': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Portal Intranet</h1>
              <p className="text-sm text-muted-foreground">Tribunal de Contas de Angola</p>
            </div>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:px-6">
        {/* Perfil do Funcionário */}
        {funcionario && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Bem-vindo(a), {funcionario.nome_completo}</CardTitle>
                  <CardDescription>{funcionario.funcao_atual || 'Funcionário'}</CardDescription>
                </div>
                <Badge className={getStatusColor(funcionario.situacao)}>
                  {funcionario.situacao}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Unidade</p>
                    <p className="font-medium text-sm">{funcionario.unidade_organica || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nº Funcionário</p>
                    <p className="font-medium text-sm">{funcionario.numero_funcionario}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Férias Disponíveis</p>
                    <p className="font-medium text-sm">{saldoFerias?.dias_disponiveis || 0} dias</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Categoria</p>
                    <p className="font-medium text-sm">{funcionario.categoria || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grid de Atalhos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-base">Ponto Eletrônico</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs">Consultar e registar assiduidade</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-base">Férias</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs">Solicitar e consultar férias</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle className="text-base">Remunerações</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs">Consultar recibos de vencimento</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <FileText className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle className="text-base">Documentos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs">Aceder a documentos oficiais</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Notícias e Comunicados */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                <CardTitle>Notícias e Comunicados</CardTitle>
              </div>
              <Button variant="ghost" size="sm">Ver todas</Button>
            </div>
          </CardHeader>
          <CardContent>
            {noticias.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhuma notícia publicada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {noticias.map((noticia) => (
                  <div key={noticia.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getPrioridadeColor(noticia.prioridade)} className="text-xs">
                            {noticia.tipo}
                          </Badge>
                          {noticia.prioridade === 'urgente' && (
                            <Badge variant="destructive" className="text-xs">Urgente</Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-base hover:text-primary cursor-pointer">
                          {noticia.titulo}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {noticia.conteudo}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {noticia.publicado_em && format(new Date(noticia.publicado_em), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}