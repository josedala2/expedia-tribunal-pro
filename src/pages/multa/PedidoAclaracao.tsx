import { ArrowLeft, MessageSquare, Plus, FileText, Eye } from "lucide-react";
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

interface PedidoAclaracaoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const PedidoAclaracao = ({ onBack }: PedidoAclaracaoProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, setValue } = useForm();
  const [showForm, setShowForm] = useState(false);

  const processosNotificados = [
    { numero: "PM/2024/001", demandado: "João Silva", dataNotificacao: "2024-11-12", decisao: "Condenação", prazoFim: "2024-11-22", status: "Prazo em Curso" },
  ];

  const pedidosPendentes = [
    { numero: "PM/2024/003", requerente: "António Costa (Demandado)", dataPedido: "2024-11-14", tipo: "Correção de Erro Material", status: "Concluso ao Juiz" },
    { numero: "PM/2024/004", requerente: "Ministério Público", dataPedido: "2024-11-13", tipo: "Aclaração", status: "Concluso ao Juiz" },
  ];

  const aclaracoesDecididas = [
    { numero: "PM/2024/002", requerente: "Maria Santos", dataPedido: "2024-10-25", dataDespacho: "2024-10-28", decisao: "Deferido Parcialmente", status: "Notificado" },
  ];

  const onSubmit = (data: any) => {
    toast({
      title: "Pedido de Aclaração Registado",
      description: "Pedido concluso ao Juiz Relator para análise e despacho de aclaração.",
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
              <MessageSquare className="h-8 w-8 text-primary" />
              Pedido de Aclaração
            </h1>
            <p className="text-muted-foreground">Reclamação para aclaração ou correção de erros materiais do acórdão</p>
          </div>
        </div>
      </div>

      {!showForm ? (
        <Tabs defaultValue="notificados" className="space-y-6">
          <TabsList>
            <TabsTrigger value="notificados">Processos Notificados</TabsTrigger>
            <TabsTrigger value="pendentes">Pedidos Pendentes</TabsTrigger>
            <TabsTrigger value="decididos">Aclarações Decididas</TabsTrigger>
          </TabsList>

          <TabsContent value="notificados">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processos Notificados - Prazo para Aclaração</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Data Notificação</TableHead>
                    <TableHead>Decisão</TableHead>
                    <TableHead>Prazo Fim</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processosNotificados.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell>{processo.dataNotificacao}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{processo.decisao}</Badge>
                      </TableCell>
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
                          <Plus className="h-4 w-4" />
                          Dar Entrada
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
              <h3 className="text-lg font-semibold mb-4">Pedidos de Aclaração Pendentes</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Requerente</TableHead>
                    <TableHead>Data Pedido</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidosPendentes.map((pedido) => (
                    <TableRow key={pedido.numero}>
                      <TableCell className="font-medium">{pedido.numero}</TableCell>
                      <TableCell>{pedido.requerente}</TableCell>
                      <TableCell>{pedido.dataPedido}</TableCell>
                      <TableCell>{pedido.tipo}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{pedido.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          Ver Pedido
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="decididos">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Aclarações Decididas e Notificadas</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Requerente</TableHead>
                    <TableHead>Data Pedido</TableHead>
                    <TableHead>Data Despacho</TableHead>
                    <TableHead>Decisão</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aclaracoesDecididas.map((aclaracao) => (
                    <TableRow key={aclaracao.numero}>
                      <TableCell className="font-medium">{aclaracao.numero}</TableCell>
                      <TableCell>{aclaracao.requerente}</TableCell>
                      <TableCell>{aclaracao.dataPedido}</TableCell>
                      <TableCell>{aclaracao.dataDespacho}</TableCell>
                      <TableCell>
                        <Badge className="bg-success">{aclaracao.decisao}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{aclaracao.status}</Badge>
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
                  <div><strong>Data Notificação Acórdão:</strong> 12/11/2024</div>
                  <div><strong>Decisão:</strong> Condenação</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Identificação do Requerente</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoRequerente">Tipo de Requerente *</Label>
                    <Select onValueChange={(value) => setValue("tipoRequerente", value)}>
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
                      <Label htmlFor="nomeRequerente">Nome Completo *</Label>
                      <Input id="nomeRequerente" placeholder="Nome do requerente" {...register("nomeRequerente")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualificacao">Qualificação *</Label>
                      <Input id="qualificacao" placeholder="Cargo/função" {...register("qualificacao")} />
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
                      <Label htmlFor="dataEntradaSG">Data Entrada na SG *</Label>
                      <Input id="dataEntradaSG" type="date" {...register("dataEntradaSG")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="protocolo">Número de Protocolo *</Label>
                      <Input id="protocolo" placeholder="PROT/2024/001" {...register("protocolo")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipoPedido">Tipo de Pedido *</Label>
                      <Select onValueChange={(value) => setValue("tipoPedido", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aclaracao">Aclaração</SelectItem>
                          <SelectItem value="correcao">Correção de Erro Material</SelectItem>
                          <SelectItem value="ambos">Aclaração e Correção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Fundamentos do Pedido</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pontosDuvida">Pontos do Acórdão que Geram Dúvida/Erro *</Label>
                    <Textarea
                      id="pontosDuvida"
                      placeholder="Identificação precisa dos pontos do acórdão que requerem aclaração ou correção..."
                      rows={4}
                      {...register("pontosDuvida")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundamentacao">Fundamentação do Pedido *</Label>
                    <Textarea
                      id="fundamentacao"
                      placeholder="Argumentação detalhada sobre a necessidade de aclaração ou correção..."
                      rows={5}
                      {...register("fundamentacao")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pedidoEspecifico">Pedido Específico *</Label>
                    <Textarea
                      id="pedidoEspecifico"
                      placeholder="O que especificamente se requer que seja aclarado ou corrigido..."
                      rows={3}
                      {...register("pedidoEspecifico")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Documentos</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="peticaoPDF">Petição de Aclaração (PDF) *</Label>
                    <Input id="peticaoPDF" type="file" accept=".pdf" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentosAnexos">Documentos de Suporte</Label>
                    <Input id="documentosAnexos" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Observações Importantes:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Pedido deve ser apresentado após comunicação do acórdão</li>
                  <li>Aclaração destina-se a esclarecer obscuridades ou ambiguidades</li>
                  <li>Correção aplica-se apenas a erros materiais (erros de cálculo, lapsos de escrita)</li>
                  <li>Não serve para modificar o mérito da decisão</li>
                  <li>Juiz Relator profere despacho de aclaração</li>
                  <li>Após aclaração, partes são notificadas</li>
                </ul>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-hover gap-2">
                  <FileText className="h-4 w-4" />
                  Registar e Enviar ao Juiz
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
};
