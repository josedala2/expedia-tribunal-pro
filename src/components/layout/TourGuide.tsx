import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";

interface TourGuideProps {
  run: boolean;
  onComplete: () => void;
}

export const TourGuide = ({ run, onComplete }: TourGuideProps) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps: Step[] = [
    {
      target: "body",
      content: "Bem-vindo ao Sistema de Gestão Processual do Tribunal de Contas! Vamos fazer um tour rápido para conhecer as principais funcionalidades.",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: ".header-section",
      content: "Este é o cabeçalho da aplicação. Aqui você pode acessar seu perfil, notificações e configurações.",
      placement: "bottom",
    },
    {
      target: ".sidebar-section",
      content: "Esta é a barra lateral de navegação. Aqui você encontra todas as áreas do sistema organizadas por categorias.",
      placement: "right",
    },
    {
      target: ".dashboard-section",
      content: "Esta é a área principal do dashboard. Aqui você visualiza estatísticas e processos recentes.",
      placement: "bottom",
    },
    {
      target: ".stats-cards",
      content: "Estes cartões mostram estatísticas importantes sobre processos, expedientes e prazos.",
      placement: "bottom",
    },
    {
      target: ".quick-actions",
      content: "Use estes botões para acessar rapidamente as ações mais comuns do sistema.",
      placement: "top",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      onComplete();
    }
    
    if (data.action === "next" || data.action === "prev") {
      setStepIndex(index + (data.action === "next" ? 1 : -1));
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "hsl(var(--primary))",
          textColor: "hsl(var(--foreground))",
          backgroundColor: "hsl(var(--background))",
          arrowColor: "hsl(var(--background))",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        },
        buttonNext: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
          borderRadius: "0.375rem",
          padding: "0.5rem 1rem",
        },
        buttonBack: {
          color: "hsl(var(--muted-foreground))",
          marginRight: "0.5rem",
        },
        buttonSkip: {
          color: "hsl(var(--muted-foreground))",
        },
      }}
      locale={{
        back: "Voltar",
        close: "Fechar",
        last: "Finalizar",
        next: "Próximo",
        skip: "Pular tour",
      }}
    />
  );
};
