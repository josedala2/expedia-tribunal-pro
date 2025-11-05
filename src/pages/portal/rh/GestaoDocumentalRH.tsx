import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderOpen, Upload } from "lucide-react";

interface GestaoDocumentalRHProps {
  onBack: () => void;
}

export default function GestaoDocumentalRH({ onBack }: GestaoDocumentalRHProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <FolderOpen className="h-6 w-6" />
                  Gestão Documental de RH
                </h1>
                <p className="text-sm text-muted-foreground">Centralizar ficheiros e documentos dos funcionários</p>
              </div>
            </div>
            <Button size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Carregar Documento
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Arquivo Documental</CardTitle>
            <CardDescription>Documentos e ficheiros de RH</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
