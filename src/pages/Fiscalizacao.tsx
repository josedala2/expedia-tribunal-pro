import { ArrowLeft, Plus, Search, Filter, FileBarChart, Eye, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FiscalizacaoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const Fiscalizacao = ({ onBack, onNavigate }: FiscalizacaoProps) => {
  const handleView = (numero: string) => {
    toast.info(`A visualizar processo ${numero}`);
    onNavigate?.("detalhe-fiscalizacao");
  };

  const handleChangeStatus = (numero: string, newStatus: string) => {
    toast.success(`Estado do processo ${numero} alterado para: ${newStatus}`);
  };

  const handleDelete = (numero: string) => {
    toast.success(`Processo ${numero} eliminado com sucesso!`);
  };

  const processos = [
    { numero: "FOGE/2024/001", orgao: "Ministério da Saúde", programa: "Programa Nacional de Saúde", status: "Em Fiscalização", auditor: "Dr. João Silva" },
    { numero: "FOGE/2024/002", orgao: "Ministério da Educação", programa: "Expansão Escolar", status: "Relatório Preliminar", auditor: "Dra. Maria Santos" },
    { numero: "FOGE/2024/003", orgao: "MINAGRI", programa: "Desenvolvimento Rural", status: "Concluído", auditor: "Eng. Carlos Neto" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <FileBarChart className="h-8 w-8 text-primary" />
              Fiscalização da Execução do OGE
            </h1>
            <p className="text-muted-foreground">Acompanhamento e controlo da execução orçamental</p>
          </div>
        </div>
        <Button 
          className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2"
          onClick={() => onNavigate?.("novo-fiscalizacao")}
        >
          <Plus className="h-5 w-5" />
          Nova Fiscalização
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="text-2xl font-bold text-primary">15</div>
          <div className="text-sm text-muted-foreground uppercase">Em Fiscalização</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-accent">
          <div className="text-2xl font-bold text-accent">8</div>
          <div className="text-sm text-muted-foreground uppercase">Relatório Preliminar</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-success">
          <div className="text-2xl font-bold text-success">42</div>
          <div className="text-sm text-muted-foreground uppercase">Concluídos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-warning">
          <div className="text-2xl font-bold text-warning">6</div>
          <div className="text-sm text-muted-foreground uppercase">Com Irregularidades</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar por número ou órgão..." className="pl-9" />
          </div>
          <Button variant="outline" className="gap-2 border-accent text-accent hover:bg-accent/10">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Processo</TableHead>
              <TableHead>Órgão</TableHead>
              <TableHead>Programa</TableHead>
              <TableHead>Auditor Responsável</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processos.map((processo) => (
              <TableRow key={processo.numero}>
                <TableCell className="font-medium">{processo.numero}</TableCell>
                <TableCell>{processo.orgao}</TableCell>
                <TableCell>{processo.programa}</TableCell>
                <TableCell>{processo.auditor}</TableCell>
                <TableCell>
                  <Badge 
                    variant={processo.status === "Concluído" ? "default" : "secondary"}
                    className={processo.status === "Concluído" ? "bg-success" : ""}
                  >
                    {processo.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleView(processo.numero)}
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" title="Alterar estado">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card">
                        <DropdownMenuLabel>Alterar Estado</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleChangeStatus(processo.numero, "Em Fiscalização")}>
                          Em Fiscalização
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeStatus(processo.numero, "Relatório Preliminar")}>
                          Relatório Preliminar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeStatus(processo.numero, "Concluído")}>
                          Concluído
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeStatus(processo.numero, "Com Irregularidades")}>
                          Com Irregularidades
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          title="Eliminar"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja eliminar o processo {processo.numero}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(processo.numero)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
