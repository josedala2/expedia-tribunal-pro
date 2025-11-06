import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface HistoricoFuncional {
  id: string;
  cargo: string;
  unidade_organica?: string;
  departamento?: string;
  categoria?: string;
  data_inicio: string;
  data_fim?: string;
  observacoes?: string;
}

interface ContagemTempoServicoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  historicoFuncional: HistoricoFuncional[];
  pensionistaNome: string;
}

interface PeriodoCalculado {
  cargo: string;
  dataInicio: Date;
  dataFim: Date;
  meses: number;
  anos: number;
  mesesRestantes: number;
  valido: boolean;
  motivo?: string;
}

export default function ContagemTempoServico({
  open,
  onOpenChange,
  historicoFuncional,
  pensionistaNome,
}: ContagemTempoServicoProps) {
  const calcularTempoServico = () => {
    const periodos: PeriodoCalculado[] = [];
    let totalMeses = 0;

    historicoFuncional.forEach((historico) => {
      const dataInicio = new Date(historico.data_inicio);
      const dataFim = historico.data_fim ? new Date(historico.data_fim) : new Date();

      // Calcular meses entre as datas
      const diffTime = dataFim.getTime() - dataInicio.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      const meses = Math.floor(diffDays / 30.44); // Média de dias por mês

      // Verificar se o período é válido (exemplo: períodos muito curtos podem ser inválidos)
      const valido = meses >= 1; // Mínimo 1 mês para ser contado

      const anos = Math.floor(meses / 12);
      const mesesRestantes = meses % 12;

      if (valido) {
        totalMeses += meses;
      }

      periodos.push({
        cargo: historico.cargo,
        dataInicio,
        dataFim,
        meses,
        anos,
        mesesRestantes,
        valido,
        motivo: valido ? undefined : "Período inferior a 1 mês",
      });
    });

    const totalAnos = Math.floor(totalMeses / 12);
    const totalMesesRestantes = totalMeses % 12;

    // Requisitos mínimos: 15 anos (180 meses)
    const requisitoMinimo = 180;
    const atingiuRequisito = totalMeses >= requisitoMinimo;
    const tempoFaltante = atingiuRequisito ? 0 : requisitoMinimo - totalMeses;
    const anosFaltantes = Math.floor(tempoFaltante / 12);
    const mesesFaltantes = tempoFaltante % 12;

    return {
      periodos,
      totalMeses,
      totalAnos,
      totalMesesRestantes,
      atingiuRequisito,
      tempoFaltante,
      anosFaltantes,
      mesesFaltantes,
    };
  };

  const resultado = calcularTempoServico();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Contagem de Tempo de Serviço
          </DialogTitle>
          <DialogDescription>
            Cálculo detalhado do tempo de serviço de {pensionistaNome}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo Total */}
          <Card className={resultado.atingiuRequisito ? "border-green-500" : "border-orange-500"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {resultado.atingiuRequisito ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                )}
                Tempo Total de Serviço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Contado</p>
                  <p className="text-3xl font-bold">
                    {resultado.totalAnos} anos
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {resultado.totalMesesRestantes} meses adicionais
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total: {resultado.totalMeses} meses
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Requisito Mínimo</p>
                  <p className="text-2xl font-bold">15 anos</p>
                  <p className="text-xs text-muted-foreground">(180 meses)</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {resultado.atingiuRequisito ? (
                    <Badge className="bg-green-600 text-white">
                      Requisito Atingido
                    </Badge>
                  ) : (
                    <>
                      <Badge className="bg-orange-600 text-white">
                        Tempo Faltante
                      </Badge>
                      <p className="text-lg font-semibold mt-2">
                        {resultado.anosFaltantes} anos e {resultado.mesesFaltantes} meses
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Detalhamento por Período */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Períodos de Serviço</h3>
            <div className="space-y-3">
              {resultado.periodos.map((periodo, index) => (
                <Card
                  key={index}
                  className={periodo.valido ? "border-green-200" : "border-red-200"}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{periodo.cargo}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          {periodo.dataInicio.toLocaleDateString("pt-BR")} até{" "}
                          {periodo.dataFim.toLocaleDateString("pt-BR")}
                        </CardDescription>
                      </div>
                      {periodo.valido ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          Válido
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                          Não Contável
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Tempo Contado: {periodo.anos} anos e {periodo.mesesRestantes} meses
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total: {periodo.meses} meses
                        </p>
                        {!periodo.valido && periodo.motivo && (
                          <p className="text-xs text-red-600 mt-1">
                            Motivo: {periodo.motivo}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Observações sobre as Regras */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm">Regras de Contagem Aplicadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Períodos com contribuições válidas são contabilizados</li>
                <li>• Interpolação permitida: períodos não consecutivos são somados</li>
                <li>• Períodos inferiores a 1 mês são excluídos</li>
                <li>• Requisito mínimo para aposentação: 15 anos (180 meses)</li>
                <li>• Cálculo baseado em média de 30.44 dias por mês</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
