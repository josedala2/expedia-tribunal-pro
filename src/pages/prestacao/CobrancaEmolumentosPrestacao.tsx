import { useState } from "react";
import { ArrowLeft, Plus, Eye, Download, Trash2, Calculator, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  anoGerencia: string;
  tipo: "Contas em Termos" | "Contas Não em Termos";
  valorEmolumentos: number;
  status: "Pendente" | "Pago" | "Vencido";
  dataEmissao: Date;
  dataVencimento: Date;
  motivoCobranca: string;
}

interface CobrancaEmolumentosPrestacaoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const CobrancaEmolumentosPrestacao = ({ onBack, onNavigate }: CobrancaEmolumentosPrestacaoProps) => {
  const [guias] = useState<GuiaCobranca[]>([
    {
      id: "1",
      numero: "GC-PC-2024-001",
      processo: "PC-2024-001",
      entidade: "Ministério da Educação",
      nif: "5000000000",
      anoGerencia: "2023",
      tipo: "Contas em Termos",
      valorEmolumentos: 350000,
      status: "Pago",
      dataEmissao: new Date(2024, 2, 10),
      dataVencimento: new Date(2024, 3, 10),
      motivoCobranca: "Emolumentos de aprovação de contas"
    },
    {
      id: "2",
      numero: "GC-PC-2024-002",
      processo: "PC-2024-002",
      entidade: "Governo Provincial de Luanda",
      nif: "5000000001",
      anoGerencia: "2023",
      tipo: "Contas Não em Termos",
      valorEmolumentos: 200000,
      status: "Pendente",
      dataEmissao: new Date(2024, 3, 5),
      dataVencimento: new Date(2024, 4, 5),
      motivoCobranca: "Emolumentos por irregularidades detectadas"
    },
    {
      id: "3",
      numero: "GC-PC-2024-003",
      processo: "PC-2024-003",
      entidade: "Assembleia Nacional",
      nif: "5000000002",
      anoGerencia: "2023",
      tipo: "Contas em Termos",
      valorEmolumentos: 450000,
      status: "Pendente",
      dataEmissao: new Date(2024, 3, 15),
      dataVencimento: new Date(2024, 4, 15),
      motivoCobranca: "Emolumentos de aprovação de contas"
    },
  ]);

  const [selectedGuia, setSelectedGuia] = useState<GuiaCobranca | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const statusColors = {
    Pendente: "bg-yellow-500 text-white",
    Pago: "bg-green-500 text-white",
    Vencido: "bg-red-500 text-white",
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
    toast.info("Funcionalidade de nova guia será implementada");
  };

  const handleCalcular = () => {
    toast.info("Calculando emolumentos automaticamente para processos de Prestação de Contas");
  };

  const totalEmolumentos = guias.reduce((acc, guia) => acc + guia.valorEmolumentos, 0);
  const guiasPendentes = guias.filter(g => g.status === "Pendente").length;
  const guiasPagas = guias.filter(g => g.status === "Pago").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cobrança de Emolumentos - Prestação de Contas</h1>
            <p className="text-muted-foreground mt-1">
              Gestão de guias de cobrança para processos de prestação de contas
            </p>
          </div>
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

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Guias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{guias.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Guias Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{guiasPendentes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Guias Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{guiasPagas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Emolumentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalEmolumentos)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Informações sobre Emolumentos */}
      <Card>
        <CardHeader>
          <CardTitle>Regras de Cobrança de Emolumentos</CardTitle>
          <CardDescription>
            Informações sobre cobrança de emolumentos em processos de prestação de contas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Contas em Termos</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Emolumentos de aprovação de contas</li>
                    <li>• Valor fixo conforme tabela oficial</li>
                    <li>• Pagamento obrigatório pela entidade</li>
                    <li>• Prazo de 30 dias após notificação</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Contas Não em Termos</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Emolumentos adicionais por irregularidades</li>
                    <li>• Calculado com base na gravidade</li>
                    <li>• Pode incluir penalizações</li>
                    <li>• Prazo de 15 dias após notificação</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Guias */}
      <Card>
        <CardHeader>
          <CardTitle>Guias de Cobrança Emitidas</CardTitle>
          <CardDescription>
            Lista de todas as guias de cobrança de emolumentos para prestação de contas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Guia</TableHead>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Ano Gerência</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Emolumentos</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Vencimento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guias.map((guia) => (
                <TableRow key={guia.id}>
                  <TableCell className="font-medium">{guia.numero}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10">
                      {guia.processo}
                    </Badge>
                  </TableCell>
                  <TableCell>{guia.entidade}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{guia.anoGerencia}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={guia.tipo === "Contas em Termos" ? "border-green-500 text-green-700" : "border-red-500 text-red-700"}
                    >
                      {guia.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(guia.valorEmolumentos)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={statusColors[guia.status]}>
                      {guia.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {format(guia.dataVencimento, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(guia)}
                        title="Visualizar guia"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(guia.numero)}
                        title="Descarregar guia"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(guia.id)}
                        title="Eliminar guia"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Document Viewer */}
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
              descricao: `${selectedGuia.motivoCobranca} - Processo ${selectedGuia.processo} (Ano Gerência: ${selectedGuia.anoGerencia})`,
              valor: 0,
              emolumentos: selectedGuia.valorEmolumentos,
              total: selectedGuia.valorEmolumentos,
            }}
            logoUrl="/logo-tc.png"
          />
        </DocumentViewer>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja eliminar esta guia de cobrança? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};