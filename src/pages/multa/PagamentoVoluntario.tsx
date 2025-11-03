import { ArrowLeft, Plus, Search, Filter, DollarSign } from "lucide-react";
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

interface PagamentoVoluntarioProps {
  onBack: () => void;
}

export const PagamentoVoluntario = ({ onBack }: PagamentoVoluntarioProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const pagamentos = [
    { numero: "PAM/2024/001", entidade: "Empresa Municipal X", valorMulta: "5.000.000 Kz", emolumentos: "150.000 Kz", dataPagamento: "03/11/2024", status: "Pago" },
    { numero: "PAM/2024/003", entidade: "Fundação Z", valorMulta: "2.000.000 Kz", emolumentos: "120.000 Kz", dataPagamento: "-", status: "Aguardando" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Sucesso",
      description: "Pagamento voluntário registado com sucesso",
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
              <DollarSign className="h-8 w-8 text-primary" />
              Pagamento Voluntário
            </h1>
            <p className="text-muted-foreground">Registo de pagamento voluntário de multas e emolumentos</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Registar Pagamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registar Pagamento Voluntário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="processo">Número do Processo</Label>
                <Input id="processo" placeholder="PAM/2024/XXX" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataPagamento">Data de Pagamento</Label>
                  <Input id="dataPagamento" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorMulta">Valor da Multa (Kz)</Label>
                  <Input id="valorMulta" type="number" placeholder="0.00" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emolumentos">Emolumentos (Kz)</Label>
                  <Input id="emolumentos" type="number" placeholder="0.00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorTotal">Valor Total (Kz)</Label>
                  <Input id="valorTotal" type="number" placeholder="0.00" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                <Input id="formaPagamento" placeholder="Ex: Transferência Bancária, Depósito" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comprovativo">Número do Comprovativo</Label>
                <Input id="comprovativo" placeholder="Número da guia/referência" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entidadePagadora">Entidade Pagadora</Label>
                <Input id="entidadePagadora" placeholder="Nome da entidade" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" placeholder="Observações adicionais sobre o pagamento..." rows={3} />
              </div>

              <div className="bg-muted p-4 rounded-md space-y-2">
                <p className="text-sm font-medium">Próximos Passos</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Comprovativo será enviado ao Juiz Relator</li>
                  <li>Abertura de vista ao Ministério Público</li>
                  <li>MP promoverá extinção e arquivamento do processo</li>
                  <li>Processo será arquivado pelo Juiz Relator</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Registar Pagamento</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-l-4 border-l-success">
          <div className="text-2xl font-bold text-success">8</div>
          <div className="text-sm text-muted-foreground uppercase">Pagos Voluntariamente</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-warning">
          <div className="text-2xl font-bold text-warning">3</div>
          <div className="text-sm text-muted-foreground uppercase">Aguardando Pagamento</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="text-2xl font-bold text-primary">45.750.000 Kz</div>
          <div className="text-sm text-muted-foreground uppercase">Total Arrecadado</div>
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
              <TableHead>Valor Multa</TableHead>
              <TableHead>Emolumentos</TableHead>
              <TableHead>Data Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagamentos.map((pag) => (
              <TableRow key={pag.numero}>
                <TableCell className="font-medium">{pag.numero}</TableCell>
                <TableCell>{pag.entidade}</TableCell>
                <TableCell className="font-semibold">{pag.valorMulta}</TableCell>
                <TableCell>{pag.emolumentos}</TableCell>
                <TableCell>{pag.dataPagamento}</TableCell>
                <TableCell>
                  <Badge variant={pag.status === "Pago" ? "default" : "secondary"} className={pag.status === "Pago" ? "bg-success" : ""}>
                    {pag.status}
                  </Badge>
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
