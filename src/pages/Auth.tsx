import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import logoTC from "@/assets/logo-tc.png";

export const Auth = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20">
        <p className="text-muted-foreground">A carregar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4">
            <img src={logoTC} alt="Tribunal de Contas" className="h-24 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Tribunal de Contas
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Sistema de Gestão Processual
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Iniciar Sessão</TabsTrigger>
            <TabsTrigger value="register">Registar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm onSuccess={() => navigate("/")} />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm 
              onSuccess={() => setActiveTab("login")} 
            />
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Sistema protegido com autenticação e controlo de acesso</p>
        </div>
      </Card>
    </div>
  );
};
