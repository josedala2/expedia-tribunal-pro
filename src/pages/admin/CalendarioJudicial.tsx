import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarioJudicialProps {
  onBack: () => void;
}

export default function CalendarioJudicial({ onBack }: CalendarioJudicialProps) {
  const { data: feriados, isLoading } = useQuery({
    queryKey: ["calendario-judicial"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendario_judicial")
        .select("*")
        .order("feriado", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Calendário Judicial</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Feriado
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feriados e Dias Não Úteis</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>A carregar...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Considera para SLAs</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feriados?.map((feriado) => (
                  <TableRow key={feriado.id}>
                    <TableCell>
                      {format(new Date(feriado.feriado), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{feriado.descricao}</TableCell>
                    <TableCell>
                      {feriado.considera_para_slas ? (
                        <Badge variant="default">Sim</Badge>
                      ) : (
                        <Badge variant="secondary">Não</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!feriados?.length && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Nenhum feriado cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}