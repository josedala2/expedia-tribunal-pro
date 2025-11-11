import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Trash2, Plus, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const GestaoSeccoesDivisoes = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<"seccao" | "divisao">("seccao");
  const [editingValue, setEditingValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [deletingValue, setDeletingValue] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch secções with usage count
  const { data: seccoes, isLoading: loadingSeccoes } = useQuery({
    queryKey: ["seccoes-with-count"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("seccao");
      
      if (error) throw error;
      
      const seccaoMap = new Map<string, number>();
      data.forEach(profile => {
        if (profile.seccao) {
          seccaoMap.set(profile.seccao, (seccaoMap.get(profile.seccao) || 0) + 1);
        }
      });
      
      return Array.from(seccaoMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  });

  // Fetch divisões with usage count
  const { data: divisoes, isLoading: loadingDivisoes } = useQuery({
    queryKey: ["divisoes-with-count"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("divisao");
      
      if (error) throw error;
      
      const divisaoMap = new Map<string, number>();
      data.forEach(profile => {
        if (profile.divisao) {
          divisaoMap.set(profile.divisao, (divisaoMap.get(profile.divisao) || 0) + 1);
        }
      });
      
      return Array.from(divisaoMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ type, oldValue, newValue }: { type: "seccao" | "divisao", oldValue: string, newValue: string }) => {
      const column = type === "seccao" ? "seccao" : "divisao";
      const { error } = await supabase
        .from("profiles")
        .update({ [column]: newValue })
        .eq(column, oldValue);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seccoes-with-count"] });
      queryClient.invalidateQueries({ queryKey: ["divisoes-with-count"] });
      queryClient.invalidateQueries({ queryKey: ["profiles-seccao-divisao"] });
      toast({
        title: "Atualizado com sucesso",
        description: `${editingType === "seccao" ? "Secção" : "Divisão"} atualizada em todos os perfis.`,
      });
      setEditDialogOpen(false);
      setEditingValue("");
      setNewValue("");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ type, value }: { type: "seccao" | "divisao", value: string }) => {
      const column = type === "seccao" ? "seccao" : "divisao";
      const { error } = await supabase
        .from("profiles")
        .update({ [column]: null })
        .eq(column, value);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seccoes-with-count"] });
      queryClient.invalidateQueries({ queryKey: ["divisoes-with-count"] });
      queryClient.invalidateQueries({ queryKey: ["profiles-seccao-divisao"] });
      toast({
        title: "Removido com sucesso",
        description: `${editingType === "seccao" ? "Secção" : "Divisão"} removida de todos os perfis.`,
      });
      setDeleteDialogOpen(false);
      setDeletingValue("");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (type: "seccao" | "divisao", value: string) => {
    setEditingType(type);
    setEditingValue(value);
    setNewValue(value);
    setEditDialogOpen(true);
  };

  const handleDelete = (type: "seccao" | "divisao", value: string) => {
    setEditingType(type);
    setDeletingValue(value);
    setDeleteDialogOpen(true);
  };

  const handleAdd = (type: "seccao" | "divisao") => {
    setEditingType(type);
    setNewValue("");
    setAddDialogOpen(true);
  };

  const confirmEdit = () => {
    if (!newValue.trim()) {
      toast({
        title: "Nome inválido",
        description: "O nome não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate({ type: editingType, oldValue: editingValue, newValue: newValue.trim() });
  };

  const confirmDelete = () => {
    deleteMutation.mutate({ type: editingType, value: deletingValue });
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Ao editar uma secção ou divisão, todos os utilizadores associados serão atualizados automaticamente.
          Ao remover, a associação será removida de todos os perfis.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="seccoes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="seccoes">Secções</TabsTrigger>
          <TabsTrigger value="divisoes">Divisões</TabsTrigger>
        </TabsList>

        <TabsContent value="seccoes">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestão de Secções</CardTitle>
                  <CardDescription>
                    Editar ou remover secções existentes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingSeccoes ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome da Secção</TableHead>
                      <TableHead>Utilizadores</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seccoes?.map((seccao) => (
                      <TableRow key={seccao.name}>
                        <TableCell className="font-medium">{seccao.name}</TableCell>
                        <TableCell>{seccao.count}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit("seccao", seccao.name)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("seccao", seccao.name)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!seccoes?.length && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          Nenhuma secção encontrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="divisoes">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestão de Divisões</CardTitle>
                  <CardDescription>
                    Editar ou remover divisões existentes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingDivisoes ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome da Divisão</TableHead>
                      <TableHead>Utilizadores</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {divisoes?.map((divisao) => (
                      <TableRow key={divisao.name}>
                        <TableCell className="font-medium">{divisao.name}</TableCell>
                        <TableCell>{divisao.count}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit("divisao", divisao.name)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("divisao", divisao.name)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!divisoes?.length && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          Nenhuma divisão encontrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar {editingType === "seccao" ? "Secção" : "Divisão"}</DialogTitle>
            <DialogDescription>
              Altere o nome. Todos os utilizadores associados serão atualizados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Atual</Label>
              <Input value={editingValue} disabled />
            </div>
            <div className="space-y-2">
              <Label>Novo Nome</Label>
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Digite o novo nome"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá remover a {editingType === "seccao" ? "secção" : "divisão"} "{deletingValue}" 
              de todos os perfis de utilizadores. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
