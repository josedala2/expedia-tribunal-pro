import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calculator } from "lucide-react";
import { toast } from "sonner";

interface NovaGuiaCobrancaProps {
  onBack: () => void;
}

export default function NovaGuiaCobranca({ onBack }: NovaGuiaCobrancaProps) {
  const [formData, setFormData] = useState({
    processo: "",
    entidade: "",
    nif: "",
    endereco: "",
    tipoVisto: "",
    valorContrato: "",
    descricao: "",
  });

  const [emolumentosCalculados, setEmolumentosCalculados] = useState<number | null>(null);

  const handleCalcularEmolumentos = () => {
    const valor = parseFloat(formData.valorContrato);
    
    if (!valor || !formData.tipoVisto) {
      toast.error("Preencha o valor do contrato e o tipo de visto");
      return;
    }

    let emolumentos = 0;
    const salarioMinimo = 70000; // Exemplo: 70.000 AOA

    switch (formData.tipoVisto) {
      case "concedido":
        // Máximo: 1% do valor do contrato
        emolumentos = valor * 0.01;
        break;
      case "recusado":
      case "tacito":
        // Mínimo: ½ do salário mínimo
        emolumentos = salarioMinimo / 2;
        break;
      default:
        toast.error("Tipo de visto inválido");
        return;
    }

    setEmolumentosCalculados(emolumentos);
    toast.success(`Emolumentos calculados: ${formatCurrency(emolumentos)}`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emolumentosCalculados) {
      toast.error("Calcule os emolumentos antes de gerar a guia");
      return;
    }

    toast.success("Guia de cobrança gerada com sucesso!");
    setTimeout(() => onBack(), 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Reset calculated fees when key values change
    if (field === "valorContrato" || field === "tipoVisto") {
      setEmolumentosCalculados(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nova Guia de Cobrança</h1>
          <p className="text-muted-foreground mt-1">
            Preencha os dados para gerar uma nova guia de cobrança
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Processo</CardTitle>
            <CardDescription>
              Dados do processo e entidade responsável
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processo">Número do Processo *</Label>
                <Input
                  id="processo"
                  placeholder="Ex: PV-2024-0123"
                  value={formData.processo}
                  onChange={(e) => handleChange("processo", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoVisto">Tipo de Visto *</Label>
                <Select
                  value={formData.tipoVisto}
                  onValueChange={(value) => handleChange("tipoVisto", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concedido">Visto Concedido</SelectItem>
                    <SelectItem value="recusado">Visto Recusado</SelectItem>
                    <SelectItem value="tacito">Visto Tácito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entidade">Entidade *</Label>
                <Input
                  id="entidade"
                  placeholder="Nome da entidade"
                  value={formData.entidade}
                  onChange={(e) => handleChange("entidade", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nif">NIF *</Label>
                <Input
                  id="nif"
                  placeholder="Número de Identificação Fiscal"
                  value={formData.nif}
                  onChange={(e) => handleChange("nif", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  placeholder="Endereço completo da entidade"
                  value={formData.endereco}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Cálculo de Emolumentos</CardTitle>
            <CardDescription>
              Valores para cálculo dos emolumentos devidos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorContrato">Valor do Contrato (AOA) *</Label>
                <Input
                  id="valorContrato"
                  type="number"
                  placeholder="0.00"
                  value={formData.valorContrato}
                  onChange={(e) => handleChange("valorContrato", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 flex items-end">
                <Button
                  type="button"
                  onClick={handleCalcularEmolumentos}
                  className="w-full"
                  variant="outline"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calcular Emolumentos
                </Button>
              </div>
            </div>

            {emolumentosCalculados !== null && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Emolumentos Calculados:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(emolumentosCalculados)}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descrição adicional (opcional)"
                value={formData.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                rows={3}
              />
            </div>

            <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
              <h4 className="font-semibold">Regras de Cálculo:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Visto Concedido:</strong> Máximo de 1% do valor do contrato</li>
                <li>• <strong>Visto Recusado/Tácito:</strong> Mínimo de ½ do salário mínimo da função pública</li>
                <li>• Pagamento no primeiro pagamento que a entidade contratante efectuar</li>
                <li>• Responsável: Entidade contratada (Visto Concedido) ou Entidade Pública Contratante (Recusado)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!emolumentosCalculados}>
            Gerar Guia de Cobrança
          </Button>
        </div>
      </form>
    </div>
  );
}
