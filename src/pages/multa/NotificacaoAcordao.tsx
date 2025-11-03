import { ArrowLeft, Send, FileText, Eye } from "lucide-react";
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

interface NotificacaoAcordaoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const NotificacaoAcordao = ({ onBack, onNavigate }: NotificacaoAcordaoProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, setValue } = useForm();
  const [showForm, setShowForm] = useState(false);

  const aguardandoNotificacao = [
    { numero: "PM/2024/001", demandado: "João Silva", dataAcordao: "2024-11-18", decisao: "Condenação", valorMulta: "5.000.000 Kz", status: "Assinado pela Câmara" },
    { numero: "PM/2024/002", demandado: "Maria Santos", dataAcordao: "2024-11-17", decisao: "Absolvição", valorMulta: "-", status: "Assinado pela Câmara" },
  ];

  const notificados = [
    { numero: "PM/2024/003", demandado: "António Costa", dataAcordao: "2024-11-10", dataNotificacao: "2024-11-12", decisao: "Condenação", valorMulta: "3.500.000 Kz", status: "Notificado" },
  ];

  const transitadoEmJulgado = [
    { numero: "PM/2024/004", demandado: "Pedro Alves", dataAcordao: "2024-10-20", dataNotificacao: "2024-10-22", dataTransito: "2024-11-06", decisao: "Condenação", status: "Trânsito em Julgado" },
  ];

  const onSubmit = (data: any) => {
    toast({
      title: "Notificação de Acórdão Emitida",
      description: "Mandado de notificação gerado e enviado ao demandado. Prazo para recurso iniciado.",
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
              <Send className="h-8 w-8 text-primary" />
              Notificação do Acórdão
            </h1>
            <p className="text-muted-foreground">Junção e notificação do acórdão assinado aos demandados</p>
          </div>
        </div>
      </div>

      {!showForm ? (
        <Tabs defaultValue="aguardando" className="space-y-6">
          <TabsList>
            <TabsTrigger value="aguardando">Aguardando Notificação</TabsTrigger>
            <TabsTrigger value="notificados">Notificados</TabsTrigger>
            <TabsTrigger value="transitado">Trânsito em Julgado</TabsTrigger>
          </TabsList>

          <TabsContent value="aguardando">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Acórdãos Aguardando Notificação</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Data Acórdão</TableHead>
                    <TableHead>Decisão</TableHead>
                    <TableHead>Valor da Multa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aguardandoNotificacao.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell>{processo.dataAcordao}</TableCell>
                      <TableCell>
                        <Badge variant={processo.decisao === "Condenação" ? "destructive" : "default"}>
                          {processo.decisao}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-destructive">{processo.valorMulta}</TableCell>
                      <TableCell>
                        <Badge className="bg-success">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-accent border-accent hover:bg-accent/10 gap-2"
                          onClick={() => setShowForm(true)}
                        >
                          <Send className="h-4 w-4" />
                          Notificar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="notificados">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Acórdãos Notificados - Prazo para Recurso</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Data Acórdão</TableHead>
                    <TableHead>Data Notificação</TableHead>
                    <TableHead>Decisão</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificados.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell>{processo.dataAcordao}</TableCell>
                      <TableCell>{processo.dataNotificacao}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{processo.decisao}</Badge>
                      </TableCell>
                      <TableCell className="font-bold">{processo.valorMulta}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          Ver Mandado
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="transitado">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Acórdãos com Trânsito em Julgado</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Data Acórdão</TableHead>
                    <TableHead>Data Notificação</TableHead>
                    <TableHead>Data Trânsito</TableHead>
                    <TableHead>Decisão</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transitadoEmJulgado.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell>{processo.dataAcordao}</TableCell>
                      <TableCell>{processo.dataNotificacao}</TableCell>
                      <TableCell className="font-semibold">{processo.dataTransito}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{processo.decisao}</Badge>
                      </TableCell>
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
                <h3 className="font-semibold text-accent mb-2">Acórdão do Processo</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Número:</strong> PM/2024/001</div>
                  <div><strong>Demandado:</strong> João Silva</div>
                  <div><strong>Data Acórdão:</strong> 18/11/2024</div>
                  <div><strong>Decisão:</strong> Condenação</div>
                  <div className="col-span-2"><strong>Valor da Multa:</strong> 5.000.000 Kz</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Despacho do Relator</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataDespacho">Data do Despacho *</Label>
                      <Input id="dataDespacho" type="date" {...register("dataDespacho")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroMandado">Número do Mandado *</Label>
                      <Input id="numeroMandado" placeholder="MAND/2024/001" {...register("numeroMandado")} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textoDespacho">Texto do Despacho *</Label>
                    <Textarea
                      id="textoDespacho"
                      placeholder="Ordena-se a junção aos autos do acórdão assinado pelos Conselheiros da 2ª Câmara e a notificação ao demandado..."
                      rows={4}
                      {...register("textoDespacho")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Dados para Notificação</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="formaNotificacao">Forma de Notificação *</Label>
                    <Select onValueChange={(value) => setValue("formaNotificacao", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pessoal">Notificação Pessoal</SelectItem>
                        <SelectItem value="advogado">Via Advogado Constituído</SelectItem>
                        <SelectItem value="correio">Via Correio Registado</SelectItem>
                        <SelectItem value="eletronico">Via Correio Eletrónico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="enderecoNotificacao">Endereço de Notificação *</Label>
                      <Input id="enderecoNotificacao" placeholder="Endereço completo" {...register("enderecoNotificacao")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destinatario">Destinatário *</Label>
                      <Input id="destinatario" placeholder="Nome do destinatário" {...register("destinatario")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone de Contacto</Label>
                      <Input id="telefone" placeholder="+244 900 000 000" {...register("telefone")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@exemplo.ao" {...register("email")} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oficialJustica">Oficial de Justiça *</Label>
                    <Input id="oficialJustica" placeholder="Nome do oficial responsável" {...register("oficialJustica")} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Conteúdo da Notificação</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resumoAcordao">Resumo do Acórdão *</Label>
                    <Textarea
                      id="resumoAcordao"
                      placeholder="Resumo do dispositivo do acórdão..."
                      rows={4}
                      {...register("resumoAcordao")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Informações adicionais..."
                      rows={2}
                      {...register("observacoes")}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Informações na Notificação:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Cópia integral do acórdão assinado</li>
                  <li>Prazo para interpor recurso (se aplicável)</li>
                  <li>Prazo para pagamento (em caso de condenação)</li>
                  <li>Consequências do não cumprimento</li>
                  <li>Informação sobre possibilidade de pedido de aclaração</li>
                </ul>
              </div>

              <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                <h4 className="font-semibold text-destructive mb-2">Em caso de Condenação:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Prazo para pagamento voluntário</li>
                  <li>Possibilidade de pagamento em prestações (até 6 trimestrais)</li>
                  <li>Juros de mora de 5% ao ano</li>
                  <li>Extração de certidão para cobrança coerciva se não pagar</li>
                </ul>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-hover gap-2">
                  <FileText className="h-4 w-4" />
                  Gerar Mandado de Notificação
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
};
