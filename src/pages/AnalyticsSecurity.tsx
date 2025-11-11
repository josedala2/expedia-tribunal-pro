import { ArrowLeft, TrendingUp, Clock, Monitor, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { TendenciasAcessoChart } from "@/components/analytics/TendenciasAcessoChart";
import { HorariosPicoChart } from "@/components/analytics/HorariosPicoChart";
import { DispositivosChart } from "@/components/analytics/DispositivosChart";
import { LocalizacoesMap } from "@/components/analytics/LocalizacoesMap";
import { ResumoAnalytics } from "@/components/analytics/ResumoAnalytics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface AnalyticsSecurityProps {
  onBack: () => void;
}

export const AnalyticsSecurity = ({ onBack }: AnalyticsSecurityProps) => {
  const [periodo, setPeriodo] = useState("7d");

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                Analytics de Segurança
              </h1>
              <p className="text-muted-foreground">
                Análise de padrões de acesso e comportamento dos utilizadores
              </p>
            </div>
          </div>

          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24 horas</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ResumoAnalytics periodo={periodo} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Tendências de Acesso</h3>
            </div>
            <TendenciasAcessoChart periodo={periodo} />
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Horários de Pico</h3>
            </div>
            <HorariosPicoChart periodo={periodo} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Dispositivos e Navegadores</h3>
            </div>
            <DispositivosChart periodo={periodo} />
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Localizações de Acesso</h3>
            </div>
            <LocalizacoesMap periodo={periodo} />
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};
