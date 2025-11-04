import { StatsCards } from "./StatsCards";
import { ProcessChart } from "./ProcessChart";
import { RecentProcesses } from "./RecentProcesses";
import { ProcessByStatus } from "./ProcessByStatus";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Visão geral dos processos e expedientes</p>
      </div>

      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ProcessChart />
        <ProcessByStatus />
      </div>

      <RecentProcesses onNavigate={onNavigate} />
    </div>
  );
};
