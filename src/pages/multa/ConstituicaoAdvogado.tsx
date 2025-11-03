import { ArrowLeft, Scale, Plus, Upload } from "lucide-react";
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

interface ConstituicaoAdvogadoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const ConstituicaoAdvogado = ({ onBack }: ConstituicaoAdvogadoProps) => {
  const { toast } = useToast();
  const { register, handleSubmit } = useForm();
  const [showForm, setShowForm] = useState(false);

  const semAdvogado = [
    { numero: "PM/2024/001", demandado: "João Silva", dataNotificacao: "2024-10-25", prazoFim: "2024-11-04", status: "Sem Advogado" },
  ];

  const comAdvogado = [
    { numero: "PM/2024/003", demandado: "António Costa", advogado: "Dr. Manuel Santos", numeroOA: "OA 1234/2020", dataConstituicao: "2024-10-27", status: "Advogado Constituído" },
  ];

  const onSubmit = (data: any) => {
    toast({
      title: "Advogado Constituído",
      description: "Mandatário judicial registado. Futuras notificações serão dirigidas ao advogado.",
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
              <Scale className="h-8 w-8 text-primary" />
              Constituição de Advogado
            </h1>
            <p className="text-muted-foreground">Registo de mandatário judicial com poderes especiais</p>
          </div>
        </div>
      </div>

      {!showForm ? (
        <>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Processos Sem Advogado Constituído</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Processo</TableHead>
                  <TableHead>Demandado</TableHead>
                  <TableHead>Data Notificação</TableHead>
                  <TableHead>Prazo Fim</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semAdvogado.map((processo) => (
                  <TableRow key={processo.numero}>
                    <TableCell className="font-medium">{processo.numero}</TableCell>
                    <TableCell>{processo.demandado}</TableCell>
                    <TableCell>{processo.dataNotificacao}</TableCell>
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
                        Constituir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Processos Com Advogado Constituído</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Processo</TableHead>
                  <TableHead>Demandado</TableHead>
                  <TableHead>Advogado</TableHead>
                  <TableHead>Nº OA</TableHead>
                  <TableHead>Data Constituição</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comAdvogado.map((processo) => (
                  <TableRow key={processo.numero}>
                    <TableCell className="font-medium">{processo.numero}</TableCell>
                    <TableCell>{processo.demandado}</TableCell>
                    <TableCell className="font-semibold">{processo.advogado}</TableCell>
                    <TableCell>{processo.numeroOA}</TableCell>
                    <TableCell>{processo.dataConstituicao}</TableCell>
                    <TableCell>
                      <Badge className="bg-success">{processo.status}</Badge>
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
                <p className="text-sm"><strong>Demandado:</strong> João Silva</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Dados do Advogado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeAdvogado">Nome Completo *</Label>
                    <Input id="nomeAdvogado" placeholder="Dr./Dra." {...register("nomeAdvogado")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroOA">Nº Ordem dos Advogados *</Label>
                    <Input id="numeroOA" placeholder="OA 0000/2020" {...register("numeroOA")} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="escritorio">Escritório/Firma de Advogados</Label>
                    <Input id="escritorio" placeholder="Nome do escritório" {...register("escritorio")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input id="telefone" placeholder="+244 900 000 000" {...register("telefone")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="advogado@email.ao" {...register("email")} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="endereco">Endereço Profissional *</Label>
                    <Input id="endereco" placeholder="Endereço completo do escritório" {...register("endereco")} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Procuração</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataProcuracao">Data da Procuração *</Label>
                      <Input id="dataProcuracao" type="date" {...register("dataProcuracao")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validadeProcuracao">Validade (máx. 4 anos) *</Label>
                      <Input id="validadeProcuracao" type="date" {...register("validadeProcuracao")} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="poderes">Poderes Especiais Conferidos *</Label>
                      <Textarea
                        id="poderes"
                        placeholder="Descrição dos poderes conferidos ao mandatário..."
                        rows={3}
                        {...register("poderes")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="procuracaoPDF">Anexar Procuração (PDF) *</Label>
                    <Input id="procuracaoPDF" type="file" accept=".pdf" />
                    <p className="text-xs text-muted-foreground">
                      A procuração deve ter sido passada há menos de 4 anos
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Domicílio para Notificações</h3>
                <div className="space-y-2">
                  <Label htmlFor="domicilioEscolhido">Endereço Escolhido na Sede do Tribunal *</Label>
                  <Input
                    id="domicilioEscolhido"
                    placeholder="Endereço para receber notificações"
                    {...register("domicilioEscolhido")}
                  />
                  <p className="text-xs text-muted-foreground">
                    As notificações serão feitas na pessoa do mandatário judicial
                  </p>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Observações Importantes:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Todas as notificações futuras serão dirigidas ao advogado</li>
                  <li>Para atos pessoais, o demandado também receberá aviso</li>
                  <li>A procuração deve ter sido passada há menos de 4 anos</li>
                  <li>O advogado deve ter escritório ou domicílio escolhido na sede do tribunal</li>
                </ul>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-hover gap-2">
                  <Upload className="h-4 w-4" />
                  Registar Constituição
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
};
