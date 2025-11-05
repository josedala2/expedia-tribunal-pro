import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Plus, Search, FileDown, FileUp, Edit, Archive, Users, Eye, UserCheck } from "lucide-react";
import { format } from "date-fns";

interface CadastroFuncionariosProps {
  onBack: () => void;
}

export default function CadastroFuncionarios({ onBack }: CadastroFuncionariosProps) {
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dialogNovo, setDialogNovo] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    nome_completo: "",
    bi: "",
    nif: "",
    data_nascimento: "",
    genero: "",
    estado_civil: "",
    contacto_telefone: "",
    contacto_email: "",
    morada: "",
    categoria: "",
    carreira: "",
    funcao_atual: "",
    unidade_organica: "",
    departamento: "",
    tipo_vinculo: "",
    data_admissao: "",
  });

  useEffect(() => {
    carregarFuncionarios();
  }, [statusFilter]);

  const carregarFuncionarios = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('funcionarios')
        .select('*')
        .order('nome_completo');

      if (statusFilter !== "todos") {
        query = query.eq('situacao', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      toast.error('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const gerarNumeroFuncionario = () => {
    const ano = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FUNC-${ano}-${numero}`;
  };

  const salvarFuncionario = async () => {
    try {
      const numeroFuncionario = gerarNumeroFuncionario();
      
      const { error } = await supabase
        .from('funcionarios')
        .insert({
          ...formData,
          numero_funcionario: numeroFuncionario,
          situacao: 'ativo'
        });

      if (error) throw error;

      toast.success('Funcionário cadastrado com sucesso!');
      setDialogNovo(false);
      setFormData({
        nome_completo: "",
        bi: "",
        nif: "",
        data_nascimento: "",
        genero: "",
        estado_civil: "",
        contacto_telefone: "",
        contacto_email: "",
        morada: "",
        categoria: "",
        carreira: "",
        funcao_atual: "",
        unidade_organica: "",
        departamento: "",
        tipo_vinculo: "",
        data_admissao: "",
      });
      carregarFuncionarios();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      toast.error('Erro ao cadastrar funcionário');
    }
  };

  const arquivarFuncionario = async (id: string) => {
    try {
      const { error } = await supabase
        .from('funcionarios')
        .update({ situacao: 'inativo' })
        .eq('id', id);

      if (error) throw error;

      toast.success('Funcionário arquivado');
      carregarFuncionarios();
    } catch (error) {
      console.error('Erro ao arquivar:', error);
      toast.error('Erro ao arquivar funcionário');
    }
  };

  const funcionariosFiltrados = funcionarios.filter(func =>
    func.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.numero_funcionario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.bi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Cadastro e Administração de Funcionários
                </h1>
                <p className="text-sm text-muted-foreground">Gerir registo e atualização de dados do pessoal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileUp className="h-4 w-4" />
                Importar
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileDown className="h-4 w-4" />
                Exportar
              </Button>
              <Dialog open={dialogNovo} onOpenChange={setDialogNovo}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Funcionário
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Funcionário</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do funcionário. Número será gerado automaticamente.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="pessoal" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="pessoal">Dados Pessoais</TabsTrigger>
                      <TabsTrigger value="profissional">Dados Profissionais</TabsTrigger>
                      <TabsTrigger value="contrato">Dados Contratuais</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pessoal" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label>Nome Completo *</Label>
                          <Input
                            value={formData.nome_completo}
                            onChange={(e) => setFormData({...formData, nome_completo: e.target.value})}
                            placeholder="Nome completo do funcionário"
                          />
                        </div>
                        <div>
                          <Label>BI</Label>
                          <Input
                            value={formData.bi}
                            onChange={(e) => setFormData({...formData, bi: e.target.value})}
                            placeholder="Número do BI"
                          />
                        </div>
                        <div>
                          <Label>NIF</Label>
                          <Input
                            value={formData.nif}
                            onChange={(e) => setFormData({...formData, nif: e.target.value})}
                            placeholder="Número do NIF"
                          />
                        </div>
                        <div>
                          <Label>Data de Nascimento</Label>
                          <Input
                            type="date"
                            value={formData.data_nascimento}
                            onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Género</Label>
                          <Select value={formData.genero} onValueChange={(v) => setFormData({...formData, genero: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Masculino">Masculino</SelectItem>
                              <SelectItem value="Feminino">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Estado Civil</Label>
                          <Select value={formData.estado_civil} onValueChange={(v) => setFormData({...formData, estado_civil: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                              <SelectItem value="casado">Casado(a)</SelectItem>
                              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Telefone</Label>
                          <Input
                            value={formData.contacto_telefone}
                            onChange={(e) => setFormData({...formData, contacto_telefone: e.target.value})}
                            placeholder="+244 ..."
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={formData.contacto_email}
                            onChange={(e) => setFormData({...formData, contacto_email: e.target.value})}
                            placeholder="email@exemplo.com"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Morada</Label>
                          <Input
                            value={formData.morada}
                            onChange={(e) => setFormData({...formData, morada: e.target.value})}
                            placeholder="Endereço completo"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="profissional" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Categoria</Label>
                          <Input
                            value={formData.categoria}
                            onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                            placeholder="Ex: Técnico Superior"
                          />
                        </div>
                        <div>
                          <Label>Carreira</Label>
                          <Input
                            value={formData.carreira}
                            onChange={(e) => setFormData({...formData, carreira: e.target.value})}
                            placeholder="Ex: Técnica Administrativa"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Função Atual</Label>
                          <Input
                            value={formData.funcao_atual}
                            onChange={(e) => setFormData({...formData, funcao_atual: e.target.value})}
                            placeholder="Cargo/Função atual"
                          />
                        </div>
                        <div>
                          <Label>Unidade Orgânica</Label>
                          <Input
                            value={formData.unidade_organica}
                            onChange={(e) => setFormData({...formData, unidade_organica: e.target.value})}
                            placeholder="Ex: Direcção de RH"
                          />
                        </div>
                        <div>
                          <Label>Departamento</Label>
                          <Input
                            value={formData.departamento}
                            onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                            placeholder="Departamento"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="contrato" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Tipo de Vínculo</Label>
                          <Select value={formData.tipo_vinculo} onValueChange={(v) => setFormData({...formData, tipo_vinculo: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="efectivo">Efectivo</SelectItem>
                              <SelectItem value="contrato">Contrato</SelectItem>
                              <SelectItem value="comissao">Comissão de Serviço</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Data de Admissão</Label>
                          <Input
                            type="date"
                            value={formData.data_admissao}
                            onChange={(e) => setFormData({...formData, data_admissao: e.target.value})}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogNovo(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={salvarFuncionario}>
                      Cadastrar Funcionário
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Funcionários</CardDescription>
              <CardTitle className="text-3xl">{funcionarios.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ativos</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {funcionarios.filter(f => f.situacao === 'ativo').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Inativos</CardDescription>
              <CardTitle className="text-3xl text-red-600">
                {funcionarios.filter(f => f.situacao === 'inativo').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Em Licença</CardDescription>
              <CardTitle className="text-3xl text-orange-600">
                {funcionarios.filter(f => f.situacao === 'licenca').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por nome, número ou BI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                  <SelectItem value="suspensao">Em Suspensão</SelectItem>
                  <SelectItem value="licenca">Em Licença</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Funcionário</TableHead>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>BI</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Unidade Orgânica</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funcionariosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          {searchTerm ? 'Nenhum funcionário encontrado' : 'Nenhum funcionário cadastrado'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    funcionariosFiltrados.map((func) => (
                      <TableRow key={func.id}>
                        <TableCell className="font-medium">{func.numero_funcionario}</TableCell>
                        <TableCell>{func.nome_completo}</TableCell>
                        <TableCell>{func.bi || '-'}</TableCell>
                        <TableCell>{func.funcao_atual || '-'}</TableCell>
                        <TableCell>{func.unidade_organica || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={func.situacao === 'ativo' ? 'default' : 'secondary'}>
                            {func.situacao}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" title="Ver Ficha">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Editar">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Arquivar"
                              onClick={() => arquivarFuncionario(func.id)}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
