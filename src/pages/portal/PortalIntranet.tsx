import DashboardFuncionario from "./DashboardFuncionario";

interface PortalIntranetProps {
  onNavigate?: (view: string) => void;
}

export default function PortalIntranet({ onNavigate }: PortalIntranetProps) {
  const handleNavigate = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  return <DashboardFuncionario onNavigate={handleNavigate} />;
}