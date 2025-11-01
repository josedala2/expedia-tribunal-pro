import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderCheck, Eye, FileBarChart, DollarSign, FileText, CheckCircle, Inbox } from "lucide-react";

interface MenuCardsProps {
  onNavigate: (view: string) => void;
}

export const MenuCards = ({ onNavigate }: MenuCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Prestação de Contas */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FolderCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Prestação de Contas</CardTitle>
              <CardDescription>Gestão de prestações</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("prestacao-contas")}
          >
            Processos
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("expediente-prestacao")}
          >
            Expediente de Relatório
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("tramitacao-prestacao")}
          >
            Tramitação do Processo
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("cumprimento-despachos-prestacao")}
          >
            Cumprimento de Despachos
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("saida-expediente-prestacao")}
          >
            Saída de Expediente
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("prestacao-soberania")}
          >
            Órgãos de Soberania
          </Button>
        </CardContent>
      </Card>

      {/* Processo de Visto */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Processo de Visto</CardTitle>
              <CardDescription>Gestão de vistos</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("visto")}
          >
            Processos de Visto
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("expediente-processual")}
          >
            Expediente Processual
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("tramitacao-visto")}
          >
            Tramitação do Processo
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("cumprimento-despachos")}
          >
            Cumprimento de Despachos
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("saida-expediente-visto")}
          >
            Saída de Expediente
          </Button>
          <div className="pt-2 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm"
              onClick={() => onNavigate("cobranca-emolumentos")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Cobrança de Emolumentos
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm"
              onClick={() => onNavigate("despacho-promocao")}
            >
              <FileBarChart className="h-4 w-4 mr-2" />
              Despacho de Promoção
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm"
              onClick={() => onNavigate("cumprimento-despachos-geral")}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Cumprimento de Despachos
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm"
              onClick={() => onNavigate("oficios-remessa")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Ofícios de Remessa
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm"
              onClick={() => onNavigate("expedientes-saida")}
            >
              <Inbox className="h-4 w-4 mr-2" />
              Expediente de Saída
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fiscalização OGE */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileBarChart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Fiscalização OGE</CardTitle>
              <CardDescription>Gestão de fiscalização</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("fiscalizacao")}
          >
            Fiscalização OGE
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("expediente-fiscalizacao")}
          >
            Expediente de Relatórios
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("tramitacao-fiscalizacao")}
          >
            Tramitação OGE
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("parecer-trimestral")}
          >
            Parecer Trimestral
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("saida-expediente-fiscalizacao")}
          >
            Saída de Expediente
          </Button>
        </CardContent>
      </Card>

      {/* Processo de Multa */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Processo de Multa</CardTitle>
              <CardDescription>Gestão de multas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm"
            onClick={() => onNavigate("multas")}
          >
            Ver Processos de Multa
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};