import { ArrowLeft, Plus, Search, Filter, Scale } from "lucide-react";
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

interface ContestacaoMultaProps {
  onBack: () => void;
}

export const ContestacaoMulta = ({ onBack }: ContestacaoMultaProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const contestacoes = [
    { numero: "PAM/2024/002", entidade: "Instituto Y", dataContestacao: "28/10/2024", demandado: "Dr. Carlos Santos", status: "Recebida" },
    { numero: "PAM/2024/004", entidade: "Empresa W", dataContestacao: "01/11/2024", demandado: "Eng. Paulo Lima", status: "Em Análise" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Sucesso",
      description: "Contestação registada com sucesso",
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
              <Scale className="h-8 w-8 text-primary" />
              Pedido de Contestação
            </h1>
            <p className="text-muted-foreground">Registo de contestações dos demandados - Prazo: 10 dias improrrogáveis</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Registar Contestação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registar Pedido de Contestação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="processo">Número do Processo</Label>
                <Input id="processo" placeholder="PAM/2024/XXX" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataContestacao">Data da Contestação</Label>
                  <Input id="dataContestacao" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prazoNotificacao">Prazo desde Notificação</Label>
                  <Input id="prazoNotificacao" placeholder="Dias decorridos" type="number" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="demandado">Demandado</Label>
                <Input id="demandado" placeholder="Nome do demandado" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="advogado">Advogado Constituído</Label>
                <Input id="advogado" placeholder="Nome do advogado (opcional)" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundamentoContestacao">Fundamento da Contestação</Label>
                <Textarea id="fundamentoContestacao" placeholder="Descreva os fundamentos de facto e de direito da contestação..." rows={5} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provasContestacao">Provas Apresentadas</Label>
                <Textarea id="provasContestacao" placeholder="Liste as provas apresentadas pelo demandado..." rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pedidoContestacao">Pedido</Label>
                <Textarea id="pedidoContestacao" placeholder="Formule o pedido da contestação..." rows={3} required />
              </div>

              <div className="bg-muted p-4 rounded-md space-y-2">
                <p className="text-sm font-medium">Observações Importantes</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Prazo de 10 dias improrrogáveis desde a notificação</li>
                  <li>O não pagamento voluntário gera juros moratórios à taxa de 5% ao ano</li>
                  <li>Não é admissível prova pericial nem intervenção de técnicos especializados</li>
                  <li>Após recebida, os autos vão conclusos ao Juiz Relator para marcação de audiência</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Registar Contestação</Button>
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
              <TableHead>Data Contestação</TableHead>
              <TableHead>Demandado</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contestacoes.map((cont) => (
              <TableRow key={cont.numero}>
                <TableCell className="font-medium">{cont.numero}</TableCell>
                <TableCell>{cont.entidade}</TableCell>
                <TableCell>{cont.dataContestacao}</TableCell>
                <TableCell>{cont.demandado}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{cont.status}</Badge>
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
