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
import { ArrowLeft, FileText, Download, Search, Filter, Plus, Upload } from "lucide-react";
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
  
  // Form
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("regulamento");
  const [numeroDoc, setNumeroDoc] = useState("");
  const [dataDoc, setDataDoc] = useState("");
  const [urlArquivo, setUrlArquivo] = useState("");

  useEffect(() => {
    carregarDocumentos();
    verificarAdmin();
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
    </div>
  );
}