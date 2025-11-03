import { ArrowLeft, Bell, Send, FileText } from "lucide-react";
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

interface NotificacaoDemandadoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const NotificacaoDemandado = ({ onBack }: NotificacaoDemandadoProps) => {
  const { toast } = useToast();
  const { register, handleSubmit } = useForm();
  const [showForm, setShowForm] = useState(false);

  const aguardandoNotificacao = [
    { numero: "PM/2024/001", entidade: "Empresa Municipal X", demandado: "João Silva", valorMulta: "5.000.000 Kz", status: "Requerimento Aprovado" },
    { numero: "PM/2024/002", entidade: "Instituto Y", demandado: "Maria Santos", valorMulta: "2.500.000 Kz", status: "Requerimento Aprovado" },
  ];

  const notificadas = [
    { numero: "PM/2024/003", entidade: "Fundação Z", demandado: "António Costa", dataNotificacao: "2024-10-25", prazoFim: "2024-11-04", status: "Prazo em Curso" },
  ];

  const prazoExpirado = [
    { numero: "PM/2024/004", entidade: "Empresa ABC", demandado: "Pedro Alves", dataNotificacao: "2024-10-10", prazoFim: "2024-10-20", status: "Não Contestou", acao: "Aguarda Julgamento" },
  ];

  const onSubmit = (data: any) => {
    toast({
      title: "Notificação Emitida",
      description: "Mandado de notificação gerado. Prazo de 10 dias improrrogáveis iniciado.",
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
              <Bell className="h-8 w-8 text-primary" />
              Notificação ao Demandado
            </h1>
            <p className="text-muted-foreground">Juiz Relator ordena notificação para contestação ou pagamento voluntário (10 dias improrrogáveis)</p>
          </div>
        </div>
      </div>

      {!showForm ? (
        <Tabs defaultValue="aguardando" className="space-y-6">
          <TabsList>
            <TabsTrigger value="aguardando">Aguardando Notificação</TabsTrigger>
            <TabsTrigger value="notificadas">Notificadas</TabsTrigger>
            <TabsTrigger value="expirado">Prazo Expirado</TabsTrigger>
          </TabsList>

          <TabsContent value="aguardando">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processos Aguardando Notificação</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Entidade</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Valor da Multa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aguardandoNotificacao.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.entidade}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
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

          <TabsContent value="notificadas">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processos Notificados - Prazo em Curso</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Entidade</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Data Notificação</TableHead>
                    <TableHead>Fim do Prazo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificadas.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.entidade}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell>{processo.dataNotificacao}</TableCell>
                      <TableCell className="font-semibold">{processo.prazoFim}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Ver Mandado
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="expirado">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processos com Prazo Expirado</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Entidade</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Data Notificação</TableHead>
                    <TableHead>Fim do Prazo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Próxima Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prazoExpirado.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.entidade}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell>{processo.dataNotificacao}</TableCell>
                      <TableCell className="text-destructive font-semibold">{processo.prazoFim}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{processo.acao}</Badge>
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
                <p className="text-sm"><strong>Número:</strong> PM/2024/001</p>
                <p className="text-sm"><strong>Demandado:</strong> João Silva</p>
                <p className="text-sm"><strong>Valor da Multa:</strong> 5.000.000 Kz</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Despacho de Notificação</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataDespacho">Data do Despacho *</Label>
                    <Input id="dataDespacho" type="date" {...register("dataDespacho")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textoNotificacao">Texto da Notificação *</Label>
                    <Textarea
                      id="textoNotificacao"
                      placeholder="Notifica-se o demandado para, no prazo de 10 dias improrrogáveis, contestar ou pagar voluntariamente..."
                      rows={6}
                      {...register("textoNotificacao")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Dados para Notificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="enderecoNotificacao">Endereço de Notificação *</Label>
                    <Input id="enderecoNotificacao" placeholder="Endereço completo" {...register("enderecoNotificacao")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone de Contacto</Label>
                    <Input id="telefone" placeholder="+244 900 000 000" {...register("telefone")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@exemplo.ao" {...register("email")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oficialJustica">Oficial de Justiça *</Label>
                    <Input id="oficialJustica" placeholder="Nome do oficial" {...register("oficialJustica")} />
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Conteúdo da Notificação:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Prazo de 10 dias improrrogáveis para contestação</li>
                  <li>Possibilidade de pagamento voluntário (multa + emolumentos)</li>
                  <li>Informação sobre juros moratórios (5% ao ano)</li>
                  <li>Direito à constituição de advogado</li>
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
