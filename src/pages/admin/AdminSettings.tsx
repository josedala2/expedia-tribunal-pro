import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AdminSettingsProps {
  onBack: () => void;
}

export default function AdminSettings({ onBack }: AdminSettingsProps) {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("*")
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase
        .from("admin_settings")
        .upsert(values);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("Configurações atualizadas com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar configurações");
    },
  });

  const handleTimezoneChange = (timezone: string) => {
    updateMutation.mutate({ ...settings, timezone });
  };

  const handleLocaleChange = (locale: string) => {
    updateMutation.mutate({ ...settings, locale });
  };

  const handleMaintenanceToggle = (checked: boolean) => {
    updateMutation.mutate({ ...settings, modo_manutencao: checked });
  };

  if (isLoading) {
    return <div>A carregar...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Configurações Gerais</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Fuso Horário</Label>
            <Select
              value={settings?.timezone || "Africa/Luanda"}
              onValueChange={handleTimezoneChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Luanda">África/Luanda</SelectItem>
                <SelectItem value="Europe/Lisbon">Europa/Lisboa</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Idioma</Label>
            <Select
              value={settings?.locale || "pt-PT"}
              onValueChange={handleLocaleChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-PT">Português (PT)</SelectItem>
                <SelectItem value="pt-AO">Português (AO)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo de Manutenção</Label>
              <p className="text-sm text-muted-foreground">
                Ativar modo de manutenção no sistema
              </p>
            </div>
            <Switch
              checked={settings?.modo_manutencao || false}
              onCheckedChange={handleMaintenanceToggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}