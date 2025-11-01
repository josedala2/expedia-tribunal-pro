import { ArrowLeft, BarChart3, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RelatoriosProps {
  onBack: () => void;
}

export const Relatorios = ({ onBack }: RelatoriosProps) => {
  const relatorios = [
    { titulo: "Relatório Anual de Atividades", periodo: "2023", tipo: "Institucional" },
    { titulo: "Prestação de Contas - Consolidado", periodo: "2023", tipo: "Financeiro" },
    { titulo: "Fiscalização OGE - Trimestral", periodo: "Q4 2023", tipo: "Fiscalização" },
    { titulo: "Processos de Visto - Mensal", periodo: "Dezembro 2023", tipo: "Controlo" },
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatorios.map((relatorio, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-accent">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <BarChart3 className="h-8 w-8 text-accent" />
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{relatorio.titulo}</h3>
                <p className="text-sm text-muted-foreground">{relatorio.periodo}</p>
              </div>
              <div className="pt-4 border-t border-border">
                <span className="text-xs uppercase tracking-wide text-accent font-medium">
                  {relatorio.tipo}
                </span>
              </div>
              <Button variant="outline" className="w-full gap-2 border-accent text-accent hover:bg-accent/10">
                <Download className="h-4 w-4" />
                Descarregar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-foreground">Gerar Novo Relatório</h2>
        <p className="text-muted-foreground mb-6">Selecione os parâmetros para gerar um relatório personalizado</p>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          Configurar Relatório
        </Button>
      </Card>
    </div>
  );
};
