import { useState } from "react";
import { Upload, X, File, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Anexo {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url?: string;
  uploading?: boolean;
}

interface AnexosUploadProps {
  anexos: Anexo[];
  onAnexosChange: (anexos: Anexo[]) => void;
  oficioId?: string;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg", 
  "image/png",
  "image/webp"
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const AnexosUpload = ({ anexos, onAnexosChange, oficioId }: AnexosUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newAnexos: Anexo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`Tipo de arquivo não permitido: ${file.name}`);
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Arquivo muito grande: ${file.name} (máx: 10MB)`);
        continue;
      }

      const anexo: Anexo = {
        id: `temp-${Date.now()}-${i}`,
        nome: file.name,
        tipo: file.type,
        tamanho: file.size,
        uploading: true,
      };

      newAnexos.push(anexo);
    }

    if (newAnexos.length === 0) return;

    // Add files to state immediately to show in UI
    onAnexosChange([...anexos, ...newAnexos]);

    // Upload files
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const anexo = newAnexos[i];

      if (!anexo) continue;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Utilizador não autenticado");
          continue;
        }

        // Create file path with user ID folder
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('oficio-anexos')
          .upload(fileName, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error(`Erro ao fazer upload: ${file.name}`);
          
          // Remove failed upload from list
          onAnexosChange(anexos.filter(a => a.id !== anexo.id));
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('oficio-anexos')
          .getPublicUrl(fileName);

        // Update anexo with URL and remove uploading flag
        const updatedAnexos = anexos.map(a =>
          a.id === anexo.id
            ? { ...a, url: publicUrl, uploading: false }
            : a
        );
        onAnexosChange(updatedAnexos);

        // If oficioId exists, save metadata to database
        if (oficioId) {
          const { error: dbError } = await supabase
            .from('oficio_anexos')
            .insert({
              oficio_id: oficioId,
              nome_arquivo: file.name,
              tipo_arquivo: file.type,
              tamanho_arquivo: file.size,
              storage_path: fileName,
              criado_por: user.id,
            });

          if (dbError) {
            console.error("Database error:", dbError);
            toast.error(`Erro ao salvar metadados: ${file.name}`);
          }
        }

        toast.success(`Upload concluído: ${file.name}`);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Erro ao fazer upload: ${file.name}`);
        
        // Remove failed upload from list
        onAnexosChange(anexos.filter(a => a.id !== anexo.id));
      }
    }

    setUploading(false);
    
    // Reset input
    event.target.value = "";
  };

  const handleRemoveAnexo = async (anexoId: string) => {
    const anexo = anexos.find(a => a.id === anexoId);
    if (!anexo) return;

    try {
      // If file was uploaded to storage, delete it
      if (anexo.url) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Extract file path from URL
          const urlParts = anexo.url.split('/');
          const fileName = `${user.id}/${urlParts[urlParts.length - 1]}`;
          
          await supabase.storage
            .from('oficio-anexos')
            .remove([fileName]);

          // Delete from database if oficioId exists
          if (oficioId) {
            await supabase
              .from('oficio_anexos')
              .delete()
              .eq('storage_path', fileName);
          }
        }
      }

      onAnexosChange(anexos.filter(a => a.id !== anexoId));
      toast.success("Anexo removido");
    } catch (error) {
      console.error("Error removing anexo:", error);
      toast.error("Erro ao remover anexo");
    }
  };

  const getFileIcon = (tipo: string) => {
    if (tipo.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    }
    return <File className="h-5 w-5 text-red-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anexos</CardTitle>
        <CardDescription>
          Adicione documentos PDF ou imagens (máx: 10MB por arquivo)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Button */}
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, JPG, PNG ou WEBP (máx: 10MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Anexos List */}
        {anexos.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Arquivos anexados ({anexos.length})</p>
            <div className="space-y-2">
              {anexos.map((anexo) => (
                <div
                  key={anexo.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(anexo.tipo)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{anexo.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(anexo.tamanho)}
                      </p>
                    </div>
                    {anexo.uploading && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAnexo(anexo.id)}
                    disabled={anexo.uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
