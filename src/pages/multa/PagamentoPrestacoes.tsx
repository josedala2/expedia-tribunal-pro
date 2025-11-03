import { ArrowLeft, Plus, Search, Filter, Calendar } from "lucide-react";
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

interface PagamentoPrestacoesProps {
  onBack: () => void;
}

export const PagamentoPrestacoes = ({ onBack }: PagamentoPrestacoesProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const pedidos = [
    { numero: "PAM/2024/005", entidade: "Empresa K", valorTotal: "12.000.000 Kz", prestacoes: "6x", periodicidade: "Trimestral", status: "Aprovado" },
    { numero: "PAM/2024/007", entidade: "Instituto L", valorTotal: "8.000.000 Kz", prestacoes: "4x", periodicidade: "Trimestral", status: "Em Análise" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Sucesso",
      description: "Pedido de pagamento em prestações registado",
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
              <Calendar className="h-8 w-8 text-primary" />
              Pagamento em Prestações
            </h1>
            <p className="text-muted-foreground">Pedidos de pagamento parcelado - Até 6 prestações trimestrais</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Novo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pedido de Pagamento em Prestações</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="processo">Número do Processo</Label>
                <Input id="processo" placeholder="PAM/2024/XXX" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataPedido">Data do Pedido</Label>
                  <Input id="dataPedido" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataAcordao">Data do Acórdão</Label>
                  <Input id="dataAcordao" type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="demandado">Demandado</Label>
                <Input id="demandado" placeholder="Nome do demandado" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorTotal">Valor Total da Condenação (Kz)</Label>
                  <Input id="valorTotal" type="number" placeholder="0.00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroPrestacoes">Número de Prestações</Label>
                  <Select required>
                    <SelectTrigger id="numeroPrestacoes">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Prestações</SelectItem>
                      <SelectItem value="3">3 Prestações</SelectItem>
                      <SelectItem value="4">4 Prestações</SelectItem>
                      <SelectItem value="5">5 Prestações</SelectItem>
                      <SelectItem value="6">6 Prestações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodicidade">Periodicidade</Label>
                <Select required>
                  <SelectTrigger id="periodicidade">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="semestral">Semestral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataPrimeiraPrestacao">Data da Primeira Prestação</Label>
                <Input id="dataPrimeiraPrestacao" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="justificacao">Justificação do Pedido</Label>
                <Textarea id="justificacao" placeholder="Justifique o pedido de pagamento parcelado..." rows={4} required />
              </div>

              <div className="bg-muted p-4 rounded-md space-y-2">
                <p className="text-sm font-medium">Condições Importantes</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Máximo de 6 prestações trimestrais</li>
                  <li>Cada prestação deve incluir juros de mora (se aplicável)</li>
                  <li>Pedido deve ser feito até ao trânsito em julgado do acórdão</li>
                  <li>Falta de pagamento de qualquer prestação = vencimento imediato das restantes</li>
                  <li>Prazo total de pagamento não pode ultrapassar 3 anos</li>
                  <li>Pedido deve ser dado entrada na SG e concluso ao Juiz Relator</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" placeholder="Observações adicionais..." rows={2} />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Registar Pedido</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="text-2xl font-bold text-primary">5</div>
          <div className="text-sm text-muted-foreground uppercase">Pedidos Ativos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-success">
          <div className="text-2xl font-bold text-success">12</div>
          <div className="text-sm text-muted-foreground uppercase">Prestações em Dia</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-destructive">
          <div className="text-2xl font-bold text-destructive">2</div>
          <div className="text-sm text-muted-foreground uppercase">Prestações Atrasadas</div>
        </Card>
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
              <TableHead>Valor Total</TableHead>
              <TableHead>Prestações</TableHead>
              <TableHead>Periodicidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((ped) => (
              <TableRow key={ped.numero}>
                <TableCell className="font-medium">{ped.numero}</TableCell>
                <TableCell>{ped.entidade}</TableCell>
                <TableCell className="font-semibold">{ped.valorTotal}</TableCell>
                <TableCell>{ped.prestacoes}</TableCell>
                <TableCell>{ped.periodicidade}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{ped.status}</Badge>
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
