import { useState } from "react";
import { ArrowLeft, Shield, Activity, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LogsAutenticacao } from "@/components/auditoria/LogsAutenticacao";
import { SessoesActivas } from "@/components/auditoria/SessoesActivas";
import { EstatisticasSeguranca } from "@/components/auditoria/EstatisticasSeguranca";

interface AuditoriaAutenticacaoProps {
  onBack: () => void;
}

export const AuditoriaAutenticacao = ({ onBack }: AuditoriaAutenticacaoProps) => {
  const [activeTab, setActiveTab] = useState("logs");

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
                <Shield className="h-8 w-8 text-primary" />
                Auditoria de Autenticação
              </h1>
              <p className="text-muted-foreground">
                Monitorização de acessos, sessões e segurança do sistema
              </p>
            </div>
          </div>
        </div>

        <EstatisticasSeguranca />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="logs" className="gap-2">
              <Clock className="h-4 w-4" />
              Logs de Acesso
            </TabsTrigger>
            <TabsTrigger value="sessoes" className="gap-2">
              <Activity className="h-4 w-4" />
              Sessões Activas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="mt-6">
            <LogsAutenticacao />
          </TabsContent>

          <TabsContent value="sessoes" className="mt-6">
            <SessoesActivas />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};
