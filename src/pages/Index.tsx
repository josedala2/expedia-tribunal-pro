import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ProcessList } from "@/components/processes/ProcessList";
import { ProcessDetail } from "@/components/processes/ProcessDetail";
import { PrestacaoContas } from "@/pages/PrestacaoContas";
import { ProcessosVisto } from "@/pages/ProcessosVisto";
import { Fiscalizacao } from "@/pages/Fiscalizacao";
import { ProcessosMulta } from "@/pages/ProcessosMulta";
import { Usuarios } from "@/pages/Usuarios";
import { Relatorios } from "@/pages/Relatorios";
import { Expedientes } from "@/pages/Expedientes";

type View = "dashboard" | "processes" | "process-detail" | "prestacao-contas" | "visto" | "fiscalizacao" | "multas" | "usuarios" | "relatorios" | "documentos" | "configuracoes" | "expedientes";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleViewProcess = (processId: string) => {
    setSelectedProcessId(processId);
    setCurrentView("process-detail");
  };

  const handleBackToList = () => {
    setSelectedProcessId(null);
    setCurrentView("processes");
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as View);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        currentView={currentView}
        onNavigate={handleNavigate}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen}
          currentView={currentView}
          onNavigate={handleNavigate}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="container mx-auto p-6">
            {currentView === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
            {currentView === "processes" && <ProcessList onViewProcess={handleViewProcess} />}
            {currentView === "process-detail" && selectedProcessId && (
              <ProcessDetail processId={selectedProcessId} onBack={handleBackToList} />
            )}
            {currentView === "expedientes" && <Expedientes onBack={() => handleNavigate("dashboard")} />}
            {currentView === "prestacao-contas" && <PrestacaoContas onBack={() => handleNavigate("dashboard")} />}
            {currentView === "visto" && <ProcessosVisto onBack={() => handleNavigate("dashboard")} />}
            {currentView === "fiscalizacao" && <Fiscalizacao onBack={() => handleNavigate("dashboard")} />}
            {currentView === "multas" && <ProcessosMulta onBack={() => handleNavigate("dashboard")} />}
            {currentView === "usuarios" && <Usuarios onBack={() => handleNavigate("dashboard")} />}
            {currentView === "relatorios" && <Relatorios onBack={() => handleNavigate("dashboard")} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
