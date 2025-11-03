import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText } from "lucide-react";
import { EntitySelector } from "@/components/ui/entity-selector";
import { useState } from "react";

interface NotificacaoPartesFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const NotificacaoPartesForm = ({ onSubmit, onCancel }: NotificacaoPartesFormProps) => {
  const [entidadeNotificada, setEntidadeNotificada] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    data.entidadeNotificada = entidadeNotificada;
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Notificação às Partes
        </CardTitle>
        <CardDescription>
          Notificação ao Ministério Público e à Entidade Pública sobre a decisão do Juiz Relator
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroProcesso">Nº do Processo</Label>
              <Input
                id="numeroProcesso"
                name="numeroProcesso"
                placeholder="Ex: PVST-2024-001"
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
            <Label htmlFor="tipoDecisao">Tipo de Decisão</Label>
            <Select name="tipoDecisao" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de decisão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recusa">Recusa de Visto</SelectItem>
                <SelectItem value="concessao">Concessão de Visto</SelectItem>
                <SelectItem value="homologacao">Homologação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <EntitySelector
            value={entidadeNotificada}
            onChange={setEntidadeNotificada}
            label="Entidade a Notificar"
            required
          />

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              placeholder="Observações adicionais sobre a notificação"
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Registar Notificação
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
