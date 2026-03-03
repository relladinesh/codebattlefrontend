import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { XPBar } from "@/components/shared/xp-bar";
import { AvatarDisplay } from "@/components/shared/avatar-display";
import { StreakCounter } from "@/components/shared/streak-counter";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard } from "lucide-react";
import {
  Target,
  Swords,
  Trophy,
  Medal,
  TrendingUp,
  Users,
  Clock,
  ChevronRight,
  Zap,
  Star,
} from "lucide-react";

interface LeaderboardPlayer {
  id: number;
  username: string;
  level: number;
  xp: number;
  avatarColor: string;
  rank: number;
}

interface Competition {
  id: number;
  title: string;
  startTime: Date;
  participants: number;
  difficulty: string;
}

const defaultUserStats = {
  xp: 0,
  maxXp: 1000,
  problemsSolved: 0,
  winRate: 0,
  rank: 0,
  badges: 0,
};

const leaderboardPlayers: LeaderboardPlayer[] = [
  { id: 1, username: "AlgoMaster", level: 42, xp: 45200, avatarColor: "#EC4899", rank: 1 },
  { id: 2, username: "ByteWarrior", level: 39, xp: 41800, avatarColor: "#06B6D4", rank: 2 },
  { id: 3, username: "DataNinja", level: 37, xp: 38900, avatarColor: "#F59E0B", rank: 3 },
  { id: 4, username: "CodePhoenix", level: 35, xp: 35600, avatarColor: "#10B981", rank: 4 },
  { id: 5, username: "BinaryBoss", level: 34, xp: 34100, avatarColor: "#3B82F6", rank: 5 },
];

const upcomingCompetitions: Competition[] = [
  { id: 1, title: "Weekly Algorithm Challenge", startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), participants: 342, difficulty: "Medium" },
  { id: 2, title: "Binary Tree Masters", startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), participants: 189, difficulty: "Hard" },
  { id: 3, title: "Array Sprint", startTime: new Date(Date.now() + 48 * 60 * 60 * 1000), participants: 521, difficulty: "Easy" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function formatTimeRemaining(date: Date): string {
  const diff = date.getTime() - Date.now();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${minutes}m`;
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20";
    case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20";
    default: return "bg-muted text-muted-foreground";
  }
}

function XPHeaderCard({ user }: { user: any }) {
  const userStats = {
    username: user?.username || "Player",
    level: user?.level || 1,
    xp: user?.xp || 0,
    maxXp: 1000 * (user?.level || 1),
    streak: user?.streak || 0,
    avatarColor: user?.avatarColor || "#8B5CF6",
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-card to-chart-2/10 border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <AvatarDisplay
              username={userStats.username}
              color={userStats.avatarColor}
              size="xl"
            />
            <div>
              <h2 className="text-2xl font-bold" data-testid="text-dashboard-username">{userStats.username}</h2>
              <StreakCounter streak={userStats.streak} size="md" />
            </div>
          </div>
          <div className="flex-1 max-w-md">
            <XPBar
              currentXP={userStats.xp}
              maxXP={userStats.maxXp}
              level={userStats.level}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button className="w-full justify-between" size="lg" data-testid="button-start-challenge">
            <span className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Start Challenge
            </span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            variant="destructive"
            className="w-full justify-between animate-pulse-glow"
            size="lg"
            data-testid="button-battle-mode"
          >
            <span className="flex items-center gap-2">
              <Swords className="h-5 w-5" />
              Enter Battle Mode
            </span>
            <Badge variant="outline" className="bg-destructive-foreground/10 border-destructive-foreground/20 text-destructive-foreground">
              LIVE
            </Badge>
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

function StatsGrid({ user }: { user: any }) {
  const userStats = {
    problemsSolved: user?.problemsSolved || 0,
    winRate: user?.winRate || 0,
    rank: user?.rank || 0,
    badges: user?.badges || 0,
  };

  const stats = [
    { title: "Problems Solved", value: userStats.problemsSolved, icon: Target, color: "text-primary", testId: "stat-problems-solved" },
    { title: "Win Rate", value: `${userStats.winRate}%`, icon: TrendingUp, color: "text-green-500", testId: "stat-win-rate" },
    { title: "Global Rank", value: userStats.rank > 0 ? `#${userStats.rank.toLocaleString()}` : "Unranked", icon: Trophy, color: "text-yellow-500", testId: "stat-global-rank" },
    { title: "Badges Earned", value: userStats.badges, icon: Medal, color: "text-chart-2", testId: "stat-badges" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover-elevate">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid={stat.testId}>{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function LeaderboardCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Players
          </CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-view-leaderboard">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Global leaderboard rankings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboardPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              className="flex items-center gap-3 p-2 rounded-lg hover-elevate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              data-testid={`leaderboard-player-${player.id}`}
            >
              <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                index === 0 ? "bg-yellow-500 text-yellow-950" :
                index === 1 ? "bg-gray-400 text-gray-900" :
                index === 2 ? "bg-amber-600 text-amber-50" :
                "bg-muted text-muted-foreground"
              }`}>
                {player.rank}
              </div>
              <AvatarDisplay
                username={player.username}
                color={player.avatarColor}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{player.username}</p>
                <p className="text-xs text-muted-foreground">Level {player.level}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-medium">{player.xp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CompetitionsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-chart-2" />
            Upcoming Competitions
          </CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-view-competitions">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Join live tournaments and compete</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingCompetitions.map((competition, index) => (
            <motion.div
              key={competition.id}
              className="p-3 rounded-lg bg-muted/50 hover-elevate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              data-testid={`competition-${competition.id}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-sm">{competition.title}</h4>
                <Badge variant="outline" className={`text-xs ${getDifficultyColor(competition.difficulty)}`}>
                  {competition.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Starts in {formatTimeRemaining(competition.startTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{competition.participants} joined</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivityCard() {
  const activities = [
    { icon: Target, text: "Solved 'Two Sum' problem", time: "2h ago", color: "text-green-500" },
    { icon: Swords, text: "Won battle against ByteKnight", time: "5h ago", color: "text-primary" },
    { icon: Medal, text: "Earned 'Speed Demon' badge", time: "1d ago", color: "text-yellow-500" },
    { icon: TrendingUp, text: "Reached new level", time: "2d ago", color: "text-chart-2" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              data-testid={`activity-${index}`}
            >
              <div className={`p-1.5 rounded-lg bg-muted ${activity.color}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{activity.text}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DailyProgressCard() {
  const dailyGoal = 5;
  const completed = 3;
  const percentage = (completed / dailyGoal) * 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Daily Goal
        </CardTitle>
        <CardDescription>Complete {dailyGoal} problems today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span data-testid="text-daily-progress">{completed} of {dailyGoal} completed</span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Complete your daily goal to maintain your streak
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Dashboard" icon={<LayoutDashboard className="h-5 w-5 text-primary" />}>
      <motion.div
        className="max-w-7xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <XPHeaderCard user={user} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsGrid user={user} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <QuickActionsCard />
          </motion.div>
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <DailyProgressCard />
              <RecentActivityCard />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <LeaderboardCard />
          </motion.div>
          <motion.div variants={itemVariants}>
            <CompetitionsCard />
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
