import { ArrowLeft, Plus, Search, Filter, FileCheck } from "lucide-react";
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

interface ElaboracaoAcordaoProps {
  onBack: () => void;
}

export const ElaboracaoAcordao = ({ onBack }: ElaboracaoAcordaoProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const acordaos = [
    { numero: "PAM/2024/004", entidade: "Empresa W", dataElaboracao: "10/11/2024", juizRelator: "Dr. António Costa", status: "Elaborado" },
    { numero: "PAM/2024/002", entidade: "Instituto Y", dataElaboracao: "-", juizRelator: "Dr. João Silva", status: "Pendente" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Sucesso",
      description: "Acórdão elaborado e enviado para aprovação",
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
              <FileCheck className="h-8 w-8 text-primary" />
              Elaboração de Acórdão
            </h1>
            <p className="text-muted-foreground">Elaboração e aprovação de acórdãos pela 2ª Câmara</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Elaborar Acórdão
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Elaborar Acórdão</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="processo">Número do Processo</Label>
                <Input id="processo" placeholder="PAM/2024/XXX" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataAudiencia">Data da Audiência</Label>
                  <Input id="dataAudiencia" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataElaboracao">Data de Elaboração</Label>
                  <Input id="dataElaboracao" type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="juizRelator">Juiz Relator</Label>
                <Input id="juizRelator" placeholder="Nome do Juiz Relator" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="decisao">Decisão</Label>
                <Select required>
                  <SelectTrigger id="decisao">
                    <SelectValue placeholder="Selecione a decisão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="condenacao">Condenação</SelectItem>
                    <SelectItem value="absolvicao">Absolvição</SelectItem>
                    <SelectItem value="parcial">Condenação Parcial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundamentacao">Fundamentação</Label>
                <Textarea id="fundamentacao" placeholder="Fundamentação legal e factual da decisão..." rows={6} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alegoesMP">Resumo das Alegações do MP</Label>
                <Textarea id="alegoesMP" placeholder="Resumo das alegações do Ministério Público..." rows={4} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alegoesDemandado">Resumo das Alegações do Demandado</Label>
                <Textarea id="alegoesDemandado" placeholder="Resumo das alegações do demandado..." rows={4} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorCondenacao">Valor da Condenação (Kz)</Label>
                <Input id="valorCondenacao" type="number" placeholder="0.00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dispositivo">Dispositivo</Label>
                <Textarea id="dispositivo" placeholder="Decisão final e dispositivo do acórdão..." rows={4} required />
              </div>

              <div className="bg-muted p-4 rounded-md space-y-2">
                <p className="text-sm font-medium">Próximas Etapas</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Vista aos Conselheiros da 2ª Câmara para apreciação</li>
                  <li>Aprovação e assinatura pelos Conselheiros presentes</li>
                  <li>Junção do acórdão assinado aos autos</li>
                  <li>Notificação do acórdão ao demandado e ao MP</li>
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
                <Button type="submit">Elaborar e Enviar para Aprovação</Button>
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
              <TableHead>Juiz Relator</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {acordaos.map((ac) => (
              <TableRow key={ac.numero}>
                <TableCell className="font-medium">{ac.numero}</TableCell>
                <TableCell>{ac.entidade}</TableCell>
                <TableCell>{ac.dataElaboracao}</TableCell>
                <TableCell>{ac.juizRelator}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{ac.status}</Badge>
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
