import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, FileText, Download, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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
  const [processoSelecionado, setProcessoSelecionado] = useState<ProcessoPendente | null>(null);
  const [dialogAberto, setDialogAberto] = useState<"processo" | "decisao" | "guia" | null>(null);
  
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

  const handleVerProcesso = (processo: ProcessoPendente) => {
    setProcessoSelecionado(processo);
    setDialogAberto("processo");
  };

  const handleVerDecisao = (processo: ProcessoPendente) => {
    setProcessoSelecionado(processo);
    setDialogAberto("decisao");
  };

  const handleVerGuia = (processo: ProcessoPendente) => {
    setProcessoSelecionado(processo);
    setDialogAberto("guia");
  };

  const handleDownload = (numero: string) => {
    toast.success(`Download dos documentos do processo ${numero} iniciado`);
  };

  const fecharDialog = () => {
    setDialogAberto(null);
    setProcessoSelecionado(null);
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
                  <th className="p-3 text-center text-sm font-semibold">Acções</th>
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
                          onClick={() => handleVerProcesso(processo)}
                          title="Ver processo completo"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerDecisao(processo)}
                          title="Ver decisão do juiz"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        {processo.temGuiaCobranca && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerGuia(processo)}
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

      {/* Diálogo Ver Processo Completo */}
      <Dialog open={dialogAberto === "processo"} onOpenChange={fecharDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Processo</DialogTitle>
            <DialogDescription>
              Informações completas do processo {processoSelecionado?.numero}
            </DialogDescription>
          </DialogHeader>
          {processoSelecionado && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Número do Processo</p>
                  <p className="text-base">{processoSelecionado.numero}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Tipo</p>
                  <Badge variant="outline">{processoSelecionado.tipoProcesso}</Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Entidade</p>
                <p className="text-base">{processoSelecionado.entidade}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Decisão do Juiz</p>
                <p className="text-base">{processoSelecionado.decisaoJuiz}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Data da Decisão</p>
                <p className="text-base">{format(processoSelecionado.dataDecisao, "dd 'de' MMMM 'de' yyyy")}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Status</p>
                <Badge className={statusColors[processoSelecionado.status]}>
                  {processoSelecionado.status}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Guia de Cobrança</p>
                <p className="text-base">{processoSelecionado.temGuiaCobranca ? "Disponível" : "Não disponível"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo Ver Decisão do Juiz */}
      <Dialog open={dialogAberto === "decisao"} onOpenChange={fecharDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Decisão do Juiz Relator</DialogTitle>
            <DialogDescription>
              Processo {processoSelecionado?.numero}
            </DialogDescription>
          </DialogHeader>
          {processoSelecionado && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-semibold mb-2">Tipo de Decisão</p>
                <p className="text-lg font-bold text-primary">{processoSelecionado.decisaoJuiz}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Fundamentação</p>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {processoSelecionado.decisaoJuiz === "Visto Concedido" 
                      ? "Após análise detalhada dos documentos apresentados, verificou-se que o processo cumpre todos os requisitos legais e regulamentares necessários. O contrato está em conformidade com as normas de contratação pública e o valor está dentro dos limites orçamentais aprovados. Portanto, concede-se o visto prévio solicitado."
                      : processoSelecionado.decisaoJuiz === "Visto Recusado"
                      ? "Após análise dos elementos constantes dos autos, verificam-se irregularidades que impedem a concessão do visto. Nomeadamente, foram identificadas falhas na documentação de suporte e desconformidade com os procedimentos de contratação pública estabelecidos. Recusa-se o visto prévio."
                      : "Após análise da prestação de contas apresentada, verifica-se que, embora os elementos essenciais estejam presentes, existem algumas ressalvas que devem ser corrigidas. As ressalvas identificadas estão especificadas no relatório anexo e devem ser atendidas no prazo estabelecido."}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Data da Decisão</p>
                <p className="text-base">{format(processoSelecionado.dataDecisao, "dd 'de' MMMM 'de' yyyy")}</p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleDownload(processoSelecionado.numero)}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Decisão
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo Ver Guia de Cobrança */}
      <Dialog open={dialogAberto === "guia"} onOpenChange={fecharDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Guia de Cobrança</DialogTitle>
            <DialogDescription>
              Processo {processoSelecionado?.numero}
            </DialogDescription>
          </DialogHeader>
          {processoSelecionado && (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 border-l-4 border-primary rounded-r">
                <p className="text-sm font-semibold mb-1">Guia de Cobrança de Emolumentos</p>
                <p className="text-xs text-muted-foreground">
                  Documento gerado automaticamente pelo sistema
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Nº da Guia</p>
                  <p className="text-base font-mono">GC-{processoSelecionado.numero}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Data de Emissão</p>
                  <p className="text-base">{format(processoSelecionado.dataDecisao, "dd/MM/yyyy")}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Entidade Responsável</p>
                <p className="text-base">{processoSelecionado.entidade}</p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-semibold mb-3">Detalhes da Cobrança</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Emolumentos de Visto:</span>
                    <span className="text-sm font-semibold">25.000,00 Kz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Taxa de Processamento:</span>
                    <span className="text-sm font-semibold">5.000,00 Kz</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-sm font-bold">Total:</span>
                    <span className="text-base font-bold text-primary">30.000,00 Kz</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Prazo de Pagamento</p>
                <p className="text-base">30 dias a partir da emissão</p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleDownload(processoSelecionado.numero)}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Guia
                </Button>
                <Button onClick={() => toast.info("Imprimir guia de cobrança")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
