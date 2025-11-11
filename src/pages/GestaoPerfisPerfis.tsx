import { useState } from "react";
import { ArrowLeft, Plus, Shield, Users, Building2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GestaoPerfilList } from "@/components/perfis/GestaoPerfilList";
import { GestaoAreasFuncionais } from "@/components/perfis/GestaoAreasFuncionais";
import { AtribuicaoPerfisUtilizador } from "@/components/perfis/AtribuicaoPerfisUtilizador";

interface GestaoPerfisPerfisProps {
  onBack: () => void;
}

export const GestaoPerfisPerfis = ({ onBack }: GestaoPerfisPerfisProps) => {
  const [activeTab, setActiveTab] = useState("perfis");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Gestão de Perfis e Permissões
            </h1>
            <p className="text-muted-foreground">
              Gerir perfis, permissões e atribuições de utilizadores
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="perfis" className="gap-2">
            <Shield className="h-4 w-4" />
            Perfis
          </TabsTrigger>
          <TabsTrigger value="atribuicoes" className="gap-2">
            <Users className="h-4 w-4" />
            Atribuições
          </TabsTrigger>
          <TabsTrigger value="areas" className="gap-2">
            <Building2 className="h-4 w-4" />
            Áreas Funcionais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfis" className="mt-6">
          <GestaoPerfilList />
        </TabsContent>

        <TabsContent value="atribuicoes" className="mt-6">
          <AtribuicaoPerfisUtilizador />
        </TabsContent>

        <TabsContent value="areas" className="mt-6">
          <GestaoAreasFuncionais />
        </TabsContent>
      </Tabs>
    </div>
  );
};
