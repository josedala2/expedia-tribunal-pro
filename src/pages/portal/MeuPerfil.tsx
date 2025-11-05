import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, User, Building, CreditCard, Users as UsersIcon, FileText, Edit, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MeuPerfilProps {
  onBack: () => void;
}

export default function MeuPerfil({ onBack }: MeuPerfilProps) {
  const [funcionario, setFuncionario] = useState<any>(null);
  const [dependentes, setDependentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [dialogDependente, setDialogDependente] = useState(false);
  
  // Form edição
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [morada, setMorada] = useState("");
  
  // Form dependente
  const [nomeDependente, setNomeDependente] = useState("");
  const [parentesco, setParentesco] = useState("");
  const [dataNascDep, setDataNascDep] = useState("");
  const [biDep, setBiDep] = useState("");

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: funcData } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setFuncionario(funcData);
        
        if (funcData) {
          setTelefone(funcData.contacto_telefone || "");
          setEmail(funcData.contacto_email || "");
          setMorada(funcData.morada || "");

          const { data: depData } = await supabase
            .from('dependentes_funcionario')
            .select('*')
            .eq('funcionario_id', funcData.id);
          
          setDependentes(depData || []);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const atualizarContactos = async () => {
    if (!funcionario) return;

    try {
      const { error } = await supabase
        .from('funcionarios')
        .update({
          contacto_telefone: telefone,
          contacto_email: email,
          morada: morada
        })
        .eq('id', funcionario.id);

      if (error) throw error;

      toast.success('Dados atualizados com sucesso');
      setEditando(false);
      carregarPerfil();
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast.error('Erro ao atualizar dados');
    }
  };

  const adicionarDependente = async () => {
    if (!funcionario || !nomeDependente.trim() || !parentesco.trim()) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      const { error } = await supabase
        .from('dependentes_funcionario')
        .insert({
          funcionario_id: funcionario.id,
          nome_completo: nomeDependente,
          parentesco: parentesco,
          data_nascimento: dataNascDep || null,
          bi: biDep || null
        });

      if (error) throw error;

      toast.success('Dependente adicionado');
      setDialogDependente(false);
      setNomeDependente("");
      setParentesco("");
      setDataNascDep("");
      setBiDep("");
      carregarPerfil();
    } catch (error) {
      console.error('Erro ao adicionar dependente:', error);
      toast.error('Erro ao adicionar dependente');
    }
  };

  const removerDependente = async (id: string) => {
    if (!confirm('Deseja realmente remover este dependente?')) return;

    try {
      const { error } = await supabase
        .from('dependentes_funcionario')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Dependente removido');
      carregarPerfil();
    } catch (error) {
      console.error('Erro ao remover dependente:', error);
      toast.error('Erro ao remover dependente');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!funcionario) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Perfil de funcionário não encontrado</p>
            <Button onClick={onBack} className="mt-4">Voltar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Meu Perfil</h1>
              <p className="text-sm text-muted-foreground">Informações pessoais e profissionais</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="pessoal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="pessoal">
              <User className="h-4 w-4 mr-2" />
              Pessoal
            </TabsTrigger>
            <TabsTrigger value="profissional">
              <Building className="h-4 w-4 mr-2" />
              Profissional
            </TabsTrigger>
            <TabsTrigger value="bancario">
              <CreditCard className="h-4 w-4 mr-2" />
              Bancário
            </TabsTrigger>
            <TabsTrigger value="dependentes">
              <UsersIcon className="h-4 w-4 mr-2" />
              Dependentes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pessoal">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Dados Pessoais</CardTitle>
                    <CardDescription>Informações básicas do funcionário</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEditando(!editando)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    {editando ? 'Cancelar' : 'Editar Contatos'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome Completo</Label>
                    <Input value={funcionario.nome_completo} disabled />
                  </div>
                  <div>
                    <Label>Nº Funcionário</Label>
                    <Input value={funcionario.numero_funcionario} disabled />
                  </div>
                  <div>
                    <Label>BI</Label>
                    <Input value={funcionario.bi || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>NIF</Label>
                    <Input value={funcionario.nif || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>Data de Nascimento</Label>
                    <Input 
                      value={funcionario.data_nascimento ? format(new Date(funcionario.data_nascimento), 'dd/MM/yyyy') : 'N/A'} 
                      disabled 
                    />
                  </div>
                  <div>
                    <Label>Género</Label>
                    <Input value={funcionario.genero || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>Estado Civil</Label>
                    <Input value={funcionario.estado_civil || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <Input 
                      value={editando ? telefone : (funcionario.contacto_telefone || 'N/A')} 
                      onChange={(e) => setTelefone(e.target.value)}
                      disabled={!editando}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Email</Label>
                    <Input 
                      type="email"
                      value={editando ? email : (funcionario.contacto_email || 'N/A')} 
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!editando}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Morada</Label>
                    <Input 
                      value={editando ? morada : (funcionario.morada || 'N/A')} 
                      onChange={(e) => setMorada(e.target.value)}
                      disabled={!editando}
                    />
                  </div>
                </div>
                {editando && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setEditando(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={atualizarContactos}>
                      Salvar Alterações
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profissional">
            <Card>
              <CardHeader>
                <CardTitle>Dados Profissionais</CardTitle>
                <CardDescription>Informações sobre carreira e função</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Categoria</Label>
                    <Input value={funcionario.categoria || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>Carreira</Label>
                    <Input value={funcionario.carreira || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>Nível</Label>
                    <Input value={funcionario.nivel || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>Função Atual</Label>
                    <Input value={funcionario.funcao_atual || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>Unidade Orgânica</Label>
                    <Input value={funcionario.unidade_organica || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>Departamento</Label>
                    <Input value={funcionario.departamento || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>Data de Admissão</Label>
                    <Input 
                      value={funcionario.data_admissao ? format(new Date(funcionario.data_admissao), 'dd/MM/yyyy') : 'N/A'} 
                      disabled 
                    />
                  </div>
                  <div>
                    <Label>Tipo de Vínculo</Label>
                    <Input value={funcionario.tipo_vinculo || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>Situação</Label>
                    <Badge variant={funcionario.situacao === 'ativo' ? 'default' : 'secondary'}>
                      {funcionario.situacao}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bancario">
            <Card>
              <CardHeader>
                <CardTitle>Dados Bancários</CardTitle>
                <CardDescription>Informações para pagamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>IBAN</Label>
                    <Input value={funcionario.iban || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>Banco</Label>
                    <Input value={funcionario.banco || 'N/A'} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dependentes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Dependentes</CardTitle>
                    <CardDescription>Lista de dependentes registados</CardDescription>
                  </div>
                  <Dialog open={dialogDependente} onOpenChange={setDialogDependente}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Adicionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Dependente</DialogTitle>
                        <DialogDescription>
                          Preencha os dados do dependente
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Nome Completo*</Label>
                          <Input
                            value={nomeDependente}
                            onChange={(e) => setNomeDependente(e.target.value)}
                            placeholder="Nome do dependente"
                          />
                        </div>
                        <div>
                          <Label>Parentesco*</Label>
                          <Input
                            value={parentesco}
                            onChange={(e) => setParentesco(e.target.value)}
                            placeholder="Ex: Filho(a), Cônjuge, etc."
                          />
                        </div>
                        <div>
                          <Label>Data de Nascimento</Label>
                          <Input
                            type="date"
                            value={dataNascDep}
                            onChange={(e) => setDataNascDep(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>BI</Label>
                          <Input
                            value={biDep}
                            onChange={(e) => setBiDep(e.target.value)}
                            placeholder="Número do BI"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogDependente(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={adicionarDependente}>
                          Adicionar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {dependentes.length === 0 ? (
                  <div className="text-center py-8">
                    <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Nenhum dependente registado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dependentes.map((dep) => (
                      <Card key={dep.id} className="border">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                              <div>
                                <Label className="text-xs text-muted-foreground">Nome</Label>
                                <p className="font-medium">{dep.nome_completo}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Parentesco</Label>
                                <p className="font-medium">{dep.parentesco}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Data de Nascimento</Label>
                                <p className="font-medium">
                                  {dep.data_nascimento ? format(new Date(dep.data_nascimento), 'dd/MM/yyyy') : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">BI</Label>
                                <p className="font-medium">{dep.bi || 'N/A'}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removerDependente(dep.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}