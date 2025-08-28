import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserMenu, KPIStrip, MainContent, RightSidebar } from "@/components/agent_dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-navy-gradient">
      {/* User Menu */}
      <UserMenu />
      
      {/* KPI Strip */}
      <KPIStrip />
      
      {/* Main Dashboard Content */}
      <div className="flex">
        {/* Left Column - Main Content (2/3 width) */}
        <MainContent />

        {/* Right Column - Tasks/Actions (1/3 width) */}
        <RightSidebar />
      </div>
      
      
    </div>
  );
}
