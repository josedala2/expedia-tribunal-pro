import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";
import { createMockUsers } from "@/scripts/createMockUsers";

const authSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  nomeCompleto: z.string().min(3, { message: "Nome completo é obrigatório" }).optional(),
});

const mockUsers = [
  { nome: "Admin Geral", email: "admin@tc.gov.ao", password: "admin123", role: "Administrador" },
  { nome: "João Silva", email: "joao.silva@tc.gov.ao", password: "tecnico123", role: "Técnico SG" },
  { nome: "Maria Santos", email: "maria.santos@tc.gov.ao", password: "chefe123", role: "Chefe CG" },
  { nome: "Carlos Neto", email: "carlos.neto@tc.gov.ao", password: "juiz123", role: "Juiz Relator" },
  { nome: "Ana Costa", email: "ana.costa@tc.gov.ao", password: "dst123", role: "DST" },
];

export const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [isCreatingUsers, setIsCreatingUsers] = useState(false);

  useEffect(() => {
    // Criar usuários mock apenas uma vez
    const setupKey = 'mock_users_created';
    const alreadyCreated = localStorage.getItem(setupKey);
    
    if (!alreadyCreated) {
      const setup = async () => {
        try {
          await createMockUsers();
          localStorage.setItem(setupKey, 'true');
        } catch (error) {
          console.error('Erro ao criar usuários:', error);
        }
      };
      setup();
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = authSchema.parse({ email, password, nomeCompleto });

      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nome_completo: validatedData.nomeCompleto,
          },
        },
      });

      if (error) throw error;

      toast.success("Conta criada com sucesso! Pode fazer login agora.");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (user: typeof mockUsers[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    // Auto login after 100ms
    setTimeout(() => {
      handleSignIn(new Event("submit") as any);
    }, 100);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = authSchema.omit({ nomeCompleto: true }).parse({ email, password });

      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) throw error;

      toast.success("Login efetuado com sucesso!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <img src="/src/assets/logo-tc.png" alt="Logo TC" className="h-20 mx-auto mb-4" />
          <CardTitle className="text-2xl">Sistema de Gestão TC</CardTitle>
          <CardDescription>Entre na sua conta ou crie uma nova</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-semibold mb-3 text-center">Acesso Rápido (Teste)</h3>
            <div className="grid grid-cols-1 gap-2">
              {mockUsers.map((user) => (
                <Button
                  key={user.email}
                  variant="outline"
                  onClick={() => handleQuickLogin(user)}
                  disabled={isLoading}
                  className="justify-start gap-2 h-auto py-3"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">{user.nome}</span>
                    <span className="text-xs text-muted-foreground">{user.role}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login Manual</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="João Silva"
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "Criar Conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
