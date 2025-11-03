import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload } from "lucide-react";

interface RececaoRequerimentoFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const RececaoRequerimentoForm = ({ onSubmit, onCancel }: RececaoRequerimentoFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(Object.fromEntries(formData));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Receção de Requerimento de Recurso
        </CardTitle>
        <CardDescription>
          Registo de requerimento de recurso interposto pelo MP ou Entidade Contratante
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroProcesso">Nº do Processo Original</Label>
              <Input
                id="numeroProcesso"
                name="numeroProcesso"
                placeholder="Ex: PVST-2024-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataInterposicao">Data de Interposição</Label>
              <Input
                id="dataInterposicao"
                name="dataInterposicao"
                type="date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recorrente">Recorrente</Label>
            <Select name="recorrente" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o recorrente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp">Ministério Público</SelectItem>
                <SelectItem value="entidade">Entidade Contratante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeRecorrente">Nome da Entidade Recorrente</Label>
            <Input
              id="nomeRecorrente"
              name="nomeRecorrente"
              placeholder="Nome completo da entidade"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundamentacao">Fundamentação do Recurso</Label>
            <Textarea
              id="fundamentacao"
              name="fundamentacao"
              placeholder="Descreva os fundamentos do recurso"
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentos">Documentos Anexos</Label>
            <Input
              id="documentos"
              name="documentos"
              type="file"
              multiple
            />
            <p className="text-sm text-muted-foreground">
              Anexe os documentos que suportam o requerimento de recurso
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              <Upload className="h-4 w-4 mr-2" />
              Registar Requerimento
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
