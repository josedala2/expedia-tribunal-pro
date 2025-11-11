import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VisualizarPerfilDialogProps {
  perfil: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const permissoesLabels: Record<string, string> = {
  "processo.criar": "Criar processos",
  "processo.ver": "Visualizar processos",
  "processo.editar": "Editar processos",
  "processo.autuar": "Autuar processos",
  "processo.distribuir": "Distribuir processos",
  "processo.ver.todos": "Ver todos os processos",
  "processo.submeter.juiz": "Submeter a Juiz",
  "expediente.validar": "Validar expedientes",
  "expediente.aprovar": "Aprovar expedientes",
  "expediente.devolver": "Devolver expedientes",
  "documento.anexar": "Anexar documentos",
  "relatorio.criar": "Criar relatórios",
  "relatorio.editar": "Editar relatórios",
  "relatorio.validar": "Validar relatórios",
  "cq.executar": "Executar controle de qualidade",
  "oficio.emitir": "Emitir ofícios",
  "decisao.proferir": "Proferir decisões",
  "decisao.coadjuvar": "Coadjuvar decisões",
  "prazo.suspender": "Suspender prazos",
  "vista.mp.abrir": "Abrir vista ao MP",
  "promocao.emitir": "Emitir promoções",
  "notificacao.executar": "Executar notificações",
  "certidao.emitir": "Emitir certidões",
};

export const VisualizarPerfilDialog = ({
  perfil,
  open,
  onOpenChange,
}: VisualizarPerfilDialogProps) => {
  if (!perfil) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {perfil.nome_perfil}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Descrição</h4>
            <p className="text-sm text-foreground">{perfil.descricao}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Estado</h4>
            <Badge variant={perfil.activo ? "default" : "secondary"}>
              {perfil.activo ? "Activo" : "Inactivo"}
            </Badge>
          </div>

          {perfil.areas_funcionais && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Área Funcional
              </h4>
              <p className="text-sm text-foreground">{perfil.areas_funcionais.nome_area}</p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Permissões ({perfil.permissoes?.length || 0})
            </h4>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {perfil.permissoes?.map((permissao: string) => (
                  <div
                    key={permissao}
                    className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-border"
                  >
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {permissoesLabels[permissao] || permissao}
                      </p>
                      <p className="text-xs text-muted-foreground">{permissao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
