import { ArrowLeft, Calendar, Plus, FileText } from "lucide-react";
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

interface PagamentoPrestacoesProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const PagamentoPrestacoes = ({ onBack }: PagamentoPrestacoesProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, setValue } = useForm();
  const [showForm, setShowForm] = useState(false);
  const [numeroPrestacoes, setNumeroPrestacoes] = useState("6");

  const pedidosPendentes = [
    { numero: "PM/2024/001", demandado: "João Silva", valorTotal: "5.500.000 Kz", dataCondenacao: "2024-10-20", status: "Aguardando Análise" },
  ];

  const parcelamentosAtivos = [
    { numero: "PM/2024/003", demandado: "António Costa", valorTotal: "3.500.000 Kz", prestacoes: "6", prestacaoPaga: "2", proximaData: "2024-12-01", status: "Em Dia" },
  ];

  const parcelamentosVencidos = [
    { numero: "PM/2024/002", demandado: "Maria Santos", valorTotal: "2.700.000 Kz", prestacoes: "6", prestacaoPaga: "1", dataVencimento: "2024-10-15", status: "Vencido" },
  ];

  const onSubmit = (data: any) => {
    toast({
      title: "Pedido de Parcelamento Registado",
      description: "Pedido enviado ao Juiz Relator para análise e deferimento.",
    });
    setShowForm(false);
  };

  const calcularPrestacao = (total: number, prestacoes: number) => {
    return (total / prestacoes).toFixed(2);
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
              <Calendar className="h-8 w-8 text-primary" />
              Pagamento em Prestações
            </h1>
            <p className="text-muted-foreground">Gestão de pedido de pagamento parcelado (até 6 prestações trimestrais)</p>
          </div>
        </div>
      </div>

      {!showForm ? (
        <Tabs defaultValue="pendentes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pendentes">Pedidos Pendentes</TabsTrigger>
            <TabsTrigger value="ativos">Parcelamentos Ativos</TabsTrigger>
            <TabsTrigger value="vencidos">Parcelamentos Vencidos</TabsTrigger>
          </TabsList>

          <TabsContent value="pendentes">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Pedidos de Parcelamento Pendentes</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Data Condenação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidosPendentes.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell className="font-bold">{processo.valorTotal}</TableCell>
                      <TableCell>{processo.dataCondenacao}</TableCell>
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
                          Analisar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="ativos">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Parcelamentos Ativos</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Prestações</TableHead>
                    <TableHead>Pagas</TableHead>
                    <TableHead>Próxima Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parcelamentosAtivos.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell className="font-bold">{processo.valorTotal}</TableCell>
                      <TableCell>{processo.prestacoes}</TableCell>
                      <TableCell>{processo.prestacaoPaga}</TableCell>
                      <TableCell>{processo.proximaData}</TableCell>
                      <TableCell>
                        <Badge className="bg-success">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Ver Plano
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="vencidos">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Parcelamentos com Prestações Vencidas</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Prestações</TableHead>
                    <TableHead>Pagas</TableHead>
                    <TableHead>Data Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parcelamentosVencidos.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell className="font-bold">{processo.valorTotal}</TableCell>
                      <TableCell>{processo.prestacoes}</TableCell>
                      <TableCell>{processo.prestacaoPaga}</TableCell>
                      <TableCell className="text-destructive">{processo.dataVencimento}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="text-destructive border-destructive">
                          Executar Saldo
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
                  <div><strong>Valor Total:</strong> 5.500.000 Kz</div>
                  <div><strong>Data Condenação:</strong> 20/10/2024</div>
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
                      <Label htmlFor="numeroPrestacoes">Número de Prestações *</Label>
                      <Select onValueChange={(value) => { setNumeroPrestacoes(value); setValue("numeroPrestacoes", value); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 prestações</SelectItem>
                          <SelectItem value="3">3 prestações</SelectItem>
                          <SelectItem value="4">4 prestações</SelectItem>
                          <SelectItem value="5">5 prestações</SelectItem>
                          <SelectItem value="6">6 prestações (máximo)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="justificativa">Justificativa do Pedido *</Label>
                    <Textarea
                      id="justificativa"
                      placeholder="Razões para o pedido de pagamento parcelado..."
                      rows={4}
                      {...register("justificativa")}
                    />
                  </div>
                </div>
              </div>

              {numeroPrestacoes && (
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-primary mb-3">Plano de Pagamento Proposto:</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Valor de Cada Prestação:</strong> {calcularPrestacao(5500000, parseInt(numeroPrestacoes))} Kz</p>
                    <p><strong>Periodicidade:</strong> Trimestral</p>
                    <p><strong>Prazo Máximo:</strong> {parseInt(numeroPrestacoes) * 3} meses</p>
                    <p><strong>Juros de Mora:</strong> 5% ao ano (sobre prestações em atraso)</p>
                    <p className="text-destructive font-semibold mt-2">
                      ⚠️ Falta de pagamento de qualquer prestação importa o imediato vencimento das restantes e execução.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Despacho do Juiz Relator</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="decisao">Decisão *</Label>
                    <Select onValueChange={(value) => setValue("decisao", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a decisão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deferido">Deferido</SelectItem>
                        <SelectItem value="indeferido">Indeferido</SelectItem>
                        <SelectItem value="deferido_parcial">Deferido Parcialmente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundamentacaoDecisao">Fundamentação da Decisão *</Label>
                    <Textarea
                      id="fundamentacaoDecisao"
                      placeholder="Fundamentos para deferimento ou indeferimento..."
                      rows={4}
                      {...register("fundamentacaoDecisao")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataPrimeiraPressuado">Data da Primeira Prestação</Label>
                    <Input id="dataPrimeiraPressuado" type="date" {...register("dataPrimeiraPressuado")} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-hover gap-2">
                  <FileText className="h-4 w-4" />
                  Registar Decisão
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
};
