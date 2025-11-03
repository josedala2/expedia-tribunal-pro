import { ArrowLeft, AlertCircle, FileText, DollarSign, Send } from "lucide-react";
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

interface CobrancaCoercivaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const CobrancaCoerciva = ({ onBack }: CobrancaCoercivaProps) => {
  const { toast } = useToast();
  const { register, handleSubmit } = useForm();
  const [showForm, setShowForm] = useState(false);

  const naoVencidos = [
    { numero: "PM/2024/001", demandado: "João Silva", valorTotal: "5.500.000 Kz", dataTransito: "2024-11-06", prazoFimPagamento: "2024-12-06", diasRestantes: "18", status: "Prazo em Curso" },
  ];

  const vencidosNaoPagos = [
    { numero: "PM/2024/003", demandado: "António Costa", valorTotal: "3.500.000 Kz", dataTransito: "2024-10-20", prazoFimPagamento: "2024-11-20", diasVencidos: "3", status: "Prazo Vencido" },
    { numero: "PM/2024/002", demandado: "Maria Santos", valorTotal: "2.700.000 Kz", dataTransito: "2024-10-15", prazoFimPagamento: "2024-11-15", diasVencidos: "8", status: "Prazo Vencido" },
  ];

  const emExecucao = [
    { numero: "PM/2024/004", demandado: "Pedro Alves", valorTotal: "8.000.000 Kz", dataCertidao: "2024-10-25", dataRemessaMP: "2024-10-26", status: "Em Execução" },
  ];

  const onSubmit = (data: any) => {
    toast({
      title: "Certidão para Cobrança Coerciva Extraída",
      description: "Certidão gerada e remetida ao Ministério Público para processo de execução.",
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
              <AlertCircle className="h-8 w-8 text-primary" />
              Execução/Cobrança Coerciva
            </h1>
            <p className="text-muted-foreground">Extração de certidões para cobrança coerciva após não pagamento</p>
          </div>
        </div>
      </div>

      {!showForm ? (
        <Tabs defaultValue="prazo" className="space-y-6">
          <TabsList>
            <TabsTrigger value="prazo">Prazo de Pagamento</TabsTrigger>
            <TabsTrigger value="vencidos">Vencidos Não Pagos</TabsTrigger>
            <TabsTrigger value="execucao">Em Execução</TabsTrigger>
          </TabsList>

          <TabsContent value="prazo">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processos em Prazo de Pagamento</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Data Trânsito</TableHead>
                    <TableHead>Prazo Fim</TableHead>
                    <TableHead>Dias Restantes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {naoVencidos.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell className="font-bold text-destructive">{processo.valorTotal}</TableCell>
                      <TableCell>{processo.dataTransito}</TableCell>
                      <TableCell className="font-semibold">{processo.prazoFimPagamento}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{processo.diasRestantes} dias</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{processo.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="vencidos">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processos com Prazo Vencido Sem Pagamento</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Data Trânsito</TableHead>
                    <TableHead>Prazo Fim</TableHead>
                    <TableHead>Dias Vencidos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vencidosNaoPagos.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell className="font-bold text-destructive">{processo.valorTotal}</TableCell>
                      <TableCell>{processo.dataTransito}</TableCell>
                      <TableCell className="text-destructive">{processo.prazoFimPagamento}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{processo.diasVencidos} dias</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive/10 gap-2"
                          onClick={() => setShowForm(true)}
                        >
                          <FileText className="h-4 w-4" />
                          Extrair Certidão
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="execucao">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processos em Execução - Cobrança Coerciva</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Data Certidão</TableHead>
                    <TableHead>Data Remessa MP</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emExecucao.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell className="font-bold text-destructive">{processo.valorTotal}</TableCell>
                      <TableCell>{processo.dataCertidao}</TableCell>
                      <TableCell>{processo.dataRemessaMP}</TableCell>
                      <TableCell>
                        <Badge className="bg-destructive">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Ver Certidão
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
              <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                <h3 className="font-semibold text-destructive mb-2">Processo de Multa - Pagamento Não Efetuado</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Número:</strong> PM/2024/003</div>
                  <div><strong>Demandado:</strong> António Costa</div>
                  <div><strong>Valor Total:</strong> 3.500.000 Kz</div>
                  <div><strong>Prazo Vencido:</strong> 3 dias</div>
                  <div className="col-span-2 text-destructive font-semibold">
                    ⚠️ Prazo de pagamento vencido. Requer extração de certidão para cobrança coerciva.
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Despacho do Juiz Relator</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataDespacho">Data do Despacho *</Label>
                      <Input id="dataDespacho" type="date" {...register("dataDespacho")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroCertidao">Número da Certidão *</Label>
                      <Input id="numeroCertidao" placeholder="CERT/2024/001" {...register("numeroCertidao")} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textoDespacho">Texto do Despacho *</Label>
                    <Textarea
                      id="textoDespacho"
                      placeholder="Verificado o não pagamento no prazo legal, ordena-se a extração de certidão para cobrança coerciva..."
                      rows={4}
                      {...register("textoDespacho")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Dados da Certidão</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorPrincipal">Valor Principal (Kz) *</Label>
                      <Input id="valorPrincipal" type="number" placeholder="3000000" {...register("valorPrincipal")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emolumentos">Emolumentos (Kz) *</Label>
                      <Input id="emolumentos" type="number" placeholder="500000" {...register("emolumentos")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jurosMora">Juros de Mora (Kz)</Label>
                      <Input id="jurosMora" type="number" placeholder="0" {...register("jurosMora")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custas">Custas Processuais (Kz)</Label>
                      <Input id="custas" type="number" placeholder="0" {...register("custas")} />
                    </div>
                  </div>

                  <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                    <h4 className="font-semibold text-accent mb-2">Cálculo Total:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Valor Principal:</span>
                        <span className="font-bold">3.000.000 Kz</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emolumentos:</span>
                        <span className="font-bold">500.000 Kz</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Juros de Mora (5% ao ano):</span>
                        <span className="font-bold">0 Kz</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Custas:</span>
                        <span className="font-bold">0 Kz</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-accent/20">
                        <span className="font-bold text-destructive">Total a Executar:</span>
                        <span className="font-bold text-destructive text-lg">3.500.000 Kz</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Dados do Executado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeExecutado">Nome Completo *</Label>
                    <Input id="nomeExecutado" placeholder="Nome do executado" {...register("nomeExecutado")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentoIdentidade">Documento de Identidade *</Label>
                    <Input id="documentoIdentidade" placeholder="BI/Cédula" {...register("documentoIdentidade")} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="residencia">Residência/Domicílio *</Label>
                    <Input id="residencia" placeholder="Endereço completo" {...register("residencia")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profissao">Profissão/Atividade</Label>
                    <Input id="profissao" placeholder="Profissão" {...register("profissao")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="localTrabalho">Local de Trabalho</Label>
                    <Input id="localTrabalho" placeholder="Instituição/empresa" {...register("localTrabalho")} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Remessa ao Ministério Público</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataRemessa">Data de Remessa *</Label>
                      <Input id="dataRemessa" type="date" {...register("dataRemessa")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroOficio">Número do Ofício *</Label>
                      <Input id="numeroOficio" placeholder="OF/2024/001" {...register("numeroOficio")} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações para o MP</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Informações adicionais relevantes para o processo de execução..."
                      rows={3}
                      {...register("observacoes")}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Conteúdo da Certidão:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Identificação completa do executado</li>
                  <li>Descrição da dívida (principal + acessórios)</li>
                  <li>Cópia do acórdão condenatório transitado em julgado</li>
                  <li>Comprovativo de notificação para pagamento voluntário</li>
                  <li>Demonstração do não pagamento no prazo</li>
                  <li>Indicação de bens penhoráveis (se conhecidos)</li>
                </ul>
              </div>

              <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                <h4 className="font-semibold text-destructive mb-2">Processo de Execução:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>MP instaurará processo de execução fiscal</li>
                  <li>Citação do executado para pagar ou nomear bens à penhora</li>
                  <li>Penhora e venda judicial de bens se necessário</li>
                  <li>Execução pode incluir arresto de salários/rendimentos</li>
                  <li>Custas do processo de execução são da responsabilidade do executado</li>
                </ul>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-hover gap-2">
                  <Send className="h-4 w-4" />
                  Extrair Certidão e Remeter ao MP
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
};
