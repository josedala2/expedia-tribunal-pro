import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from "lucide-react";

interface AceitarExpedienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expediente: any;
  onAceito: () => void;
}

export const AceitarExpedienteDialog = ({
  open,
  onOpenChange,
  expediente,
  onAceito,
}: AceitarExpedienteDialogProps) => {
  const { toast } = useToast();
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [processando, setProcessando] = useState(false);

  const gerarAssinaturaDigital = () => {
    const timestamp = new Date().getTime();
    const randomData = Math.random().toString(36).substring(2, 15);
    return `DST-${timestamp}-${randomData}`.substring(0, 40);
  };

  const handleAceitar = async () => {
    if (!nomeResponsavel.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome completo.",
        variant: "destructive",
      });
      return;
    }

    setProcessando(true);

    try {
      const assinaturaDigital = gerarAssinaturaDigital();
      const dataAceite = new Date().toISOString();

      const { error } = await supabase
        .from('expedientes')
        .update({
          aceito_destinatario: true,
          assinatura_destinatario: assinaturaDigital,
          data_aceite_destinatario: dataAceite,
          nome_destinatario_assinatura: nomeResponsavel,
          status: 'Recebido',
        })
        .eq('id', expediente.id);

      if (error) {
        console.error("Erro ao aceitar expediente:", error);
        toast({
          title: "Erro",
          description: "Não foi possível aceitar o expediente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Expediente aceito com sucesso!",
        description: "Sua assinatura digital foi registada no documento.",
      });

      onAceito();
      onOpenChange(false);
      setNomeResponsavel("");
    } catch (error) {
      console.error("Erro ao aceitar expediente:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setProcessando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Aceitar Recepção de Expediente
          </DialogTitle>
          <DialogDescription>
            Confirme o recebimento e assine digitalmente este expediente interno.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <strong>Expediente:</strong> {expediente?.numero}
            </p>
            <p className="text-sm">
              <strong>Assunto:</strong> {expediente?.assunto}
            </p>
            <p className="text-sm">
              <strong>Origem:</strong> {expediente?.origem}
            </p>
            <p className="text-sm">
              <strong>Tipo:</strong> {expediente?.tipo}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeResponsavel">Seu Nome Completo *</Label>
            <Input
              id="nomeResponsavel"
              value={nomeResponsavel}
              onChange={(e) => setNomeResponsavel(e.target.value)}
              placeholder="Digite seu nome completo"
            />
            <p className="text-xs text-muted-foreground">
              Este nome será usado para gerar sua assinatura digital
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Atenção:</strong> Ao aceitar, você confirma o recebimento deste expediente
              e uma assinatura digital será gerada em seu nome.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={processando}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAceitar}
            disabled={processando}
            className="bg-primary hover:bg-primary-hover"
          >
            {processando ? "Processando..." : "Aceitar e Assinar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
