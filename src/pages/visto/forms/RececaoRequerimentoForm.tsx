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
            <Select name="nomeRecorrente" required>
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
