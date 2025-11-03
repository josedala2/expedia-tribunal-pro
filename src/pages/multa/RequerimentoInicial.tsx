import { ArrowLeft, Plus, Search, Filter, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface RequerimentoInicialProps {
  onBack: () => void;
}

export const RequerimentoInicial = ({ onBack }: RequerimentoInicialProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const requerimentos = [
    { numero: "PAM/2024/001", entidade: "Empresa Municipal X", dataElaboracao: "20/10/2024", elaborador: "MP - Dr. Pedro Santos", status: "Elaborado" },
    { numero: "PAM/2024/002", entidade: "Instituto Y", dataElaboracao: "15/10/2024", elaborador: "MP - Dra. Ana Silva", status: "Em Análise" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Sucesso",
      description: "Requerimento inicial elaborado com sucesso",
    });
    setOpen(false);
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
              Requerimento Inicial - MP
            </h1>
            <p className="text-muted-foreground">Elaboração do requerimento inicial pelo Ministério Público</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Novo Requerimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Elaborar Requerimento Inicial</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="processo">Número do Processo</Label>
                <Input id="processo" placeholder="PAM/2024/XXX" required />
              </div>

              <div className="space-y-2">
                <Label>Identificação do Demandado</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeDemandado">Nome Completo</Label>
                    <Input id="nomeDemandado" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="residencia">Residência</Label>
                    <Input id="residencia" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="localTrabalho">Local de Trabalho</Label>
                    <Input id="localTrabalho" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="funcaoDemandado">Função</Label>
                    <Input id="funcaoDemandado" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remuneracao">Remuneração</Label>
                  <Input id="remuneracao" type="number" placeholder="0.00 Kz" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="razoesFacto">Razões de Facto</Label>
                <Textarea id="razoesFacto" placeholder="Descreva de forma articulada as razões de facto..." rows={4} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="razoesDireito">Razões de Direito</Label>
                <Textarea id="razoesDireito" placeholder="Descreva de forma articulada as razões de direito..." rows={4} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pedido">Formulação do Pedido</Label>
                <Textarea id="pedido" placeholder="Formule o pedido..." rows={3} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="montanteRepor">Montante a Repor/Pagar (Kz)</Label>
                  <Input id="montanteRepor" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="montanteMulta">Montante da Multa (Kz)</Label>
                  <Input id="montanteMulta" type="number" placeholder="0.00" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provas">Provas Apresentadas</Label>
                <Textarea id="provas" placeholder="Liste as provas apresentadas (máximo 3 testemunhas por facto)..." rows={3} />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Elaborar Requerimento</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar por número ou entidade..." className="pl-9" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Processo</TableHead>
              <TableHead>Entidade</TableHead>
              <TableHead>Data Elaboração</TableHead>
              <TableHead>Elaborado Por</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requerimentos.map((req) => (
              <TableRow key={req.numero}>
                <TableCell className="font-medium">{req.numero}</TableCell>
                <TableCell>{req.entidade}</TableCell>
                <TableCell>{req.dataElaboracao}</TableCell>
                <TableCell>{req.elaborador}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{req.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
