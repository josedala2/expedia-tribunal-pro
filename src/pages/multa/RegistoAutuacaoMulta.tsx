import { ArrowLeft, Plus, Search, Filter, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface RegistoAutuacaoMultaProps {
  onBack: () => void;
}

export const RegistoAutuacaoMulta = ({ onBack }: RegistoAutuacaoMultaProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const registos = [
    { numero: "PAM/2024/001", entidade: "Empresa Municipal X", dataRegisto: "15/10/2024", responsavel: "Dr. João Silva", status: "Registado" },
    { numero: "PAM/2024/002", entidade: "Instituto Y", dataRegisto: "10/10/2024", responsavel: "Dra. Maria Costa", status: "Autuado" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Sucesso",
      description: "Registo e autuação criado com sucesso",
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
              Registo e Autuação - Processo de Multa
            </h1>
            <p className="text-muted-foreground">Registo inicial e autuação do processo autónomo de multa</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Novo Registo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Registo e Autuação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número do Processo</Label>
                  <Input id="numero" placeholder="PAM/2024/XXX" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataRegisto">Data de Registo</Label>
                  <Input id="dataRegisto" type="date" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entidade">Entidade Demandada</Label>
                <Input id="entidade" placeholder="Nome da entidade" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input id="responsavel" placeholder="Nome do responsável" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="funcao">Função</Label>
                  <Input id="funcao" placeholder="Função exercida" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="infracoes">Infrações Identificadas</Label>
                <Textarea id="infracoes" placeholder="Descreva as infrações financeiras identificadas..." rows={4} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorMulta">Valor da Multa (Kz)</Label>
                <Input id="valorMulta" type="number" placeholder="0.00" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" placeholder="Observações adicionais..." rows={3} />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Registar</Button>
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
              <TableHead>Data Registo</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registos.map((registo) => (
              <TableRow key={registo.numero}>
                <TableCell className="font-medium">{registo.numero}</TableCell>
                <TableCell>{registo.entidade}</TableCell>
                <TableCell>{registo.dataRegisto}</TableCell>
                <TableCell>{registo.responsavel}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{registo.status}</Badge>
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
