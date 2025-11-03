import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, CheckCircle } from "lucide-react";

interface ConclusaoAutosFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const ConclusaoAutosForm = ({ onSubmit, onCancel }: ConclusaoAutosFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(Object.fromEntries(formData));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Conclusão dos Autos
        </CardTitle>
        <CardDescription>
          Conclusão dos autos do recurso para o Juiz Relator
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
              <Label htmlFor="dataConclusao">Data da Conclusão</Label>
              <Input
                id="dataConclusao"
                name="dataConclusao"
                type="date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="escrivao">Escrivão dos Autos</Label>
            <Input
              id="escrivao"
              name="escrivao"
              placeholder="Nome do escrivão"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumo">Resumo do Processo</Label>
            <Textarea
              id="resumo"
              name="resumo"
              placeholder="Resumo dos principais pontos do processo de recurso"
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentosJuntos">Documentos Juntos aos Autos</Label>
            <Textarea
              id="documentosJuntos"
              name="documentosJuntos"
              placeholder="Liste os documentos que foram juntados aos autos"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              placeholder="Observações adicionais sobre a conclusão"
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Registar Conclusão
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
