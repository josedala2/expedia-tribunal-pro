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
                <Select
                  value={formData.entidade}
                  onValueChange={(value) => handleChange("entidade", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a entidade" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    <SelectItem value="A. Presidente da República">A. Presidente da República</SelectItem>
                    <SelectItem value="Presidência da República">Presidência da República</SelectItem>
                    <SelectItem value="Casa Civil">Casa Civil</SelectItem>
                    <SelectItem value="Casa Militar">Casa Militar</SelectItem>
                    <SelectItem value="Gabinete do Presidente da República">Gabinete do Presidente da República</SelectItem>
                    <SelectItem value="Gabinete da Primeira-Dama">Gabinete da Primeira-Dama</SelectItem>
                    
                    <SelectItem value="B. Assembleia Nacional">B. Assembleia Nacional</SelectItem>
                    <SelectItem value="Gabinete do Presidente da Assembleia Nacional">Gabinete do Presidente da Assembleia Nacional</SelectItem>
                    <SelectItem value="Secretariado-Geral da Assembleia Nacional">Secretariado-Geral da Assembleia Nacional</SelectItem>
                    
                    <SelectItem value="C. Governo - Vice-Presidência">C. Governo - Vice-Presidência</SelectItem>
                    <SelectItem value="Vice-Presidência da República">Vice-Presidência da República</SelectItem>
                    <SelectItem value="Conselho de Ministros">Conselho de Ministros</SelectItem>
                    
                    <SelectItem value="Ministério da Administração do Território (MAT)">Ministério da Administração do Território (MAT)</SelectItem>
                    <SelectItem value="Ministério das Finanças (MINFIN)">Ministério das Finanças (MINFIN)</SelectItem>
                    <SelectItem value="Ministério da Economia e Planeamento (MEP)">Ministério da Economia e Planeamento (MEP)</SelectItem>
                    <SelectItem value="Ministério dos Recursos Minerais, Petróleo e Gás (MIREMPET)">Ministério dos Recursos Minerais, Petróleo e Gás (MIREMPET)</SelectItem>
                    <SelectItem value="Ministério da Energia e Águas (MINEA)">Ministério da Energia e Águas (MINEA)</SelectItem>
                    <SelectItem value="Ministério da Agricultura e Florestas (MINAGRIF)">Ministério da Agricultura e Florestas (MINAGRIF)</SelectItem>
                    <SelectItem value="Ministério das Pescas e Recursos Marinhos (MINPRM)">Ministério das Pescas e Recursos Marinhos (MINPRM)</SelectItem>
                    <SelectItem value="Ministério da Indústria e Comércio (MINDCOM)">Ministério da Indústria e Comércio (MINDCOM)</SelectItem>
                    <SelectItem value="Ministério das Obras Públicas, Urbanismo e Habitação (MINOPUH)">Ministério das Obras Públicas, Urbanismo e Habitação (MINOPUH)</SelectItem>
                    <SelectItem value="Ministério dos Transportes (MINTRANS)">Ministério dos Transportes (MINTRANS)</SelectItem>
                    <SelectItem value="Ministério das Telecomunicações, Tecnologias de Informação e Comunicação Social (MINTTICS)">Ministério das Telecomunicações, Tecnologias de Informação e Comunicação Social (MINTTICS)</SelectItem>
                    <SelectItem value="Ministério da Educação (MED)">Ministério da Educação (MED)</SelectItem>
                    <SelectItem value="Ministério do Ensino Superior, Ciência, Tecnologia e Inovação (MESCTI)">Ministério do Ensino Superior, Ciência, Tecnologia e Inovação (MESCTI)</SelectItem>
                    <SelectItem value="Ministério da Saúde (MINSA)">Ministério da Saúde (MINSA)</SelectItem>
                    <SelectItem value="Ministério da Cultura e Turismo (MINCULTUR)">Ministério da Cultura e Turismo (MINCULTUR)</SelectItem>
                    <SelectItem value="Ministério da Administração Pública, Trabalho e Segurança Social (MAPTSS)">Ministério da Administração Pública, Trabalho e Segurança Social (MAPTSS)</SelectItem>
                    <SelectItem value="Ministério da Justiça e dos Direitos Humanos (MINJUSDH)">Ministério da Justiça e dos Direitos Humanos (MINJUSDH)</SelectItem>
                    <SelectItem value="Ministério do Interior (MININT)">Ministério do Interior (MININT)</SelectItem>
                    <SelectItem value="Ministério da Defesa Nacional, Antigos Combatentes e Veteranos da Pátria (MDNACVP)">Ministério da Defesa Nacional, Antigos Combatentes e Veteranos da Pátria (MDNACVP)</SelectItem>
                    <SelectItem value="Ministério do Ambiente (MINAMB)">Ministério do Ambiente (MINAMB)</SelectItem>
                    <SelectItem value="Ministério da Juventude e Desportos (MINJUD)">Ministério da Juventude e Desportos (MINJUD)</SelectItem>
                    <SelectItem value="Ministério das Relações Exteriores (MIREX)">Ministério das Relações Exteriores (MIREX)</SelectItem>
                    
                    <SelectItem value="D. Tribunais Superiores">D. Tribunais Superiores</SelectItem>
                    <SelectItem value="Tribunal Constitucional">Tribunal Constitucional</SelectItem>
                    <SelectItem value="Tribunal Supremo">Tribunal Supremo</SelectItem>
                    <SelectItem value="Tribunal de Contas">Tribunal de Contas</SelectItem>
                    <SelectItem value="Tribunal Militar Supremo">Tribunal Militar Supremo</SelectItem>
                    
                    <SelectItem value="E. Procuradoria-Geral da República (PGR)">E. Procuradoria-Geral da República (PGR)</SelectItem>
                    <SelectItem value="Procuradoria-Geral da República">Procuradoria-Geral da República</SelectItem>
                    
                    <SelectItem value="F. Outros Órgãos de Soberania">F. Outros Órgãos de Soberania</SelectItem>
                    <SelectItem value="Comissão Nacional Eleitoral (CNE)">Comissão Nacional Eleitoral (CNE)</SelectItem>
                    <SelectItem value="Conselho de Segurança Nacional">Conselho de Segurança Nacional</SelectItem>
                    <SelectItem value="Provedoria de Justiça">Provedoria de Justiça</SelectItem>
                  </SelectContent>
                </Select>
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
