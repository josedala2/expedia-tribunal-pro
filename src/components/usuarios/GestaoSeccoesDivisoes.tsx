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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const GestaoSeccoesDivisoes = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<"seccao" | "divisao">("seccao");
  const [editingId, setEditingId] = useState<string>("");
  const [editingValue, setEditingValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [divisaoPaiId, setDivisaoPaiId] = useState<string>("none");
  const [deletingValue, setDeletingValue] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch secções with usage count
  const { data: seccoes, isLoading: loadingSeccoes } = useQuery({
    queryKey: ["seccoes-with-count"],
    queryFn: async () => {
      // Fetch from organizacao_estrutura with divisao info
      const { data: estruturaData } = await supabase
        .from("organizacao_estrutura")
        .select(`
          *,
          divisao_pai:divisao_pai_id (
            id,
            nome
          )
        `)
        .eq("tipo", "seccao");
      
      // Fetch from profiles
      const { data: profilesData, error } = await supabase
        .from("profiles")
        .select("seccao");
      
      if (error) throw error;
      
      const seccaoMap = new Map<string, { 
        count: number, 
        descricao?: string, 
        divisao_pai?: string,
        divisao_pai_id?: string,
        id?: string 
      }>();
      
      // Add from estrutura
      estruturaData?.forEach(item => {
        seccaoMap.set(item.nome, { 
          count: 0, 
          descricao: item.descricao || undefined,
          divisao_pai: item.divisao_pai?.nome,
          divisao_pai_id: item.divisao_pai_id,
          id: item.id
        });
      });
      
      // Count from profiles
      profilesData.forEach(profile => {
        if (profile.seccao) {
          const existing = seccaoMap.get(profile.seccao);
          if (existing) {
            existing.count++;
          } else {
            seccaoMap.set(profile.seccao, { count: 1 });
          }
        }
      });
      
      return Array.from(seccaoMap.entries())
        .map(([name, data]) => ({ 
          name, 
          count: data.count, 
          descricao: data.descricao,
          divisao_pai: data.divisao_pai,
          divisao_pai_id: data.divisao_pai_id,
          id: data.id
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  });

  // Fetch divisões with usage count
  const { data: divisoes, isLoading: loadingDivisoes } = useQuery({
    queryKey: ["divisoes-with-count"],
    queryFn: async () => {
      // Fetch from organizacao_estrutura
      const { data: estruturaData } = await supabase
        .from("organizacao_estrutura")
        .select("*")
        .eq("tipo", "divisao");
      
      // Fetch from profiles
      const { data: profilesData, error } = await supabase
        .from("profiles")
        .select("divisao");
      
      if (error) throw error;
      
      const divisaoMap = new Map<string, { count: number, descricao?: string, id?: string }>();
      
      // Add from estrutura
      estruturaData?.forEach(item => {
        divisaoMap.set(item.nome, { count: 0, descricao: item.descricao || undefined, id: item.id });
      });
      
      // Count from profiles
      profilesData.forEach(profile => {
        if (profile.divisao) {
          const existing = divisaoMap.get(profile.divisao);
          if (existing) {
            existing.count++;
          } else {
            divisaoMap.set(profile.divisao, { count: 1 });
          }
        }
      });
      
      return Array.from(divisaoMap.entries())
        .map(([name, data]) => ({ name, count: data.count, descricao: data.descricao, id: data.id }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ 
      type, 
      id,
      oldValue, 
      newValue,
      divisao_pai_id 
    }: { 
      type: "seccao" | "divisao", 
      id?: string,
      oldValue: string, 
      newValue: string,
      divisao_pai_id?: string 
    }) => {
      // Update in organizacao_estrutura if we have an ID
      if (id) {
        const updateData: any = { nome: newValue };
        if (type === "seccao") {
          updateData.divisao_pai_id = divisao_pai_id === "none" ? null : divisao_pai_id || null;
        }
        
        const { error: estruturaError } = await supabase
          .from("organizacao_estrutura")
          .update(updateData)
          .eq("id", id);
        
        if (estruturaError) throw estruturaError;
      }
      
      // Update in profiles
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
      setEditingId("");
      setEditingValue("");
      setNewValue("");
      setDivisaoPaiId("");
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

  const handleEdit = (type: "seccao" | "divisao", value: string, id?: string, divisaoPaiIdAtual?: string) => {
    setEditingType(type);
    setEditingId(id || "");
    setEditingValue(value);
    setNewValue(value);
    setDivisaoPaiId(divisaoPaiIdAtual || "none");
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
    setNewDescription("");
    setDivisaoPaiId("none");
    setAddDialogOpen(true);
  };

  // Add mutation
  const addMutation = useMutation({
    mutationFn: async ({ type, nome, descricao, divisao_pai_id }: { 
      type: "seccao" | "divisao", 
      nome: string, 
      descricao?: string,
      divisao_pai_id?: string 
    }) => {
      const { error } = await supabase
        .from("organizacao_estrutura")
        .insert({
          tipo: type,
          nome: nome.trim(),
          descricao: descricao?.trim() || null,
          divisao_pai_id: type === "seccao" && divisao_pai_id ? divisao_pai_id : null,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seccoes-with-count"] });
      queryClient.invalidateQueries({ queryKey: ["divisoes-with-count"] });
      queryClient.invalidateQueries({ queryKey: ["profiles-seccao-divisao"] });
      toast({
        title: "Criado com sucesso",
        description: `${editingType === "seccao" ? "Secção" : "Divisão"} cadastrada e disponível para seleção.`,
      });
      setAddDialogOpen(false);
      setNewValue("");
      setNewDescription("");
      setDivisaoPaiId("");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const confirmEdit = () => {
    if (!newValue.trim()) {
      toast({
        title: "Nome inválido",
        description: "O nome não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate({ 
      type: editingType,
      id: editingId,
      oldValue: editingValue, 
      newValue: newValue.trim(),
      divisao_pai_id: divisaoPaiId === "none" ? undefined : divisaoPaiId 
    });
  };

  const confirmDelete = () => {
    deleteMutation.mutate({ type: editingType, value: deletingValue });
  };

  const confirmAdd = () => {
    if (!newValue.trim()) {
      toast({
        title: "Nome inválido",
        description: "O nome não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }
    addMutation.mutate({ 
      type: editingType, 
      nome: newValue, 
      descricao: newDescription,
      divisao_pai_id: divisaoPaiId === "none" ? undefined : divisaoPaiId 
    });
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
                    Cadastrar, editar ou remover secções
                  </CardDescription>
                </div>
                <Button onClick={() => handleAdd("seccao")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Secção
                </Button>
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
                      <TableHead>Divisão</TableHead>
                      <TableHead>Utilizadores</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seccoes?.map((seccao) => (
                      <TableRow key={seccao.name}>
                        <TableCell className="font-medium">{seccao.name}</TableCell>
                        <TableCell>
                          {seccao.divisao_pai ? (
                            <span className="text-sm text-muted-foreground">{seccao.divisao_pai}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">Sem divisão</span>
                          )}
                        </TableCell>
                        <TableCell>{seccao.count}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit("seccao", seccao.name, seccao.id, seccao.divisao_pai_id)}
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
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
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
                    Cadastrar, editar ou remover divisões
                  </CardDescription>
                </div>
                <Button onClick={() => handleAdd("divisao")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Divisão
                </Button>
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
            {editingType === "seccao" && (
              <div className="space-y-2">
                <Label>Divisão</Label>
                <Select value={divisaoPaiId} onValueChange={setDivisaoPaiId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma divisão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem divisão</SelectItem>
                    {divisoes?.filter(d => d.id).map((divisao) => (
                      <SelectItem key={divisao.id} value={divisao.id!}>
                        {divisao.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova {editingType === "seccao" ? "Secção" : "Divisão"}</DialogTitle>
            <DialogDescription>
              Cadastrar uma nova {editingType === "seccao" ? "secção" : "divisão"} para a organização.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={`Digite o nome da ${editingType === "seccao" ? "secção" : "divisão"}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição (opcional)</Label>
              <Input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Digite uma descrição"
              />
            </div>
            {editingType === "seccao" && (
              <div className="space-y-2">
                <Label>Divisão (opcional)</Label>
                <Select value={divisaoPaiId} onValueChange={setDivisaoPaiId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma divisão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem divisão</SelectItem>
                    {divisoes?.filter(d => d.id).map((divisao) => (
                      <SelectItem key={divisao.id} value={divisao.id!}>
                        {divisao.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmAdd} disabled={addMutation.isPending}>
              {addMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar
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
