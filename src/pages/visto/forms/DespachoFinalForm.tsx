import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Stamp } from "lucide-react";

interface DespachoFinalFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const DespachoFinalForm = ({ onSubmit, onCancel }: DespachoFinalFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(Object.fromEntries(formData));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stamp className="h-5 w-5" />
          Despacho Final
        </CardTitle>
        <CardDescription>
          Despacho final do Juiz Relator sobre o recurso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroRecurso">Nº do Recurso</Label>
              <Input
                id="numeroRecurso"
                name="numeroRecurso"
                placeholder="Ex: REC-2024-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataDespacho">Data do Despacho</Label>
              <Input
                id="dataDespacho"
                name="dataDespacho"
                type="date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="juizRelator">Juiz Relator</Label>
            <Input
              id="juizRelator"
              name="juizRelator"
              placeholder="Nome do Juiz Relator"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="decisaoFinal">Decisão Final</Label>
            <Select name="decisaoFinal" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a decisão final" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="provido">Recurso Provido</SelectItem>
                <SelectItem value="nao_provido">Recurso Não Provido</SelectItem>
                <SelectItem value="provido_parcial">Recurso Provido Parcialmente</SelectItem>
                <SelectItem value="arquivamento">Arquivamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundamentacao">Fundamentação do Despacho</Label>
            <Textarea
              id="fundamentacao"
              name="fundamentacao"
              placeholder="Fundamentos legais e jurídicos do despacho final"
              rows={8}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="consequencias">Consequências da Decisão</Label>
            <Textarea
              id="consequencias"
              name="consequencias"
              placeholder="Descreva as consequências práticas da decisão"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificacoes">Entidades a Notificar</Label>
            <Textarea
              id="notificacoes"
              name="notificacoes"
              placeholder="Liste as entidades que devem ser notificadas"
              rows={3}
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Emitir Despacho Final
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
