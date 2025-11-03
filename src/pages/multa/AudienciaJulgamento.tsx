import { ArrowLeft, Plus, Search, Filter, Gavel } from "lucide-react";
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

interface AudienciaJulgamentoProps {
  onBack: () => void;
}

export const AudienciaJulgamento = ({ onBack }: AudienciaJulgamentoProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const audiencias = [
    { numero: "PAM/2024/002", entidade: "Instituto Y", dataAudiencia: "15/11/2024", presidente: "Presidente 2ª Câmara", status: "Agendada" },
    { numero: "PAM/2024/004", entidade: "Empresa W", dataAudiencia: "08/11/2024", presidente: "Presidente 2ª Câmara", status: "Realizada" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Sucesso",
      description: "Audiência de julgamento agendada com sucesso",
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
              <Gavel className="h-8 w-8 text-primary" />
              Audiência de Julgamento
            </h1>
            <p className="text-muted-foreground">Agendamento e registo de audiências de julgamento - Presidida pelo Presidente da 2ª Câmara</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Agendar Audiência
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agendar Audiência de Julgamento</DialogTitle>
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
                  <Label htmlFor="horaAudiencia">Hora</Label>
                  <Input id="horaAudiencia" type="time" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="local">Local</Label>
                <Input id="local" defaultValue="Sala de Audiências - 2ª Câmara" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="presidente">Presidente</Label>
                <Input id="presidente" defaultValue="Presidente da 2ª Câmara" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="juizRelator">Juiz Relator</Label>
                <Input id="juizRelator" placeholder="Nome do Juiz Relator" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="representanteMP">Representante do Ministério Público</Label>
                <Input id="representanteMP" placeholder="Nome do representante do MP" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="advogadoDemandado">Advogado do Demandado</Label>
                <Input id="advogadoDemandado" placeholder="Nome do advogado" />
              </div>

              <div className="bg-muted p-4 rounded-md space-y-2">
                <p className="text-sm font-medium">Regras da Audiência</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Presidida pelo Presidente da 2ª Câmara</li>
                  <li>Presença obrigatória: Representante do MP e Advogados dos Demandados</li>
                  <li>Duração das alegações orais: máximo 20 minutos</li>
                  <li>Não há direito à resposta</li>
                  <li>É dispensada a vista</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label>Após a Audiência</Label>
                <Textarea 
                  value="Após proferidas as alegações e contra-alegações, o Juiz relator elabora o acórdão no prazo legal e ordena que seja dada vista aos Conselheiros para apreciação, aprovação e assinatura pela 2ª Câmara."
                  disabled
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" placeholder="Observações adicionais..." rows={3} />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Agendar Audiência</Button>
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
              <TableHead>Data Audiência</TableHead>
              <TableHead>Presidente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audiencias.map((aud) => (
              <TableRow key={aud.numero}>
                <TableCell className="font-medium">{aud.numero}</TableCell>
                <TableCell>{aud.entidade}</TableCell>
                <TableCell>{aud.dataAudiencia}</TableCell>
                <TableCell>{aud.presidente}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{aud.status}</Badge>
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
