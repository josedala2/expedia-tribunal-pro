import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Users, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Usuario {
  id: string;
  nome_completo: string;
  email: string;
  seccao: string | null;
  divisao: string | null;
}

export const TransferenciaMassaUtilizadores = () => {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [tipoDestino, setTipoDestino] = useState<"seccao" | "divisao">("seccao");
  const [destinoId, setDestinoId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch utilizadores
  const { data: usuarios, isLoading: loadingUsuarios } = useQuery({
    queryKey: ["usuarios-transferencia"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, nome_completo, email, seccao, divisao")
        .order("nome_completo");
      
      if (error) throw error;
      return data as Usuario[];
    },
  });

  // Fetch divisões
  const { data: divisoes } = useQuery({
    queryKey: ["divisoes-transferencia"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizacao_estrutura")
        .select("id, nome")
        .eq("tipo", "divisao")
        .order("nome");
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch secções
  const { data: seccoes } = useQuery({
    queryKey: ["seccoes-transferencia"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizacao_estrutura")
        .select(`
          id,
          nome,
          divisao_pai:divisao_pai_id (
            nome
          )
        `)
        .eq("tipo", "seccao")
        .order("nome");
      
      if (error) throw error;
      return data;
    },
  });

  // Mutation para transferência
  const transferMutation = useMutation({
    mutationFn: async () => {
      const updateData: any = {};
      
      if (tipoDestino === "seccao") {
        const seccaoNome = seccoes?.find(s => s.id === destinoId)?.nome;
        updateData.seccao = seccaoNome || null;
      } else {
        const divisaoNome = divisoes?.find(d => d.id === destinoId)?.nome;
        updateData.divisao = divisaoNome || null;
      }

      const userIds = Array.from(selectedUsers);
      
      // Update all users in parallel
      const updates = userIds.map(userId =>
        supabase
          .from("profiles")
          .update(updateData)
          .eq("id", userId)
      );

      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) {
        throw new Error(`${errors.length} falhas na transferência`);
      }

      return results;
    },
    onSuccess: () => {
      toast({
        title: "Transferência concluída",
        description: `${selectedUsers.size} utilizador(es) transferido(s) com sucesso.`,
      });
      setSelectedUsers(new Set());
      setDestinoId("");
      queryClient.invalidateQueries({ queryKey: ["usuarios-transferencia"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na transferência",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleUser = (userId: string) => {
    const newSet = new Set(selectedUsers);
    if (newSet.has(userId)) {
      newSet.delete(userId);
    } else {
      newSet.add(userId);
    }
    setSelectedUsers(newSet);
  };

  const toggleAll = () => {
    if (selectedUsers.size === filteredUsuarios.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsuarios.map(u => u.id)));
    }
  };

  const filteredUsuarios = usuarios?.filter(u =>
    u.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleTransfer = () => {
    if (selectedUsers.size === 0) {
      toast({
        title: "Nenhum utilizador selecionado",
        description: "Selecione pelo menos um utilizador para transferir.",
        variant: "destructive",
      });
      return;
    }

    if (!destinoId) {
      toast({
        title: "Destino não selecionado",
        description: "Selecione um destino para a transferência.",
        variant: "destructive",
      });
      return;
    }

    transferMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Transferência em Massa de Utilizadores
        </CardTitle>
        <CardDescription>
          Selecione utilizadores e mova-os para uma nova divisão ou secção
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuração de Destino */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <Label>Tipo de Destino</Label>
            <Select
              value={tipoDestino}
              onValueChange={(value: "seccao" | "divisao") => {
                setTipoDestino(value);
                setDestinoId("");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seccao">Secção</SelectItem>
                <SelectItem value="divisao">Divisão</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Destino</Label>
            <Select value={destinoId} onValueChange={setDestinoId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o destino" />
              </SelectTrigger>
              <SelectContent>
                {tipoDestino === "seccao" ? (
                  seccoes?.map((seccao: any) => (
                    <SelectItem key={seccao.id} value={seccao.id}>
                      {seccao.nome}
                      {seccao.divisao_pai && (
                        <span className="text-muted-foreground ml-2">
                          ({seccao.divisao_pai.nome})
                        </span>
                      )}
                    </SelectItem>
                  ))
                ) : (
                  divisoes?.map((divisao) => (
                    <SelectItem key={divisao.id} value={divisao.id}>
                      {divisao.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pesquisa */}
        <div className="space-y-2">
          <Label>Pesquisar Utilizadores</Label>
          <Input
            placeholder="Nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Lista de Utilizadores */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              Utilizadores ({selectedUsers.size} selecionado{selectedUsers.size !== 1 ? 's' : ''})
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAll}
            >
              {selectedUsers.size === filteredUsuarios.length ? "Desmarcar Todos" : "Selecionar Todos"}
            </Button>
          </div>

          <div className="border rounded-lg max-h-[400px] overflow-auto">
            {loadingUsuarios ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Secção Atual</TableHead>
                    <TableHead>Divisão Atual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.has(usuario.id)}
                          onCheckedChange={() => toggleUser(usuario.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {usuario.nome_completo}
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        {usuario.seccao ? (
                          <Badge variant="secondary">{usuario.seccao}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {usuario.divisao ? (
                          <Badge variant="outline">{usuario.divisao}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Botão de Transferência */}
        <div className="flex justify-end">
          <Button
            onClick={handleTransfer}
            disabled={transferMutation.isPending || selectedUsers.size === 0 || !destinoId}
            className="gap-2"
          >
            {transferMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                A transferir...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4" />
                Transferir {selectedUsers.size} Utilizador{selectedUsers.size !== 1 ? 'es' : ''}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
