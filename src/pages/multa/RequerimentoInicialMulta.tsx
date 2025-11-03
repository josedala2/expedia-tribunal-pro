import { ArrowLeft, FileText, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface RequerimentoInicialMultaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const RequerimentoInicialMulta = ({ onBack, onNavigate }: RequerimentoInicialMultaProps) => {
  const { toast } = useToast();
  const { register, handleSubmit } = useForm();
  const [showForm, setShowForm] = useState(false);

  const processosAguardandoRequerimento = [
    { numero: "PM/2024/001", entidade: "Empresa Municipal X", dataRemessa: "2024-11-01", status: "Aguardando Requerimento" },
    { numero: "PM/2024/002", entidade: "Instituto Y", dataRemessa: "2024-11-02", status: "Aguardando Requerimento" },
  ];

  const requerimentosElaborados = [
    { numero: "PM/2024/003", entidade: "Fundação Z", dataRequerimento: "2024-10-28", status: "Enviado ao Juiz" },
  ];

  const onSubmit = (data: any) => {
    toast({
      title: "Requerimento Inicial Elaborado",
      description: "Requerimento enviado ao Juiz Relator para análise e despacho.",
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
              <FileText className="h-8 w-8 text-primary" />
              Elaboração do Requerimento Inicial
            </h1>
            <p className="text-muted-foreground">Ministério Público elabora o requerimento inicial do processo de multa</p>
          </div>
        </div>
      </div>

      {!showForm ? (
        <>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Processos Aguardando Requerimento Inicial</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Processo</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Data Remessa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processosAguardandoRequerimento.map((processo) => (
                  <TableRow key={processo.numero}>
                    <TableCell className="font-medium">{processo.numero}</TableCell>
                    <TableCell>{processo.entidade}</TableCell>
                    <TableCell>{processo.dataRemessa}</TableCell>
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
                        Elaborar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Requerimentos Elaborados</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Processo</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Data Requerimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requerimentosElaborados.map((processo) => (
                  <TableRow key={processo.numero}>
                    <TableCell className="font-medium">{processo.numero}</TableCell>
                    <TableCell>{processo.entidade}</TableCell>
                    <TableCell>{processo.dataRequerimento}</TableCell>
                    <TableCell>
                      <Badge className="bg-success">{processo.status}</Badge>
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
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-6">
            <div className="space-y-6">
              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <h3 className="font-semibold text-accent mb-2">Processo de Multa</h3>
                <p className="text-sm"><strong>Número:</strong> PM/2024/001</p>
                <p className="text-sm"><strong>Entidade:</strong> Empresa Municipal X</p>
                <p className="text-sm"><strong>Data Remessa:</strong> 01/11/2024</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">1. Identificação do Demandado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeDemandado">Nome Completo *</Label>
                    <Input id="nomeDemandado" placeholder="Nome do gestor/responsável" {...register("nomeDemandado")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="residencia">Residência *</Label>
                    <Input id="residencia" placeholder="Endereço completo" {...register("residencia")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="localTrabalho">Local de Trabalho *</Label>
                    <Input id="localTrabalho" placeholder="Instituição/empresa" {...register("localTrabalho")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="funcao">Função *</Label>
                    <Input id="funcao" placeholder="Cargo exercido" {...register("funcao")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remuneracao">Remuneração *</Label>
                    <Input id="remuneracao" placeholder="Valor mensal" {...register("remuneracao")} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">2. Razões de Facto e de Direito</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="factos">Factos Articulados *</Label>
                    <Textarea
                      id="factos"
                      placeholder="Descrição detalhada e articulada dos factos que fundamentam o pedido..."
                      rows={6}
                      {...register("factos")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fundamentoJuridico">Fundamento Jurídico *</Label>
                    <Textarea
                      id="fundamentoJuridico"
                      placeholder="Base legal e normativa aplicável (leis, decretos, artigos)..."
                      rows={4}
                      {...register("fundamentoJuridico")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">3. Pedido e Valores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valorMulta">Valor da Multa (Kz) *</Label>
                    <Input id="valorMulta" type="number" placeholder="5000000" {...register("valorMulta")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emolumentos">Emolumentos (Kz) *</Label>
                    <Input id="emolumentos" type="number" placeholder="500000" {...register("emolumentos")} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="pedido">Formulação do Pedido *</Label>
                    <Textarea
                      id="pedido"
                      placeholder="Requer-se a condenação do demandado ao pagamento de..."
                      rows={3}
                      {...register("pedido")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">4. Provas</h3>
                <div className="space-y-2">
                  <Label htmlFor="provas">Provas Apresentadas (máximo 3 testemunhas por facto)</Label>
                  <Textarea
                    id="provas"
                    placeholder="Lista de documentos, testemunhas e demais provas..."
                    rows={4}
                    {...register("provas")}
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-hover gap-2">
                  <Save className="h-4 w-4" />
                  Enviar Requerimento
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
};
