import { useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { validatePDFFile } from "@/lib/validations";
import { toast } from "sonner";

interface DocumentItem {
  name: string;
  required?: boolean;
  file?: File;
}

interface DocumentChecklistProps {
  documents: string[];
  requiredDocuments?: string[];
  selectedDocuments?: string[];
  onSelectionChange?: (selected: string[]) => void;
  onFilesChange?: (files: Map<string, File>) => void;
  label?: string;
  allowFileUpload?: boolean;
}

export const DocumentChecklist = ({
  documents,
  requiredDocuments = [],
  selectedDocuments = [],
  onSelectionChange,
  onFilesChange,
  label = "Documentação Anexa",
  allowFileUpload = true,
}: DocumentChecklistProps) => {
  const [selected, setSelected] = useState<string[]>(selectedDocuments);
  const [files, setFiles] = useState<Map<string, File>>(new Map());
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCheckboxChange = (document: string, checked: boolean) => {
    const newSelected = checked
      ? [...selected, document]
      : selected.filter((d) => d !== document);
    
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleFileChange = (document: string, file: File | null) => {
    const newFiles = new Map(files);
    const newErrors = new Map(errors);

    if (file) {
      const validation = validatePDFFile(file);
      if (!validation.valid) {
        newErrors.set(document, validation.message || "Ficheiro inválido");
        toast.error(validation.message || "Ficheiro inválido");
      } else {
        newFiles.set(document, file);
        newErrors.delete(document);
        
        // Auto-selecciona o documento quando um ficheiro é adicionado
        if (!selected.includes(document)) {
          const newSelected = [...selected, document];
          setSelected(newSelected);
          onSelectionChange?.(newSelected);
        }
        
        toast.success(`Ficheiro "${file.name}" anexado com sucesso`);
      }
    } else {
      newFiles.delete(document);
    }

    setFiles(newFiles);
    setErrors(newErrors);
    onFilesChange?.(newFiles);
  };

  const isRequired = (doc: string) => requiredDocuments.includes(doc);

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">{label}</Label>
      
      <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Marque os documentos a anexar. Documentos obrigatórios estão assinalados (*):
        </p>
        
        {documents.map((doc) => (
          <div key={doc} className="space-y-2 pb-3 border-b border-border/50 last:border-0 last:pb-0">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`doc-${doc}`}
                checked={selected.includes(doc)}
                onCheckedChange={(checked) => handleCheckboxChange(doc, checked as boolean)}
              />
              <Label
                htmlFor={`doc-${doc}`}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {doc} {isRequired(doc) && <span className="text-destructive">*</span>}
                {isRequired(doc) && (
                  <span className="text-xs text-muted-foreground ml-1">(obrigatório)</span>
                )}
                {!isRequired(doc) && (
                  <span className="text-xs text-muted-foreground ml-1">(opcional)</span>
                )}
              </Label>
            </div>

            {allowFileUpload && selected.includes(doc) && (
              <div className="ml-6 flex items-center gap-2">
                {files.get(doc) ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background rounded-md px-3 py-2 border">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="truncate max-w-[200px]">{files.get(doc)?.name}</span>
                    <button
                      type="button"
                      onClick={() => handleFileChange(doc, null)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      title="Remover ficheiro"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf"
                      className="max-w-[250px] text-sm"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileChange(doc, file);
                      }}
                    />
                  </div>
                )}
                
                {errors.get(doc) && (
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.get(doc)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Apenas ficheiros PDF são permitidos. Tamanho máximo: 10 MB por ficheiro.
      </p>
    </div>
  );
};
