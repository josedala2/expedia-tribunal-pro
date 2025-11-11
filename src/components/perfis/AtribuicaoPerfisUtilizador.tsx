import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AtribuirPerfilDialog } from "./AtribuirPerfilDialog";
import { toast } from "sonner";

export const AtribuicaoPerfisUtilizador = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogAtribuir, setDialogAtribuir] = useState(false);
  const [utilizadorSelecionado, setUtilizadorSelecionado] = useState<any>(null);

  const { data: utilizadores, isLoading, refetch } = useQuery({
    queryKey: ["utilizadores-com-perfis"],
    queryFn: async () => {
      // Buscar utilizadores
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("nome_completo");

      if (profilesError) {
        toast.error("Erro ao carregar utilizadores");
        throw profilesError;
      }

      // Buscar perfis atribuídos
      const { data: perfisAtribuidos, error: perfisError } = await supabase
        .from("utilizador_perfis")
        .select(`
          id,
          user_id,
          perfil_id,
          perfis_utilizador(nome_perfil)
        `);

      if (perfisError) {
        toast.error("Erro ao carregar perfis");
        throw perfisError;
      }

      // Combinar dados
      return profiles.map((profile) => ({
        ...profile,
        utilizador_perfis: perfisAtribuidos?.filter((p) => p.user_id === profile.id) || [],
      }));
    },
  });

  const handleAtribuirPerfil = (utilizador: any) => {
    setUtilizadorSelecionado(utilizador);
    setDialogAtribuir(true);
  };

  const utilizadoresFiltrados = utilizadores?.filter((u) =>
    u.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">A carregar utilizadores...</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome ou email..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilizador</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfis Atribuídos</TableHead>
                <TableHead>Acções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utilizadoresFiltrados?.map((utilizador) => (
                <TableRow key={utilizador.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {utilizador.nome_completo
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{utilizador.nome_completo}</span>
                    </div>
                  </TableCell>
                  <TableCell>{utilizador.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {utilizador.utilizador_perfis?.map((up: any) => (
                        <Badge key={up.id} variant="outline">
                          {up.perfis_utilizador?.nome_perfil}
                        </Badge>
                      ))}
                      {(!utilizador.utilizador_perfis || utilizador.utilizador_perfis.length === 0) && (
                        <span className="text-sm text-muted-foreground">Sem perfis</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleAtribuirPerfil(utilizador)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Gerir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AtribuirPerfilDialog
        utilizador={utilizadorSelecionado}
        open={dialogAtribuir}
        onOpenChange={setDialogAtribuir}
        onSuccess={() => {
          refetch();
        }}
      />
    </>
  );
};
