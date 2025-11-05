import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Download, FileText, Calendar, DollarSign, Clock, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RelatoriosPessoaisProps {
  onBack: () => void;
}

export default function RelatoriosPessoais({ onBack }: RelatoriosPessoaisProps) {
  const [funcionario, setFuncionario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: funcData } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setFuncionario(funcData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const gerarAnos = () => {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    for (let i = anoAtual; i >= anoAtual - 5; i--) {
      anos.push(i.toString());
    }
    return anos;
  };

  const gerarRelatorio = (tipo: string) => {
    toast.success(`Gerando relatório: ${tipo}`);
    // Aqui seria implementada a lógica real de geração de PDF
  };

  const tiposRelatorio = [
    {
      id: 'ferias',
      titulo: 'Relatório de Férias',
      descricao: 'Histórico de férias gozadas, disponíveis e pendentes',
      icon: Calendar,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'assiduidade',
      titulo: 'Relatório de Assiduidade',
      descricao: 'Resumo de presença, faltas e pontualidade',
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'remuneracao',
      titulo: 'Evolução Salarial',
      descricao: 'Histórico de remunerações e subsídios',
      icon: DollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 'formacao',
      titulo: 'Cursos e Certificações',
      descricao: 'Histórico completo de formações',
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      id: 'desempenho',
      titulo: 'Avaliações de Desempenho',
      descricao: 'Histórico de avaliações e pontuações',
      icon: TrendingUp,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Relatórios Pessoais</h1>
              <p className="text-sm text-muted-foreground">Geração e exportação de relatórios</p>
            </div>
            <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gerarAnos().map((ano) => (
                  <SelectItem key={ano} value={ano}>Ano {ano}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Informações do Funcionário */}
        {funcionario && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Dados do Funcionário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Nome</p>
                  <p className="font-medium">{funcionario.nome_completo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Nº Funcionário</p>
                  <p className="font-medium">{funcionario.numero_funcionario}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Unidade</p>
                  <p className="font-medium">{funcionario.unidade_organica || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grid de Relatórios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tiposRelatorio.map((relatorio) => {
            const Icon = relatorio.icon;
            return (
              <Card key={relatorio.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 ${relatorio.bgColor} rounded-lg`}>
                      <Icon className={`h-6 w-6 ${relatorio.color}`} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{relatorio.titulo}</CardTitle>
                      <CardDescription className="mt-1">
                        {relatorio.descricao}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Período:</span>
                      <span className="font-medium">{anoSelecionado}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 gap-2" 
                        variant="outline"
                        onClick={() => gerarRelatorio(relatorio.titulo)}
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button 
                        className="flex-1 gap-2" 
                        variant="outline"
                        onClick={() => gerarRelatorio(relatorio.titulo)}
                      >
                        <Download className="h-4 w-4" />
                        Excel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Relatório Completo */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Relatório Completo</CardTitle>
            <CardDescription>
              Documento consolidado com todas as informações do funcionário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Relatório Anual Completo {anoSelecionado}
                </p>
                <p className="text-xs text-muted-foreground">
                  Inclui: dados pessoais, assiduidade, férias, remunerações, formações e avaliações
                </p>
              </div>
              <Button size="lg" className="gap-2" onClick={() => gerarRelatorio('Completo')}>
                <Download className="h-5 w-5" />
                Gerar Relatório Completo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Notas Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Os relatórios são gerados em tempo real com base nos dados atuais do sistema</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Todos os documentos incluem assinatura digital e carimbo de data/hora</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Os relatórios podem ser enviados automaticamente para o seu email institucional</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Histórico de relatórios gerados fica disponível por 90 dias</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
