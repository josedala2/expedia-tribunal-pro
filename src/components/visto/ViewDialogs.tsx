import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Download, Calendar, User, FileText, Gavel, Scale, Briefcase } from "lucide-react";

interface ConclusaoAutoData {
  id: string;
  numeroProcesso: string;
  numeroTermo: string;
  escrivao: string;
  destinatario: string;
  dataConclusao: string;
  tipoDocumento: string;
  status: string;
  motivo: string;
}

interface AnaliseDecisaoData {
  id: string;
  numeroProcesso: string;
  juizRelator: string;
  dataAnalise: string;
  tipoDecisao: string;
  valorOriginal: string;
  valorDeferido: string;
  status: string;
  prazoRestante: number | null;
}

interface PromocaoData {
  id: string;
  numeroProcesso: string;
  procurador: string;
  dataPromocao: string;
  tipoParecer: string;
  decisaoJuiz: string;
  status: string;
  prazoRestante: number | null;
}

// Dialog para Conclusão dos Autos
export const ConclusaoAutosViewDialog = ({
  open,
  onOpenChange,
  data,
  onEdit,
  getStatusColor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ConclusaoAutoData | null;
  onEdit: () => void;
  getStatusColor: (status: string) => string;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Detalhes do Termo de Conclusão
        </DialogTitle>
        <DialogDescription>
          {data?.numeroTermo}
        </DialogDescription>
      </DialogHeader>
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Número do Processo</Label>
              <p className="font-medium">{data.numeroProcesso}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Número do Termo</Label>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {data.numeroTermo}
              </Badge>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Escrivão dos Autos</Label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{data.escrivao}</p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Data da Conclusão</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{data.dataConclusao}</p>
              </div>
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-muted-foreground">Destinatário</Label>
              <p className="font-medium">{data.destinatario}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Tipo de Documento</Label>
              <p className="font-medium">{data.tipoDocumento}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Badge variant="outline" className={getStatusColor(data.status)}>
                {data.status}
              </Badge>
            </div>
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground">Motivo da Conclusão</Label>
            <div className="mt-2 p-3 bg-muted/50 rounded-md">
              <p className="text-sm">{data.motivo}</p>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

// Dialog para Análise e Decisão do Juiz
export const AnaliseDecisaoViewDialog = ({
  open,
  onOpenChange,
  data,
  onEdit,
  getStatusColor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: AnaliseDecisaoData | null;
  onEdit: () => void;
  getStatusColor: (status: string) => string;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5" />
          Detalhes da Análise e Decisão
        </DialogTitle>
        <DialogDescription>
          {data?.numeroProcesso}
        </DialogDescription>
      </DialogHeader>
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Número do Processo</Label>
              <p className="font-medium">{data.numeroProcesso}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Juiz Relator</Label>
              <div className="flex items-center gap-2 mt-1">
                <Gavel className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{data.juizRelator}</p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Data da Análise</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{data.dataAnalise}</p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Tipo de Decisão</Label>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {data.tipoDecisao}
              </Badge>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Valor Original</Label>
              <p className="font-medium text-lg">{data.valorOriginal}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Valor Deferido</Label>
              <p className="font-medium text-lg text-green-600">{data.valorDeferido}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Badge variant="outline" className={getStatusColor(data.status)}>
                {data.status}
              </Badge>
            </div>
            {data.prazoRestante && (
              <div>
                <Label className="text-xs text-muted-foreground">Prazo Restante</Label>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
                  {data.prazoRestante} dias
                </Badge>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
            <h4 className="font-semibold text-sm mb-2">Resumo da Decisão</h4>
            <p className="text-sm text-muted-foreground">
              O Juiz Relator analisou o processo e proferiu a decisão de <strong>{data.tipoDecisao}</strong>.
              {data.valorDeferido !== "-" && ` O valor deferido foi de ${data.valorDeferido}, correspondente a uma redução de ${
                ((parseFloat(data.valorOriginal.replace(/[^\d,]/g, '').replace(',', '.')) - 
                  parseFloat(data.valorDeferido.replace(/[^\d,]/g, '').replace(',', '.'))) / 
                  parseFloat(data.valorOriginal.replace(/[^\d,]/g, '').replace(',', '.')) * 100).toFixed(1)
              }% do valor original.`}
            </p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Decisão
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

// Dialog para Promoção do MP
export const PromocaoMPViewDialog = ({
  open,
  onOpenChange,
  data,
  onEdit,
  getStatusColor,
  getParecerColor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PromocaoData | null;
  onEdit: () => void;
  getStatusColor: (status: string) => string;
  getParecerColor: (parecer: string) => string;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Detalhes da Promoção do Ministério Público
        </DialogTitle>
        <DialogDescription>
          {data?.numeroProcesso}
        </DialogDescription>
      </DialogHeader>
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Número do Processo</Label>
              <p className="font-medium">{data.numeroProcesso}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Procurador</Label>
              <div className="flex items-center gap-2 mt-1">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{data.procurador}</p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Data da Promoção</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{data.dataPromocao}</p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Decisão do Juiz Relator</Label>
              <p className="font-medium">{data.decisaoJuiz}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Tipo de Parecer</Label>
              <Badge variant="outline" className={getParecerColor(data.tipoParecer)}>
                {data.tipoParecer}
              </Badge>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Badge variant="outline" className={getStatusColor(data.status)}>
                {data.status}
              </Badge>
            </div>
            {data.prazoRestante && (
              <div className="col-span-2">
                <Label className="text-xs text-muted-foreground">Prazo Restante</Label>
                <Badge 
                  variant="outline" 
                  className={
                    data.prazoRestante <= 2 
                      ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                      : data.prazoRestante <= 5
                      ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                      : "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                  }
                >
                  {data.prazoRestante} dias
                </Badge>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
            <h4 className="font-semibold text-sm mb-2">Posição do Ministério Público</h4>
            <p className="text-sm text-muted-foreground">
              O Ministério Público, após análise do processo e da decisão do Juiz Relator ({data.decisaoJuiz}), 
              emitiu parecer de <strong>{data.tipoParecer}</strong>.
            </p>
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground">Documentos Analisados</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Decisão do Juiz Relator</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Guia de Cobrança</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Autos do Processo</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Parecer
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);
