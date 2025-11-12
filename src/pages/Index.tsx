import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { TourGuide } from "@/components/layout/TourGuide";
import PortalIntranet from "./portal/PortalIntranet";
import MeuPerfil from "./portal/MeuPerfil";
import Assiduidade from "./portal/Assiduidade";
import Ferias from "./portal/Ferias";
import AprovacaoFeriasChefia from "./portal/AprovacaoFeriasChefia";
import Remuneracoes from "./portal/Remuneracoes";
import DocumentosOficiais from "./portal/DocumentosOficiais";
import GestaoNoticias from "./portal/GestaoNoticias";
import GestaoRH from "./portal/GestaoRH";
import CadastroFuncionarios from "./portal/rh/CadastroFuncionarios";
import GestaoContratos from "./portal/rh/GestaoContratos";
import AssiduidadePontualidade from "./portal/rh/AssiduidadePontualidade";
import GestaoFeriasLicencas from "./portal/rh/GestaoFeriasLicencas";

import FormacaoDesenvolvimento from "./portal/rh/FormacaoDesenvolvimento";
import GestaoRemuneracoesBeneficios from "./portal/rh/GestaoRemuneracoesBeneficios";
import GestaoDocumentalRH from "./portal/rh/GestaoDocumentalRH";
import GestaoPensionistas from "./portal/rh/GestaoPensionistas";
import RelatoriosEstatisticasRH from "./portal/rh/RelatoriosEstatisticasRH";
import SolicitacoesDeclaracoes from "./portal/rh/SolicitacoesDeclaracoes";
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
import { NovoProcessoMulta } from "@/pages/NovoProcessoMulta";
import { ExpedienteProcessual } from "@/pages/visto/ExpedienteProcessual";
import { TramitacaoProcessoVisto } from "@/pages/visto/TramitacaoProcessoVisto";
import { CumprimentoDespachos } from "@/pages/visto/CumprimentoDespachos";
import { SaidaExpedienteProcessoVisto } from "@/pages/visto/SaidaExpedienteProcessoVisto";
import { ExpedientePrestacaoContas } from "@/pages/prestacao/ExpedientePrestacaoContas";
import { TramitacaoPrestacaoContas } from "@/pages/prestacao/TramitacaoPrestacaoContas";
import { CumprimentoDespachosPrestacao } from "@/pages/prestacao/CumprimentoDespachosPrestacao";
import { SaidaExpedientePrestacao } from "@/pages/prestacao/SaidaExpedientePrestacao";
import { PrestacaoOrgaosSoberania } from "@/pages/prestacao/PrestacaoOrgaosSoberania";
import { CobrancaEmolumentosPrestacao } from "@/pages/prestacao/CobrancaEmolumentosPrestacao";
import { DespachoPromocaoPrestacao } from "@/pages/prestacao/DespachoPromocaoPrestacao";
import { OficiosRemessaPrestacao } from "@/pages/prestacao/OficiosRemessaPrestacao";
import { NovoOficioRemessaPrestacao } from "@/pages/prestacao/NovoOficioRemessaPrestacao";
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
import { AnaliseDecisaoJuizRelator } from "@/pages/visto/AnaliseDecisaoJuizRelator";
import { PromocaoMinisterioPublico } from "@/pages/visto/PromocaoMinisterioPublico";
import AnaliseDecisaoFinalJuizRelator from "@/pages/visto/AnaliseDecisaoFinalJuizRelator";
import CumprimentoDespachoADFJR from "@/pages/visto/CumprimentoDespachoADFJR";
import RecursoOrdinario from "@/pages/visto/RecursoOrdinario";
import RecursoInconstitucionalidade from "@/pages/visto/RecursoInconstitucionalidade";
import RecursosAtivos from "@/pages/visto/RecursosAtivos";
import { DesencadearMulta } from "@/pages/multa/DesencadearMulta";
import { RequerimentoInicialMulta } from "@/pages/multa/RequerimentoInicialMulta";
import { NotificacaoDemandado } from "@/pages/multa/NotificacaoDemandado";
import { PagamentoVoluntarioMulta } from "@/pages/multa/PagamentoVoluntarioMulta";
import { PagamentoPrestacoes } from "@/pages/multa/PagamentoPrestacoes";
import { ContestacaoMulta } from "@/pages/multa/ContestacaoMulta";
import { ConstituicaoAdvogado } from "@/pages/multa/ConstituicaoAdvogado";
import { ConfiancaProcesso } from "@/pages/multa/ConfiancaProcesso";
import { AudienciaJulgamentoMulta } from "@/pages/multa/AudienciaJulgamentoMulta";
import { AcordaoMulta } from "@/pages/multa/AcordaoMulta";
import { NotificacaoAcordao } from "@/pages/multa/NotificacaoAcordao";
import { PedidoAclaracao } from "@/pages/multa/PedidoAclaracao";
import { CobrancaCoerciva } from "@/pages/multa/CobrancaCoerciva";
import AdminConfigMenu from "@/pages/admin/AdminConfigMenu";
import AdminSettings from "@/pages/admin/AdminSettings";
import CalendarioJudicial from "@/pages/admin/CalendarioJudicial";
import RegrasDistribuicao from "@/pages/admin/RegrasDistribuicao";
import MapaLetraJuiz from "@/pages/admin/MapaLetraJuiz";
import EmolumentosTabela from "@/pages/admin/EmolumentosTabela";

type View = "dashboard" | "portal-intranet" | "meu-perfil" | "assiduidade" | "ferias" | "aprovacao-ferias-chefia" | "remuneracoes" | "documentos-oficiais" | "gestao-noticias" | "gestao-rh" | "rh-cadastro-funcionarios" | "rh-gestao-contratos" | "rh-assiduidade-pontualidade" | "rh-gestao-ferias-licencas" | "rh-formacao-desenvolvimento" | "rh-gestao-remuneracoes" | "rh-gestao-documental-rh" | "rh-gestao-pensionistas" | "rh-relatorios-estatisticas-rh" | "rh-solicitacoes-declaracoes" | "processes" | "process-detail" | "prestacao-contas" | "visto" | "fiscalizacao" | "multas" | "novo-processo-multa" | "usuarios" | "relatorios" | "documentos" | "configuracoes" | "comunicacoes-internas" | "expedientes" | "novo-expediente" | "detalhe-expediente" | "novo-prestacao" | "detalhe-prestacao" | "novo-visto" | "detalhe-visto" | "novo-fiscalizacao" | "detalhe-fiscalizacao" | "detalhe-multa" | "expediente-processual" | "tramitacao-visto" | "cumprimento-despachos" | "saida-expediente-visto" | "interposicao-recurso" | "pedido-reducao-emolumentos" | "conclusao-autos-cgsfp" | "analise-decisao-juiz" | "promocao-mp" | "analise-decisao-final-juiz" | "cumprimento-despacho-adfjr" | "expediente-prestacao" | "tramitacao-prestacao" | "cumprimento-despachos-prestacao" | "cobranca-emolumentos-prestacao" | "despacho-promocao-prestacao" | "oficios-remessa-prestacao" | "novo-oficio-remessa-prestacao" | "saida-expediente-prestacao" | "prestacao-soberania" | "expediente-fiscalizacao" | "tramitacao-fiscalizacao" | "parecer-trimestral" | "saida-expediente-fiscalizacao" | "cobranca-emolumentos" | "nova-guia-cobranca" | "despacho-promocao" | "novo-despacho-promocao" | "cumprimento-despachos-geral" | "cumprimento-despacho-detail" | "oficios-remessa" | "novo-oficio-remessa" | "expedientes-saida" | "novo-expediente-saida" | "recurso-ordinario" | "recurso-ordinario-registo" | "recurso-ordinario-plenario" | "recurso-ordinario-projeto" | "recurso-ordinario-vista" | "recurso-ordinario-resolucao" | "recurso-ordinario-notificacao" | "recurso-inconstitucionalidade" | "recurso-inconstitucionalidade-apresentacao" | "recurso-inconstitucionalidade-analise" | "recursos-ativos" | "desencadear-multa" | "requerimento-inicial-multa" | "notificacao-demandado" | "pagamento-voluntario-multa" | "pagamento-prestacoes" | "contestacao-multa" | "constituicao-advogado" | "confianca-processo" | "audiencia-julgamento-multa" | "acordao-multa" | "notificacao-acordao" | "pedido-aclaracao" | "cobranca-coerciva" | "admin-config" | "admin-settings" | "calendario-judicial" | "regras-distribuicao" | "mapa-letra-juiz" | "sla-regras" | "emolumentos-tabela" | "doc-templates" | "notificacao-templates" | "retencao-regras" | "integration-config" | "feature-flags";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      setTimeout(() => setRunTour(true), 1000);
    }
  }, []);

  const handleTourComplete = () => {
    localStorage.setItem("hasSeenTour", "true");
    setRunTour(false);
  };

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
      <TourGuide run={runTour} onComplete={handleTourComplete} />
      
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
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-80' : 'ml-0'}`}>
          <div className="container mx-auto p-3 md:p-6">
            {currentView === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
        {currentView === "portal-intranet" && <PortalIntranet onNavigate={handleNavigate} />}
        {currentView === "meu-perfil" && <MeuPerfil onBack={() => handleNavigate("portal-intranet")} />}
        {currentView === "assiduidade" && <Assiduidade onBack={() => handleNavigate("portal-intranet")} />}
            {currentView === "ferias" && <Ferias onBack={() => handleNavigate("portal-intranet")} />}
            {currentView === "aprovacao-ferias-chefia" && <AprovacaoFeriasChefia onBack={() => handleNavigate("portal-intranet")} />}
            {currentView === "remuneracoes" && <Remuneracoes onBack={() => handleNavigate("portal-intranet")} />}
            {currentView === "documentos-oficiais" && <DocumentosOficiais onBack={() => handleNavigate("portal-intranet")} />}
            {currentView === "gestao-noticias" && <GestaoNoticias onBack={() => handleNavigate("portal-intranet")} />}
            {currentView === "gestao-rh" && <GestaoRH onBack={() => handleNavigate("portal-intranet")} onNavigate={handleNavigate} />}
            {currentView === "rh-cadastro-funcionarios" && <CadastroFuncionarios onBack={() => handleNavigate("gestao-rh")} />}
            {currentView === "rh-gestao-contratos" && <GestaoContratos onBack={() => handleNavigate("gestao-rh")} />}
            {currentView === "rh-assiduidade-pontualidade" && <AssiduidadePontualidade onBack={() => handleNavigate("gestao-rh")} />}
            {currentView === "rh-gestao-ferias-licencas" && <GestaoFeriasLicencas onBack={() => handleNavigate("gestao-rh")} />}
            
            {currentView === "rh-formacao-desenvolvimento" && <FormacaoDesenvolvimento onBack={() => handleNavigate("gestao-rh")} />}
            {currentView === "rh-gestao-remuneracoes" && <GestaoRemuneracoesBeneficios onBack={() => handleNavigate("gestao-rh")} />}
            {currentView === "rh-gestao-documental-rh" && <GestaoDocumentalRH onBack={() => handleNavigate("gestao-rh")} />}
            {currentView === "rh-gestao-pensionistas" && <GestaoPensionistas onBack={() => handleNavigate("gestao-rh")} />}
            {currentView === "rh-relatorios-estatisticas-rh" && <RelatoriosEstatisticasRH onBack={() => handleNavigate("gestao-rh")} />}
            {currentView === "rh-solicitacoes-declaracoes" && <SolicitacoesDeclaracoes onBack={() => handleNavigate("gestao-rh")} />}
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
            {currentView === "novo-processo-multa" && <NovoProcessoMulta onBack={() => handleNavigate("multas")} />}
            {currentView === "detalhe-multa" && <DetalheProcessoMulta onBack={() => handleNavigate("multas")} />}
            {currentView === "expediente-processual" && <ExpedienteProcessual onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "tramitacao-visto" && <TramitacaoProcessoVisto onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "cumprimento-despachos" && <CumprimentoDespachos onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "saida-expediente-visto" && <SaidaExpedienteProcessoVisto onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "interposicao-recurso" && <InterposicaoRecurso onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "pedido-reducao-emolumentos" && <PedidoReducaoEmolumentos onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "conclusao-autos-cgsfp" && <ConclusaoAutosCGSFP onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "analise-decisao-juiz" && <AnaliseDecisaoJuizRelator onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "promocao-mp" && <PromocaoMinisterioPublico onBack={() => handleNavigate("visto")} onNavigate={handleNavigate} />}
            {currentView === "analise-decisao-final-juiz" && <AnaliseDecisaoFinalJuizRelator />}
            {currentView === "cumprimento-despacho-adfjr" && <CumprimentoDespachoADFJR />}
            {currentView === "expediente-prestacao" && <ExpedientePrestacaoContas onBack={() => handleNavigate("prestacao-contas")} onNavigate={handleNavigate} />}
            {currentView === "tramitacao-prestacao" && <TramitacaoPrestacaoContas onBack={() => handleNavigate("prestacao-contas")} onNavigate={handleNavigate} />}
            {currentView === "cumprimento-despachos-prestacao" && <CumprimentoDespachosPrestacao onBack={() => handleNavigate("prestacao-contas")} onNavigate={handleNavigate} />}
            {currentView === "cobranca-emolumentos-prestacao" && <CobrancaEmolumentosPrestacao onBack={() => handleNavigate("prestacao-contas")} onNavigate={handleNavigate} />}
            {currentView === "despacho-promocao-prestacao" && <DespachoPromocaoPrestacao onBack={() => handleNavigate("prestacao-contas")} onNavigate={handleNavigate} />}
            {currentView === "oficios-remessa-prestacao" && <OficiosRemessaPrestacao onBack={() => handleNavigate("prestacao-contas")} onNavigate={handleNavigate} />}
            {currentView === "novo-oficio-remessa-prestacao" && <NovoOficioRemessaPrestacao onBack={() => handleNavigate("oficios-remessa-prestacao")} onNavigate={handleNavigate} />}
            {currentView === "saida-expediente-prestacao" && <SaidaExpedientePrestacao onBack={() => handleNavigate("prestacao-contas")} onNavigate={handleNavigate} />}
            {currentView === "prestacao-soberania" && <PrestacaoOrgaosSoberania onBack={() => handleNavigate("prestacao-contas")} onNavigate={handleNavigate} />}
            {currentView === "expediente-fiscalizacao" && <ExpedienteFiscalizacaoOGE onBack={() => handleNavigate("fiscalizacao")} onNavigate={handleNavigate} />}
            {currentView === "tramitacao-fiscalizacao" && <TramitacaoFiscalizacaoOGE onBack={() => handleNavigate("fiscalizacao")} onNavigate={handleNavigate} />}
            {currentView === "parecer-trimestral" && <ParecerTrimestral onBack={() => handleNavigate("fiscalizacao")} onNavigate={handleNavigate} />}
            {currentView === "saida-expediente-fiscalizacao" && <SaidaExpedienteFiscalizacao onBack={() => handleNavigate("fiscalizacao")} onNavigate={handleNavigate} />}
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
            {currentView === "recurso-ordinario" && <RecursoOrdinario />}
            {currentView === "recurso-ordinario-registo" && <RecursoOrdinario />}
            {currentView === "recurso-ordinario-plenario" && <RecursoOrdinario />}
            {currentView === "recurso-ordinario-projeto" && <RecursoOrdinario />}
            {currentView === "recurso-ordinario-vista" && <RecursoOrdinario />}
            {currentView === "recurso-ordinario-resolucao" && <RecursoOrdinario />}
            {currentView === "recurso-ordinario-notificacao" && <RecursoOrdinario />}
            {currentView === "recurso-inconstitucionalidade" && <RecursoInconstitucionalidade />}
            {currentView === "recurso-inconstitucionalidade-apresentacao" && <RecursoInconstitucionalidade />}
            {currentView === "recurso-inconstitucionalidade-analise" && <RecursoInconstitucionalidade />}
            {currentView === "recursos-ativos" && <RecursosAtivos />}
            {currentView === "desencadear-multa" && <DesencadearMulta onBack={() => handleNavigate("multas")} onNavigate={handleNavigate} />}
            {currentView === "requerimento-inicial-multa" && <RequerimentoInicialMulta onBack={() => handleNavigate("multas")} onNavigate={handleNavigate} />}
            {currentView === "notificacao-demandado" && <NotificacaoDemandado onBack={() => handleNavigate("multas")} onNavigate={handleNavigate} />}
            {currentView === "pagamento-voluntario-multa" && <PagamentoVoluntarioMulta onBack={() => handleNavigate("multas")} onNavigate={handleNavigate} />}
            {currentView === "pagamento-prestacoes" && <PagamentoPrestacoes onBack={() => handleNavigate("multas")} onNavigate={handleNavigate} />}
            {currentView === "contestacao-multa" && <ContestacaoMulta onBack={() => handleNavigate("multas")} onNavigate={handleNavigate} />}
            {currentView === "constituicao-advogado" && <ConstituicaoAdvogado onBack={() => handleNavigate("multas")} onNavigate={handleNavigate} />}
            {currentView === "confianca-processo" && <ConfiancaProcesso onBack={() => handleNavigate("multas")} onNavigate={handleNavigate} />}
            {currentView === "audiencia-julgamento-multa" && <AudienciaJulgamentoMulta onBack={() => handleNavigate("multas")} onNavigate={handleNavigate} />}
            {currentView === "acordao-multa" && <AcordaoMulta onBack={() => handleNavigate("multas")} onNavigate={handleNavigate} />}
            {currentView === "notificacao-acordao" && <NotificacaoAcordao onBack={() => handleNavigate("multas")} onNavigate={handleNavigate} />}
            {currentView === "pedido-aclaracao" && <PedidoAclaracao onBack={() => handleNavigate("multas")} onNavigate={handleNavigate} />}
            {currentView === "cobranca-coerciva" && <CobrancaCoerciva onBack={() => handleNavigate("multas")} onNavigate={handleNavigate} />}
            {currentView === "admin-config" && <AdminConfigMenu onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />}
            {currentView === "admin-settings" && <AdminSettings onBack={() => handleNavigate("admin-config")} />}
            {currentView === "calendario-judicial" && <CalendarioJudicial onBack={() => handleNavigate("admin-config")} />}
            {currentView === "regras-distribuicao" && <RegrasDistribuicao onBack={() => handleNavigate("admin-config")} />}
            {currentView === "mapa-letra-juiz" && <MapaLetraJuiz onBack={() => handleNavigate("admin-config")} />}
            {currentView === "emolumentos-tabela" && <EmolumentosTabela onBack={() => handleNavigate("admin-config")} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
