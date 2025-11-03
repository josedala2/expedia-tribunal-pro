import { ArrowLeft, Eye, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ConfiancaProcessoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const ConfiancaProcesso = ({ onBack }: ConfiancaProcessoProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, setValue } = useForm();
  const [showForm, setShowForm] = useState(false);

  const processosDisponiveis = [
    { numero: "PM/2024/001", demandado: "João Silva", dataNotificacaoJulgamento: "2024-10-28", dataJulgamento: "2024-11-15", prazoFim: "2024-11-02", status: "Prazo em Curso" },
  ];

  const pedidosPendentes = [
    { numero: "PM/2024/003", solicitante: "Dr. Manuel Santos (Advogado)", dataPedido: "2024-10-29", valorGuia: "50.000 Kz", status: "Aguardando Pagamento" },
  ];

  const confiancasAutorizadas = [
    { numero: "PM/2024/002", solicitante: "Ministério Público", dataConfianca: "2024-10-25", dataExpiracao: "2024-10-28", status: "Autorizado" },
  ];

  const onSubmit = (data: any) => {
    toast({
      title: "Pedido de Confiança Registado",
      description: "Guia de pagamento emitida. Aguardando comprovativo para liberação.",
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Eye className="h-8 w-8 text-primary" />
              Pedido de Confiança ao Processo
            </h1>
            <p className="text-muted-foreground">Consulta ao processo pelo MP, demandado ou advogado (prazo de 5 dias após notificação)</p>
          </div>
        </div>
      </div>

      {!showForm ? (
        <Tabs defaultValue="disponiveis" className="space-y-6">
          <TabsList>
            <TabsTrigger value="disponiveis">Processos Disponíveis</TabsTrigger>
            <TabsTrigger value="pendentes">Pedidos Pendentes</TabsTrigger>
            <TabsTrigger value="autorizados">Confiançascas Autorizadas</TabsTrigger>
          </TabsList>

          <TabsContent value="disponiveis">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processos em Prazo de Confiança (5 dias)</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Data Notificação Julgamento</TableHead>
                    <TableHead>Data Julgamento</TableHead>
                    <TableHead>Prazo Fim</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processosDisponiveis.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell>{processo.dataNotificacaoJulgamento}</TableCell>
                      <TableCell className="font-semibold">{processo.dataJulgamento}</TableCell>
                      <TableCell>{processo.prazoFim}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-accent border-accent hover:bg-accent/10 gap-2"
                          onClick={() => setShowForm(true)}
                        >
                          <FileText className="h-4 w-4" />
                          Solicitar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="pendentes">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Pedidos Aguardando Pagamento</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Data Pedido</TableHead>
                    <TableHead>Valor da Guia</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidosPendentes.map((pedido) => (
                    <TableRow key={pedido.numero}>
                      <TableCell className="font-medium">{pedido.numero}</TableCell>
                      <TableCell>{pedido.solicitante}</TableCell>
                      <TableCell>{pedido.dataPedido}</TableCell>
                      <TableCell className="font-bold text-primary">{pedido.valorGuia}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{pedido.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="gap-2">
                          <DollarSign className="h-4 w-4" />
                          Ver Guia
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="autorizados">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Confiançascas Autorizadas</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Data Confiança</TableHead>
                    <TableHead>Data Expiração</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {confiancasAutorizadas.map((confianca) => (
                    <TableRow key={confianca.numero}>
                      <TableCell className="font-medium">{confianca.numero}</TableCell>
                      <TableCell>{confianca.solicitante}</TableCell>
                      <TableCell>{confianca.dataConfianca}</TableCell>
                      <TableCell>{confianca.dataExpiracao}</TableCell>
                      <TableCell>
                        <Badge className="bg-success">{confianca.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-6">
            <div className="space-y-6">
              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <h3 className="font-semibold text-accent mb-2">Processo de Multa</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Número:</strong> PM/2024/001</div>
                  <div><strong>Demandado:</strong> João Silva</div>
                  <div><strong>Data Julgamento:</strong> 15/11/2024</div>
                  <div><strong>Prazo Fim:</strong> 02/11/2024 (5 dias)</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Dados do Solicitante</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoSolicitante">Tipo de Solicitante *</Label>
                    <Select onValueChange={(value) => setValue("tipoSolicitante", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp">Ministério Público</SelectItem>
                        <SelectItem value="demandado">Demandado</SelectItem>
                        <SelectItem value="advogado">Advogado do Demandado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomeSolicitante">Nome Completo *</Label>
                      <Input id="nomeSolicitante" placeholder="Nome do solicitante" {...register("nomeSolicitante")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documentoIdentificacao">Documento de Identificação *</Label>
                      <Input id="documentoIdentificacao" placeholder="BI/Cédula" {...register("documentoIdentificacao")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input id="telefone" placeholder="+244 900 000 000" {...register("telefone")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@exemplo.ao" {...register("email")} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Dados do Pedido</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataPedido">Data do Pedido *</Label>
                      <Input id="dataPedido" type="date" {...register("dataPedido")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataConsulta">Data Pretendida para Consulta *</Label>
                      <Input id="dataConsulta" type="date" {...register("dataConsulta")} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motivacao">Motivação do Pedido *</Label>
                    <Textarea
                      id="motivacao"
                      placeholder="Razões para solicitar confiança ao processo..."
                      rows={3}
                      {...register("motivacao")}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-3">Emolumentos e Pagamento:</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Valor da Guia:</strong> 50.000 Kz</p>
                  <p><strong>Validade da Guia:</strong> 7 dias</p>
                  <p><strong>Conta do Tribunal:</strong> [Número da conta]</p>
                  <p className="mt-3 text-primary font-semibold">
                    O comprovativo de pagamento deve ser apresentado para efeitos da consulta requerida.
                  </p>
                </div>
              </div>

              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-accent mb-2">Observações Importantes:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Pedido deve ser feito no prazo de 5 dias após notificação para julgamento</li>
                  <li>Processo pode ser consultado pelo MP, demandado ou mandatário judicial</li>
                  <li>Pagamento obrigatório mediante guia emitida pelos serviços do TC</li>
                  <li>Comprovativo deve ser apresentado na SG para autorização de consulta</li>
                </ul>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-hover gap-2">
                  <FileText className="h-4 w-4" />
                  Emitir Guia de Pagamento
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
};
