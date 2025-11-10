import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Upload, Trash2, Scan, Loader2, File, FileImage, FileCheck, Search } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProcessDocumentsProps {
  processoNumero?: string;
}

const statusColors: Record<string, string> = {
  "validado": "bg-success/10 text-success border-success/20",
  "pendente": "bg-warning/10 text-warning border-warning/20",
  "rejeitado": "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabels: Record<string, string> = {
  "validado": "Validado",
  "pendente": "Pendente",
  "rejeitado": "Rejeitado",
};

const tiposDocumento = [
  "Relatório Principal",
  "Anexo Financeiro",
  "Parecer Técnico",
  "Documento Oficial",
  "Comprovativo",
  "Outro",
];

export const ProcessDocuments = ({ processoNumero = "PC/2024/001" }: ProcessDocumentsProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [descricao, setDescricao] = useState("");
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);

  // Configurar PDF.js worker
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }, []);

  // Extract text from PDF
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      return fullText.trim();
    } catch (error) {
      console.error('Erro ao extrair texto do PDF:', error);
      throw error;
    }
  };

  // Extract text from image using OCR
  const extractTextFromImage = async (file: File): Promise<string> => {
    try {
      const result = await Tesseract.recognize(file, 'por', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`Progresso OCR: ${Math.round(m.progress * 100)}%`);
          }
        },
      });
      return result.data.text.trim();
    } catch (error) {
      console.error('Erro ao processar OCR:', error);
      throw error;
    }
  };

  // Fetch documentos
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["processo-documentos", processoNumero],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("processo_documentos")
        .select("*")
        .eq("processo_numero", processoNumero)
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Search documents by extracted text
  const { data: searchResults } = useQuery({
    queryKey: ['search-documentos', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 3) return null;
      
      const { data, error } = await supabase
        .rpc('search_documentos', { search_query: searchQuery });

      if (error) throw error;
      return data || [];
    },
    enabled: searchQuery.length >= 3,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!uploadFile || !tipoDocumento) {
        throw new Error("Arquivo e tipo de documento são obrigatórios");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Upload para storage
      const fileExt = uploadFile.name.split(".").pop();
      const fileName = `${user.id}/${processoNumero}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("processo-documentos")
        .upload(filePath, uploadFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Extract text based on file type
      setIsProcessingOCR(true);
      let textoExtraido = '';
      let ocrProcessado = false;

      try {
        if (uploadFile.type === 'application/pdf') {
          textoExtraido = await extractTextFromPDF(uploadFile);
          ocrProcessado = true;
          toast.success("Texto extraído do PDF com sucesso!");
        } else if (uploadFile.type.startsWith('image/')) {
          textoExtraido = await extractTextFromImage(uploadFile);
          ocrProcessado = true;
          toast.success("OCR processado com sucesso!");
        }
      } catch (error) {
        console.error('Erro no processamento OCR:', error);
        toast.warning('Documento anexado, mas não foi possível extrair texto');
      } finally {
        setIsProcessingOCR(false);
      }

      // Inserir metadados com texto extraído
      const { error: dbError } = await supabase
        .from("processo_documentos")
        .insert({
          processo_numero: processoNumero,
          nome_arquivo: uploadFile.name,
          tipo_documento: tipoDocumento,
          descricao: descricao,
          tamanho_arquivo: uploadFile.size,
          tipo_mime: uploadFile.type,
          storage_path: filePath,
          uploaded_by: user.id,
          status: "pendente",
          texto_extraido: textoExtraido,
          ocr_processado: ocrProcessado,
          ocr_processado_em: ocrProcessado ? new Date().toISOString() : null,
        });

      if (dbError) throw dbError;

      return { filePath, ocrProcessado };
    },
    onSuccess: (data) => {
      const message = data.ocrProcessado 
        ? "Documento anexado e texto extraído com sucesso!" 
        : "Documento anexado com sucesso!";
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["processo-documentos", processoNumero] });
      setShowUploadDialog(false);
      setUploadFile(null);
      setTipoDocumento("");
      setDescricao("");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao anexar documento: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (doc: any) => {
      // Deletar do storage
      const { error: storageError } = await supabase.storage
        .from("processo-documentos")
        .remove([doc.storage_path]);

      if (storageError) throw storageError;

      // Deletar do banco
      const { error: dbError } = await supabase
        .from("processo_documentos")
        .delete()
        .eq("id", doc.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      toast.success("Documento eliminado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["processo-documentos", processoNumero] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao eliminar documento: ${error.message}`);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Tamanho máximo: 50MB");
        return;
      }
      setUploadFile(file);
      setShowUploadDialog(true);
    }
  };

  const handleUpload = () => {
    uploadMutation.mutate();
  };

  const handleView = async (doc: any) => {
    try {
      const { data, error } = await supabase.storage
        .from("processo-documentos")
        .createSignedUrl(doc.storage_path, 3600); // 1 hora

      if (error) throw error;

      if (doc.tipo_mime === "application/pdf" || doc.tipo_mime.startsWith("image/")) {
        setViewerUrl(data.signedUrl);
        setShowViewer(true);
      } else {
        window.open(data.signedUrl, "_blank");
      }
    } catch (error: any) {
      toast.error(`Erro ao visualizar: ${error.message}`);
    }
  };

  const handleDownload = async (doc: any) => {
    try {
      const { data, error } = await supabase.storage
        .from("processo-documentos")
        .createSignedUrl(doc.storage_path, 60);

      if (error) throw error;

      const link = document.createElement("a");
      link.href = data.signedUrl;
      link.download = doc.nome_arquivo;
      link.click();

      toast.success(`Download iniciado: ${doc.nome_arquivo}`);
    } catch (error: any) {
      toast.error(`Erro ao fazer download: ${error.message}`);
    }
  };

  const handleDelete = (doc: any) => {
    deleteMutation.mutate(doc);
  };

  const handleScan = () => {
    toast.info("Funcionalidade de digitalização será implementada");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <FileImage className="h-6 w-6 text-primary" />;
    if (mimeType === "application/pdf") return <FileText className="h-6 w-6 text-destructive" />;
    if (mimeType.includes("word")) return <File className="h-6 w-6 text-blue-500" />;
    if (mimeType.includes("sheet") || mimeType.includes("excel")) return <File className="h-6 w-6 text-green-500" />;
    return <File className="h-6 w-6 text-muted-foreground" />;
  };

  const displayDocuments = searchQuery.length >= 3 && searchResults 
    ? searchResults 
    : documents;

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Documentos do Processo</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {documents.length} documento(s) anexado(s)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleScan} variant="outline">
              <Scan className="mr-2 h-4 w-4" />
              Digitalizar
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingOCR}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isProcessingOCR ? 'Processando...' : 'Anexar Documento'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Pesquisar por conteúdo dos documentos (mínimo 3 caracteres)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery.length >= 3 && searchResults && (
              <p className="text-sm text-muted-foreground mt-2">
                {searchResults.length} documento(s) encontrado(s)
              </p>
            )}
          </div>

          {displayDocuments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                {searchQuery ? "Nenhum documento encontrado" : "Nenhum documento anexado"}
              </p>
              <p className="text-sm mt-2">
                {searchQuery 
                  ? "Tente usar palavras-chave diferentes" 
                  : 'Clique em "Anexar Documento" para adicionar arquivos ao processo'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayDocuments.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex flex-col p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {getFileIcon(doc.tipo_mime)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground truncate">
                            {doc.nome_arquivo}
                          </p>
                          <Badge variant="outline" className="flex-shrink-0 text-xs">
                            {doc.tipo_documento}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                          <span>{formatFileSize(doc.tamanho_arquivo)}</span>
                          <span>•</span>
                          <span>{format(new Date(doc.criado_em), "dd/MM/yyyy HH:mm")}</span>
                          {doc.descricao && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-xs">{doc.descricao}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      {doc.ocr_processado && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Search className="h-3 w-3 mr-1" />
                          OCR
                        </Badge>
                      )}
                      <Badge className={statusColors[doc.status]}>
                        {statusLabels[doc.status]}
                      </Badge>
                      {doc.texto_extraido && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Ver texto extraído"
                          onClick={() => {
                            toast.info(
                              <div className="max-h-60 overflow-y-auto">
                                <p className="font-semibold mb-2">Texto extraído:</p>
                                <p className="text-xs whitespace-pre-wrap">{doc.texto_extraido}</p>
                              </div>
                            );
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(doc)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(doc)}
                        title="Baixar"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Eliminar"
                            className="text-destructive hover:text-destructive"
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja eliminar o documento "{doc.nome_arquivo}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(doc)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {searchQuery && doc.texto_extraido && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                      <p className="text-muted-foreground line-clamp-2">
                        {doc.texto_extraido.substring(0, 200)}...
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anexar Documento</DialogTitle>
            <DialogDescription>
              Preencha as informações sobre o documento que deseja anexar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {uploadFile && (
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                {getFileIcon(uploadFile.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{uploadFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(uploadFile.size)}
                  </p>
                  {(uploadFile.type === 'application/pdf' || uploadFile.type.startsWith('image/')) && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ OCR será processado automaticamente
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Documento *</Label>
              <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposDocumento.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Textarea
                id="descricao"
                placeholder="Adicione uma descrição breve..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!tipoDocumento || uploadMutation.isPending || isProcessingOCR}
            >
              {uploadMutation.isPending || isProcessingOCR ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isProcessingOCR ? 'Processando OCR...' : 'A anexar...'}
                </>
              ) : (
                <>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Anexar
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Visualizador de Documento</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {viewerUrl && (
              <iframe
                src={viewerUrl}
                className="w-full h-full border-0 rounded-lg"
                title="Document Viewer"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
