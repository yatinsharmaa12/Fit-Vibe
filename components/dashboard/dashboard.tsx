import { Leaderboard } from "./leaderboard";
import LiveTracking from "./live-tracking";
import { DailyProgressChart } from "./daily-progress-chart";
import { DashboardNavbar } from "./dashboard-navbar";
import { UserOverview } from "./user-overview";

const MainDashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar />

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Welcome back, track your progress and stay fit.</p>
          </div>

          <UserOverview />

          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <DailyProgressChart />
              <LiveTracking />
            </div>
            <div className="lg:col-span-1">
              <Leaderboard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;
