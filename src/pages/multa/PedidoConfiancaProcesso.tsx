import { ArrowLeft, Plus, Search, Filter, Eye } from "lucide-react";
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

interface PedidoConfiancaProcessoProps {
  onBack: () => void;
}

export const PedidoConfiancaProcesso = ({ onBack }: PedidoConfiancaProcessoProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const pedidos = [
    { numero: "PAM/2024/002", entidade: "Instituto Y", dataPedido: "10/11/2024", requerente: "Dr. Carlos Santos (Advogado)", status: "Aprovado" },
    { numero: "PAM/2024/004", entidade: "Empresa W", dataPedido: "05/11/2024", requerente: "Eng. Paulo Lima (Demandado)", status: "Em Análise" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Sucesso",
      description: "Pedido de confiança ao processo registado",
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
              <Eye className="h-8 w-8 text-primary" />
              Pedido de Confiança ao Processo
            </h1>
            <p className="text-muted-foreground">Consulta aos autos - Prazo: 5 dias após notificação da audiência</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Novo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Pedido de Confiança ao Processo</DialogTitle>
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
                  <Label htmlFor="dataNotificacaoAudiencia">Data Notificação Audiência</Label>
                  <Input id="dataNotificacaoAudiencia" type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requerente">Requerente</Label>
                <Input id="requerente" placeholder="Nome do requerente (MP, Demandado ou Advogado)" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualidade">Qualidade do Requerente</Label>
                <Input id="qualidade" placeholder="Ex: Ministério Público, Demandado, Advogado" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataConsulta">Data Pretendida para Consulta</Label>
                <Input id="dataConsulta" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorGuia">Valor da Guia (Kz)</Label>
                <Input id="valorGuia" type="number" placeholder="0.00" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comprovanteDepositou">Nº Comprovativo de Pagamento</Label>
                <Input id="comprovanteDepositou" placeholder="Número do comprovativo de depósito" required />
              </div>

              <div className="bg-muted p-4 rounded-md space-y-2">
                <p className="text-sm font-medium">Condições para Consulta</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Pedido deve ser feito no prazo de 5 dias após notificação da audiência</li>
                  <li>Podem consultar: MP, Demandado ou seu Mandatário Judicial</li>
                  <li>Necessário pagamento de guia emitida pelos serviços do TC</li>
                  <li>Depósito na conta do Tribunal indicada na guia</li>
                  <li>Comprovativo deve ser apresentado para efeitos da consulta</li>
                  <li>Pedido deve ser dado entrada na SG e concluso ao Juiz Relator</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="finalidade">Finalidade da Consulta</Label>
                <Textarea id="finalidade" placeholder="Descreva a finalidade da consulta aos autos..." rows={3} required />
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
              <TableHead>Data Pedido</TableHead>
              <TableHead>Requerente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((ped) => (
              <TableRow key={ped.numero}>
                <TableCell className="font-medium">{ped.numero}</TableCell>
                <TableCell>{ped.entidade}</TableCell>
                <TableCell>{ped.dataPedido}</TableCell>
                <TableCell>{ped.requerente}</TableCell>
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
