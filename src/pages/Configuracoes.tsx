import { ArrowLeft, Settings, User, Bell, Shield, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const passwordSchema = z.object({
  senhaAtual: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  novaSenha: z.string()
    .min(8, "Nova senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número"),
  confirmarSenha: z.string()
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

interface ConfiguracoesProps {
  onBack: () => void;
}

export const Configuracoes = ({ onBack }: ConfiguracoesProps) => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema)
  });

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.novaSenha
      });

      if (error) throw error;

      toast({
        title: "Senha actualizada",
        description: "Sua senha foi alterada com sucesso.",
      });
      reset();
    } catch (error: any) {
      toast({
        title: "Erro ao actualizar senha",
        description: error.message || "Ocorreu um erro ao alterar a senha.",
        variant: "destructive"
      });
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Configurações do Sistema
          </h1>
          <p className="text-muted-foreground">Gerir preferências e configurações</p>
        </div>
      </div>

      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="perfil" className="font-bold">Perfil</TabsTrigger>
          <TabsTrigger value="notificacoes" className="font-bold">Notificações</TabsTrigger>
          <TabsTrigger value="seguranca" className="font-bold">Segurança</TabsTrigger>
          <TabsTrigger value="sistema" className="font-bold">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <User className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-xl font-bold">Dados do Perfil</h2>
                <p className="text-sm text-muted-foreground">Atualize suas informações pessoais</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" defaultValue="João Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="joao.silva@tc.gov.ao" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" defaultValue="Auditor Sénior" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input id="departamento" defaultValue="Fiscalização" />
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary-hover">Salvar Alterações</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Bell className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-xl font-bold">Preferências de Notificações</h2>
                <p className="text-sm text-muted-foreground">Configure como deseja receber notificações</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificações de Email</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações por email</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Novos Expedientes</Label>
                  <p className="text-sm text-muted-foreground">Notificar sobre novos expedientes</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Processos Urgentes</Label>
                  <p className="text-sm text-muted-foreground">Alertas de processos urgentes</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Relatórios Semanais</Label>
                  <p className="text-sm text-muted-foreground">Resumo semanal de atividades</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-xl font-bold">Segurança da Conta</h2>
                <p className="text-sm text-muted-foreground">Gerir senha e autenticação</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senha-atual">Senha Atual</Label>
                <Input 
                  id="senha-atual" 
                  type="password" 
                  {...register("senhaAtual")}
                />
                {errors.senhaAtual && (
                  <p className="text-sm text-destructive">{errors.senhaAtual.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nova-senha">Nova Senha</Label>
                <Input 
                  id="nova-senha" 
                  type="password" 
                  {...register("novaSenha")}
                />
                {errors.novaSenha && (
                  <p className="text-sm text-destructive">{errors.novaSenha.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Mínimo 8 caracteres, com letras maiúsculas, minúsculas e números
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                <Input 
                  id="confirmar-senha" 
                  type="password" 
                  {...register("confirmarSenha")}
                />
                {errors.confirmarSenha && (
                  <p className="text-sm text-destructive">{errors.confirmarSenha.message}</p>
                )}
              </div>

              <Button type="submit" className="bg-primary hover:bg-primary-hover">
                Atualizar Senha
              </Button>

              <div className="pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">Adicionar camada extra de segurança</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="sistema">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-xl font-bold">Configurações do Sistema</h2>
                <p className="text-sm text-muted-foreground">Preferências gerais do sistema</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Modo Escuro</Label>
                  <p className="text-sm text-muted-foreground">Alternar tema da interface</p>
                </div>
                <Switch 
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">Backup diário dos dados</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Logs de Auditoria</Label>
                  <p className="text-sm text-muted-foreground">Registar todas as acções</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
