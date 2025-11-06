import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, FileText, Download, Search, Filter, Plus, Upload, FilePlus, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DocumentosOficiaisProps {
  onBack: () => void;
}

export default function DocumentosOficiais({ onBack }: DocumentosOficiaisProps) {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas");
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialogNovo, setDialogNovo] = useState(false);
  
  // Form documento
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("regulamento");
  const [numeroDoc, setNumeroDoc] = useState("");
  const [dataDoc, setDataDoc] = useState("");
  const [urlArquivo, setUrlArquivo] = useState("");

  // Estados para solicitação de declaração
  const [dialogDeclaracao, setDialogDeclaracao] = useState(false);
  const [tipoDeclaracao, setTipoDeclaracao] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [observacoesDeclaracao, setObservacoesDeclaracao] = useState("");
  const [salvandoDeclaracao, setSalvandoDeclaracao] = useState(false);
  const [funcionarioLogado, setFuncionarioLogado] = useState<any>(null);

  useEffect(() => {
    carregarDocumentos();
    verificarAdmin();
    carregarFuncionarioLogado();
  }, [categoriaFiltro]);

  const verificarAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      setIsAdmin(roles?.some(r => r.role === 'admin') || false);
    }
  };

  const carregarFuncionarioLogado = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: funcionario } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setFuncionarioLogado(funcionario);
      }
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error);
    }
  };

  const carregarDocumentos = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('documentos_oficiais')
        .select('*')
        .eq('publicado', true)
        .order('data_documento', { ascending: false });

      if (categoriaFiltro !== 'todas') {
        query = query.eq('categoria', categoriaFiltro);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setDocumentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const salvarDocumento = async () => {
    if (!titulo.trim() || !categoria) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('documentos_oficiais')
        .insert({
          titulo,
          descricao,
          categoria,
          numero_documento: numeroDoc || null,
          data_documento: dataDoc || null,
          url_arquivo: urlArquivo || null,
          publicado: true,
          autor_id: user?.id
        });

      if (error) throw error;

      toast.success('Documento adicionado');
      setDialogNovo(false);
      limparForm();
      carregarDocumentos();
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      toast.error('Erro ao salvar documento');
    }
  };

  const limparForm = () => {
    setTitulo("");
    setDescricao("");
    setCategoria("regulamento");
    setNumeroDoc("");
    setDataDoc("");
    setUrlArquivo("");
  };

  // Tipos de declarações disponíveis
  const tiposDeclaracoes = [
    {
      id: "efeitos_legais",
      titulo: "Declaração (Efeitos Legais)",
      descricao: "Para fins legais e administrativos diversos",
      prazo: "2-3 dias úteis",
      requerAprovacao: true
    },
    {
      id: "abertura_conta",
      titulo: "Declaração (Abertura de Conta)",
      descricao: "Para abertura de conta bancária",
      prazo: "1-2 dias úteis",
      requerAprovacao: true
    },
    {
      id: "atualizacao_dados",
      titulo: "Declaração (Actualização de Dados)",
      descricao: "Para atualização de dados cadastrais",
      prazo: "1 dia útil",
      requerAprovacao: false
    },
    {
      id: "passaporte",
      titulo: "Declaração (Emissão/Renovação de Passaporte)",
      descricao: "Para emissão ou renovação de passaporte",
      prazo: "2-3 dias úteis",
      requerAprovacao: true
    },
    {
      id: "matricula",
      titulo: "Declaração (Matrícula)",
      descricao: "Para matrícula escolar ou académica",
      prazo: "1-2 dias úteis",
      requerAprovacao: false
    },
    {
      id: "visto",
      titulo: "Declaração (Obtenção de Visto)",
      descricao: "Para solicitação de visto internacional",
      prazo: "2-3 dias úteis",
      requerAprovacao: true
    },
    {
      id: "credito_bancario",
      titulo: "Declaração (Crédito Bancário)",
      descricao: "Para solicitação de crédito bancário",
      prazo: "2-3 dias úteis",
      requerAprovacao: true
    },
    {
      id: "atualizacao_conta",
      titulo: "Declaração (Actualização de Conta)",
      descricao: "Para atualização de dados bancários",
      prazo: "1-2 dias úteis",
      requerAprovacao: false
    },
    {
      id: "avalista",
      titulo: "Declaração (Avalista)",
      descricao: "Para servir como avalista em contratos",
      prazo: "3-5 dias úteis",
      requerAprovacao: true
    }
  ];

  const declaracaoSelecionadaObj = tiposDeclaracoes.find(t => t.id === tipoDeclaracao);

  const solicitarDeclaracao = async () => {
    if (!tipoDeclaracao) {
      toast.error("Selecione um tipo de declaração");
      return;
    }
    if (!destinatario.trim()) {
      toast.error("Informe o destinatário/finalidade");
      return;
    }
    if (!funcionarioLogado) {
      toast.error("Funcionário não encontrado");
      return;
    }

    setSalvandoDeclaracao(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar autenticado");
        return;
      }

      const observacoesCompletas = `Destinatário/Finalidade: ${destinatario}\n${observacoesDeclaracao ? '\nObservações: ' + observacoesDeclaracao : ''}`;

      const { error } = await supabase
        .from('solicitacoes_declaracoes')
        .insert({
          funcionario_id: funcionarioLogado.id,
          tipo_declaracao: tipoDeclaracao,
          observacoes: observacoesCompletas,
          solicitado_por: user.id
        });

      if (error) throw error;

      toast.success("Solicitação enviada com sucesso! O RH será notificado.");
      fecharDialogDeclaracao();
    } catch (error) {
      console.error('Erro ao solicitar declaração:', error);
      toast.error('Erro ao enviar solicitação');
    } finally {
      setSalvandoDeclaracao(false);
    }
  };

  const fecharDialogDeclaracao = () => {
    setDialogDeclaracao(false);
    setTipoDeclaracao("");
    setDestinatario("");
    setObservacoesDeclaracao("");
  };

  const documentosFiltrados = documentos.filter(doc => 
    doc.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    doc.numero_documento?.toLowerCase().includes(busca.toLowerCase()) ||
    doc.descricao?.toLowerCase().includes(busca.toLowerCase())
  );

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'regulamento': return 'default';
      case 'circular': return 'secondary';
      case 'despacho': return 'outline';
      case 'instrucao': return 'default';
      case 'formulario': return 'secondary';
      case 'relatorio': return 'outline';
      default: return 'outline';
    }
  };

  const formatarTamanho = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Documentos Oficiais</h1>
              <p className="text-sm text-muted-foreground">Repositório de documentos institucionais</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="gap-2"
                onClick={() => setDialogDeclaracao(true)}
              >
                <FilePlus className="h-4 w-4" />
                Solicitar Declaração
              </Button>
              {isAdmin && (
                <Dialog open={dialogNovo} onOpenChange={(open) => {
                  setDialogNovo(open);
                  if (!open) limparForm();
                }}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Novo Documento
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Adicionar Documento Oficial</DialogTitle>
                    <DialogDescription>
                      Preencha as informações do documento
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Título*</Label>
                      <Input
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Título do documento"
                      />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Descrição resumida do documento"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Categoria*</Label>
                        <Select value={categoria} onValueChange={setCategoria}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regulamento">Regulamento</SelectItem>
                            <SelectItem value="circular">Circular</SelectItem>
                            <SelectItem value="despacho">Despacho</SelectItem>
                            <SelectItem value="instrucao">Instrução</SelectItem>
                            <SelectItem value="formulario">Formulário</SelectItem>
                            <SelectItem value="relatorio">Relatório</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Número do Documento</Label>
                        <Input
                          value={numeroDoc}
                          onChange={(e) => setNumeroDoc(e.target.value)}
                          placeholder="Ex: 001/2025"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Data do Documento</Label>
                      <Input
                        type="date"
                        value={dataDoc}
                        onChange={(e) => setDataDoc(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>URL/Link do Arquivo</Label>
                      <Input
                        value={urlArquivo}
                        onChange={(e) => setUrlArquivo(e.target.value)}
                        placeholder="https://..."
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Cole o link do arquivo hospedado
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogNovo(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={salvarDocumento}>
                      Adicionar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar documentos..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Categorias</SelectItem>
                    <SelectItem value="regulamento">Regulamentos</SelectItem>
                    <SelectItem value="circular">Circulares</SelectItem>
                    <SelectItem value="despacho">Despachos</SelectItem>
                    <SelectItem value="instrucao">Instruções</SelectItem>
                    <SelectItem value="formulario">Formulários</SelectItem>
                    <SelectItem value="relatorio">Relatórios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Documentos */}
        {documentosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                {busca ? 'Nenhum documento encontrado' : 'Nenhum documento disponível'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {documentosFiltrados.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getCategoriaColor(doc.categoria)}>
                          {doc.categoria}
                        </Badge>
                        {doc.numero_documento && (
                          <Badge variant="outline">{doc.numero_documento}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{doc.titulo}</CardTitle>
                      {doc.descricao && (
                        <CardDescription className="mt-2">{doc.descricao}</CardDescription>
                      )}
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {doc.data_documento && (
                        <p>
                          Data: {format(new Date(doc.data_documento), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      )}
                      {doc.tipo_arquivo && (
                        <p>Formato: {doc.tipo_arquivo.toUpperCase()}</p>
                      )}
                      {doc.tamanho_arquivo && (
                        <p>Tamanho: {formatarTamanho(doc.tamanho_arquivo)}</p>
                      )}
                    </div>
                    <Button className="gap-2">
                      <Download className="h-4 w-4" />
                      Baixar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Dialog de Solicitação de Declaração */}
      <Dialog open={dialogDeclaracao} onOpenChange={setDialogDeclaracao}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solicitar Declaração</DialogTitle>
            <DialogDescription>
              Preencha as informações para solicitar sua declaração
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {funcionarioLogado && (
              <Card className="bg-muted/50">
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Solicitante</p>
                  <p className="font-medium">{funcionarioLogado.nome_completo}</p>
                  <p className="text-sm text-muted-foreground">
                    Nº {funcionarioLogado.numero_funcionario} • {funcionarioLogado.departamento || "N/A"}
                  </p>
                </div>
              </Card>
            )}

            <div className="space-y-2">
              <Label>Tipo de Declaração*</Label>
              <Select value={tipoDeclaracao} onValueChange={setTipoDeclaracao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de declaração" />
                </SelectTrigger>
                <SelectContent>
                  {tiposDeclaracoes.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {declaracaoSelecionadaObj && (
              <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">{declaracaoSelecionadaObj.descricao}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Prazo: {declaracaoSelecionadaObj.prazo}</span>
                </div>
                {declaracaoSelecionadaObj.requerAprovacao && (
                  <div className="flex items-start gap-2 pt-2">
                    <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Requer aprovação do departamento de RH
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Destinatário/Finalidade*</Label>
              <Input
                placeholder="Ex: Banco XYZ, Embaixada de Portugal, etc."
                value={destinatario}
                onChange={(e) => setDestinatario(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Informe para quem ou para que a declaração será utilizada
              </p>
            </div>

            <div className="space-y-2">
              <Label>Observações Adicionais (opcional)</Label>
              <Textarea
                placeholder="Adicione informações adicionais sobre a solicitação..."
                value={observacoesDeclaracao}
                onChange={(e) => setObservacoesDeclaracao(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={fecharDialogDeclaracao}>
              Cancelar
            </Button>
            <Button onClick={solicitarDeclaracao} disabled={salvandoDeclaracao}>
              {salvandoDeclaracao ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}