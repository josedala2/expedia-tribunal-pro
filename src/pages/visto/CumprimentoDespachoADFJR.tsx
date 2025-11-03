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
import { Plus, Search, Eye, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { EntitySelector } from "@/components/ui/entity-selector";

interface CumprimentoDespacho {
  id: string;
  numeroProcesso: string;
  entidade: string;
  numeroDespacho: string;
  dataDespacho: string;
  dataCumprimento: string;
  responsavel: string;
  status: "Cumprido" | "Pendente" | "Parcial" | "Não Cumprido";
  descricaoDespacho: string;
  acoesTomadas: string;
  observacoes: string;
}

export default function CumprimentoDespachoADFJR() {
  const [cumprimentos, setCumprimentos] = useState<CumprimentoDespacho[]>([
    {
      id: "1",
      numeroProcesso: "PC/2024/001",
      entidade: "Ministério da Saúde",
      numeroDespacho: "ADFJR/001/2024",
      dataDespacho: "2024-01-10",
      dataCumprimento: "2024-01-15",
      responsavel: "Maria Santos",
      status: "Cumprido",
      descricaoDespacho: "Apresentar documentação complementar",
      acoesTomadas: "Documentação apresentada conforme solicitado",
      observacoes: "Cumprimento total do despacho"
    }
  ]);

  const [filtroProcesso, setFiltroProcesso] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [novoCumprimento, setNovoCumprimento] = useState({
    numeroProcesso: "",
    entidade: "",
    numeroDespacho: "",
    dataDespacho: "",
    dataCumprimento: "",
    responsavel: "",
    status: "" as CumprimentoDespacho["status"],
    descricaoDespacho: "",
    acoesTomadas: "",
    observacoes: ""
  });
  const [dialogAberto, setDialogAberto] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cumprimento: CumprimentoDespacho = {
      id: String(cumprimentos.length + 1),
      ...novoCumprimento
    };
    setCumprimentos([...cumprimentos, cumprimento]);
    setNovoCumprimento({
      numeroProcesso: "",
      entidade: "",
      numeroDespacho: "",
      dataDespacho: "",
      dataCumprimento: "",
      responsavel: "",
      status: "" as CumprimentoDespacho["status"],
      descricaoDespacho: "",
      acoesTomadas: "",
      observacoes: ""
    });
    setDialogAberto(false);
    toast.success("Cumprimento de Despacho registrado com sucesso!");
  };

  const cumprimentosFiltered = cumprimentos.filter(c => 
    c.numeroProcesso.toLowerCase().includes(filtroProcesso.toLowerCase()) &&
    (filtroStatus === "" || c.status === filtroStatus)
  );

  const getStatusBadge = (status: CumprimentoDespacho["status"]) => {
    const variants = {
      "Cumprido": "default",
      "Pendente": "outline",
      "Parcial": "secondary",
      "Não Cumprido": "destructive"
    };
    return <Badge variant={variants[status] as any}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cumprimento do Despacho da ADFJR</h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe e registre o cumprimento dos despachos da Análise e Decisão Final do Juiz Relator
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
          <CardDescription>Estatísticas de cumprimento dos despachos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{cumprimentos.length}</p>
            </div>
            <div className="p-4 bg-green-500/5 rounded-lg">
              <p className="text-sm text-muted-foreground">Cumpridos</p>
              <p className="text-2xl font-bold text-green-600">
                {cumprimentos.filter(c => c.status === "Cumprido").length}
              </p>
            </div>
            <div className="p-4 bg-yellow-500/5 rounded-lg">
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {cumprimentos.filter(c => c.status === "Pendente").length}
              </p>
            </div>
            <div className="p-4 bg-red-500/5 rounded-lg">
              <p className="text-sm text-muted-foreground">Não Cumpridos</p>
              <p className="text-2xl font-bold text-red-600">
                {cumprimentos.filter(c => c.status === "Não Cumprido").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Cumprimento de Despachos</CardTitle>
              <CardDescription>Lista de todos os cumprimentos registrados</CardDescription>
            </div>
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cumprimento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Registrar Cumprimento de Despacho</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do cumprimento do despacho da ADFJR
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numeroProcesso">Número do Processo</Label>
                      <Input
                        id="numeroProcesso"
                        value={novoCumprimento.numeroProcesso}
                        onChange={(e) => setNovoCumprimento({...novoCumprimento, numeroProcesso: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <EntitySelector
                        value={novoCumprimento.entidade}
                        onChange={(value) => setNovoCumprimento({...novoCumprimento, entidade: value})}
                        label="Entidade"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numeroDespacho">Número do Despacho</Label>
                      <Input
                        id="numeroDespacho"
                        value={novoCumprimento.numeroDespacho}
                        onChange={(e) => setNovoCumprimento({...novoCumprimento, numeroDespacho: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataDespacho">Data do Despacho</Label>
                      <Input
                        id="dataDespacho"
                        type="date"
                        value={novoCumprimento.dataDespacho}
                        onChange={(e) => setNovoCumprimento({...novoCumprimento, dataDespacho: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataCumprimento">Data do Cumprimento</Label>
                      <Input
                        id="dataCumprimento"
                        type="date"
                        value={novoCumprimento.dataCumprimento}
                        onChange={(e) => setNovoCumprimento({...novoCumprimento, dataCumprimento: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsavel">Responsável</Label>
                      <Input
                        id="responsavel"
                        value={novoCumprimento.responsavel}
                        onChange={(e) => setNovoCumprimento({...novoCumprimento, responsavel: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={novoCumprimento.status}
                      onValueChange={(value) => setNovoCumprimento({...novoCumprimento, status: value as CumprimentoDespacho["status"]})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cumprido">Cumprido</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Parcial">Parcial</SelectItem>
                        <SelectItem value="Não Cumprido">Não Cumprido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricaoDespacho">Descrição do Despacho</Label>
                    <Textarea
                      id="descricaoDespacho"
                      value={novoCumprimento.descricaoDespacho}
                      onChange={(e) => setNovoCumprimento({...novoCumprimento, descricaoDespacho: e.target.value})}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="acoesTomadas">Ações Tomadas</Label>
                    <Textarea
                      id="acoesTomadas"
                      value={novoCumprimento.acoesTomadas}
                      onChange={(e) => setNovoCumprimento({...novoCumprimento, acoesTomadas: e.target.value})}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={novoCumprimento.observacoes}
                      onChange={(e) => setNovoCumprimento({...novoCumprimento, observacoes: e.target.value})}
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogAberto(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Registrar Cumprimento</Button>
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
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Cumprido">Cumprido</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Parcial">Parcial</SelectItem>
                <SelectItem value="Não Cumprido">Não Cumprido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Processo</TableHead>
                  <TableHead>Nº Despacho</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Data Despacho</TableHead>
                  <TableHead>Data Cumprimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cumprimentosFiltered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Nenhum cumprimento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  cumprimentosFiltered.map((cumprimento) => (
                    <TableRow key={cumprimento.id}>
                      <TableCell className="font-medium">{cumprimento.numeroProcesso}</TableCell>
                      <TableCell>{cumprimento.numeroDespacho}</TableCell>
                      <TableCell>{cumprimento.entidade}</TableCell>
                      <TableCell>{new Date(cumprimento.dataDespacho).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{new Date(cumprimento.dataCumprimento).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{getStatusBadge(cumprimento.status)}</TableCell>
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
