import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, FileSignature } from "lucide-react";

interface AssinarOficioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  oficio: {
    numero: string;
    tipo: string;
    destinatario: string;
  };
  onAssinado: (assinatura: string) => void;
}

export const AssinarOficioDialog = ({
  open,
  onOpenChange,
  oficio,
  onAssinado,
}: AssinarOficioDialogProps) => {
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [loading, setLoading] = useState(false);

  const gerarAssinaturaDigital = () => {
    const timestamp = new Date().toISOString();
    const data = `${oficio.numero}-${nome}-${cargo}-${timestamp}`;
    return `ASS-${btoa(data).substring(0, 32)}`;
  };

  const handleAssinar = async () => {
    if (!nome.trim()) {
      toast.error("Por favor, insira o seu nome completo");
      return;
    }

    if (!cargo.trim()) {
      toast.error("Por favor, insira o seu cargo");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const assinatura = gerarAssinaturaDigital();

      toast.success("Ofício assinado digitalmente com sucesso!", {
        description: `Assinatura: ${assinatura}`,
      });

      onAssinado(assinatura);
      onOpenChange(false);
      setNome("");
      setCargo("");
    } catch (error) {
      toast.error("Erro ao assinar o ofício");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-primary" />
            <DialogTitle>Assinatura Digital de Ofício</DialogTitle>
          </div>
          <DialogDescription>
            Assine digitalmente o ofício antes de enviá-lo. A assinatura será
            registada e verificável.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Ofício:
              </span>
              <p className="text-sm font-semibold">{oficio.numero}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Tipo:
              </span>
              <p className="text-sm">{oficio.tipo}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Destinatário:
              </span>
              <p className="text-sm">{oficio.destinatario}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              placeholder="Introduza o seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo *</Label>
            <Input
              id="cargo"
              placeholder="Introduza o seu cargo"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">
              ⚠️ A assinatura digital é legalmente vinculativa. Ao assinar,
              confirma que reviu o conteúdo do ofício e autoriza o seu envio.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleAssinar} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A assinar...
              </>
            ) : (
              <>
                <FileSignature className="mr-2 h-4 w-4" />
                Assinar Ofício
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
