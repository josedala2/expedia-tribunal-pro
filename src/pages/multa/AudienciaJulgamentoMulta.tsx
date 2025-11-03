import { ArrowLeft, Users, Calendar, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AudienciaJulgamentoMultaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const AudienciaJulgamentoMulta = ({ onBack }: AudienciaJulgamentoMultaProps) => {
  const { toast } = useToast();

  const audienciasAgendadas = [
    { numero: "PM/2024/001", demandado: "João Silva", data: "2024-11-15", hora: "10:00", presidente: "Conselheiro Dr. Manuel Costa", status: "Agendada" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Audiência de Julgamento
          </h1>
          <p className="text-muted-foreground">Presidida pelo Presidente da 2ª Câmara (alegações máx. 20 minutos)</p>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Audiências Agendadas</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Processo</TableHead>
              <TableHead>Demandado</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Presidente</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audienciasAgendadas.map((audiencia) => (
              <TableRow key={audiencia.numero}>
                <TableCell className="font-medium">{audiencia.numero}</TableCell>
                <TableCell>{audiencia.demandado}</TableCell>
                <TableCell>{audiencia.data}</TableCell>
                <TableCell>{audiencia.hora}</TableCell>
                <TableCell>{audiencia.presidente}</TableCell>
                <TableCell><Badge className="bg-success">{audiencia.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
