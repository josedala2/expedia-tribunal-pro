import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Despacho {
  id: string;
  numero: string;
  processo: string;
  entidade: string;
  tipoDespacho: 
    | "Solicitação de Elementos"
    | "Geração de Cobrança"
    | "Submissão ao Plenário"
    | "Termo de Vista ao MP"
    | "Ofício de Remessa"
    | "Notificação à Entidade"
    | "Recebimento de Pagamento";
  juizRelator: string;
  dataDespacho: Date;
  prazo: Date;
  status: "Pendente" | "Em Andamento" | "Concluído";
  prioridade: "Baixa" | "Normal" | "Alta" | "Urgente";
}

interface CumprimentoDespachosProps {
  onNavigate?: (view: string) => void;
  onBack?: () => void;
}

export default function CumprimentoDespachos({ onNavigate }: CumprimentoDespachosProps) {
  const [despachos] = useState<Despacho[]>([
    {
      id: "1",
      numero: "DES-2024-001",
      processo: "PV-2024-0123",
      entidade: "Ministério da Educação",
      tipoDespacho: "Geração de Cobrança",
      juizRelator: "Dr. António Silva",
      dataDespacho: new Date(2024, 9, 20),
      prazo: new Date(2024, 9, 25),
      status: "Pendente",
      prioridade: "Alta",
    },
    {
      id: "2",
      numero: "DES-2024-002",
      processo: "PC-2024-0089",
      entidade: "Instituto Nacional de Saúde",
      tipoDespacho: "Solicitação de Elementos",
      juizRelator: "Dra. Maria Santos",
      dataDespacho: new Date(2024, 9, 18),
      prazo: new Date(2024, 9, 28),
      status: "Em Andamento",
      prioridade: "Normal",
    },
    {
      id: "3",
      numero: "DES-2024-003",
      processo: "PV-2024-0125",
      entidade: "Ministério das Finanças",
      tipoDespacho: "Notificação à Entidade",
      juizRelator: "Dr. João Costa",
      dataDespacho: new Date(2024, 9, 15),
      prazo: new Date(2024, 9, 22),
      status: "Concluído",
      prioridade: "Normal",
    },
    {
      id: "4",
      numero: "DES-2024-004",
      processo: "PV-2024-0130",
      entidade: "Governo Provincial de Luanda",
      tipoDespacho: "Termo de Vista ao MP",
      juizRelator: "Dr. António Silva",
      dataDespacho: new Date(2024, 9, 22),
      prazo: new Date(2024, 9, 29),
      status: "Pendente",
      prioridade: "Urgente",
    },
  ]);

  const statusColors = {
    Pendente: "bg-yellow-500",
    "Em Andamento": "bg-blue-500",
    Concluído: "bg-green-500",
  };

  const prioridadeColors = {
    Baixa: "bg-gray-500",
    Normal: "bg-blue-500",
    Alta: "bg-orange-500",
    Urgente: "bg-red-500",
  };

  const handleCumprirDespacho = (despachoId: string) => {
    if (onNavigate) {
      // Store despacho ID in state management if needed
      onNavigate("cumprimento-despacho-detail");
    }
    toast.info("Abrindo formulário para cumprimento do despacho");
  };

  const handleVerProcesso = (numero: string) => {
    toast.info(`Visualizando processo ${numero}`);
  };

  const handleVerDespacho = (numero: string) => {
    toast.info(`Visualizando despacho ${numero}`);
  };

  const getDiasRestantes = (prazo: Date) => {
    const hoje = new Date();
    const diff = Math.ceil((prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cumprimento de Despachos</h1>
          <p className="text-muted-foreground mt-1">
            Escrivão dos Autos - Gestão e cumprimento de mandados judiciais
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Despachos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{despachos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {despachos.filter(d => d.status === "Pendente").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {despachos.filter(d => d.status === "Em Andamento").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {despachos.filter(d => d.prioridade === "Urgente").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Responsabilidades do Escrivão</CardTitle>
          <CardDescription>
            Acções e mandados a cumprir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Elaborar ofícios de solicitação de elementos</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Cumprir mandado de geração de cobrança</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Submeter processos ao plenário</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Gerar termo de vista ao Ministério Público</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Elaborar ofício de remessa de decisão</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Notificar entidades das decisões</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Receber e processar comprovativo de pagamento</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Remeter autos ao Juiz Relator</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Despachos a Cumprir</CardTitle>
          <CardDescription>
            Lista de despachos emitidos pelos juízes relatores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="p-3 text-left text-sm font-semibold">Nº Despacho</th>
                  <th className="p-3 text-left text-sm font-semibold">Processo</th>
                  <th className="p-3 text-left text-sm font-semibold">Entidade</th>
                  <th className="p-3 text-left text-sm font-semibold">Tipo de Despacho</th>
                  <th className="p-3 text-left text-sm font-semibold">Juiz Relator</th>
                  <th className="p-3 text-center text-sm font-semibold">Prazo</th>
                  <th className="p-3 text-center text-sm font-semibold">Prioridade</th>
                  <th className="p-3 text-center text-sm font-semibold">Status</th>
                  <th className="p-3 text-center text-sm font-semibold">Acções</th>
                </tr>
              </thead>
              <tbody>
                {despachos.map((despacho) => {
                  const diasRestantes = getDiasRestantes(despacho.prazo);
                  return (
                    <tr key={despacho.id} className="border-b hover:bg-muted/30">
                      <td className="p-3 text-sm font-medium">{despacho.numero}</td>
                      <td className="p-3 text-sm">{despacho.processo}</td>
                      <td className="p-3 text-sm">{despacho.entidade}</td>
                      <td className="p-3 text-sm">
                        <Badge variant="outline">{despacho.tipoDespacho}</Badge>
                      </td>
                      <td className="p-3 text-sm">{despacho.juizRelator}</td>
                      <td className="p-3 text-sm text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span>{format(despacho.prazo, "dd/MM/yyyy")}</span>
                          {diasRestantes > 0 ? (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {diasRestantes} dias
                            </span>
                          ) : (
                            <span className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Vencido
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className={prioridadeColors[despacho.prioridade]}>
                          {despacho.prioridade}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className={statusColors[despacho.status]}>
                          {despacho.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerProcesso(despacho.processo)}
                            title="Ver processo"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerDespacho(despacho.numero)}
                            title="Ver despacho"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          {despacho.status !== "Concluído" && (
                            <Button
                              size="sm"
                              onClick={() => handleCumprirDespacho(despacho.id)}
                              title="Cumprir despacho"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Cumprir
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos e Termos</CardTitle>
          <CardDescription>
            Documentos utilizados no cumprimento de despachos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="p-3 border rounded-lg">
              <FileText className="h-4 w-4 mb-2 text-primary" />
              <p className="font-semibold">Termo de Juntada</p>
              <p className="text-xs text-muted-foreground">Junção de documentos aos autos</p>
            </div>
            <div className="p-3 border rounded-lg">
              <FileText className="h-4 w-4 mb-2 text-primary" />
              <p className="font-semibold">Termo de Recebimento</p>
              <p className="text-xs text-muted-foreground">Recebimento de documentos</p>
            </div>
            <div className="p-3 border rounded-lg">
              <FileText className="h-4 w-4 mb-2 text-primary" />
              <p className="font-semibold">Termo de Conclusão</p>
              <p className="text-xs text-muted-foreground">Remessa ao Juiz Relator</p>
            </div>
            <div className="p-3 border rounded-lg">
              <FileText className="h-4 w-4 mb-2 text-primary" />
              <p className="font-semibold">Termo de Notificação</p>
              <p className="text-xs text-muted-foreground">Notificação ao MP e entidades</p>
            </div>
            <div className="p-3 border rounded-lg">
              <FileText className="h-4 w-4 mb-2 text-primary" />
              <p className="font-semibold">Ofício de Solicitação</p>
              <p className="text-xs text-muted-foreground">Solicitação de elementos</p>
            </div>
            <div className="p-3 border rounded-lg">
              <FileText className="h-4 w-4 mb-2 text-primary" />
              <p className="font-semibold">Ofício de Remessa</p>
              <p className="text-xs text-muted-foreground">Remessa de decisões</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
