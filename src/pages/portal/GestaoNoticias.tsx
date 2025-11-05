import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Plus, Newspaper, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GestaoNoticiasProps {
  onBack: () => void;
}

export default function GestaoNoticias({ onBack }: GestaoNoticiasProps) {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogNova, setDialogNova] = useState(false);
  const [noticiaEditando, setNoticiaEditando] = useState<any>(null);
  
  // Form
  const [tipo, setTipo] = useState("noticia");
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [prioridade, setPrioridade] = useState("normal");

  useEffect(() => {
    carregarNoticias();
  }, []);

  const carregarNoticias = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('noticias_comunicados')
        .select('*')
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      setNoticias(data || []);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
      toast.error('Erro ao carregar notícias');
    } finally {
      setLoading(false);
    }
  };

  const limparForm = () => {
    setTipo("noticia");
    setTitulo("");
    setConteudo("");
    setPrioridade("normal");
    setNoticiaEditando(null);
  };

  const salvarNoticia = async () => {
    if (!titulo.trim() || !conteudo.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (noticiaEditando) {
        const { error } = await supabase
          .from('noticias_comunicados')
          .update({
            tipo,
            titulo,
            conteudo,
            prioridade
          })
          .eq('id', noticiaEditando.id);

        if (error) throw error;
        toast.success('Notícia atualizada');
      } else {
        const { error } = await supabase
          .from('noticias_comunicados')
          .insert({
            tipo,
            titulo,
            conteudo,
            prioridade,
            status: 'rascunho',
            autor_id: user?.id
          });

        if (error) throw error;
        toast.success('Notícia criada');
      }

      setDialogNova(false);
      limparForm();
      carregarNoticias();
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      toast.error('Erro ao salvar notícia');
    }
  };

  const editarNoticia = (noticia: any) => {
    setNoticiaEditando(noticia);
    setTipo(noticia.tipo);
    setTitulo(noticia.titulo);
    setConteudo(noticia.conteudo);
    setPrioridade(noticia.prioridade);
    setDialogNova(true);
  };

  const alternarPublicacao = async (noticia: any) => {
    try {
      const novoStatus = noticia.status === 'publicado' ? 'rascunho' : 'publicado';
      const { error } = await supabase
        .from('noticias_comunicados')
        .update({
          status: novoStatus,
          publicado_em: novoStatus === 'publicado' ? new Date().toISOString() : null
        })
        .eq('id', noticia.id);

      if (error) throw error;
      
      toast.success(novoStatus === 'publicado' ? 'Notícia publicada' : 'Notícia despublicada');
      carregarNoticias();
    } catch (error) {
      console.error('Erro ao alterar publicação:', error);
      toast.error('Erro ao alterar publicação');
    }
  };

  const excluirNoticia = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta notícia?')) return;

    try {
      const { error } = await supabase
        .from('noticias_comunicados')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Notícia excluída');
      carregarNoticias();
    } catch (error) {
      console.error('Erro ao excluir notícia:', error);
      toast.error('Erro ao excluir notícia');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publicado': return 'default';
      case 'rascunho': return 'secondary';
      case 'arquivado': return 'outline';
      default: return 'outline';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'destructive';
      case 'alta': return 'default';
      case 'normal': return 'secondary';
      case 'baixa': return 'outline';
      default: return 'outline';
    }
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
              <h1 className="text-2xl font-bold">Gestão de Notícias</h1>
              <p className="text-sm text-muted-foreground">Administração de comunicados internos</p>
            </div>
            <Dialog open={dialogNova} onOpenChange={(open) => {
              setDialogNova(open);
              if (!open) limparForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Notícia
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {noticiaEditando ? 'Editar Notícia' : 'Nova Notícia'}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha as informações da notícia ou comunicado
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo</Label>
                      <Select value={tipo} onValueChange={setTipo}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="noticia">Notícia</SelectItem>
                          <SelectItem value="comunicado">Comunicado</SelectItem>
                          <SelectItem value="circular">Circular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Prioridade</Label>
                      <Select value={prioridade} onValueChange={setPrioridade}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Título da notícia..."
                    />
                  </div>
                  <div>
                    <Label>Conteúdo</Label>
                    <Textarea
                      value={conteudo}
                      onChange={(e) => setConteudo(e.target.value)}
                      placeholder="Escreva o conteúdo da notícia..."
                      rows={8}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogNova(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={salvarNoticia}>
                    {noticiaEditando ? 'Atualizar' : 'Criar'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Todas as Notícias</CardTitle>
            <CardDescription>Gerir notícias, comunicados e circulares</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Criação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {noticias.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Nenhuma notícia cadastrada</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    noticias.map((noticia) => (
                      <TableRow key={noticia.id}>
                        <TableCell className="font-medium max-w-xs">
                          <div className="truncate">{noticia.titulo}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{noticia.tipo}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPrioridadeColor(noticia.prioridade)}>
                            {noticia.prioridade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(noticia.status)}>
                            {noticia.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(noticia.criado_em), 'dd/MM/yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => alternarPublicacao(noticia)}
                              title={noticia.status === 'publicado' ? 'Despublicar' : 'Publicar'}
                            >
                              {noticia.status === 'publicado' ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editarNoticia(noticia)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => excluirNoticia(noticia.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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