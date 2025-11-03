import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Gavel } from "lucide-react";

interface DecisaoRecursoFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const DecisaoRecursoForm = ({ onSubmit, onCancel }: DecisaoRecursoFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(Object.fromEntries(formData));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5" />
          Decisão sobre o Recurso
        </CardTitle>
        <CardDescription>
          Decisão do Juiz Relator sobre o recurso interposto
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
              <Label htmlFor="dataDecisao">Data da Decisão</Label>
              <Input
                id="dataDecisao"
                name="dataDecisao"
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
            <Label htmlFor="tipoDecisao">Tipo de Decisão</Label>
            <Select name="tipoDecisao" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de decisão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deferimento">Deferimento do Recurso</SelectItem>
                <SelectItem value="indeferimento">Indeferimento do Recurso</SelectItem>
                <SelectItem value="deferimento_parcial">Deferimento Parcial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundamentacao">Fundamentação da Decisão</Label>
            <Textarea
              id="fundamentacao"
              name="fundamentacao"
              placeholder="Fundamentos legais e jurídicos da decisão"
              rows={8}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              placeholder="Observações adicionais"
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Registar Decisão
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
