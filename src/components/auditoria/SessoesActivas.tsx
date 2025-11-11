import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { Monitor, Smartphone, Chrome, XCircle } from "lucide-react";
import { toast } from "sonner";

export const SessoesActivas = () => {
  const { data: sessoes, isLoading, refetch } = useQuery({
    queryKey: ["sessoes-activas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessoes_activas")
        .select(`
          *,
          profiles(nome_completo, email)
        `)
        .eq("activa", true)
        .order("ultima_actividade", { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // Actualizar a cada 5 segundos
  });

  const handleTerminarSessao = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from("sessoes_activas")
        .update({ activa: false })
        .eq("session_id", sessionId);

      if (error) throw error;

      toast.success("Sessão terminada com sucesso");
      refetch();
    } catch (error: any) {
      toast.error("Erro ao terminar sessão: " + error.message);
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    if (!userAgent) return <Monitor className="h-4 w-4" />;
    
    if (userAgent.toLowerCase().includes("mobile") || userAgent.toLowerCase().includes("android") || userAgent.toLowerCase().includes("iphone")) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getBrowserName = (userAgent: string) => {
    if (!userAgent) return "Desconhecido";
    
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Outro";
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">A carregar sessões...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Sessões Activas ({sessoes?.length || 0})
          </h3>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilizador</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Iniciada</TableHead>
                <TableHead>Última Actividade</TableHead>
                <TableHead>Acções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessoes?.map((sessao: any) => (
                <TableRow key={sessao.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {sessao.profiles?.nome_completo || "Utilizador"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sessao.profiles?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(sessao.user_agent)}
                      <span className="text-sm">
                        {getBrowserName(sessao.user_agent)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {sessao.ip_address || "N/A"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(sessao.iniciada_em), "dd/MM HH:mm", { locale: pt })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {formatDistanceToNow(new Date(sessao.ultima_actividade), {
                        addSuffix: true,
                        locale: pt,
                      })}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTerminarSessao(sessao.session_id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Terminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {sessoes && sessoes.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma sessão activa
          </p>
        )}
      </div>
    </Card>
  );
};
