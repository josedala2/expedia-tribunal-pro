import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GraduationCap, Award, TrendingUp, Plus, Download, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FormacaoAvaliacao() {
  const [funcionario, setFuncionario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dialogNova, setDialogNova] = useState(false);
  
  // Form certificação
  const [nomeCurso, setNomeCurso] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [dataConclusao, setDataConclusao] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
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
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar formação');
    } finally {
      setLoading(false);
    }
  };

  // Mock data para demonstração
  const cursosInternos = [
    {
      id: 1,
      titulo: "Fiscalização de Contas Públicas",
      categoria: "Técnico",
      cargaHoraria: "40h",
      dataInicio: "2025-02-01",
      status: "inscrito"
    },
    {
      id: 2,
      titulo: "Ética no Serviço Público",
      categoria: "Formação Geral",
      cargaHoraria: "20h",
      dataInicio: "2025-03-15",
      status: "disponivel"
    }
  ];

  const certificacoes = [
    {
      id: 1,
      curso: "Auditoria Governamental Avançada",
      instituicao: "INTOSAI",
      dataConclusao: "2024-11-20",
      cargaHoraria: "80h"
    }
  ];

  const avaliacoes = [
    {
      id: 1,
      periodo: "2024",
      tipo: "Avaliação Anual",
      pontuacao: 4.5,
      status: "concluida",
      data: "2024-12-15"
    },
    {
      id: 2,
      periodo: "2023",
      tipo: "Avaliação Anual",
      pontuacao: 4.2,
      status: "concluida",
      data: "2023-12-10"
    }
  ];

  const adicionarCertificacao = () => {
    if (!nomeCurso || !instituicao || !dataConclusao) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    toast.success('Certificação registada com sucesso');
    setDialogNova(false);
    setNomeCurso("");
    setInstituicao("");
    setDataConclusao("");
    setCargaHoraria("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="cursos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="cursos" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Cursos Internos
            </TabsTrigger>
            <TabsTrigger value="certificacoes" className="gap-2">
              <Award className="h-4 w-4" />
              Certificações
            </TabsTrigger>
            <TabsTrigger value="avaliacoes" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Avaliações
            </TabsTrigger>
          </TabsList>

          {/* Cursos Internos */}
          <TabsContent value="cursos">
            <Card>
              <CardHeader>
                <CardTitle>Plano de Formação {new Date().getFullYear()}</CardTitle>
                <CardDescription>Cursos disponíveis e inscrições</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cursosInternos.map((curso) => (
                    <Card key={curso.id} className="border">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{curso.titulo}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Categoria</p>
                                <p className="font-medium">{curso.categoria}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Carga Horária</p>
                                <p className="font-medium">{curso.cargaHoraria}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Início</p>
                                <p className="font-medium">
                                  {format(new Date(curso.dataInicio), 'dd/MM/yyyy')}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Status</p>
                                <Badge variant={curso.status === 'inscrito' ? 'default' : 'outline'}>
                                  {curso.status === 'inscrito' ? 'Inscrito' : 'Disponível'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {curso.status === 'disponivel' && (
                            <Button size="sm">Inscrever-se</Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificações */}
          <TabsContent value="certificacoes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Minhas Certificações</CardTitle>
                    <CardDescription>Cursos e formações externas</CardDescription>
                  </div>
                  <Dialog open={dialogNova} onOpenChange={setDialogNova}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Adicionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nova Certificação</DialogTitle>
                        <DialogDescription>
                          Registar nova formação ou certificação externa
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Nome do Curso*</Label>
                          <Input
                            value={nomeCurso}
                            onChange={(e) => setNomeCurso(e.target.value)}
                            placeholder="Ex: Auditoria Governamental"
                          />
                        </div>
                        <div>
                          <Label>Instituição*</Label>
                          <Input
                            value={instituicao}
                            onChange={(e) => setInstituicao(e.target.value)}
                            placeholder="Ex: INTOSAI"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Data Conclusão*</Label>
                            <Input
                              type="date"
                              value={dataConclusao}
                              onChange={(e) => setDataConclusao(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Carga Horária</Label>
                            <Input
                              value={cargaHoraria}
                              onChange={(e) => setCargaHoraria(e.target.value)}
                              placeholder="Ex: 40h"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogNova(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={adicionarCertificacao}>
                          Adicionar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certificacoes.map((cert) => (
                    <Card key={cert.id} className="border">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <GraduationCap className="h-5 w-5 text-primary" />
                              <h3 className="font-semibold">{cert.curso}</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Instituição</p>
                                <p className="font-medium">{cert.instituicao}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Conclusão</p>
                                <p className="font-medium">
                                  {format(new Date(cert.dataConclusao), 'dd/MM/yyyy')}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Carga Horária</p>
                                <p className="font-medium">{cert.cargaHoraria}</p>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Certificado
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Avaliações */}
          <TabsContent value="avaliacoes">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Avaliações de Desempenho</CardTitle>
                <CardDescription>Resultados das avaliações anuais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {avaliacoes.map((aval) => (
                    <Card key={aval.id} className="border">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{aval.tipo}</h3>
                                <p className="text-sm text-muted-foreground">Período: {aval.periodo}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Pontuação</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-2xl font-bold text-primary">{aval.pontuacao}</p>
                                  <span className="text-muted-foreground">/ 5.0</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant="default" className="mt-1">
                                  {aval.status}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Data</p>
                                <p className="font-medium">
                                  {format(new Date(aval.data), 'dd/MM/yyyy')}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Relatório
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }
