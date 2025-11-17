import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Admin Dashboard Components
import { 
  UserMenu as AdminUserMenu, 
  MainContent as AdminMainContent, 
  RightSidebar as AdminRightSidebar 
} from "@/components/admin_dashboard";

// Real Estate Admin Dashboard Components
import { 
  UserMenu as REAdminUserMenu, 
  MainContent as REAdminMainContent, 
  RightSidebar as REAdminRightSidebar 
} from "@/components/real_estate_admin_dashboard";

// Agent Dashboard Components
import { 
  UserMenu as AgentUserMenu, 
  MainContent as AgentMainContent, 
  RightSidebar as AgentRightSidebar 
} from "@/components/agent_dashboard";

// Layout Components
import DashboardFooter from "@/components/layout/DashboardFooter";
import MobileRestriction from "@/components/layout/MobileRestriction";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Render appropriate dashboard components based on user role
  const renderDashboard = () => {
    switch (session.user.role) {
      case 'admin':
        return (
          <>
            <AdminUserMenu />
            <div className="flex">
              <AdminMainContent />
              <AdminRightSidebar />
            </div>
          </>
        );
      
      case 'real_estate_admin':
        return (
          <>
            <REAdminUserMenu />
            <div className="flex">
              <REAdminMainContent />
              <REAdminRightSidebar />
            </div>
          </>
        );
      
      case 'agent':
      default:
        return (
          <>
            <AgentUserMenu />
            <div className="flex">
              <AgentMainContent />
              <AgentRightSidebar />
            </div>
          </>
        );
    }
  };

  return (
    <MobileRestriction showHomeButton={false}>
      <div className="min-h-screen bg-navy-gradient pb-16">
        {renderDashboard()}
        <DashboardFooter />
      </div>
    </MobileRestriction>
  );
}
