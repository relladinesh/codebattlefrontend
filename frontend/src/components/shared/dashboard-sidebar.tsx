import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AvatarDisplay } from "./avatar-display";
import { LevelBadge } from "./level-badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Swords,
  Target,
  Trophy,
  Medal,
  Settings,
  LogOut,
  Flame,
  Map,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Challenges", url: "/dashboard/challenges", icon: Target },
  { title: "Battle Arena", url: "/dashboard/arena", icon: Swords },
  { title: "Quests", url: "/dashboard/quests", icon: Map },
  { title: "Leaderboard", url: "/dashboard/leaderboard", icon: Trophy },
  { title: "Achievements", url: "/dashboard/achievements", icon: Medal },
];

const defaultUser = {
  username: "Player",
  level: 1,
  streak: 0,
  avatarColor: "#8B5CF6",
};

export function DashboardSidebar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const displayUser = user
    ? {
        username: user.username,
        level: user.level || 1,
        streak: user.streak || 0,
        avatarColor: user.avatarColor || "#8B5CF6",
      }
    : defaultUser;

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" data-testid="link-sidebar-home">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <Swords className="h-7 w-7 text-primary" />
              <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              BRAWL
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-4 mb-2">
            <div className="flex items-center gap-3 mb-3">
              <AvatarDisplay
                username={displayUser.username}
                color={displayUser.avatarColor}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold truncate"
                  data-testid="text-sidebar-username"
                >
                  {displayUser.username}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LevelBadge level={displayUser.level} size="sm" />
                  <span data-testid="text-sidebar-level">
                    Level {displayUser.level}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-medium" data-testid="text-sidebar-streak">
                {displayUser.streak} day streak
              </span>
            </div>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`sidebar-${item.title
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location === "/dashboard/settings"}
                  data-testid="sidebar-settings"
                >
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
