import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Calendar, Clock, DollarSign, FileText, Bell, 
  AlertCircle, CheckCircle, TrendingUp, Users,
  CalendarCheck, ClockIcon, Briefcase, Award, Inbox
} from "lucide-react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardFuncionarioProps {
  onNavigate: (view: string) => void;
}

export default function DashboardFuncionario({ onNavigate }: DashboardFuncionarioProps) {
  const [funcionario, setFuncionario] = useState<any>(null);
  const [pontoHoje, setPontoHoje] = useState<any>(null);
  const [saldoFerias, setSaldoFerias] = useState<any>(null);
  const [ultimaRemuneracao, setUltimaRemuneracao] = useState<any>(null);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [pedidosPendentes, setPedidosPendentes] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Carregar dados do funcionário
        const { data: funcData } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setFuncionario(funcData);

        if (funcData) {
          // Ponto de hoje
          const hoje = format(new Date(), 'yyyy-MM-dd');
          const { data: pontoData } = await supabase
            .from('registos_ponto')
            .select('*')
            .eq('funcionario_id', funcData.id)
            .eq('data', hoje)
            .maybeSingle();
          
          setPontoHoje(pontoData);

          // Saldo de férias
          const { data: saldoData } = await supabase
            .from('saldo_ferias')
            .select('*')
            .eq('funcionario_id', funcData.id)
            .eq('ano', new Date().getFullYear())
            .maybeSingle();
          
          setSaldoFerias(saldoData);

          // Última remuneração
          const { data: remData } = await supabase
            .from('remuneracoes')
            .select('*')
            .eq('funcionario_id', funcData.id)
            .eq('processado', true)
            .order('ano', { ascending: false })
            .order('mes', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          setUltimaRemuneracao(remData);

          // Pedidos pendentes (férias)
          const { data: feriasData, count } = await supabase
            .from('ferias')
            .select('*', { count: 'exact', head: true })
            .eq('funcionario_id', funcData.id)
            .eq('status', 'pendente');
          
          setPedidosPendentes(count || 0);

          // Carregar notícias recentes como notificações
          const { data: noticiasData } = await supabase
            .from('noticias_comunicados')
            .select('*')
            .eq('status', 'publicado')
            .order('publicado_em', { ascending: false })
            .limit(3);
          
          setNotificacoes(noticiasData || []);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const registarPontoRapido = async () => {
    if (!funcionario) return;

    try {
      const hoje = format(new Date(), 'yyyy-MM-dd');
      const agora = new Date().toISOString();

      if (!pontoHoje) {
        // Primeiro registo do dia
        const { error } = await supabase
          .from('registos_ponto')
          .insert({
            funcionario_id: funcionario.id,
            data: hoje,
            entrada_manha: agora,
            tipo: 'normal'
          });

        if (error) throw error;
        toast.success('Entrada registada!');
      } else if (!pontoHoje.saida_tarde) {
        // Registar próxima marcação
        const updates: any = {};
        if (!pontoHoje.saida_manha) {
          updates.saida_manha = agora;
          toast.success('Saída da manhã registada!');
        } else if (!pontoHoje.entrada_tarde) {
          updates.entrada_tarde = agora;
          toast.success('Entrada da tarde registada!');
        } else {
          updates.saida_tarde = agora;
          toast.success('Saída da tarde registada!');
        }

        const { error } = await supabase
          .from('registos_ponto')
          .update(updates)
          .eq('id', pontoHoje.id);

        if (error) throw error;
      } else {
        toast.info('Todos os registos do dia já foram feitos');
        return;
      }

      carregarDashboard();
    } catch (error) {
      console.error('Erro ao registar ponto:', error);
      toast.error('Erro ao registar ponto');
    }
  };

  const formatarHora = (timestamp: string | null) => {
    if (!timestamp) return '--:--';
    return format(new Date(timestamp), 'HH:mm');
  };

  const getStatusPonto = () => {
    if (!pontoHoje) return { label: 'Sem registo', color: 'text-destructive' };
    if (pontoHoje.saida_tarde) return { label: 'Dia completo', color: 'text-green-500' };
    if (pontoHoje.entrada_tarde) return { label: 'Tarde iniciada', color: 'text-blue-500' };
    if (pontoHoje.saida_manha) return { label: 'Pausa almoço', color: 'text-orange-500' };
    if (pontoHoje.entrada_manha) return { label: 'Presente', color: 'text-green-500' };
    return { label: 'Sem registo', color: 'text-muted-foreground' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statusPonto = getStatusPonto();

  return (
    <div className="space-y-6">
      {/* Saudação e Ponto Rápido */}
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Bem-vindo(a), {funcionario?.nome_completo?.split(' ')[0]}</CardTitle>
            <CardDescription>
              {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Status:</span>
                  <span className={statusPonto.color}>{statusPonto.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Entrada Manhã</p>
                    <p className="font-mono text-lg">{formatarHora(pontoHoje?.entrada_manha)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Saída Tarde</p>
                    <p className="font-mono text-lg">{formatarHora(pontoHoje?.saida_tarde)}</p>
                  </div>
                </div>
              </div>
              <Button size="lg" onClick={registarPontoRapido}>
                <ClockIcon className="h-5 w-5 mr-2" />
                Registar Ponto
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores Pessoais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('ferias')}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CalendarCheck className="h-5 w-5 text-green-500" />
              <Badge variant="outline">{new Date().getFullYear()}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{saldoFerias?.dias_disponiveis || 0}</p>
              <p className="text-xs text-muted-foreground">Dias de Férias Disponíveis</p>
            </div>
            <div className="mt-2 flex gap-2 text-xs">
              <span className="text-muted-foreground">Gozados: {saldoFerias?.dias_gozados || 0}</span>
              <span className="text-orange-500">Pendentes: {saldoFerias?.dias_pendentes || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('assiduidade')}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Inbox className="h-5 w-5 text-blue-500" />
              <Badge variant="secondary">Pendentes</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Correspondências Pendentes</p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Requer atenção
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('remuneracoes')}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {ultimaRemuneracao ? new Intl.NumberFormat('pt-AO', {
                  style: 'currency',
                  currency: 'AOA',
                  minimumFractionDigits: 0
                }).format(parseFloat(ultimaRemuneracao.liquido)) : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">Último Vencimento</p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {ultimaRemuneracao && `${ultimaRemuneracao.mes}/${ultimaRemuneracao.ano}`}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Briefcase className="h-5 w-5 text-orange-500" />
              {pedidosPendentes > 0 && (
                <Badge variant="destructive">{pedidosPendentes}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{pedidosPendentes}</p>
              <p className="text-xs text-muted-foreground">Pedidos Pendentes</p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Aguardando aprovação
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atalhos Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Atalhos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => onNavigate('documentos-oficiais')}>
              <FileText className="h-5 w-5" />
              <span className="text-xs">Documentos</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => onNavigate('meu-perfil')}>
              <Users className="h-5 w-5" />
              <span className="text-xs">Atualizar Dados</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notificações e Avisos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Notificações</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {notificacoes.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notificacoes.map((notif) => (
                  <Alert key={notif.id}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notif.titulo}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notif.publicado_em && format(new Date(notif.publicado_em), 'dd/MM/yyyy')}
                          </p>
                        </div>
                        <Badge variant={notif.prioridade === 'urgente' ? 'destructive' : 'outline'} className="text-xs">
                          {notif.tipo}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Resumo do Mês</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-sm text-muted-foreground">Dias Trabalhados</span>
                <span className="font-semibold">20 / 22</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-sm text-muted-foreground">Horas Trabalhadas</span>
                <span className="font-semibold">160h</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-sm text-muted-foreground">Faltas</span>
                <span className="font-semibold text-red-500">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Atrasos</span>
                <span className="font-semibold text-orange-500">1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
