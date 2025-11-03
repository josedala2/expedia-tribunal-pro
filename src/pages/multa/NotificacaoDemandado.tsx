import { ArrowLeft, Plus, Search, Filter, Bell } from "lucide-react";
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

interface NotificacaoDemandadoProps {
  onBack: () => void;
}

export const NotificacaoDemandado = ({ onBack }: NotificacaoDemandadoProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const notificacoes = [
    { numero: "PAM/2024/001", entidade: "Empresa Municipal X", dataNotificacao: "25/10/2024", prazo: "10 dias (até 04/11/2024)", status: "Notificado" },
    { numero: "PAM/2024/002", entidade: "Instituto Y", dataNotificacao: "20/10/2024", prazo: "10 dias (até 30/10/2024)", status: "Aguardando Resposta" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Sucesso",
      description: "Notificação enviada com sucesso",
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
              <Bell className="h-8 w-8 text-primary" />
              Notificação ao Demandado
            </h1>
            <p className="text-muted-foreground">Notificação para contestar ou pagar voluntariamente - Prazo: 10 dias improrrogáveis</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Nova Notificação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Emitir Notificação ao Demandado</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="processo">Número do Processo</Label>
                <Input id="processo" placeholder="PAM/2024/XXX" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataNotificacao">Data de Notificação</Label>
                  <Input id="dataNotificacao" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prazoResposta">Prazo para Resposta</Label>
                  <Input id="prazoResposta" value="10 dias (improrrogáveis)" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="demandado">Demandado</Label>
                <Input id="demandado" placeholder="Nome do demandado" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="morada">Morada para Notificação</Label>
                <Input id="morada" placeholder="Endereço completo" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorMulta">Valor da Multa (Kz)</Label>
                <Input id="valorMulta" type="number" placeholder="0.00" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emolumentos">Emolumentos (Kz)</Label>
                <Input id="emolumentos" type="number" placeholder="0.00" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="infracoes">Infrações</Label>
                <Textarea id="infracoes" placeholder="Resumo das infrações financeiras..." rows={3} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consequencias">Consequências da Não Resposta</Label>
                <Textarea 
                  id="consequencias" 
                  value="O não pagamento voluntário gera a contagem de juros moratórios, à taxa de juro de 5% ao ano, a partir da data da notificação até o pagamento integral. O prazo para contestar é de 10 dias improrrogáveis."
                  disabled
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="formaNotificacao">Forma de Notificação</Label>
                <Select>
                  <SelectTrigger id="formaNotificacao">
                    <SelectValue placeholder="Selecione a forma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="correio">Correio Registado</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Emitir Notificação</Button>
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
              <TableHead>Data Notificação</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notificacoes.map((not) => (
              <TableRow key={not.numero}>
                <TableCell className="font-medium">{not.numero}</TableCell>
                <TableCell>{not.entidade}</TableCell>
                <TableCell>{not.dataNotificacao}</TableCell>
                <TableCell>{not.prazo}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{not.status}</Badge>
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
