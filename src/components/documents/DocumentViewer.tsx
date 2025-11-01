import { Button } from "@/components/ui/button";
import { Download, Printer, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const DocumentViewer = ({ isOpen, onClose, title, children }: DocumentViewerProps) => {
  const handlePrint = () => {
    const printContent = document.getElementById("document-content");
    if (!printContent) {
      toast.error("Erro ao preparar documento para impressão");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Erro ao abrir janela de impressão");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              padding: 20mm;
              font-size: 12pt;
              line-height: 1.6;
            }
            @media print {
              body { margin: 0; padding: 20mm; }
            }
            h1, h2, h3 { color: #000; }
            .border-b-2 { border-bottom: 2px solid #000; }
            .border-t { border-top: 1px solid #666; }
            .border-t-2 { border-top: 2px solid #666; }
            .border-l-4 { border-left: 4px solid #0066cc; }
            .border-2 { border: 2px solid #666; }
            .bg-gray-50 { background-color: #f9fafb; }
            .bg-gray-100 { background-color: #f3f4f6; }
            .bg-yellow-50 { background-color: #fefce8; }
            .border-yellow-300 { border-color: #fde047; }
            .border-yellow-400 { border-color: #facc15; }
            .rounded { border-radius: 4px; }
            .p-4 { padding: 16px; }
            .p-6 { padding: 24px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-4 { margin-bottom: 16px; }
            .mb-6 { margin-bottom: 24px; }
            .mb-8 { margin-bottom: 32px; }
            .mt-2 { margin-top: 8px; }
            .mt-4 { margin-top: 16px; }
            .mt-8 { margin-top: 32px; }
            .mt-12 { margin-top: 48px; }
            .space-y-1 > * + * { margin-top: 4px; }
            .space-y-2 > * + * { margin-top: 8px; }
            .space-y-4 > * + * { margin-top: 16px; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-justify { text-align: justify; }
            .font-bold { font-weight: bold; }
            .font-semibold { font-weight: 600; }
            .text-sm { font-size: 0.875rem; }
            .text-xs { font-size: 0.75rem; }
            .text-lg { font-size: 1.125rem; }
            .text-xl { font-size: 1.25rem; }
            .leading-relaxed { line-height: 1.625; }
            .whitespace-pre-line { white-space: pre-line; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #666; padding: 8px; }
            thead { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);

    toast.success("Documento enviado para impressão");
  };

  const handleDownload = () => {
    // Implementar download como PDF usando html2pdf ou similar
    toast.info("Funcionalidade de download será implementada em breve");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
              <Button onClick={onClose} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
