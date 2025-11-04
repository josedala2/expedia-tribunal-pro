import { ArrowLeft, FileWarning, Save, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const desencadearMultaSchema = z.object({
  processoOrigem: z.string().trim().min(1, "Processo de origem é obrigatório").max(50, "Máximo 50 caracteres"),
  tipoProcesso: z.string().trim().min(1, "Tipo de processo é obrigatório"),
  entidade: z.string().trim().min(3, "Nome da entidade é obrigatório").max(200, "Máximo 200 caracteres"),
  infracoes: z.string().trim().min(10, "Descrição das infrações deve ter no mínimo 10 caracteres").max(2000, "Máximo 2000 caracteres"),
  fundamentacao: z.string().trim().min(20, "Fundamentação deve ter no mínimo 20 caracteres").max(5000, "Máximo 5000 caracteres"),
  numeroMulta: z.string().trim().min(1, "Número do processo de multa é obrigatório").max(50, "Máximo 50 caracteres"),
  dataDespacho: z.string().trim().min(1, "Data do despacho é obrigatória"),
  artigosLei: z.string().trim().min(1, "Artigos da lei são obrigatórios").max(200, "Máximo 200 caracteres"),
  procuradorMP: z.string().trim().min(1, "Procurador do MP é obrigatório"),
  observacoes: z.string().trim().max(1000, "Máximo 1000 caracteres").optional().or(z.literal("")),
});

type DesencadearMultaForm = z.infer<typeof desencadearMultaSchema>;

interface DesencadearMultaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const DesencadearMulta = ({ onBack }: DesencadearMultaProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<DesencadearMultaForm>({
    resolver: zodResolver(desencadearMultaSchema)
  });
  const [showForm, setShowForm] = useState(false);

  const processosComInfracoes = [
    { id: "1", numero: "PC/2024/045", entidade: "Empresa Municipal X", tipo: "Prestação de Contas", infracoes: "Irregularidades Contabilísticas", status: "Pendente" },
    { id: "2", numero: "VP/2024/123", entidade: "Instituto Y", tipo: "Visto Prévio", infracoes: "Falta de Documentação", status: "Pendente" },
    { id: "3", numero: "FO/2024/089", entidade: "Fundação Z", tipo: "Fiscalização OGE", infracoes: "Desvio de Fundos", status: "Pendente" },
  ];

  const onSubmit = (data: DesencadearMultaForm) => {
    toast({
      title: "Processo Autónomo de Multa Desencadeado",
      description: "Autos remetidos ao Ministério Público para elaboração do requerimento inicial.",
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
              <FileWarning className="h-8 w-8 text-primary" />
              Desencadear Processo Autónomo de Multa
            </h1>
            <p className="text-muted-foreground">Remeter autos ao Ministério Público para elaboração do requerimento inicial</p>
          </div>
        </div>
      </div>

      {!showForm ? (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Pesquisar por número ou entidade..." className="pl-9" />
              </div>
              <Button variant="outline" className="gap-2 border-accent text-accent hover:bg-accent/10">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Processos com Infrações Financeiras Identificadas</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Entidade</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Infrações</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processosComInfracoes.map((processo) => (
                    <TableRow key={processo.id}>
                      <TableCell className="font-medium">{processo.numero}</TableCell>
                      <TableCell>{processo.entidade}</TableCell>
                      <TableCell>{processo.tipo}</TableCell>
                      <TableCell>{processo.infracoes}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{processo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-accent border-accent hover:bg-accent/10"
                          onClick={() => setShowForm(true)}
                        >
                          Desencadear Multa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-6">
            <div className="space-y-6">
              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <h3 className="font-semibold text-accent mb-2">Processo Origem</h3>
                <p className="text-sm"><strong>Número:</strong> PC/2024/045</p>
                <p className="text-sm"><strong>Entidade:</strong> Empresa Municipal X</p>
                <p className="text-sm"><strong>Infrações:</strong> Irregularidades Contabilísticas</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Despacho do Juiz Relator</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroMulta">Número do Processo de Multa *</Label>
                    <Input
                      id="numeroMulta"
                      placeholder="PM/2024/001"
                      {...register("numeroMulta")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataDespacho">Data do Despacho *</Label>
                    <Input
                      id="dataDespacho"
                      type="date"
                      {...register("dataDespacho")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundamentacao">Fundamentação do Despacho *</Label>
                    <Textarea
                      id="fundamentacao"
                      placeholder="Descrição detalhada das infrações financeiras identificadas e fundamento legal para desencadear processo autónomo de multa..."
                      rows={6}
                      {...register("fundamentacao")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="artigosLei">Artigos da Lei Aplicáveis *</Label>
                    <Input
                      id="artigosLei"
                      placeholder="Art. 29º, n.º 1 da LOPTC"
                      {...register("artigosLei")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="procuradorMP">Procurador do Ministério Público *</Label>
                    <Select onValueChange={(value) => setValue("procuradorMP", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o procurador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="procurador1">Dr. António Silva</SelectItem>
                        <SelectItem value="procurador2">Dra. Maria Santos</SelectItem>
                        <SelectItem value="procurador3">Dr. João Costa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Informações adicionais..."
                      rows={3}
                      {...register("observacoes")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-hover gap-2">
                  <Save className="h-4 w-4" />
                  Remeter ao MP
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
};
