import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DocumentChecklistProps {
  documents: string[];
  selectedDocuments?: string[];
  onSelectionChange?: (selected: string[]) => void;
  label?: string;
  allowFileUpload?: boolean;
}

export const DocumentChecklist = ({
  documents,
  selectedDocuments = [],
  onSelectionChange,
  label = "Documentos Anexos",
  allowFileUpload = true,
}: DocumentChecklistProps) => {
  const [selected, setSelected] = useState<string[]>(selectedDocuments);

  const handleCheckboxChange = (document: string, checked: boolean) => {
    const newSelected = checked
      ? [...selected, document]
      : selected.filter((d) => d !== document);
    
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">{label}</Label>
      
      <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Marque os documentos que estão sendo anexados:
        </p>
        {documents.map((doc) => (
          <div key={doc} className="flex items-center space-x-2">
            <Checkbox
              id={`doc-${doc}`}
              checked={selected.includes(doc)}
              onCheckedChange={(checked) => handleCheckboxChange(doc, checked as boolean)}
            />
            <Label
              htmlFor={`doc-${doc}`}
              className="text-sm font-normal cursor-pointer"
            >
              {doc}
            </Label>
          </div>
        ))}
      </div>

      {allowFileUpload && (
        <div className="space-y-2">
          <Label htmlFor="file-upload" className="text-sm">
            Upload de Arquivos
          </Label>
          <Input
            id="file-upload"
            type="file"
            multiple
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            Anexe os documentos selecionados acima (PDF, DOCX, imagens)
          </p>
        </div>
      )}
    </div>
  );
};
