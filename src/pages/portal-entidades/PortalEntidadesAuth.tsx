import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logoTC from "@/assets/logo-tc.png";
import { Loader2, Building2, CheckCircle } from "lucide-react";

export default function PortalEntidadesAuth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [registoSucesso, setRegistoSucesso] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [regNome, setRegNome] = useState("");
  const [regSigla, setRegSigla] = useState("");
  const [regNif, setRegNif] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regTelefone, setRegTelefone] = useState("");
  const [regEndereco, setRegEndereco] = useState("");
  const [regTipoEntidade, setRegTipoEntidade] = useState("Órgão Público");
  const [regProvincia, setRegProvincia] = useState("");
  const [regResponsavelNome, setRegResponsavelNome] = useState("");
  const [regResponsavelCargo, setRegResponsavelCargo] = useState("");
  const [regResponsavelEmail, setRegResponsavelEmail] = useState("");
  const [regResponsavelTelefone, setRegResponsavelTelefone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if this user is an entity user
        const { data: entUser } = await supabase
          .from("utilizadores_entidade")
          .select("*, entidades_externas:entidade_id(status)")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (entUser) {
          const entidadeStatus = (entUser as any).entidades_externas?.status;
          if (entidadeStatus === "aprovada") {
            navigate("/portal-entidades/dashboard");
          } else {
            navigate("/portal-entidades/pendente");
          }
        }
      }
      setCheckingAuth(false);
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;

      // Check if entity user
      const { data: entUser } = await supabase
        .from("utilizadores_entidade")
        .select("*, entidades_externas:entidade_id(status)")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!entUser) {
        await supabase.auth.signOut();
        toast.error("Esta conta não está associada a nenhuma entidade. Use o portal interno.");
        setLoading(false);
        return;
      }

      const entidadeStatus = (entUser as any).entidades_externas?.status;
      if (entidadeStatus === "aprovada") {
        navigate("/portal-entidades/dashboard");
      } else if (entidadeStatus === "pendente") {
        navigate("/portal-entidades/pendente");
      } else {
        toast.error("A sua entidade foi rejeitada ou suspensa. Contacte o Tribunal.");
        await supabase.auth.signOut();
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao iniciar sessão");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regPasswordConfirm) {
      toast.error("As palavras-passe não coincidem");
      return;
    }
    if (regPassword.length < 6) {
      toast.error("A palavra-passe deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: regResponsavelEmail,
        password: regPassword,
        options: {
          emailRedirectTo: window.location.origin + "/portal-entidades",
          data: {
            nome_completo: regResponsavelNome,
            tipo_utilizador: "entidade_externa",
          },
        },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar utilizador");

      // 2. Create entity
      const { data: entidade, error: entError } = await supabase
        .from("entidades_externas")
        .insert({
          nome: regNome,
          sigla: regSigla || null,
          nif: regNif || null,
          email: regEmail || null,
          telefone: regTelefone || null,
          endereco: regEndereco || null,
          tipo_entidade: regTipoEntidade,
          provincia: regProvincia || null,
          responsavel_nome: regResponsavelNome,
          responsavel_cargo: regResponsavelCargo || null,
          responsavel_email: regResponsavelEmail,
          responsavel_telefone: regResponsavelTelefone || null,
        })
        .select()
        .single();
      if (entError) throw entError;

      // 3. Link user to entity
      const { error: linkError } = await supabase
        .from("utilizadores_entidade")
        .insert({
          user_id: authData.user.id,
          entidade_id: entidade.id,
          nome_completo: regResponsavelNome,
          cargo: regResponsavelCargo || null,
          telefone: regResponsavelTelefone || null,
          is_responsavel: true,
        });
      if (linkError) throw linkError;

      setRegistoSucesso(true);
      toast.success("Registo submetido com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro no registo");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (registoSucesso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold">Registo Submetido!</h2>
          <p className="text-muted-foreground">
            O seu pedido de registo foi submetido com sucesso. O Tribunal irá analisar e aprovar o acesso da sua entidade.
            Receberá uma notificação por e-mail quando o acesso for aprovado.
          </p>
          <p className="text-sm text-muted-foreground">
            Por favor, verifique o seu e-mail para confirmar a sua conta.
          </p>
          <Button onClick={() => { setRegistoSucesso(false); setActiveTab("login"); }} className="w-full">
            Voltar ao Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-lg p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logoTC} alt="Tribunal de Contas" className="h-20 w-auto mb-3" />
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-5 w-5 text-amber-600" />
            <h1 className="text-xl font-bold text-foreground">Portal das Entidades</h1>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Tribunal de Contas de Angola
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Iniciar Sessão</TabsTrigger>
            <TabsTrigger value="register">Registar Entidade</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">E-mail</Label>
                <Input id="login-email" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required placeholder="email@entidade.ao" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Palavra-passe</Label>
                <Input id="login-password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Entrar
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="border-b pb-3 mb-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Dados da Entidade</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-2">
                  <Label>Nome da Entidade *</Label>
                  <Input value={regNome} onChange={e => setRegNome(e.target.value)} required placeholder="Ex: Ministério das Finanças" />
                </div>
                <div className="space-y-2">
                  <Label>Sigla</Label>
                  <Input value={regSigla} onChange={e => setRegSigla(e.target.value)} placeholder="Ex: MINFIN" />
                </div>
                <div className="space-y-2">
                  <Label>NIF</Label>
                  <Input value={regNif} onChange={e => setRegNif(e.target.value)} placeholder="NIF da entidade" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail Institucional</Label>
                  <Input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="geral@entidade.ao" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={regTelefone} onChange={e => setRegTelefone(e.target.value)} placeholder="+244 XXX XXX XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Entidade</Label>
                  <Select value={regTipoEntidade} onValueChange={setRegTipoEntidade}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Órgão Público">Órgão Público</SelectItem>
                      <SelectItem value="Empresa Pública">Empresa Pública</SelectItem>
                      <SelectItem value="Governo Provincial">Governo Provincial</SelectItem>
                      <SelectItem value="Administração Municipal">Administração Municipal</SelectItem>
                      <SelectItem value="Instituto Público">Instituto Público</SelectItem>
                      <SelectItem value="Autarquia">Autarquia</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Província</Label>
                  <Input value={regProvincia} onChange={e => setRegProvincia(e.target.value)} placeholder="Ex: Luanda" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Endereço</Label>
                  <Input value={regEndereco} onChange={e => setRegEndereco(e.target.value)} placeholder="Endereço completo" />
                </div>
              </div>

              <div className="border-b pb-3 mb-3 mt-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Responsável / Ponto Focal</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-2">
                  <Label>Nome Completo *</Label>
                  <Input value={regResponsavelNome} onChange={e => setRegResponsavelNome(e.target.value)} required placeholder="Nome do responsável" />
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input value={regResponsavelCargo} onChange={e => setRegResponsavelCargo(e.target.value)} placeholder="Ex: Director Administrativo" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={regResponsavelTelefone} onChange={e => setRegResponsavelTelefone(e.target.value)} placeholder="+244 XXX XXX XXX" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>E-mail do Responsável *</Label>
                  <Input type="email" value={regResponsavelEmail} onChange={e => setRegResponsavelEmail(e.target.value)} required placeholder="responsavel@entidade.ao" />
                </div>
              </div>

              <div className="border-b pb-3 mb-3 mt-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Credenciais de Acesso</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Palavra-passe *</Label>
                  <Input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required minLength={6} />
                </div>
                <div className="space-y-2">
                  <Label>Confirmar *</Label>
                  <Input type="password" value={regPasswordConfirm} onChange={e => setRegPasswordConfirm(e.target.value)} required minLength={6} />
                </div>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submeter Registo
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>O acesso ao portal está sujeito à aprovação do Tribunal de Contas</p>
        </div>
      </Card>
    </div>
  );
}
