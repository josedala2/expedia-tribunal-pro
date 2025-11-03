import { useState } from "react";
import { ArrowLeft, Search, Filter, FileText, Calendar, User, AlertCircle, CheckCircle, Clock, Eye, Edit, Trash2, Plus, DollarSign, Gavel, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { EntitySelector } from "@/components/ui/entity-selector";

interface PedidoReducaoEmolumentosProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const PedidoReducaoEmolumentos = ({ onBack, onNavigate }: PedidoReducaoEmolumentosProps) => {
  const { toast } = useToast();
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    numeroProcesso: "",
    entidadeContratada: "",
    valorEmolumentos: "",
    valorProposto: "",
    fundamentacao: "",
    documentosAnexos: "",
    observacoes: "",
    decisao: "",
    promocao: "",
  });

  const handleView = (id: string) => {
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) {
      setSelectedPedido(pedido);
      setShowViewDialog(true);
    }
  };

  const handleChangeStatus = (id: string, status: string) => {
    toast({
      title: "Status alterado",
      description: `Status alterado para: ${status}`,
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Pedido eliminado",
      description: "O pedido foi eliminado com sucesso.",
      variant: "destructive",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Formulário submetido",
      description: "Os dados foram registados com sucesso.",
    });
    setActiveForm(null);
    setFormData({
      numeroProcesso: "",
      entidadeContratada: "",
      valorEmolumentos: "",
      valorProposto: "",
      fundamentacao: "",
      documentosAnexos: "",
      observacoes: "",
      decisao: "",
      promocao: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Dados mockados de pedidos
  const pedidos = [
    {
      id: "1",
      numeroProcesso: "PVST-2024-001",
      entidadeContratada: "Hospital Central",
      valorEmolumentos: "15.000,00 Db",
      valorProposto: "7.500,00 Db",
      dataSubmissao: "20/01/2024",
      etapaAtual: "Análise do Juiz Relator",
      status: "Em Análise",
    },
    {
      id: "2",
      numeroProcesso: "PVST-2024-002",
      entidadeContratada: "Município de São Tomé",
      valorEmolumentos: "25.000,00 Db",
      valorProposto: "12.500,00 Db",
      dataSubmissao: "22/01/2024",
      etapaAtual: "Promoção do MP",
      status: "Aguardando Promoção",
    },
    {
      id: "3",
      numeroProcesso: "PVST-2023-089",
      entidadeContratada: "Instituto Nacional de Saúde",
      valorEmolumentos: "10.000,00 Db",
      valorProposto: "5.000,00 Db",
      dataSubmissao: "15/01/2024",
      etapaAtual: "Cumprimento do Despacho",
      status: "Deferido",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Análise":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "Aguardando Promoção":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "Deferido":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "Indeferido":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-foreground">Pedido de Redução de Emolumentos</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de pedidos de redução dos emolumentos devidos após concessão de visto
          </p>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground">Ativos no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1</div>
            <p className="text-xs text-muted-foreground">Aguardando decisão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deferidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1</div>
            <p className="text-xs text-muted-foreground">Pedidos aprovados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Promoção</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1</div>
            <p className="text-xs text-muted-foreground">Pendente do MP</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar e Filtrar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nº processo ou entidade..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="analise">Em Análise</SelectItem>
                <SelectItem value="promocao">Aguardando Promoção</SelectItem>
                <SelectItem value="deferido">Deferido</SelectItem>
                <SelectItem value="indeferido">Indeferido</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Etapa Atual" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pedido">Pedido de Redução</SelectItem>
                <SelectItem value="conclusao">Conclusão dos Autos</SelectItem>
                <SelectItem value="analise">Análise do Juiz</SelectItem>
                <SelectItem value="promocao">Promoção do MP</SelectItem>
                <SelectItem value="decisao">Decisão Final</SelectItem>
                <SelectItem value="cumprimento">Cumprimento do Despacho</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Informação sobre o Fluxo */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Fluxo de Pedido de Redução de Emolumentos
          </CardTitle>
          <CardDescription>
            Em caso de concessão de visto, após comunicação da decisão e dos emolumentos devidos, a entidade CONTRATADA pode solicitar redução dos emolumentos devidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background">1. Pedido de Redução</Badge>
              <Badge variant="outline" className="bg-background">2. Conclusão dos Autos pela CG-SFP</Badge>
              <Badge variant="outline" className="bg-background">3. Análise e Decisão do Juiz Relator</Badge>
              <Badge variant="outline" className="bg-background">4. Promoção do MP</Badge>
              <Badge variant="outline" className="bg-background">5. Análise e Decisão Final do Juiz</Badge>
              <Badge variant="outline" className="bg-background">6. Cumprimento do Despacho</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <Button variant="outline" onClick={() => setActiveForm("pedido")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Pedido de Redução
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("conclusao")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Conclusão dos Autos
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("analise")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Análise do Juiz Relator
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("promocao")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Promoção do MP
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("decisao")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Decisão Final
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("cumprimento")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Cumprimento do Despacho
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos de Redução</CardTitle>
          <CardDescription>
            Pedidos ativos de redução de emolumentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Entidade Contratada</TableHead>
                <TableHead>Valor Emolumentos</TableHead>
                <TableHead>Valor Proposto</TableHead>
                <TableHead>Data Submissão</TableHead>
                <TableHead>Etapa Atual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell className="font-medium">
                    {pedido.numeroProcesso}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {pedido.entidadeContratada}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
                      {pedido.valorEmolumentos}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                      {pedido.valorProposto}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {pedido.dataSubmissao}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {pedido.etapaAtual}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(pedido.status)}>
                      {pedido.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(pedido.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleChangeStatus(pedido.id, "Em Análise")}>
                            Em Análise
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(pedido.id, "Aguardando Promoção")}>
                            Aguardando Promoção
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(pedido.id, "Deferido")}>
                            Deferido
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(pedido.id, "Indeferido")}>
                            Indeferido
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem a certeza que deseja eliminar este pedido? Esta ação não pode ser revertida.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(pedido.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Formulários */}
      <Dialog open={activeForm !== null} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeForm === "pedido" && (
                <>
                  <DollarSign className="h-5 w-5" />
                  Pedido de Redução de Emolumentos
                </>
              )}
              {activeForm === "conclusao" && (
                <>
                  <FileText className="h-5 w-5" />
                  Conclusão dos Autos pela CG-SFP
                </>
              )}
              {activeForm === "analise" && (
                <>
                  <Gavel className="h-5 w-5" />
                  Análise e Decisão do Juiz Relator
                </>
              )}
              {activeForm === "promocao" && (
                <>
                  <Scale className="h-5 w-5" />
                  Promoção do Ministério Público
                </>
              )}
              {activeForm === "decisao" && (
                <>
                  <Gavel className="h-5 w-5" />
                  Análise e Decisão Final do Juiz Relator
                </>
              )}
              {activeForm === "cumprimento" && (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Cumprimento do Despacho
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {activeForm === "pedido" && "Registe o pedido de redução dos emolumentos devidos"}
              {activeForm === "conclusao" && "Conclusão dos autos para envio ao Juiz Relator"}
              {activeForm === "analise" && "Análise do pedido e proferimento de decisão"}
              {activeForm === "promocao" && "Promoção do Ministério Público sobre o pedido"}
              {activeForm === "decisao" && "Decisão final após análise de toda a documentação"}
              {activeForm === "cumprimento" && "Cumprimento do despacho proferido"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Formulário: Pedido de Redução */}
            {activeForm === "pedido" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Número do Processo *</Label>
                    <Input
                      value={formData.numeroProcesso}
                      onChange={(e) => handleInputChange("numeroProcesso", e.target.value)}
                      placeholder="Ex: PVST-2024-001"
                      required
                    />
                  </div>
                  <div>
                    <EntitySelector
                      value={formData.entidadeContratada}
                      onChange={(value) => handleInputChange("entidadeContratada", value)}
                      label="Entidade Contratada"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valor dos Emolumentos (Db) *</Label>
                    <Input
                      type="number"
                      value={formData.valorEmolumentos}
                      onChange={(e) => handleInputChange("valorEmolumentos", e.target.value)}
                      placeholder="15000.00"
                      required
                    />
                  </div>
                  <div>
                    <Label>Valor Proposto (Db) *</Label>
                    <Input
                      type="number"
                      value={formData.valorProposto}
                      onChange={(e) => handleInputChange("valorProposto", e.target.value)}
                      placeholder="7500.00"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Fundamentação do Pedido *</Label>
                  <Textarea
                    value={formData.fundamentacao}
                    onChange={(e) => handleInputChange("fundamentacao", e.target.value)}
                    placeholder="Descreva os fundamentos legais e factuais para a redução dos emolumentos..."
                    rows={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.fundamentacao.length}/2000 caracteres
                  </p>
                </div>
                
                <div>
                  <Label>Documentos Anexos</Label>
                  <Textarea
                    value={formData.documentosAnexos}
                    onChange={(e) => handleInputChange("documentosAnexos", e.target.value)}
                    placeholder="Liste os documentos anexados ao pedido..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Formulário: Conclusão dos Autos */}
            {activeForm === "conclusao" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Número do Processo *</Label>
                    <Select onValueChange={(value) => handleInputChange("numeroProcesso", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o processo" />
                      </SelectTrigger>
                      <SelectContent>
                        {pedidos.map((p) => (
                          <SelectItem key={p.id} value={p.numeroProcesso}>
                            {p.numeroProcesso} - {p.entidadeContratada}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Data de Conclusão *</Label>
                    <Input type="date" required />
                  </div>
                </div>
                
                <div>
                  <Label>Relatório de Conclusão *</Label>
                  <Textarea
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                    placeholder="Relatório sobre a verificação do pedido e documentação apresentada..."
                    rows={6}
                    required
                  />
                </div>
                
                <div>
                  <Label>Documentação Verificada</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Pedido de redução devidamente fundamentado</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Documentos comprovativos anexados</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Guia de cobrança original</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Formulário: Análise do Juiz Relator */}
            {activeForm === "analise" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Número do Processo *</Label>
                    <Select onValueChange={(value) => handleInputChange("numeroProcesso", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o processo" />
                      </SelectTrigger>
                      <SelectContent>
                        {pedidos.map((p) => (
                          <SelectItem key={p.id} value={p.numeroProcesso}>
                            {p.numeroProcesso} - {p.entidadeContratada}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Decisão *</Label>
                    <Select onValueChange={(value) => handleInputChange("decisao", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a decisão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deferido_total">Deferido Totalmente</SelectItem>
                        <SelectItem value="deferido_parcial">Deferido Parcialmente</SelectItem>
                        <SelectItem value="indeferido">Indeferido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {formData.decisao === "deferido_parcial" && (
                  <div>
                    <Label>Novo Valor dos Emolumentos (Db) *</Label>
                    <Input
                      type="number"
                      placeholder="10000.00"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <Label>Fundamentação da Decisão *</Label>
                  <Textarea
                    value={formData.fundamentacao}
                    onChange={(e) => handleInputChange("fundamentacao", e.target.value)}
                    placeholder="Fundamente a decisão proferida com base nos elementos apresentados..."
                    rows={8}
                    required
                  />
                </div>
                
                <div>
                  <Label>Observações Adicionais</Label>
                  <Textarea
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                    placeholder="Observações ou recomendações adicionais..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Formulário: Promoção do MP */}
            {activeForm === "promocao" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Número do Processo *</Label>
                    <Select onValueChange={(value) => handleInputChange("numeroProcesso", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o processo" />
                      </SelectTrigger>
                      <SelectContent>
                        {pedidos.map((p) => (
                          <SelectItem key={p.id} value={p.numeroProcesso}>
                            {p.numeroProcesso} - {p.entidadeContratada}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Data da Promoção *</Label>
                    <Input type="date" required />
                  </div>
                </div>
                
                <div>
                  <Label>Parecer do Ministério Público *</Label>
                  <Select onValueChange={(value) => handleInputChange("promocao", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o parecer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="favoravel">Favorável ao Deferimento</SelectItem>
                      <SelectItem value="favoravel_parcial">Favorável ao Deferimento Parcial</SelectItem>
                      <SelectItem value="desfavoravel">Desfavorável ao Deferimento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Fundamentação da Promoção *</Label>
                  <Textarea
                    value={formData.fundamentacao}
                    onChange={(e) => handleInputChange("fundamentacao", e.target.value)}
                    placeholder="Fundamente o parecer do Ministério Público sobre o pedido de redução..."
                    rows={8}
                    required
                  />
                </div>
                
                <div>
                  <Label>Referências Legais</Label>
                  <Textarea
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                    placeholder="Cite os diplomas legais e jurisprudência relevantes..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Formulário: Decisão Final */}
            {activeForm === "decisao" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Número do Processo *</Label>
                    <Select onValueChange={(value) => handleInputChange("numeroProcesso", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o processo" />
                      </SelectTrigger>
                      <SelectContent>
                        {pedidos.map((p) => (
                          <SelectItem key={p.id} value={p.numeroProcesso}>
                            {p.numeroProcesso} - {p.entidadeContratada}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Decisão Final *</Label>
                    <Select onValueChange={(value) => handleInputChange("decisao", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a decisão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deferido_total">Deferido Totalmente</SelectItem>
                        <SelectItem value="deferido_parcial">Deferido Parcialmente</SelectItem>
                        <SelectItem value="indeferido">Indeferido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {(formData.decisao === "deferido_total" || formData.decisao === "deferido_parcial") && (
                  <div>
                    <Label>Valor Final dos Emolumentos (Db) *</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 7500.00"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <Label>Fundamentação da Decisão Final *</Label>
                  <Textarea
                    value={formData.fundamentacao}
                    onChange={(e) => handleInputChange("fundamentacao", e.target.value)}
                    placeholder="Fundamente a decisão final considerando todos os elementos do processo, incluindo a promoção do MP..."
                    rows={8}
                    required
                  />
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    Elementos Analisados
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Pedido de redução da entidade contratada</li>
                    <li>• Relatório de conclusão da CG-SFP</li>
                    <li>• Decisão inicial do Juiz Relator</li>
                    <li>• Promoção do Ministério Público</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Formulário: Cumprimento do Despacho */}
            {activeForm === "cumprimento" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Número do Processo *</Label>
                    <Select onValueChange={(value) => handleInputChange("numeroProcesso", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o processo" />
                      </SelectTrigger>
                      <SelectContent>
                        {pedidos.map((p) => (
                          <SelectItem key={p.id} value={p.numeroProcesso}>
                            {p.numeroProcesso} - {p.entidadeContratada}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Data de Cumprimento *</Label>
                    <Input type="date" required />
                  </div>
                </div>
                
                <div>
                  <Label>Tipo de Ação *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a ação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notificacao">Notificação às Partes</SelectItem>
                      <SelectItem value="guia_atualizada">Emissão de Guia Atualizada</SelectItem>
                      <SelectItem value="arquivo">Arquivo do Processo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Descrição do Cumprimento *</Label>
                  <Textarea
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                    placeholder="Descreva as ações executadas para cumprimento do despacho..."
                    rows={5}
                    required
                  />
                </div>
                
                <div>
                  <Label>Documentos Gerados</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Ofício de notificação da decisão</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Guia de cobrança atualizada (se aplicável)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Certidão da decisão</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Submeter Formulário
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveForm(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido de Redução</DialogTitle>
            <DialogDescription>
              {selectedPedido?.numeroProcesso}
            </DialogDescription>
          </DialogHeader>
          {selectedPedido && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Número do Processo</Label>
                  <p className="font-medium">{selectedPedido.numeroProcesso}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Entidade Contratada</Label>
                  <p className="font-medium">{selectedPedido.entidadeContratada}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Valor dos Emolumentos</Label>
                  <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
                    {selectedPedido.valorEmolumentos}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Valor Proposto</Label>
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                    {selectedPedido.valorProposto}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Data de Submissão</Label>
                  <p className="font-medium">{selectedPedido.dataSubmissao}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge variant="outline" className={getStatusColor(selectedPedido.status)}>
                    {selectedPedido.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Etapa Atual do Processo</Label>
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                  <p className="text-sm font-medium">{selectedPedido.etapaAtual}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Redução Solicitada</Label>
                <div className="mt-2 p-4 bg-muted/50 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Percentual de redução:</span>
                    <span className="text-lg font-bold text-primary">50%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Economia esperada:</span>
                    <span className="text-lg font-bold text-green-600">
                      {(parseFloat(selectedPedido.valorEmolumentos.replace(/[^\d,]/g, '').replace(',', '.')) - 
                        parseFloat(selectedPedido.valorProposto.replace(/[^\d,]/g, '').replace(',', '.'))).toFixed(2)} Db
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
