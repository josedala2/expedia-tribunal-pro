import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Pencil, Trash2, Mail, Lock, Plug, Webhook, Eye, EyeOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface IntegrationConfigProps {
  onBack: () => void;
}

const tiposIntegracao = [
  { value: "SMTP", label: "SMTP (Email)", icon: Mail },
  { value: "SSO", label: "SSO (Autenticação)", icon: Lock },
  { value: "API", label: "API Externa", icon: Plug },
  { value: "Webhook", label: "Webhook", icon: Webhook },
];

// Schema de validação base
const baseConfigSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100),
  tipo: z.enum(["SMTP", "SSO", "API", "Webhook"], {
    errorMap: () => ({ message: "Tipo inválido" })
  }),
  ativo: z.boolean()
});

export default function IntegrationConfig({ onBack }: IntegrationConfigProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    ativo: true,
    config: {} as Record<string, any>
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const { data: integrations, isLoading } = useQuery({
    queryKey: ["integration-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("integration_config")
        .select("*")
        .order("nome");
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("integration_config")
        .insert([{
          nome: data.nome,
          tipo: data.tipo,
          ativo: data.ativo,
          config: data.config
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integration-config"] });
      toast.success("Integração criada com sucesso");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao criar integração");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("integration_config")
        .update({
          nome: data.nome,
          tipo: data.tipo,
          ativo: data.ativo,
          config: data.config
        })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integration-config"] });
      toast.success("Integração atualizada com sucesso");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao atualizar integração");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("integration_config")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integration-config"] });
      toast.success("Integração excluída com sucesso");
      setDeleteDialogOpen(false);
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao excluir integração");
    }
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      tipo: "",
      ativo: true,
      config: {}
    });
    setErrors({});
    setEditingIntegration(null);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (integration: any) => {
    setEditingIntegration(integration);
    setFormData({
      nome: integration.nome,
      tipo: integration.tipo,
      ativo: integration.ativo,
      config: integration.config || {}
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const validateForm = (): boolean => {
    try {
      baseConfigSchema.parse({
        nome: formData.nome,
        tipo: formData.tipo,
        ativo: formData.ativo
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Corrija os erros no formulário");
      return;
    }

    if (editingIntegration) {
      updateMutation.mutate({ id: editingIntegration.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getTipoInfo = (tipo: string) => {
    return tiposIntegracao.find(t => t.value === tipo) || tiposIntegracao[0];
  };

  const maskSensitiveValue = (value: string) => {
    if (!value) return "";
    if (value.length <= 8) return "••••••••";
    return value.substring(0, 4) + "••••••••" + value.substring(value.length - 4);
  };

  const toggleShowSensitive = (id: string) => {
    setShowSensitive(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateConfig = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  const renderConfigFields = () => {
    switch (formData.tipo) {
      case "SMTP":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Host SMTP *</Label>
                <Input
                  value={formData.config.host || ""}
                  onChange={(e) => updateConfig("host", e.target.value)}
                  placeholder="smtp.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Porta *</Label>
                <Input
                  type="number"
                  value={formData.config.port || ""}
                  onChange={(e) => updateConfig("port", parseInt(e.target.value))}
                  placeholder="587"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Usuário *</Label>
              <Input
                value={formData.config.username || ""}
                onChange={(e) => updateConfig("username", e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Senha *</Label>
              <Input
                type="password"
                value={formData.config.password || ""}
                onChange={(e) => updateConfig("password", e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.config.secure || false}
                onCheckedChange={(checked) => updateConfig("secure", checked)}
              />
              <Label>Usar SSL/TLS</Label>
            </div>
          </div>
        );
      
      case "SSO":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Provider *</Label>
              <Select 
                value={formData.config.provider || ""} 
                onValueChange={(value) => updateConfig("provider", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="microsoft">Microsoft</SelectItem>
                  <SelectItem value="okta">Okta</SelectItem>
                  <SelectItem value="auth0">Auth0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Client ID *</Label>
              <Input
                value={formData.config.clientId || ""}
                onChange={(e) => updateConfig("clientId", e.target.value)}
                placeholder="your-client-id"
              />
            </div>
            <div className="space-y-2">
              <Label>Client Secret *</Label>
              <Input
                type="password"
                value={formData.config.clientSecret || ""}
                onChange={(e) => updateConfig("clientSecret", e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label>Redirect URI</Label>
              <Input
                value={formData.config.redirectUri || ""}
                onChange={(e) => updateConfig("redirectUri", e.target.value)}
                placeholder="https://your-app.com/auth/callback"
              />
            </div>
          </div>
        );
      
      case "API":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL Base *</Label>
              <Input
                value={formData.config.baseUrl || ""}
                onChange={(e) => updateConfig("baseUrl", e.target.value)}
                placeholder="https://api.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Autenticação *</Label>
              <Select 
                value={formData.config.authType || ""} 
                onValueChange={(value) => updateConfig("authType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="apikey">API Key</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Credencial *</Label>
              <Input
                type="password"
                value={formData.config.credential || ""}
                onChange={(e) => updateConfig("credential", e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label>Headers Customizados (JSON)</Label>
              <Textarea
                value={formData.config.customHeaders || ""}
                onChange={(e) => updateConfig("customHeaders", e.target.value)}
                placeholder='{"X-Custom-Header": "value"}'
                rows={3}
              />
            </div>
          </div>
        );
      
      case "Webhook":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL do Webhook *</Label>
              <Input
                value={formData.config.url || ""}
                onChange={(e) => updateConfig("url", e.target.value)}
                placeholder="https://webhook.example.com/endpoint"
              />
            </div>
            <div className="space-y-2">
              <Label>Método HTTP *</Label>
              <Select 
                value={formData.config.method || "POST"} 
                onValueChange={(value) => updateConfig("method", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Secret (opcional)</Label>
              <Input
                type="password"
                value={formData.config.secret || ""}
                onChange={(e) => updateConfig("secret", e.target.value)}
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground">
                Secret para validação de assinatura HMAC
              </p>
            </div>
            <div className="space-y-2">
              <Label>Headers (JSON)</Label>
              <Textarea
                value={formData.config.headers || ""}
                onChange={(e) => updateConfig("headers", e.target.value)}
                placeholder='{"Content-Type": "application/json"}'
                rows={3}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Configurações de Integração</h1>
            <p className="text-muted-foreground">Gerir integrações externas (SMTP, SSO, API, Webhooks)</p>
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Integração
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="SMTP">SMTP</TabsTrigger>
          <TabsTrigger value="SSO">SSO</TabsTrigger>
          <TabsTrigger value="API">API</TabsTrigger>
          <TabsTrigger value="Webhook">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrações Cadastradas</CardTitle>
              <CardDescription>Gerir todas as integrações externas do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Carregando...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {integrations?.map((integration) => {
                      const tipoInfo = getTipoInfo(integration.tipo);
                      const Icon = tipoInfo.icon;
                      return (
                        <TableRow key={integration.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              {integration.nome}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{tipoInfo.label}</Badge>
                          </TableCell>
                          <TableCell>
                            {integration.ativo ? (
                              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                            ) : (
                              <Badge variant="secondary">Inativo</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(integration)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(integration.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {tiposIntegracao.map((tipo) => (
          <TabsContent key={tipo.value} value={tipo.value}>
            <Card>
              <CardHeader>
                <CardTitle>Integrações {tipo.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {integrations?.filter(i => i.tipo === tipo.value).map((integration) => (
                      <TableRow key={integration.id}>
                        <TableCell className="font-medium">{integration.nome}</TableCell>
                        <TableCell>
                          {integration.ativo ? (
                            <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                          ) : (
                            <Badge variant="secondary">Inativo</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(integration)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(integration.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Segurança de Credenciais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-yellow-800 space-y-2 list-disc list-inside">
            <li>Credenciais sensíveis são armazenadas de forma segura no banco de dados</li>
            <li>Valores sensíveis são mascarados na interface</li>
            <li>Para uso em edge functions, considere usar Supabase Secrets</li>
            <li>Teste as integrações após configuração</li>
          </ul>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingIntegration ? "Editar Integração" : "Nova Integração"}</DialogTitle>
            <DialogDescription>
              Configure a integração externa com credenciais e parâmetros
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Integração *</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Email Principal"
                className={errors.nome ? "border-red-500" : ""}
              />
              {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
            </div>

            <div className="space-y-2">
              <Label>Tipo de Integração *</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value) => setFormData({ ...formData, tipo: value, config: {} })}
              >
                <SelectTrigger className={errors.tipo ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposIntegracao.map((tipo) => {
                    const Icon = tipo.icon;
                    return (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {tipo.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.tipo && <p className="text-sm text-red-500">{errors.tipo}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
              />
              <Label>Integração Ativa</Label>
            </div>

            {formData.tipo && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Configurações Específicas</h3>
                {renderConfigFields()}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingIntegration ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta integração? Esta ação não pode ser desfeita e pode afetar funcionalidades que dependem desta integração.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
