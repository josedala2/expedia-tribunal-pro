import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Mail, Lock, UserCheck, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "Email demasiado longo" }),
  password: z
    .string()
    .min(6, { message: "Password deve ter pelo menos 6 caracteres" })
    .max(100, { message: "Password demasiado longa" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: () => void;
}

// Lista de utilizadores demo disponíveis
const demoUsers = [
  { email: 'teste@tc.gov.ao', nome: 'Utilizador de Teste', password: 'teste123', categoria: 'Geral' },
  { email: 'presidente.tc@tc.gov.ao', nome: 'Presidente do TC', password: 'demo123', categoria: 'Presidência' },
  { email: 'presidente.1camara@tc.gov.ao', nome: 'Presidente 1ª Câmara', password: 'demo123', categoria: 'Presidência' },
  { email: 'presidente.2camara@tc.gov.ao', nome: 'Presidente 2ª Câmara', password: 'demo123', categoria: 'Presidência' },
  { email: 'juiz.relator@tc.gov.ao', nome: 'Juiz Relator', password: 'demo123', categoria: 'Magistrados' },
  { email: 'juiz.adjunto@tc.gov.ao', nome: 'Juiz Adjunto', password: 'demo123', categoria: 'Magistrados' },
  { email: 'mp@tc.gov.ao', nome: 'Ministério Público', password: 'demo123', categoria: 'Magistrados' },
  { email: 'dst@tc.gov.ao', nome: 'Director Serv. Técnicos', password: 'demo123', categoria: 'Direcção' },
  { email: 'chefe.sg@tc.gov.ao', nome: 'Chefe SG', password: 'demo123', categoria: 'Direcção' },
  { email: 'chefe.divisao@tc.gov.ao', nome: 'Chefe de Divisão', password: 'demo123', categoria: 'Direcção' },
  { email: 'chefe.seccao@tc.gov.ao', nome: 'Chefe de Secção', password: 'demo123', categoria: 'Direcção' },
  { email: 'contadoria@tc.gov.ao', nome: 'Contadoria Geral', password: 'demo123', categoria: 'Departamentos' },
  { email: 'tecnico@tc.gov.ao', nome: 'Técnico', password: 'demo123', categoria: 'Técnicos' },
  { email: 'tecnico.sg@tc.gov.ao', nome: 'Técnico SG', password: 'demo123', categoria: 'Técnicos' },
  { email: 'oficial@tc.gov.ao', nome: 'Oficial de Diligências', password: 'demo123', categoria: 'Técnicos' },
  { email: '1divisao@tc.gov.ao', nome: '1ª Divisão', password: 'demo123', categoria: 'Divisões' },
  { email: '2divisao@tc.gov.ao', nome: '2ª Divisão', password: 'demo123', categoria: 'Divisões' },
  { email: '3divisao@tc.gov.ao', nome: '3ª Divisão (OGE)', password: 'demo123', categoria: 'Divisões' },
  { email: 'fiscalizacao@tc.gov.ao', nome: 'Dept. Fiscalização', password: 'demo123', categoria: 'Fiscalização' },
  { email: 'fisc.preventiva@tc.gov.ao', nome: 'Fisc. Preventiva', password: 'demo123', categoria: 'Fiscalização' },
  { email: 'fisc.sucessiva@tc.gov.ao', nome: 'Fisc. Sucessiva', password: 'demo123', categoria: 'Fiscalização' },
  { email: 'entidade@tc.gov.ao', nome: 'Repr. Entidade', password: 'demo123', categoria: 'Externos' },
];

// Agrupar por categoria
const groupedUsers = demoUsers.reduce((acc, user) => {
  if (!acc[user.categoria]) {
    acc[user.categoria] = [];
  }
  acc[user.categoria].push(user);
  return acc;
}, {} as Record<string, typeof demoUsers>);

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoUsers, setShowDemoUsers] = useState(false);
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const fillCredentials = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
    setShowDemoUsers(false);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou password incorrectos");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Por favor, confirme o seu email antes de iniciar sessão");
        } else {
          toast.error("Erro ao iniciar sessão: " + error.message);
        }
        return;
      }

      toast.success("Sessão iniciada com sucesso");
      onSuccess();
    } catch (error: any) {
      toast.error("Erro inesperado: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 xs:space-y-4">
      <div className="space-y-1.5 xs:space-y-2">
        <Label htmlFor="email" className="text-xs xs:text-sm">Email</Label>
        <div className="relative">
          <Mail className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 xs:h-4 xs:w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="seu.email@tc.gov.ao"
            className="pl-8 xs:pl-9 text-sm xs:text-base h-9 xs:h-10"
            {...register("email")}
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-xs xs:text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5 xs:space-y-2">
        <Label htmlFor="password" className="text-xs xs:text-sm">Password</Label>
        <div className="relative">
          <Lock className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 xs:h-4 xs:w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-8 xs:pl-9 text-sm xs:text-base h-9 xs:h-10"
            {...register("password")}
            disabled={isLoading}
          />
        </div>
        {errors.password && (
          <p className="text-xs xs:text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-1 xs:pt-2">
        <Button type="submit" className="w-full h-9 xs:h-10 text-sm xs:text-base" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 xs:h-4 xs:w-4 animate-spin" />
              A iniciar sessão...
            </>
          ) : (
            "Iniciar Sessão"
          )}
        </Button>
        
        <Collapsible open={showDemoUsers} onOpenChange={setShowDemoUsers}>
          <CollapsibleTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full text-muted-foreground h-9 xs:h-10 text-xs xs:text-sm" 
              disabled={isLoading}
            >
              <UserCheck className="mr-1.5 xs:mr-2 h-3.5 w-3.5 xs:h-4 xs:w-4" />
              Utilizadores Demo
              {showDemoUsers ? (
                <ChevronUp className="ml-auto h-4 w-4" />
              ) : (
                <ChevronDown className="ml-auto h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="border rounded-lg p-2 bg-muted/30">
              <ScrollArea className="h-[280px] pr-3">
                <div className="space-y-3">
                  {Object.entries(groupedUsers).map(([categoria, users]) => (
                    <div key={categoria}>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 px-1">
                        {categoria}
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5">
                        {users.map((user) => (
                          <Button
                            key={user.email}
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto py-1.5 px-2 text-left justify-start hover:bg-primary/10 text-xs"
                            onClick={() => fillCredentials(user.email, user.password)}
                            disabled={isLoading}
                          >
                            <span className="truncate">{user.nome}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Password padrão: <code className="bg-muted px-1 rounded">demo123</code> (ou <code className="bg-muted px-1 rounded">teste123</code> para teste)
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </form>
  );
};
