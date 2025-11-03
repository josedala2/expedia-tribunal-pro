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
import { NovoExpediente } from "@/pages/NovoExpediente";
import { DetalheExpediente } from "@/pages/DetalheExpediente";
import { NovoProcessoPrestacao } from "@/pages/NovoProcessoPrestacao";
import { DetalheProcessoPrestacao } from "@/pages/DetalheProcessoPrestacao";
import { NovoProcessoVisto } from "@/pages/NovoProcessoVisto";
import { Documentos } from "@/pages/Documentos";
import { Configuracoes } from "@/pages/Configuracoes";
import { ComunicacoesInternas } from "@/pages/ComunicacoesInternas";
import { DetalheProcessoVisto } from "@/pages/DetalheProcessoVisto";
import { DetalheFiscalizacao } from "@/pages/DetalheFiscalizacao";
import { NovoProcessoFiscalizacao } from "@/pages/NovoProcessoFiscalizacao";
import { DetalheProcessoMulta } from "@/pages/DetalheProcessoMulta";
import { ExpedienteProcessual } from "@/pages/visto/ExpedienteProcessual";
import { TramitacaoProcessoVisto } from "@/pages/visto/TramitacaoProcessoVisto";
import { CumprimentoDespachos } from "@/pages/visto/CumprimentoDespachos";
import { SaidaExpedienteProcessoVisto } from "@/pages/visto/SaidaExpedienteProcessoVisto";
import { ExpedientePrestacaoContas } from "@/pages/prestacao/ExpedientePrestacaoContas";
import { TramitacaoPrestacaoContas } from "@/pages/prestacao/TramitacaoPrestacaoContas";
import { CumprimentoDespachosPrestacao } from "@/pages/prestacao/CumprimentoDespachosPrestacao";
import { SaidaExpedientePrestacao } from "@/pages/prestacao/SaidaExpedientePrestacao";
import { PrestacaoOrgaosSoberania } from "@/pages/prestacao/PrestacaoOrgaosSoberania";
import { ExpedienteFiscalizacaoOGE } from "@/pages/fiscalizacao/ExpedienteFiscalizacaoOGE";
import { TramitacaoFiscalizacaoOGE } from "@/pages/fiscalizacao/TramitacaoFiscalizacaoOGE";
import { ParecerTrimestral } from "@/pages/fiscalizacao/ParecerTrimestral";
import { SaidaExpedienteFiscalizacao } from "@/pages/fiscalizacao/SaidaExpedienteFiscalizacao";
import CobrancaEmolumentos from "@/pages/CobrancaEmolumentos";
import NovaGuiaCobranca from "@/pages/NovaGuiaCobranca";
import DespachoPromocao from "@/pages/DespachoPromocao";
import NovoDespachoPromocao from "@/pages/NovoDespachoPromocao";
import CumprimentoDespachosGeral from "@/pages/CumprimentoDespachos";
import CumprimentoDespachoDetail from "@/pages/CumprimentoDespachoDetail";
import OficiosRemessa from "@/pages/OficiosRemessa";
import NovoOficioRemessa from "@/pages/NovoOficioRemessa";
import ExpedientesSaida from "@/pages/ExpedientesSaida";
import NovoExpedienteSaida from "@/pages/NovoExpedienteSaida";
import { InterposicaoRecurso } from "@/pages/visto/InterposicaoRecurso";
import { PedidoReducaoEmolumentos } from "@/pages/visto/PedidoReducaoEmolumentos";
import { ConclusaoAutosCGSFP } from "@/pages/visto/ConclusaoAutosCGSFP";

type View = "dashboard" | "processes" | "process-detail" | "prestacao-contas" | "visto" | "fiscalizacao" | "multas" | "usuarios" | "relatorios" | "documentos" | "configuracoes" | "comunicacoes-internas" | "expedientes" | "novo-expediente" | "detalhe-expediente" | "novo-prestacao" | "detalhe-prestacao" | "novo-visto" | "detalhe-visto" | "novo-fiscalizacao" | "detalhe-fiscalizacao" | "detalhe-multa" | "expediente-processual" | "tramitacao-visto" | "cumprimento-despachos" | "saida-expediente-visto" | "interposicao-recurso" | "pedido-reducao-emolumentos" | "conclusao-autos-cgsfp" | "expediente-prestacao" | "tramitacao-prestacao" | "cumprimento-despachos-prestacao" | "saida-expediente-prestacao" | "prestacao-soberania" | "expediente-fiscalizacao" | "tramitacao-fiscalizacao" | "parecer-trimestral" | "saida-expediente-fiscalizacao" | "cobranca-emolumentos" | "nova-guia-cobranca" | "despacho-promocao" | "novo-despacho-promocao" | "cumprimento-despachos-geral" | "cumprimento-despacho-detail" | "oficios-remessa" | "novo-oficio-remessa" | "expedientes-saida" | "novo-expediente-saida";

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
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>
          <div className="container mx-auto p-6">
            {currentView === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
            {currentView === "processes" && <ProcessList onViewProcess={handleViewProcess} />}
            {currentView === "process-detail" && selectedProcessId && (
              <ProcessDetail processId={selectedProcessId} onBack={handleBackToList} />
            )}
            {currentView === "expedientes" && <Expedientes onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />}
            {currentView === "novo-expediente" && <NovoExpediente onBack={() => handleNavigate("expedientes")} />}
            {currentView === "detalhe-expediente" && <DetalheExpediente onBack={() => handleNavigate("expedientes")} />}
            {currentView === "prestacao-contas" && <PrestacaoContas onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />}
            {currentView === "novo-prestacao" && <NovoProcessoPrestacao onBack={() => handleNavigate("prestacao-contas")} />}
            {currentView === "detalhe-prestacao" && <DetalheProcessoPrestacao onBack={() => handleNavigate("prestacao-contas")} />}
            {currentView === "visto" && <ProcessosVisto onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />}
            {currentView === "novo-visto" && <NovoProcessoVisto onBack={() => handleNavigate("visto")} />}
            {currentView === "detalhe-visto" && <DetalheProcessoVisto onBack={() => handleNavigate("visto")} />}
            {currentView === "fiscalizacao" && <Fiscalizacao onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />}
            {currentView === "novo-fiscalizacao" && <NovoProcessoFiscalizacao onBack={() => handleNavigate("fiscalizacao")} />}
            {currentView === "detalhe-fiscalizacao" && <DetalheFiscalizacao onBack={() => handleNavigate("fiscalizacao")} />}
            {currentView === "multas" && <ProcessosMulta onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />}
            {currentView === "detalhe-multa" && <DetalheProcessoMulta onBack={() => handleNavigate("multas")} />}
            {currentView === "expediente-processual" && <ExpedienteProcessual onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "tramitacao-visto" && <TramitacaoProcessoVisto onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "cumprimento-despachos" && <CumprimentoDespachos onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "saida-expediente-visto" && <SaidaExpedienteProcessoVisto onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "interposicao-recurso" && <InterposicaoRecurso onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "pedido-reducao-emolumentos" && <PedidoReducaoEmolumentos onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "conclusao-autos-cgsfp" && <ConclusaoAutosCGSFP onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "expediente-prestacao" && <ExpedientePrestacaoContas onBack={() => handleNavigate("prestacao-contas")} onNavigate={handleNavigate} />}
            {currentView === "tramitacao-prestacao" && <TramitacaoPrestacaoContas onBack={() => handleNavigate("prestacao-contas")} onNavigate={handleNavigate} />}
            {currentView === "cumprimento-despachos-prestacao" && <CumprimentoDespachosPrestacao onBack={() => handleNavigate("prestacao-contas")} onNavigate={handleNavigate} />}
            {currentView === "saida-expediente-prestacao" && <SaidaExpedientePrestacao onBack={() => handleNavigate("prestacao-contas")} onNavigate={handleNavigate} />}
            {currentView === "prestacao-soberania" && <PrestacaoOrgaosSoberania onBack={() => handleNavigate("prestacao-contas")} onNavigate={handleNavigate} />}
            {currentView === "fiscalizacao" && <Fiscalizacao onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />}
            {currentView === "expediente-fiscalizacao" && <ExpedienteFiscalizacaoOGE onBack={() => handleNavigate("fiscalizacao")} onNavigate={handleNavigate} />}
            {currentView === "tramitacao-fiscalizacao" && <TramitacaoFiscalizacaoOGE onBack={() => handleNavigate("fiscalizacao")} onNavigate={handleNavigate} />}
            {currentView === "parecer-trimestral" && <ParecerTrimestral onBack={() => handleNavigate("fiscalizacao")} onNavigate={handleNavigate} />}
            {currentView === "saida-expediente-fiscalizacao" && <SaidaExpedienteFiscalizacao onBack={() => handleNavigate("fiscalizacao")} onNavigate={handleNavigate} />}
            {currentView === "novo-fiscalizacao" && <NovoProcessoFiscalizacao onBack={() => handleNavigate("fiscalizacao")} />}
            {currentView === "detalhe-fiscalizacao" && <DetalheFiscalizacao onBack={() => handleNavigate("fiscalizacao")} />}
            {currentView === "multas" && <ProcessosMulta onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />}
            {currentView === "detalhe-multa" && <DetalheProcessoMulta onBack={() => handleNavigate("multas")} />}
            {currentView === "usuarios" && <Usuarios onBack={() => handleNavigate("dashboard")} />}
            {currentView === "relatorios" && <Relatorios onBack={() => handleNavigate("dashboard")} />}
            {currentView === "documentos" && <Documentos onBack={() => handleNavigate("dashboard")} />}
            {currentView === "configuracoes" && <Configuracoes onBack={() => handleNavigate("dashboard")} />}
            {currentView === "comunicacoes-internas" && <ComunicacoesInternas onBack={() => handleNavigate("dashboard")} />}
            {currentView === "cobranca-emolumentos" && <CobrancaEmolumentos onNavigate={handleNavigate} />}
            {currentView === "nova-guia-cobranca" && <NovaGuiaCobranca onBack={() => handleNavigate("cobranca-emolumentos")} />}
            {currentView === "despacho-promocao" && <DespachoPromocao onNavigate={handleNavigate} />}
            {currentView === "novo-despacho-promocao" && <NovoDespachoPromocao onBack={() => handleNavigate("despacho-promocao")} />}
            {currentView === "cumprimento-despachos-geral" && <CumprimentoDespachosGeral onNavigate={handleNavigate} />}
            {currentView === "cumprimento-despacho-detail" && <CumprimentoDespachoDetail onBack={() => handleNavigate("cumprimento-despachos-geral")} />}
            {currentView === "oficios-remessa" && <OficiosRemessa onNavigate={handleNavigate} />}
            {currentView === "novo-oficio-remessa" && <NovoOficioRemessa onNavigate={handleNavigate} />}
            {currentView === "expedientes-saida" && <ExpedientesSaida onNavigate={handleNavigate} />}
            {currentView === "novo-expediente-saida" && <NovoExpedienteSaida onNavigate={handleNavigate} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
