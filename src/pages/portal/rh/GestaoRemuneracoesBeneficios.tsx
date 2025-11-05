import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, Plus } from "lucide-react";

interface GestaoRemuneracoesBeneficiosProps {
  onBack: () => void;
}

export default function GestaoRemuneracoesBeneficios({ onBack }: GestaoRemuneracoesBeneficiosProps) {
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
                  <DollarSign className="h-6 w-6" />
                  Gestão de Remunerações e Benefícios
                </h1>
                <p className="text-sm text-muted-foreground">Controlar pagamentos, subsídios e benefícios</p>
              </div>
            </div>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Processar Folha
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Folha de Pagamento</CardTitle>
            <CardDescription>Gerir remunerações e benefícios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
