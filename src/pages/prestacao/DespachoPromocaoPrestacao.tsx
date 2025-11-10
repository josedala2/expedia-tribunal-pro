import { useState } from "react";
import { ArrowLeft, Plus, Eye, FileText, Download, CheckCircle, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";

interface ProcessoPrestacaoPendente {
  id: string;
  numero: string;
  entidade: string;
  anoGerencia: string;
  decisaoJuiz: "Contas em Termos" | "Contas Não em Termos" | "Diligências";
  dataDecisao: Date;
  temGuiaCobranca: boolean;
  temRelatorioSintese: boolean;
  status: "Pendente MP" | "Em Análise MP" | "Promoção Emitida";
  prazoMP: number; // dias para pronúncia do MP
}

interface DespachoPromocaoPrestacaoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const DespachoPromocaoPrestacao = ({ onBack, onNavigate }: DespachoPromocaoPrestacaoProps) => {
  const [processos] = useState<ProcessoPrestacaoPendente[]>([
    {
      id: "1",
      numero: "PC-2024-001",
      entidade: "Ministério da Educação",
      anoGerencia: "2023",
      decisaoJuiz: "Contas em Termos",
      dataDecisao: new Date(2024, 2, 15),
      temGuiaCobranca: true,
      temRelatorioSintese: true,
      status: "Pendente MP",
      prazoMP: 15,
    },
    {
      id: "2",
      numero: "PC-2024-002",
      entidade: "Governo Provincial de Luanda",
      anoGerencia: "2023",
      decisaoJuiz: "Contas Não em Termos",
      dataDecisao: new Date(2024, 3, 5),
      temGuiaCobranca: false,
      temRelatorioSintese: true,
      status: "Em Análise MP",
      prazoMP: 8,
    },
    {
      id: "3",
      numero: "PC-2024-003",
      entidade: "Assembleia Nacional",
      anoGerencia: "2023",
      decisaoJuiz: "Contas em Termos",
      dataDecisao: new Date(2024, 3, 10),
      temGuiaCobranca: true,
      temRelatorioSintese: true,
      status: "Promoção Emitida",
      prazoMP: 0,
    },
  ]);

  const statusColors = {
    "Pendente MP": "bg-yellow-500 text-white",
    "Em Análise MP": "bg-blue-500 text-white",
    "Promoção Emitida": "bg-green-500 text-white",
  };

  const getPrazoColor = (dias: number) => {
    if (dias <= 3) return "text-red-600 font-bold";
    if (dias <= 7) return "text-yellow-600 font-semibold";
    return "text-green-600";
  };

  const handleNovoDespacho = (processoId: string, numero: string) => {
    toast.info(`Elaborar despacho de promoção para o processo ${numero}`);
  };

  const handleVerProcesso = (numero: string) => {
    toast.info(`Visualizando processo completo ${numero}`);
  };

  const handleVerDecisao = (numero: string) => {
    toast.info(`Visualizando decisão do Juiz Relator - ${numero}`);
  };

  const handleVerRelatorio = (numero: string) => {
    toast.info(`Visualizando relatório síntese - ${numero}`);
  };

  const handleVerGuia = (numero: string) => {
    toast.info(`Visualizando guia de cobrança - ${numero}`);
  };

  const handleDownload = (numero: string) => {
    toast.success(`Download dos documentos do processo ${numero} iniciado`);
  };

  const totalProcessos = processos.length;
  const processosPendentes = processos.filter(p => p.status === "Pendente MP").length;
  const processosEmAnalise = processos.filter(p => p.status === "Em Análise MP").length;
  const processosConcluidos = processos.filter(p => p.status === "Promoção Emitida").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Despacho de Promoção - Prestação de Contas</h1>
            <p className="text-muted-foreground mt-1">
              Ministério Público - Promoção sobre decisões em processos de prestação de contas
            </p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Processos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalProcessos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes MP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{processosPendentes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Análise MP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{processosEmAnalise}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Promoções Emitidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{processosConcluidos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Informações sobre Despacho de Promoção */}
      <Card>
        <CardHeader>
          <CardTitle>Informações sobre Despacho de Promoção</CardTitle>
          <CardDescription>
            Procedimentos e responsabilidades do Ministério Público em processos de prestação de contas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r">
              <h3 className="font-semibold mb-2 text-foreground">Responsabilidade do Ministério Público</h3>
              <p className="text-muted-foreground">
                O Ministério Público promove sobre a decisão do Juiz Relator relativamente ao processo de prestação de contas,
                tendo acesso ao relatório síntese, decisão final e guia de cobrança (quando aplicável).
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-start gap-2">
                  <FileCheck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">Documentos Necessários</h3>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Relatório Síntese da Análise Técnica</li>
                      <li>• Decisão do Juiz Relator</li>
                      <li>• Contas da Entidade (ano de gerência)</li>
                      <li>• Guia de Cobrança (quando aplicável)</li>
                      <li>• Documentos anexos relevantes</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">Fluxo do Processo</h3>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>1. Recebimento da decisão do Juiz</li>
                      <li>2. Análise dos autos pelo MP (15 dias)</li>
                      <li>3. Elaboração da promoção</li>
                      <li>4. Assinatura do Procurador-Geral</li>
                      <li>5. Remessa ao Juiz Relator</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Processos */}
      <Card>
        <CardHeader>
          <CardTitle>Processos Pendentes de Promoção</CardTitle>
          <CardDescription>
            Lista de processos de prestação de contas aguardando despacho de promoção do Ministério Público
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Ano Gerência</TableHead>
                <TableHead>Decisão do Juiz</TableHead>
                <TableHead className="text-center">Data Decisão</TableHead>
                <TableHead className="text-center">Prazo MP</TableHead>
                <TableHead className="text-center">Documentos</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processos.map((processo) => (
                <TableRow key={processo.id}>
                  <TableCell className="font-medium">{processo.numero}</TableCell>
                  <TableCell>{processo.entidade}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{processo.anoGerencia}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        processo.decisaoJuiz === "Contas em Termos" 
                          ? "border-green-500 text-green-700" 
                          : processo.decisaoJuiz === "Contas Não em Termos"
                          ? "border-red-500 text-red-700"
                          : "border-yellow-500 text-yellow-700"
                      }
                    >
                      {processo.decisaoJuiz}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {format(processo.dataDecisao, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="text-center">
                    {processo.prazoMP > 0 ? (
                      <span className={getPrazoColor(processo.prazoMP)}>
                        {processo.prazoMP} dias
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      {processo.temRelatorioSintese && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {processo.temGuiaCobranca && (
                        <FileText className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={statusColors[processo.status]}>
                      {processo.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
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
                      {processo.temRelatorioSintese && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerRelatorio(processo.numero)}
                          title="Ver relatório síntese"
                        >
                          <FileCheck className="h-4 w-4" />
                        </Button>
                      )}
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
                      {(processo.status === "Pendente MP" || processo.status === "Em Análise MP") && (
                        <Button
                          size="sm"
                          onClick={() => handleNovoDespacho(processo.id, processo.numero)}
                          title="Elaborar despacho de promoção"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Promover
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Critérios de Aceitação */}
      <Card>
        <CardHeader>
          <CardTitle>Critérios de Aceitação</CardTitle>
          <CardDescription>
            Requisitos para elaboração do despacho de promoção em prestação de contas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Sistema deve permitir ao MP analisar o relatório síntese e a decisão do Juiz Relator</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>MP deve ter acesso completo aos autos do processo de prestação de contas</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Sistema deve disponibilizar guia de cobrança quando aplicável</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Prazo de 15 dias deve ser respeitado para emissão da promoção</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Remessa automática ao Juiz Relator após assinatura e emissão da promoção</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};