import { ArrowLeft, Coins, CheckCircle, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface PagamentoVoluntarioMultaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const PagamentoVoluntarioMulta = ({ onBack }: PagamentoVoluntarioMultaProps) => {
  const { toast } = useToast();
  const { register, handleSubmit } = useForm();
  const [showForm, setShowForm] = useState(false);

  const aguardandoPagamento = [
    { numero: "PM/2024/001", demandado: "João Silva", valorMulta: "5.000.000 Kz", emolumentos: "500.000 Kz", total: "5.500.000 Kz", dataNotificacao: "2024-10-25", prazoFim: "2024-11-04" },
  ];

  const pagamentosRecebidos = [
    { numero: "PM/2024/003", demandado: "António Costa", valorPago: "3.500.000 Kz", dataPagamento: "2024-10-28", status: "Vista ao MP", comprovante: "COMP2024/0123" },
  ];

  const arquivados = [
    { numero: "PM/2024/002", demandado: "Maria Santos", valorPago: "2.700.000 Kz", dataPagamento: "2024-10-20", dataArquivamento: "2024-10-25", status: "Arquivado" },
  ];

  const onSubmit = (data: any) => {
    toast({
      title: "Pagamento Registado",
      description: "Comprovativo enviado ao Juiz Relator para vista ao MP.",
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
              <Coins className="h-8 w-8 text-primary" />
              Pagamento Voluntário
            </h1>
            <p className="text-muted-foreground">Registo e comprovação de pagamento voluntário da multa</p>
          </div>
        </div>
      </div>

      {!showForm ? (
        <Tabs defaultValue="aguardando" className="space-y-6">
          <TabsList>
            <TabsTrigger value="aguardando">Aguardando Pagamento</TabsTrigger>
            <TabsTrigger value="recebidos">Pagamentos Recebidos</TabsTrigger>
            <TabsTrigger value="arquivados">Arquivados</TabsTrigger>
          </TabsList>

          <TabsContent value="aguardando">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processos Aguardando Pagamento Voluntário</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Valor Multa</TableHead>
                    <TableHead>Emolumentos</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Prazo Fim</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aguardandoPagamento.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell className="text-destructive font-bold">{processo.valorMulta}</TableCell>
                      <TableCell>{processo.emolumentos}</TableCell>
                      <TableCell className="font-bold">{processo.total}</TableCell>
                      <TableCell>{processo.prazoFim}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-accent border-accent hover:bg-accent/10 gap-2"
                          onClick={() => setShowForm(true)}
                        >
                          <Upload className="h-4 w-4" />
                          Registar Pagamento
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="recebidos">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Pagamentos Recebidos - Aguardando Vista ao MP</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Valor Pago</TableHead>
                    <TableHead>Data Pagamento</TableHead>
                    <TableHead>Comprovante</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentosRecebidos.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell className="font-bold text-success">{processo.valorPago}</TableCell>
                      <TableCell>{processo.dataPagamento}</TableCell>
                      <TableCell className="font-mono text-xs">{processo.comprovante}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Ver Comprovante
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="arquivados">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processos Arquivados por Pagamento</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Valor Pago</TableHead>
                    <TableHead>Data Pagamento</TableHead>
                    <TableHead>Data Arquivamento</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {arquivados.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell className="font-bold text-success">{processo.valorPago}</TableCell>
                      <TableCell>{processo.dataPagamento}</TableCell>
                      <TableCell>{processo.dataArquivamento}</TableCell>
                      <TableCell>
                        <Badge className="bg-success">{processo.status}</Badge>
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
                  <div><strong>Valor da Multa:</strong> 5.000.000 Kz</div>
                  <div><strong>Emolumentos:</strong> 500.000 Kz</div>
                  <div className="col-span-2 text-lg font-bold text-primary">
                    <strong>Total a Pagar:</strong> 5.500.000 Kz
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Dados do Pagamento</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataPagamento">Data do Pagamento *</Label>
                      <Input id="dataPagamento" type="date" {...register("dataPagamento")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valorPago">Valor Pago (Kz) *</Label>
                      <Input id="valorPago" type="number" placeholder="5500000" {...register("valorPago")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroComprovante">Número do Comprovante *</Label>
                      <Input id="numeroComprovante" placeholder="COMP2024/0001" {...register("numeroComprovante")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                      <Input id="formaPagamento" placeholder="Transferência bancária" {...register("formaPagamento")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="banco">Banco *</Label>
                      <Input id="banco" placeholder="Nome do banco" {...register("banco")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referencia">Referência da Transação *</Label>
                      <Input id="referencia" placeholder="Referência bancária" {...register("referencia")} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Comprovante de Pagamento</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="comprovante">Anexar Comprovante (PDF, JPG, PNG) *</Label>
                    <Input id="comprovante" type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Informações adicionais sobre o pagamento..."
                      rows={3}
                      {...register("observacoes")}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                <h4 className="font-semibold text-success mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Próximos Passos:
                </h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Comprovativo será concluso ao Juiz Relator</li>
                  <li>Juiz ordena abertura de vista ao Ministério Público</li>
                  <li>MP comprova pagamento e promove extinção da ação</li>
                  <li>Juiz procede ao arquivamento do processo</li>
                </ul>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-hover gap-2">
                  <CheckCircle className="h-4 w-4" />
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
