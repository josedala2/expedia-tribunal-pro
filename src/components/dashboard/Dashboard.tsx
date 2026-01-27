import { StatsCards } from "./StatsCards";
import { ProcessChart } from "./ProcessChart";
import { RecentProcesses } from "./RecentProcesses";
import { ProcessByStatus } from "./ProcessByStatus";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  return (
    <div className="dashboard-section space-y-4 sm:space-y-5 md:space-y-6">
      <div>
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-xs xs:text-sm text-muted-foreground mt-0.5 sm:mt-1">Visão geral dos processos e expedientes</p>
      </div>

      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <ProcessChart />
        <ProcessByStatus />
      </div>

      <RecentProcesses onNavigate={onNavigate} />
    </div>
  );
};
