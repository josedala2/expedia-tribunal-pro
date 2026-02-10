import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import logoTC from "@/assets/logo-tc.png";
import { Clock, LogOut, Building2 } from "lucide-react";

export default function PortalEntidadesPendente() {
  const navigate = useNavigate();
  const [entidadeNome, setEntidadeNome] = useState("");
  const [status, setStatus] = useState("pendente");

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/portal-entidades"); return; }

      const { data: entUser } = await supabase
        .from("utilizadores_entidade")
        .select("entidade_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!entUser) { navigate("/portal-entidades"); return; }

      const { data: entidade } = await supabase
        .from("entidades_externas")
        .select("nome, status")
        .eq("id", entUser.entidade_id)
        .single();

      if (entidade) {
        setEntidadeNome(entidade.nome);
        setStatus(entidade.status);
        if (entidade.status === "aprovada") {
          navigate("/portal-entidades/dashboard");
        }
      }
    };
    checkStatus();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/portal-entidades");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <img src={logoTC} alt="Tribunal de Contas" className="h-16 w-auto mx-auto" />
        <div className="flex items-center justify-center gap-2">
          <Building2 className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-bold">Portal das Entidades</h2>
        </div>

        {status === "pendente" && (
          <>
            <div className="p-4 rounded-full bg-amber-100 w-fit mx-auto">
              <Clock className="h-10 w-10 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold">Registo em Análise</h3>
            <p className="text-muted-foreground">
              O registo da entidade <strong>{entidadeNome}</strong> está a ser analisado pelo Tribunal de Contas.
              Será notificado por e-mail quando o acesso for aprovado.
            </p>
          </>
        )}

        {status === "rejeitada" && (
          <>
            <div className="p-4 rounded-full bg-red-100 w-fit mx-auto">
              <Clock className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-destructive">Registo Rejeitado</h3>
            <p className="text-muted-foreground">
              O registo da entidade <strong>{entidadeNome}</strong> foi rejeitado. Contacte o Tribunal de Contas para mais informações.
            </p>
          </>
        )}

        {status === "suspensa" && (
          <>
            <div className="p-4 rounded-full bg-orange-100 w-fit mx-auto">
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold">Acesso Suspenso</h3>
            <p className="text-muted-foreground">
              O acesso da entidade <strong>{entidadeNome}</strong> está temporariamente suspenso. Contacte o Tribunal de Contas.
            </p>
          </>
        )}

        <Button variant="outline" onClick={handleLogout} className="w-full">
          <LogOut className="h-4 w-4 mr-2" /> Sair
        </Button>
      </Card>
    </div>
  );
}
