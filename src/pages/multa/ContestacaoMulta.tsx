import { ArrowLeft, FileCheck, Upload, Eye } from "lucide-react";
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

interface ContestacaoMultaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const ContestacaoMulta = ({ onBack, onNavigate }: ContestacaoMultaProps) => {
  const { toast } = useToast();
  const { register, handleSubmit } = useForm();
  const [showForm, setShowForm] = useState(false);

  const prazoContestacao = [
    { numero: "PM/2024/001", demandado: "João Silva", dataNotificacao: "2024-10-25", prazoFim: "2024-11-04", diasRestantes: "3", status: "Prazo em Curso" },
  ];

  const contestacoesRecebidas = [
    { numero: "PM/2024/003", demandado: "António Costa", dataContestacao: "2024-10-28", dataRecebimento: "2024-10-29", status: "Vista ao MP" },
  ];

  const naoContestados = [
    { numero: "PM/2024/002", demandado: "Maria Santos", dataNotificacao: "2024-10-10", prazoFim: "2024-10-20", status: "Não Contestou" },
  ];

  const onSubmit = (data: any) => {
    toast({
      title: "Contestação Registada",
      description: "Autos conclusos ao Juiz Relator para análise e inscrição em tabela para julgamento.",
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
              <FileCheck className="h-8 w-8 text-primary" />
              Pedido de Contestação
            </h1>
            <p className="text-muted-foreground">Entrada e análise de contestação (prazo de 10 dias improrrogáveis)</p>
          </div>
        </div>
      </div>

      {!showForm ? (
        <Tabs defaultValue="prazo" className="space-y-6">
          <TabsList>
            <TabsTrigger value="prazo">Prazo de Contestação</TabsTrigger>
            <TabsTrigger value="recebidas">Contestações Recebidas</TabsTrigger>
            <TabsTrigger value="nao-contestados">Não Contestados</TabsTrigger>
          </TabsList>

          <TabsContent value="prazo">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processos em Prazo de Contestação</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Data Notificação</TableHead>
                    <TableHead>Prazo Fim</TableHead>
                    <TableHead>Dias Restantes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prazoContestacao.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell>{processo.dataNotificacao}</TableCell>
                      <TableCell className="font-semibold">{processo.prazoFim}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{processo.diasRestantes} dias</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-accent border-accent hover:bg-accent/10 gap-2"
                          onClick={() => setShowForm(true)}
                        >
                          <Upload className="h-4 w-4" />
                          Dar Entrada
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="recebidas">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contestações Recebidas</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Data Contestação</TableHead>
                    <TableHead>Data Recebimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contestacoesRecebidas.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell>{processo.dataContestacao}</TableCell>
                      <TableCell>{processo.dataRecebimento}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          Ver Contestação
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="nao-contestados">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processos Não Contestados</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Demandado</TableHead>
                    <TableHead>Data Notificação</TableHead>
                    <TableHead>Prazo Fim</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Próxima Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {naoContestados.map((processo) => (
                    <TableRow key={processo.numero}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.demandado}</TableCell>
                      <TableCell>{processo.dataNotificacao}</TableCell>
                      <TableCell className="text-destructive font-semibold">{processo.prazoFim}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigate?.("audiencia-julgamento-multa")}
                        >
                          Marcar Audiência
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
                  <div><strong>Prazo Fim:</strong> 04/11/2024</div>
                  <div><strong>Dias Restantes:</strong> 3 dias</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Dados da Contestação</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataContestacao">Data da Contestação *</Label>
                      <Input id="dataContestacao" type="date" {...register("dataContestacao")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataEntrada">Data de Entrada na SG *</Label>
                      <Input id="dataEntrada" type="date" {...register("dataEntrada")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="protocolo">Número de Protocolo *</Label>
                      <Input id="protocolo" placeholder="PROT/2024/001" {...register("protocolo")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recebidoPor">Recebido Por *</Label>
                      <Input id="recebidoPor" placeholder="Nome do funcionário" {...register("recebidoPor")} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Conteúdo da Contestação</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fundamentacao">Fundamentos Apresentados *</Label>
                    <Textarea
                      id="fundamentacao"
                      placeholder="Resumo dos fundamentos da contestação apresentados pelo demandado..."
                      rows={6}
                      {...register("fundamentacao")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pedidoContestacao">Pedido *</Label>
                    <Textarea
                      id="pedidoContestacao"
                      placeholder="O que o demandado requer (absolvição, redução da multa, etc.)..."
                      rows={3}
                      {...register("pedidoContestacao")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Documentos e Provas</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contestacaoPDF">Peça de Contestação (PDF) *</Label>
                    <Input id="contestacaoPDF" type="file" accept=".pdf" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provasAnexas">Provas Anexas</Label>
                    <Input id="provasAnexas" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testemunhas">Testemunhas Arroladas (máx. 3 por facto)</Label>
                    <Textarea
                      id="testemunhas"
                      placeholder="Lista de testemunhas com qualificação completa..."
                      rows={3}
                      {...register("testemunhas")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Advogado Constituído</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeAdvogado">Nome do Advogado</Label>
                    <Input id="nomeAdvogado" placeholder="Nome completo" {...register("nomeAdvogado")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroOA">Número da Ordem dos Advogados</Label>
                    <Input id="numeroOA" placeholder="OA Nº" {...register("numeroOA")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enderecoAdvogado">Endereço Profissional</Label>
                    <Input id="enderecoAdvogado" placeholder="Escritório/endereço" {...register("enderecoAdvogado")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contatoAdvogado">Contacto</Label>
                    <Input id="contatoAdvogado" placeholder="Telefone/email" {...register("contatoAdvogado")} />
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Próximos Passos:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Autos conclusos ao Juiz Relator</li>
                  <li>Inscrição em tabela para julgamento</li>
                  <li>Vista ao Ministério Público</li>
                  <li>Notificação para audiência de julgamento</li>
                  <li>Começa a correr juros moratórios (5% ao ano)</li>
                </ul>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-hover gap-2">
                  <FileCheck className="h-4 w-4" />
                  Registar Contestação
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
};
