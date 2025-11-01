import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, FileText, Download, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ProcessoPendente {
  id: string;
  numero: string;
  entidade: string;
  tipoProcesso: "Visto" | "Prestação de Contas" | "Fiscalização";
  decisaoJuiz: string;
  dataDecisao: Date;
  temGuiaCobranca: boolean;
  status: "Pendente MP" | "Em Análise" | "Concluído";
}

interface DespachoPromocaoProps {
  onNavigate?: (view: string) => void;
}

export default function DespachoPromocao({ onNavigate }: DespachoPromocaoProps) {
  const [processos] = useState<ProcessoPendente[]>([
    {
      id: "1",
      numero: "PV-2024-0123",
      entidade: "Ministério da Educação",
      tipoProcesso: "Visto",
      decisaoJuiz: "Visto Concedido",
      dataDecisao: new Date(2024, 9, 15),
      temGuiaCobranca: true,
      status: "Pendente MP",
    },
    {
      id: "2",
      numero: "PC-2024-0089",
      entidade: "Instituto Nacional de Saúde",
      tipoProcesso: "Prestação de Contas",
      decisaoJuiz: "Aprovado com Ressalvas",
      dataDecisao: new Date(2024, 9, 20),
      temGuiaCobranca: false,
      status: "Em Análise",
    },
    {
      id: "3",
      numero: "PV-2024-0125",
      entidade: "Ministério das Finanças",
      tipoProcesso: "Visto",
      decisaoJuiz: "Visto Recusado",
      dataDecisao: new Date(2024, 9, 18),
      temGuiaCobranca: true,
      status: "Pendente MP",
    },
  ]);

  const statusColors = {
    "Pendente MP": "bg-yellow-500",
    "Em Análise": "bg-blue-500",
    "Concluído": "bg-green-500",
  };

  const handleNovoDespacho = (processoId: string) => {
    if (onNavigate) {
      onNavigate("novo-despacho-promocao");
    }
    toast.info("Abrindo formulário para novo despacho de promoção");
  };

  const handleVerProcesso = (numero: string) => {
    toast.info(`Visualizando processo ${numero}`);
  };

  const handleVerDecisao = (numero: string) => {
    toast.info(`Visualizando decisão do processo ${numero}`);
  };

  const handleVerGuia = (numero: string) => {
    toast.info(`Visualizando guia de cobrança do processo ${numero}`);
  };

  const handleDownload = (numero: string) => {
    toast.success(`Download dos documentos do processo ${numero} iniciado`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Despacho de Promoção</h1>
          <p className="text-muted-foreground mt-1">
            Ministério Público - Promoção sobre decisões do Juiz Relator
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações sobre Despacho de Promoção</CardTitle>
          <CardDescription>
            Procedimentos e responsabilidades do Ministério Público
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r">
              <h3 className="font-semibold mb-2">Responsabilidade</h3>
              <p className="text-muted-foreground">
                O Ministério Público promove sobre a decisão do Juiz Relator relativamente ao processo,
                tendo acesso a todos os documentos incluindo a Guia de Cobrança.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Documentos Necessários</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Decisão do Juiz Relator</li>
                  <li>• Guia de Cobrança (quando aplicável)</li>
                  <li>• Processo completo</li>
                  <li>• Documentos anexos relevantes</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Fluxo do Processo</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>1. Recebimento da decisão do Juiz</li>
                  <li>2. Análise dos autos pelo MP</li>
                  <li>3. Elaboração da promoção</li>
                  <li>4. Remessa ao Juiz Relator</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processos Pendentes de Promoção</CardTitle>
          <CardDescription>
            Lista de processos aguardando despacho de promoção do Ministério Público
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="p-3 text-left text-sm font-semibold">Processo</th>
                  <th className="p-3 text-left text-sm font-semibold">Entidade</th>
                  <th className="p-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="p-3 text-left text-sm font-semibold">Decisão do Juiz</th>
                  <th className="p-3 text-center text-sm font-semibold">Data Decisão</th>
                  <th className="p-3 text-center text-sm font-semibold">Guia Cobrança</th>
                  <th className="p-3 text-center text-sm font-semibold">Status</th>
                  <th className="p-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {processos.map((processo) => (
                  <tr key={processo.id} className="border-b hover:bg-muted/30">
                    <td className="p-3 text-sm font-medium">{processo.numero}</td>
                    <td className="p-3 text-sm">{processo.entidade}</td>
                    <td className="p-3 text-sm">
                      <Badge variant="outline">{processo.tipoProcesso}</Badge>
                    </td>
                    <td className="p-3 text-sm">{processo.decisaoJuiz}</td>
                    <td className="p-3 text-sm text-center">
                      {format(processo.dataDecisao, "dd/MM/yyyy")}
                    </td>
                    <td className="p-3 text-center">
                      {processo.temGuiaCobranca ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={statusColors[processo.status]}>
                        {processo.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerProcesso(processo.numero)}
                          title="Ver processo completo"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerDecisao(processo.numero)}
                          title="Ver decisão do juiz"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        {processo.temGuiaCobranca && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerGuia(processo.numero)}
                            title="Ver guia de cobrança"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {processo.status === "Pendente MP" && (
                          <Button
                            size="sm"
                            onClick={() => handleNovoDespacho(processo.id)}
                            title="Elaborar despacho de promoção"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Promover
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Critérios de Aceitação</CardTitle>
          <CardDescription>
            Requisitos para elaboração do despacho de promoção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Sistema deve permitir a promoção eficiente do Ministério Público</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Sistema deve fornecer acesso aos documentos necessários</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Visualização da decisão do Juiz Relator e Guia de Cobrança</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Remessa automática ao Juiz Relator após emissão da promoção</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
