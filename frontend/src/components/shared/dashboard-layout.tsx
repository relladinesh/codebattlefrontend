import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { ThemeToggle } from "./theme-toggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

const sidebarStyle = {
  "--sidebar-width": "16rem",
  "--sidebar-width-icon": "3rem",
};

export function DashboardLayout({ children, title, icon, badge }: DashboardLayoutProps) {
  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="flex items-center justify-between gap-4 p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              {icon}
              <h1 className="text-lg font-semibold">{title}</h1>
              {badge}
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
