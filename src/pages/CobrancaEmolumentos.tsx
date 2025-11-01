import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Download, Trash2, Calculator } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { GuiaCobrancaTemplate } from "@/components/documents/GuiaCobrancaTemplate";

interface GuiaCobranca {
  id: string;
  numero: string;
  processo: string;
  entidade: string;
  nif: string;
  tipo: "Visto Concedido" | "Visto Recusado" | "Visto Tácito";
  valorContrato: number;
  emolumentos: number;
  status: "Pendente" | "Pago" | "Vencido";
  dataEmissao: Date;
  dataVencimento: Date;
}

interface CobrancaEmolumentosProps {
  onNavigate?: (view: string) => void;
}

export default function CobrancaEmolumentos({ onNavigate }: CobrancaEmolumentosProps) {
  const [guias] = useState<GuiaCobranca[]>([
    {
      id: "1",
      numero: "GC-2024-001",
      processo: "PV-2024-0123",
      entidade: "Ministério da Educação",
      nif: "5000000000",
      tipo: "Visto Concedido",
      valorContrato: 50000000,
      emolumentos: 500000,
      status: "Pago",
      dataEmissao: new Date(2024, 0, 15),
      dataVencimento: new Date(2024, 1, 15),
    },
    {
      id: "2",
      numero: "GC-2024-002",
      processo: "PV-2024-0124",
      entidade: "Instituto Nacional de Saúde",
      nif: "5000000001",
      tipo: "Visto Recusado",
      valorContrato: 30000000,
      emolumentos: 150000,
      status: "Pendente",
      dataEmissao: new Date(2024, 1, 1),
      dataVencimento: new Date(2024, 2, 1),
    },
  ]);

  const [selectedGuia, setSelectedGuia] = useState<GuiaCobranca | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const statusColors = {
    Pendente: "bg-yellow-500",
    Pago: "bg-green-500",
    Vencido: "bg-red-500",
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value);
  };

  const handleView = (guia: GuiaCobranca) => {
    setSelectedGuia(guia);
    setShowViewer(true);
    toast.info(`Visualizando guia ${guia.numero}`);
  };

  const handleDownload = (numero: string) => {
    toast.success(`Download da guia ${numero} iniciado`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      toast.success(`Guia eliminada com sucesso`);
      setDeleteId(null);
    }
  };

  const handleNovaGuia = () => {
    if (onNavigate) {
      onNavigate("nova-guia-cobranca");
    }
  };

  const handleCalcular = () => {
    toast.info("Calculando emolumentos automaticamente");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cobrança de Emolumentos</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de guias de cobrança e emolumentos devidos
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCalcular} variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            Calcular Emolumentos
          </Button>
          <Button onClick={handleNovaGuia}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Guia
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regras de Emolumentos</CardTitle>
          <CardDescription>
            Informações sobre o cálculo de emolumentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Visto Concedido</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Máximo: 1% do valor do contrato</li>
                <li>• Pagamento no 1º pagamento da entidade contratante</li>
                <li>• Responsável: Entidade contratada</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Visto Recusado/Tácito</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Mínimo: ½ do salário mínimo da função pública</li>
                <li>• Sempre devido o mínimo</li>
                <li>• Responsável: Entidade pública contratante</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Guias de Cobrança</CardTitle>
          <CardDescription>
            Lista de todas as guias de cobrança emitidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="p-3 text-left text-sm font-semibold">Nº Guia</th>
                  <th className="p-3 text-left text-sm font-semibold">Processo</th>
                  <th className="p-3 text-left text-sm font-semibold">Entidade</th>
                  <th className="p-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="p-3 text-right text-sm font-semibold">Emolumentos</th>
                  <th className="p-3 text-center text-sm font-semibold">Status</th>
                  <th className="p-3 text-center text-sm font-semibold">Vencimento</th>
                  <th className="p-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {guias.map((guia) => (
                  <tr key={guia.id} className="border-b hover:bg-muted/30">
                    <td className="p-3 text-sm font-medium">{guia.numero}</td>
                    <td className="p-3 text-sm">{guia.processo}</td>
                    <td className="p-3 text-sm">{guia.entidade}</td>
                    <td className="p-3 text-sm">
                      <Badge variant="outline">{guia.tipo}</Badge>
                    </td>
                    <td className="p-3 text-sm text-right font-medium">
                      {formatCurrency(guia.emolumentos)}
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={statusColors[guia.status]}>
                        {guia.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-center">
                      {format(guia.dataVencimento, "dd/MM/yyyy")}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(guia)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(guia.numero)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(guia.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedGuia && (
        <DocumentViewer
          isOpen={showViewer}
          onClose={() => setShowViewer(false)}
          title={`Guia de Cobrança - ${selectedGuia.numero}`}
        >
          <GuiaCobrancaTemplate
            data={{
              numero: selectedGuia.numero,
              processo: selectedGuia.processo,
              entidade: selectedGuia.entidade,
              nif: selectedGuia.nif,
              endereco: "Av. Principal, Luanda - Angola",
              dataEmissao: selectedGuia.dataEmissao,
              dataVencimento: selectedGuia.dataVencimento,
              descricao: `Emolumentos referentes ao processo ${selectedGuia.processo} - ${selectedGuia.tipo}`,
              valor: 0,
              emolumentos: selectedGuia.emolumentos,
              total: selectedGuia.emolumentos,
            }}
            logoUrl="/logo-tc.png"
          />
        </DocumentViewer>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja eliminar esta guia de cobrança? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
