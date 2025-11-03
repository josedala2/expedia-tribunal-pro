import { useState } from "react";
import { ArrowLeft, Download, Filter, Calendar, FileText, BarChart3, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ProcessChart } from "@/components/dashboard/ProcessChart";
import { ProcessByStatus } from "@/components/dashboard/ProcessByStatus";
import { useToast } from "@/hooks/use-toast";

interface RelatoriosDetalhadosProps {
  onBack: () => void;
}

export const RelatoriosDetalhados = ({ onBack }: RelatoriosDetalhadosProps) => {
  const { toast } = useToast();
  const [tipoRelatorio, setTipoRelatorio] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [formato, setFormato] = useState("pdf");

  const handleGerarRelatorio = () => {
    if (!tipoRelatorio || !periodo) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione o tipo de relatório e o período",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Relatório gerado",
      description: `Relatório ${tipoRelatorio} do período ${periodo} foi gerado com sucesso`,
    });
  };

  const relatoriosDisponiveis = [
    { 
      titulo: "Relatório Anual de Atividades", 
      periodo: "2023", 
      tipo: "Institucional",
      descricao: "Consolidação de todas as atividades realizadas durante o ano"
    },
    { 
      titulo: "Prestação de Contas - Consolidado", 
      periodo: "2023", 
      tipo: "Financeiro",
      descricao: "Análise financeira consolidada de todos os processos"
    },
    { 
      titulo: "Fiscalização OGE - Trimestral", 
      periodo: "Q4 2023", 
      tipo: "Fiscalização",
      descricao: "Resultados da fiscalização do Orçamento Geral do Estado"
    },
    { 
      titulo: "Processos de Visto - Mensal", 
      periodo: "Dezembro 2023", 
      tipo: "Controlo",
      descricao: "Estatísticas mensais dos processos de visto"
    },
    { 
      titulo: "Cumprimento de Despachos", 
      periodo: "2023", 
      tipo: "Operacional",
      descricao: "Taxa de cumprimento e prazos médios de execução"
    },
    { 
      titulo: "Análise de Recursos", 
      periodo: "2023", 
      tipo: "Jurídico",
      descricao: "Recursos interpostos e decisões proferidas"
    },
  ];

  const estatisticas = [
    { label: "Total de Processos", valor: "1.247", variacao: "+12%", icon: FileText },
    { label: "Em Análise", valor: "342", variacao: "+8%", icon: TrendingUp },
    { label: "Concluídos", valor: "905", variacao: "+15%", icon: BarChart3 },
    { label: "Taxa de Conclusão", valor: "72.6%", variacao: "+3%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Relatórios e Estatísticas
          </h1>
          <p className="text-muted-foreground">Consulta e geração de relatórios institucionais</p>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estatisticas.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.valor}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.variacao}</span> vs. período anterior
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProcessChart />
        <ProcessByStatus />
      </div>

      {/* Gerador de Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Gerar Novo Relatório Personalizado
          </CardTitle>
          <CardDescription>
            Configure os parâmetros para gerar um relatório customizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Relatório</Label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="institucional">Institucional</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="fiscalizacao">Fiscalização</SelectItem>
                  <SelectItem value="controlo">Controlo</SelectItem>
                  <SelectItem value="operacional">Operacional</SelectItem>
                  <SelectItem value="juridico">Jurídico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo">Período</Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger id="periodo">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="semestral">Semestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="formato">Formato</Label>
              <Select value={formato} onValueChange={setFormato}>
                <SelectTrigger id="formato">
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleGerarRelatorio} className="gap-2">
              <FileText className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Relatórios Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis para Download</CardTitle>
          <CardDescription>Relatórios previamente gerados prontos para consulta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatoriosDisponiveis.map((relatorio, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-base">{relatorio.titulo}</CardTitle>
                  <CardDescription>{relatorio.descricao}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Período:</span>
                    <span className="font-medium">{relatorio.periodo}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium text-primary">{relatorio.tipo}</span>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Descarregar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};