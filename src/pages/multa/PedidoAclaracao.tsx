import { ArrowLeft, Plus, Search, Filter, HelpCircle } from "lucide-react";
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

interface PedidoAclaracaoProps {
  onBack: () => void;
}

export const PedidoAclaracao = ({ onBack }: PedidoAclaracaoProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const pedidos = [
    { numero: "PAM/2024/004", entidade: "Empresa W", dataPedido: "18/11/2024", requerente: "MP - Dr. Pedro Santos", status: "Deferido" },
    { numero: "PAM/2024/006", entidade: "Instituto M", dataPedido: "20/11/2024", requerente: "Dr. João Lopes (Advogado)", status: "Em Análise" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Sucesso",
      description: "Pedido de aclaração registado e enviado ao Juiz Relator",
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
              <HelpCircle className="h-8 w-8 text-primary" />
              Pedido de Aclaração
            </h1>
            <p className="text-muted-foreground">Reclamações para aclaração ou correção de erros materiais no acórdão</p>
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
              <DialogTitle>Pedido de Aclaração do Acórdão</DialogTitle>
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
                  <Label htmlFor="dataNotificacaoAcordao">Data Notificação Acórdão</Label>
                  <Input id="dataNotificacaoAcordao" type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requerente">Requerente</Label>
                <Input id="requerente" placeholder="Nome do requerente (MP ou Demandado)" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualidadeRequerente">Qualidade</Label>
                <Input id="qualidadeRequerente" placeholder="Ex: Ministério Público, Demandado, Advogado" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoReclamacao">Tipo de Reclamação</Label>
                <Input id="tipoReclamacao" placeholder="Ex: Aclaração, Correção de erro material" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundamentacao">Fundamentação do Pedido</Label>
                <Textarea 
                  id="fundamentacao" 
                  placeholder="Fundamente o pedido de aclaração ou correção, indicando especificamente os pontos que carecem de esclarecimento ou os erros materiais encontrados..." 
                  rows={6} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trechoAcordao">Trecho do Acórdão em Questão</Label>
                <Textarea 
                  id="trechoAcordao" 
                  placeholder="Transcreva o trecho específico do acórdão que carece de aclaração ou contém erro material..." 
                  rows={4} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pedidoEspecifico">Pedido Específico</Label>
                <Textarea 
                  id="pedidoEspecifico" 
                  placeholder="Formule claramente o que pretende que seja aclarado ou corrigido..." 
                  rows={3} 
                  required 
                />
              </div>

              <div className="bg-muted p-4 rounded-md space-y-2">
                <p className="text-sm font-medium">Procedimento</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Pedido apresentado após comunicação do acórdão</li>
                  <li>Pode ser apresentado pelo MP e/ou Demandado</li>
                  <li>Entrada na SG do TC para ser concluso ao Juiz Relator</li>
                  <li>Juiz Relator produz despacho com a aclaração</li>
                  <li>Aclaração é notificada às partes</li>
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
