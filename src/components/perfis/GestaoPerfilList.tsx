import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield, Eye, Edit } from "lucide-react";
import { toast } from "sonner";
import { VisualizarPerfilDialog } from "./VisualizarPerfilDialog";
import { EditarPerfilDialog } from "./EditarPerfilDialog";

export const GestaoPerfilList = () => {
  const [perfilSelecionado, setPerfilSelecionado] = useState<any>(null);
  const [dialogVisualizar, setDialogVisualizar] = useState(false);
  const [dialogEditar, setDialogEditar] = useState(false);

  const { data: perfis, isLoading, refetch } = useQuery({
    queryKey: ["perfis-utilizador"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("perfis_utilizador")
        .select("*, areas_funcionais(nome_area)")
        .order("nome_perfil");

      if (error) {
        toast.error("Erro ao carregar perfis");
        throw error;
      }

      return data;
    },
  });

  const handleVisualizarPerfil = (perfil: any) => {
    setPerfilSelecionado(perfil);
    setDialogVisualizar(true);
  };

  const handleEditarPerfil = (perfil: any) => {
    setPerfilSelecionado(perfil);
    setDialogEditar(true);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">A carregar perfis...</p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {perfis?.map((perfil) => (
            <Card key={perfil.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">{perfil.nome_perfil}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {perfil.descricao}
                      </p>
                    </div>
                  </div>
                  <Badge variant={perfil.activo ? "default" : "secondary"}>
                    {perfil.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>

                {perfil.areas_funcionais && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Área:</span> {perfil.areas_funcionais.nome_area}
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>{perfil.permissoes?.length || 0} permissões</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleVisualizarPerfil(perfil)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditarPerfil(perfil)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <VisualizarPerfilDialog
        perfil={perfilSelecionado}
        open={dialogVisualizar}
        onOpenChange={setDialogVisualizar}
      />

      <EditarPerfilDialog
        perfil={perfilSelecionado}
        open={dialogEditar}
        onOpenChange={setDialogEditar}
        onSuccess={() => {
          refetch();
          setDialogEditar(false);
        }}
      />
    </>
  );
};
