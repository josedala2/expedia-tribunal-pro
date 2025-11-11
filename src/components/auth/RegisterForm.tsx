import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Mail, Lock, User } from "lucide-react";

const registerSchema = z
  .object({
    nomeCompleto: z
      .string()
      .trim()
      .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
      .max(100, { message: "Nome demasiado longo" }),
    email: z
      .string()
      .trim()
      .email({ message: "Email inválido" })
      .max(255, { message: "Email demasiado longo" }),
    password: z
      .string()
      .min(6, { message: "Password deve ter pelo menos 6 caracteres" })
      .max(100, { message: "Password demasiado longa" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As passwords não coincidem",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(data.email, data.password, data.nomeCompleto);

      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("Este email já está registado");
        } else if (error.message.includes("Password should be at least")) {
          toast.error("Password demasiado fraca");
        } else {
          toast.error("Erro ao registar: " + error.message);
        }
        return;
      }

      toast.success("Registo concluído! Pode agora iniciar sessão.");
      onSuccess();
    } catch (error: any) {
      toast.error("Erro inesperado: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nomeCompleto">Nome Completo</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="nomeCompleto"
            type="text"
            placeholder="João Silva"
            className="pl-9"
            {...register("nomeCompleto")}
            disabled={isLoading}
          />
        </div>
        {errors.nomeCompleto && (
          <p className="text-sm text-destructive">{errors.nomeCompleto.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="seu.email@tc.gov.ao"
            className="pl-9"
            {...register("email")}
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-9"
            {...register("password")}
            disabled={isLoading}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="pl-9"
            {...register("confirmPassword")}
            disabled={isLoading}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            A registar...
          </>
        ) : (
          "Registar"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Ao registar-se, concorda com os termos de serviço
      </p>
    </form>
  );
};
