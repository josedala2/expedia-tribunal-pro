import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, FileDown } from "lucide-react";

interface RelatoriosEstatisticasRHProps {
  onBack: () => void;
}

export default function RelatoriosEstatisticasRH({ onBack }: RelatoriosEstatisticasRHProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Relatórios e Estatísticas
                </h1>
                <p className="text-sm text-muted-foreground">Base para tomada de decisão e auditoria</p>
              </div>
            </div>
            <Button size="sm" className="gap-2">
              <FileDown className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Quadro de Pessoal</CardTitle>
              <CardDescription>Por unidade, categoria e cargo</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Taxa de Rotatividade</CardTitle>
              <CardDescription>Análise de entradas e saídas</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Mapa de Férias</CardTitle>
              <CardDescription>Férias e licenças por período</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Estatísticas de Desempenho</CardTitle>
              <CardDescription>Avaliações e formações</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Relatório de Assiduidade</CardTitle>
              <CardDescription>Presença e pontualidade</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Custos com Pessoal</CardTitle>
              <CardDescription>Análise financeira de RH</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
