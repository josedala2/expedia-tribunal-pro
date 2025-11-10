import { ArrowLeft, FileText, Download, Upload, Search, Filter, X, FilePlus, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";

interface DocumentosProps {
  onBack: () => void;
}

export const Documentos = ({ onBack }: DocumentosProps) => {
  const { toast } = useToast();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDeclaracaoDialog, setShowDeclaracaoDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<string>("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Estados para solicitação de declaração
  const [etapaDeclaracao, setEtapaDeclaracao] = useState(1);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState("");
  const [tipoDeclaracao, setTipoDeclaracao] = useState("");
  const [observacoesDeclaracao, setObservacoesDeclaracao] = useState("");
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [buscaFuncionario, setBuscaFuncionario] = useState("");
  const [carregandoFuncionarios, setCarregandoFuncionarios] = useState(false);
  const [salvandoDeclaracao, setSalvandoDeclaracao] = useState(false);
  
  const documentos = [
    { id: "1", nome: "Regulamento Interno 2024.pdf", tipo: "PDF", tamanho: "2.5 MB", categoria: "Normativo", data: "15/01/2024", url: "#" },
    { id: "2", nome: "Manual de Procedimentos.docx", tipo: "DOCX", tamanho: "1.8 MB", categoria: "Manual", data: "10/01/2024", url: "#" },
    { id: "3", nome: "Modelo Relatório Auditoria.xlsx", tipo: "XLSX", tamanho: "450 KB", categoria: "Modelo", data: "08/01/2024", url: "#" },
    { id: "4", nome: "Lei Orgânica TC.pdf", tipo: "PDF", tamanho: "3.2 MB", categoria: "Legislação", data: "05/01/2024", url: "#" },
  ];

  const documentosFiltrados = documentos.filter(doc => {
    const matchSearch = doc.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = !tipoFiltro || doc.tipo === tipoFiltro;
    const matchCategoria = !categoriaFiltro || doc.categoria === categoriaFiltro;
    return matchSearch && matchTipo && matchCategoria;
  });

  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo para carregar.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Documento carregado com sucesso!",
      description: `${selectedFile.name} foi adicionado à biblioteca.`,
    });
    setShowUploadDialog(false);
    setSelectedFile(null);
  };

  const handleDownload = (doc: typeof documentos[0]) => {
    toast({
      title: "Download iniciado",
      description: `Baixando ${doc.nome}...`,
    });
    // Simulação de download - em produção, use o URL real
  };

  const limparFiltros = () => {
    setTipoFiltro("");
    setCategoriaFiltro("");
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

  useEffect(() => {
    if (showDeclaracaoDialog && etapaDeclaracao === 1) {
      carregarFuncionarios();
    }
  }, [showDeclaracaoDialog, etapaDeclaracao]);

  const carregarFuncionarios = async () => {
    setCarregandoFuncionarios(true);
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('id, numero_funcionario, nome_completo, departamento')
        .eq('situacao', 'ativo')
        .order('nome_completo');

      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      sonnerToast.error('Erro ao carregar lista de funcionários');
    } finally {
      setCarregandoFuncionarios(false);
    }
  };

  const funcionariosFiltrados = funcionarios.filter(f => 
    f.nome_completo.toLowerCase().includes(buscaFuncionario.toLowerCase()) ||
    f.numero_funcionario.toLowerCase().includes(buscaFuncionario.toLowerCase())
  );

  const funcionarioSelecionadoObj = funcionarios.find(f => f.id === funcionarioSelecionado);
  const declaracaoSelecionadaObj = tiposDeclaracoes.find(t => t.id === tipoDeclaracao);

  const avancarParaDeclaracao = () => {
    if (!funcionarioSelecionado) {
      sonnerToast.error("Selecione um funcionário");
      return;
    }
    setEtapaDeclaracao(2);
  };

  const voltarParaFuncionario = () => {
    setEtapaDeclaracao(1);
    setTipoDeclaracao("");
  };

  const solicitarDeclaracao = async () => {
    if (!funcionarioSelecionado) {
      sonnerToast.error("Selecione um funcionário");
      return;
    }
    if (!tipoDeclaracao) {
      sonnerToast.error("Selecione um tipo de declaração");
      return;
    }

    setSalvandoDeclaracao(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        sonnerToast.error("Você precisa estar autenticado");
        return;
      }

      const { error } = await supabase
        .from('solicitacoes_declaracoes')
        .insert({
          funcionario_id: funcionarioSelecionado,
          tipo_declaracao: tipoDeclaracao,
          observacoes: observacoesDeclaracao || null,
          solicitado_por: user.id
        });

      if (error) throw error;

      sonnerToast.success("Solicitação enviada com sucesso!");
      fecharDialogDeclaracao();
    } catch (error) {
      console.error('Erro ao solicitar declaração:', error);
      sonnerToast.error('Erro ao enviar solicitação');
    } finally {
      setSalvandoDeclaracao(false);
    }
  };

  const fecharDialogDeclaracao = () => {
    setShowDeclaracaoDialog(false);
    setEtapaDeclaracao(1);
    setFuncionarioSelecionado("");
    setTipoDeclaracao("");
    setObservacoesDeclaracao("");
    setBuscaFuncionario("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Biblioteca de Documentos
            </h1>
            <p className="text-muted-foreground">Gestão de documentos e modelos institucionais</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowDeclaracaoDialog(true)}
            variant="outline"
            className="gap-2"
          >
            <FilePlus className="h-5 w-5" />
            Solicitar Declaração
          </Button>
          <Button 
            onClick={() => setShowUploadDialog(true)}
            className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2"
          >
            <Upload className="h-5 w-5" />
            Carregar Documento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-primary hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-primary">248</div>
          <div className="text-sm text-muted-foreground">Total de Documentos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-accent hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-accent">45</div>
          <div className="text-sm text-muted-foreground">Modelos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-success hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-success">120</div>
          <div className="text-sm text-muted-foreground">Normativos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-warning hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-warning">83</div>
          <div className="text-sm text-muted-foreground">Legislação</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar documentos..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {(tipoFiltro || categoriaFiltro) && (
                  <Badge variant="secondary" className="ml-1">
                    {[tipoFiltro, categoriaFiltro].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Filtros</h4>
                  {(tipoFiltro || categoriaFiltro) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={limparFiltros}
                    >
                      Limpar
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo-filtro">Tipo de Documento</Label>
                  <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                    <SelectTrigger id="tipo-filtro">
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">Todos os tipos</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="DOCX">DOCX</SelectItem>
                      <SelectItem value="XLSX">XLSX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria-filtro">Categoria</Label>
                  <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                    <SelectTrigger id="categoria-filtro">
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">Todas as categorias</SelectItem>
                      <SelectItem value="Normativo">Normativo</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Modelo">Modelo</SelectItem>
                      <SelectItem value="Legislação">Legislação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Acções</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum documento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              documentosFiltrados.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {doc.nome}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{doc.tipo}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{doc.categoria}</Badge>
                  </TableCell>
                  <TableCell>{doc.tamanho}</TableCell>
                  <TableCell>{doc.data}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="h-4 w-4" />
                      Baixar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog de Upload de Documentos */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Carregar Novo Documento</DialogTitle>
            <DialogDescription>
              Selecione um arquivo para adicionar à biblioteca de documentos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoria-upload">Categoria *</Label>
              <Select>
                <SelectTrigger id="categoria-upload">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normativo">Normativo</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="modelo">Modelo</SelectItem>
                  <SelectItem value="legislacao">Legislação</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Arquivo *</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao-upload">Descrição (opcional)</Label>
              <Input
                id="descricao-upload"
                placeholder="Breve descrição do documento"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowUploadDialog(false);
                setSelectedFile(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleFileUpload} className="gap-2">
              <Upload className="h-4 w-4" />
              Carregar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Solicitação de Declaração */}
      <Dialog open={showDeclaracaoDialog} onOpenChange={setShowDeclaracaoDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {etapaDeclaracao === 1 ? "Selecionar Funcionário" : "Selecionar Tipo de Declaração"}
            </DialogTitle>
            <DialogDescription>
              {etapaDeclaracao === 1 
                ? "Escolha o funcionário para o qual deseja solicitar a declaração"
                : "Escolha o tipo de declaração que deseja solicitar"}
            </DialogDescription>
          </DialogHeader>

          {etapaDeclaracao === 1 ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Buscar Funcionário</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Digite o nome ou número do funcionário..."
                    value={buscaFuncionario}
                    onChange={(e) => setBuscaFuncionario(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {carregandoFuncionarios ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {funcionariosFiltrados.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum funcionário encontrado
                    </p>
                  ) : (
                    funcionariosFiltrados.map((func) => (
                      <Card
                        key={func.id}
                        className={`cursor-pointer transition-colors hover:border-primary ${
                          funcionarioSelecionado === func.id ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => setFuncionarioSelecionado(func.id)}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{func.nome_completo}</p>
                              <p className="text-sm text-muted-foreground">
                                Nº {func.numero_funcionario} • {func.departamento || "N/A"}
                              </p>
                            </div>
                            {funcionarioSelecionado === func.id && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {funcionarioSelecionadoObj && (
                <Card className="bg-muted/50">
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Funcionário Selecionado</p>
                    <p className="font-medium">{funcionarioSelecionadoObj.nome_completo}</p>
                    <p className="text-sm text-muted-foreground">
                      Nº {funcionarioSelecionadoObj.numero_funcionario}
                    </p>
                  </div>
                </Card>
              )}

              <div className="space-y-2">
                <Label>Tipo de Declaração</Label>
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
                <>
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

                  <div className="space-y-2">
                    <Label>Observações (opcional)</Label>
                    <Textarea
                      placeholder="Adicione informações adicionais sobre a solicitação..."
                      value={observacoesDeclaracao}
                      onChange={(e) => setObservacoesDeclaracao(e.target.value)}
                      rows={4}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            {etapaDeclaracao === 1 ? (
              <>
                <Button variant="outline" onClick={fecharDialogDeclaracao}>
                  Cancelar
                </Button>
                <Button onClick={avancarParaDeclaracao}>
                  Continuar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={voltarParaFuncionario}>
                  Voltar
                </Button>
                <Button onClick={solicitarDeclaracao} disabled={salvandoDeclaracao}>
                  {salvandoDeclaracao ? "Enviando..." : "Confirmar Solicitação"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
