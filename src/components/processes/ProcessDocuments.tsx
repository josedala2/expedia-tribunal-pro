import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Upload } from "lucide-react";

const documents = [
  {
    id: 1,
    name: "Relatório de Prestação de Contas 2024.pdf",
    type: "Relatório Principal",
    size: "2.4 MB",
    uploadedBy: "Ministério da Educação",
    uploadDate: "2025-03-15 09:00",
    status: "Validado",
  },
  {
    id: 2,
    name: "Demonstrações Financeiras.xlsx",
    type: "Anexo Financeiro",
    size: "856 KB",
    uploadedBy: "Ministério da Educação",
    uploadDate: "2025-03-15 09:05",
    status: "Validado",
  },
  {
    id: 3,
    name: "Parecer Técnico Preliminar.docx",
    type: "Parecer Técnico",
    size: "124 KB",
    uploadedBy: "Ana Costa",
    uploadDate: "2025-03-16 15:30",
    status: "Em Análise",
  },
  {
    id: 4,
    name: "Ofício de Notificação.pdf",
    type: "Documento Oficial",
    size: "98 KB",
    uploadedBy: "Secretaria Geral",
    uploadDate: "2025-03-15 11:30",
    status: "Validado",
  },
];

const statusColors: Record<string, string> = {
  "Validado": "bg-success/10 text-success border-success/20",
  "Em Análise": "bg-primary/10 text-primary border-primary/20",
  "Pendente": "bg-warning/10 text-warning border-warning/20",
};

export const ProcessDocuments = () => {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documentos do Processo</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Todos os documentos anexados</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Anexar Documento
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground truncate">{doc.name}</p>
                    <Badge variant="outline" className="flex-shrink-0 text-xs">
                      {doc.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.uploadedBy}</span>
                    <span>•</span>
                    <span>{doc.uploadDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <Badge className={statusColors[doc.status]}>
                  {doc.status}
                </Badge>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
