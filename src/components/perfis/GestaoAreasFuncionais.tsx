import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Edit } from "lucide-react";
import { toast } from "sonner";

export const GestaoAreasFuncionais = () => {
  const { data: areas, isLoading } = useQuery({
    queryKey: ["areas-funcionais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("areas_funcionais")
        .select("*")
        .order("nome_area");

      if (error) {
        toast.error("Erro ao carregar áreas funcionais");
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">A carregar áreas funcionais...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas?.map((area) => (
          <Card key={area.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">{area.nome_area}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{area.descricao}</p>
                  </div>
                </div>
              </div>

              {area.unidades_internas && area.unidades_internas.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Unidades Internas:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {area.unidades_internas.map((unidade, index) => (
                      <Badge key={index} variant="outline">
                        {unidade}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
