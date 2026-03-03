import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import Landing from "@/pages/landing";
import Signup from "@/pages/signup";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Challenges from "@/pages/challenges";
import Arena from "@/pages/arena";
import Leaderboard from "@/pages/leaderboard";
import Achievements from "@/pages/achievements";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import ListQuests from "./pages/listQuests";
import Quests from "./pages/quests";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/challenges" component={Challenges} />
      <Route path="/dashboard/arena" component={Arena} />
      <Route path="/dashboard/listQuests" component={ListQuests} />
      <Route path="/dashboard/quests" component={Quests} />
      <Route path="/dashboard/leaderboard" component={Leaderboard} />
      <Route path="/dashboard/achievements" component={Achievements} />
      <Route path="/dashboard/settings" component={Settings} />
      <Route path="/dashboard/:section" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
