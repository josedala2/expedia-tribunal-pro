import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { EntitySelector } from "@/components/ui/entity-selector";

interface AnaliseDecisao {
  id: string;
  numeroProcesso: string;
  entidade: string;
  dataAnalise: string;
  juizRelator: string;
  decisao: "Aprovado" | "Rejeitado" | "Diligência" | "Pendente";
  fundamentacao: string;
  observacoes: string;
}

export default function AnaliseDecisaoFinalJuizRelator() {
  const [analises, setAnalises] = useState<AnaliseDecisao[]>([
    {
      id: "1",
      numeroProcesso: "PC/2024/001",
      entidade: "Ministério da Saúde",
      dataAnalise: "2024-01-15",
      juizRelator: "Dr. João Silva",
      decisao: "Aprovado",
      fundamentacao: "Decisão fundamentada conforme análise técnica",
      observacoes: "Processo analisado e aprovado sem restrições"
    }
  ]);

  const [filtroProcesso, setFiltroProcesso] = useState("");
  const [filtroDecisao, setFiltroDecisao] = useState("");
  const [novaAnalise, setNovaAnalise] = useState({
    numeroProcesso: "",
    entidade: "",
    dataAnalise: "",
    juizRelator: "",
    decisao: "" as AnaliseDecisao["decisao"],
    fundamentacao: "",
    observacoes: ""
  });
  const [dialogAberto, setDialogAberto] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const analise: AnaliseDecisao = {
      id: String(analises.length + 1),
      ...novaAnalise
    };
    setAnalises([...analises, analise]);
    setNovaAnalise({
      numeroProcesso: "",
      entidade: "",
      dataAnalise: "",
      juizRelator: "",
      decisao: "" as AnaliseDecisao["decisao"],
      fundamentacao: "",
      observacoes: ""
    });
    setDialogAberto(false);
    toast.success("Análise e Decisão Final registrada com sucesso!");
  };

  const analisesFiltered = analises.filter(a => 
    a.numeroProcesso.toLowerCase().includes(filtroProcesso.toLowerCase()) &&
    (filtroDecisao === "" || a.decisao === filtroDecisao)
  );

  const getDecisaoBadge = (decisao: AnaliseDecisao["decisao"]) => {
    const variants = {
      "Aprovado": "default",
      "Rejeitado": "destructive",
      "Diligência": "secondary",
      "Pendente": "outline"
    };
    return <Badge variant={variants[decisao] as any}>{decisao}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Análise e Decisão Final do Juiz Relator</h1>
        <p className="text-muted-foreground mt-2">
          Registre e acompanhe as análises e decisões finais do Juiz Relator nos processos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
          <CardDescription>Estatísticas das análises e decisões</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{analises.length}</p>
            </div>
            <div className="p-4 bg-green-500/5 rounded-lg">
              <p className="text-sm text-muted-foreground">Aprovados</p>
              <p className="text-2xl font-bold text-green-600">
                {analises.filter(a => a.decisao === "Aprovado").length}
              </p>
            </div>
            <div className="p-4 bg-red-500/5 rounded-lg">
              <p className="text-sm text-muted-foreground">Rejeitados</p>
              <p className="text-2xl font-bold text-red-600">
                {analises.filter(a => a.decisao === "Rejeitado").length}
              </p>
            </div>
            <div className="p-4 bg-yellow-500/5 rounded-lg">
              <p className="text-sm text-muted-foreground">Diligências</p>
              <p className="text-2xl font-bold text-yellow-600">
                {analises.filter(a => a.decisao === "Diligência").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Análises e Decisões</CardTitle>
              <CardDescription>Lista de todas as análises registradas</CardDescription>
            </div>
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Análise
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Registrar Análise e Decisão Final</DialogTitle>
                  <DialogDescription>
                    Preencha os dados da análise e decisão do Juiz Relator
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numeroProcesso">Número do Processo</Label>
                      <Input
                        id="numeroProcesso"
                        value={novaAnalise.numeroProcesso}
                        onChange={(e) => setNovaAnalise({...novaAnalise, numeroProcesso: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <EntitySelector
                        value={novaAnalise.entidade}
                        onChange={(value) => setNovaAnalise({...novaAnalise, entidade: value})}
                        label="Entidade"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataAnalise">Data da Análise</Label>
                      <Input
                        id="dataAnalise"
                        type="date"
                        value={novaAnalise.dataAnalise}
                        onChange={(e) => setNovaAnalise({...novaAnalise, dataAnalise: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="juizRelator">Juiz Relator</Label>
                      <Input
                        id="juizRelator"
                        value={novaAnalise.juizRelator}
                        onChange={(e) => setNovaAnalise({...novaAnalise, juizRelator: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="decisao">Decisão</Label>
                    <Select
                      value={novaAnalise.decisao}
                      onValueChange={(value) => setNovaAnalise({...novaAnalise, decisao: value as AnaliseDecisao["decisao"]})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a decisão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aprovado">Aprovado</SelectItem>
                        <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                        <SelectItem value="Diligência">Diligência</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundamentacao">Fundamentação da Decisão</Label>
                    <Textarea
                      id="fundamentacao"
                      value={novaAnalise.fundamentacao}
                      onChange={(e) => setNovaAnalise({...novaAnalise, fundamentacao: e.target.value})}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={novaAnalise.observacoes}
                      onChange={(e) => setNovaAnalise({...novaAnalise, observacoes: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogAberto(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Registrar Análise</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número do processo..."
                  value={filtroProcesso}
                  onChange={(e) => setFiltroProcesso(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filtroDecisao} onValueChange={setFiltroDecisao}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por decisão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                <SelectItem value="Diligência">Diligência</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Processo</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Juiz Relator</TableHead>
                  <TableHead>Decisão</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analisesFiltered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhuma análise encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  analisesFiltered.map((analise) => (
                    <TableRow key={analise.id}>
                      <TableCell className="font-medium">{analise.numeroProcesso}</TableCell>
                      <TableCell>{analise.entidade}</TableCell>
                      <TableCell>{new Date(analise.dataAnalise).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{analise.juizRelator}</TableCell>
                      <TableCell>{getDecisaoBadge(analise.decisao)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
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
    </div>
  );
}
