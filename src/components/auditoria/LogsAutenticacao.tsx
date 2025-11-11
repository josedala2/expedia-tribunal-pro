import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, XCircle, LogIn, LogOut, UserPlus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const LogsAutenticacao = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventoFilter, setEventoFilter] = useState("todos");
  const [sucessoFilter, setSucessoFilter] = useState("todos");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["auth-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auth_logs")
        .select("*")
        .order("criado_em", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    refetchInterval: 10000, // Actualizar a cada 10 segundos
  });

  const logsFiltrados = logs?.filter((log) => {
    const matchSearch =
      log.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip_address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEvento = eventoFilter === "todos" || log.evento === eventoFilter;
    const matchSucesso = sucessoFilter === "todos" || 
      (sucessoFilter === "sucesso" && log.sucesso) ||
      (sucessoFilter === "falha" && !log.sucesso);

    return matchSearch && matchEvento && matchSucesso;
  });

  const getEventoIcon = (evento: string) => {
    switch (evento) {
      case "login":
        return <LogIn className="h-4 w-4" />;
      case "logout":
        return <LogOut className="h-4 w-4" />;
      case "signup":
        return <UserPlus className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getEventoLabel = (evento: string) => {
    const labels: Record<string, string> = {
      login: "Iniciar Sessão",
      logout: "Terminar Sessão",
      signup: "Registo",
      password_reset: "Reset Password",
      session_refresh: "Actualização Sessão",
    };
    return labels[evento] || evento;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">A carregar logs...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por email ou IP..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={eventoFilter} onValueChange={setEventoFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Evento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Eventos</SelectItem>
              <SelectItem value="login">Iniciar Sessão</SelectItem>
              <SelectItem value="logout">Terminar Sessão</SelectItem>
              <SelectItem value="signup">Registo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sucessoFilter} onValueChange={setSucessoFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Estados</SelectItem>
              <SelectItem value="sucesso">Sucesso</SelectItem>
              <SelectItem value="falha">Falha</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Navegador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logsFiltrados?.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {format(new Date(log.criado_em), "dd/MM/yyyy HH:mm:ss", { locale: pt })}
                  </TableCell>
                  <TableCell className="font-medium">{log.email || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEventoIcon(log.evento)}
                      <span className="text-sm">{getEventoLabel(log.evento)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.sucesso ? (
                      <Badge variant="default" className="gap-1 bg-success">
                        <CheckCircle2 className="h-3 w-3" />
                        Sucesso
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Falha
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.ip_address || "N/A"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {log.user_agent || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {logsFiltrados && logsFiltrados.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhum log encontrado
          </p>
        )}
      </div>
    </Card>
  );
};
