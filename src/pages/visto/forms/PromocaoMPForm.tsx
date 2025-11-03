import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Scale } from "lucide-react";

interface PromocaoMPFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const PromocaoMPForm = ({ onSubmit, onCancel }: PromocaoMPFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(Object.fromEntries(formData));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Despacho de Promoção do MP
        </CardTitle>
        <CardDescription>
          Promoção do Ministério Público sobre a decisão do recurso
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
              <Label htmlFor="dataPromocao">Data da Promoção</Label>
              <Input
                id="dataPromocao"
                name="dataPromocao"
                type="date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="procurador">Procurador Responsável</Label>
            <Input
              id="procurador"
              name="procurador"
              placeholder="Nome do procurador"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parecer">Parecer do Ministério Público</Label>
            <Select name="parecer" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o parecer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="favoravel">Favorável ao Deferimento</SelectItem>
                <SelectItem value="desfavoravel">Favorável ao Indeferimento</SelectItem>
                <SelectItem value="parcial">Deferimento Parcial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundamentacao">Fundamentação do Parecer</Label>
            <Textarea
              id="fundamentacao"
              name="fundamentacao"
              placeholder="Fundamentos legais do parecer do Ministério Público"
              rows={8}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recomendacoes">Recomendações</Label>
            <Textarea
              id="recomendacoes"
              name="recomendacoes"
              placeholder="Recomendações do Ministério Público"
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Registar Promoção
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
