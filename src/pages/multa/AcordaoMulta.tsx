import { ArrowLeft, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AcordaoMultaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const AcordaoMulta = ({ onBack }: AcordaoMultaProps) => {
  const acordaos = [
    { numero: "PM/2024/001", demandado: "João Silva", dataJulgamento: "2024-11-15", decisao: "Condenação", valorMulta: "5.000.000 Kz", status: "Vista aos Conselheiros" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Gavel className="h-8 w-8 text-primary" />
            Resolução/Acórdão
          </h1>
          <p className="text-muted-foreground">Elaboração e assinatura pela 2ª Câmara</p>
        </div>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Processo</TableHead>
              <TableHead>Demandado</TableHead>
              <TableHead>Data Julgamento</TableHead>
              <TableHead>Decisão</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {acordaos.map((acordao) => (
              <TableRow key={acordao.numero}>
                <TableCell className="font-medium">{acordao.numero}</TableCell>
                <TableCell>{acordao.demandado}</TableCell>
                <TableCell>{acordao.dataJulgamento}</TableCell>
                <TableCell><Badge variant="destructive">{acordao.decisao}</Badge></TableCell>
                <TableCell className="font-bold">{acordao.valorMulta}</TableCell>
                <TableCell><Badge variant="secondary">{acordao.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
