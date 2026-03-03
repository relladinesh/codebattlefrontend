import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { AvatarDisplay } from "@/components/shared/avatar-display";
import { LevelBadge } from "@/components/shared/level-badge";
import { useAuth } from "@/lib/auth-context";
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  Target,
  Swords,
  Star,
  Zap,
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatarColor: string;
  level: number;
  xp: number;
  problemsSolved: number;
  winRate: number;
  streak: number;
  change: "up" | "down" | "same";
  changeAmount: number;
}

const globalLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "AlgoMaster", avatarColor: "#EC4899", level: 42, xp: 45200, problemsSolved: 523, winRate: 89, streak: 45, change: "same", changeAmount: 0 },
  { rank: 2, username: "ByteWarrior", avatarColor: "#06B6D4", level: 39, xp: 41800, problemsSolved: 489, winRate: 85, streak: 32, change: "up", changeAmount: 2 },
  { rank: 3, username: "DataNinja", avatarColor: "#F59E0B", level: 37, xp: 38900, problemsSolved: 456, winRate: 82, streak: 28, change: "down", changeAmount: 1 },
  { rank: 4, username: "CodePhoenix", avatarColor: "#10B981", level: 35, xp: 35600, problemsSolved: 412, winRate: 79, streak: 21, change: "up", changeAmount: 3 },
  { rank: 5, username: "BinaryBoss", avatarColor: "#3B82F6", level: 34, xp: 34100, problemsSolved: 398, winRate: 77, streak: 18, change: "same", changeAmount: 0 },
  { rank: 6, username: "RecursionKing", avatarColor: "#8B5CF6", level: 31, xp: 29800, problemsSolved: 356, winRate: 74, streak: 15, change: "up", changeAmount: 1 },
  { rank: 7, username: "StackOverflow", avatarColor: "#EF4444", level: 30, xp: 28400, problemsSolved: 342, winRate: 72, streak: 12, change: "down", changeAmount: 2 },
  { rank: 8, username: "HashQueen", avatarColor: "#6366F1", level: 29, xp: 27100, problemsSolved: 328, winRate: 71, streak: 10, change: "up", changeAmount: 4 },
  { rank: 9, username: "TreeTraverser", avatarColor: "#14B8A6", level: 28, xp: 25800, problemsSolved: 315, winRate: 69, streak: 8, change: "same", changeAmount: 0 },
  { rank: 10, username: "GraphGuru", avatarColor: "#F472B6", level: 27, xp: 24500, problemsSolved: 301, winRate: 68, streak: 6, change: "down", changeAmount: 3 },
];

const weeklyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "SpeedCoder", avatarColor: "#F59E0B", level: 28, xp: 2850, problemsSolved: 42, winRate: 95, streak: 7, change: "up", changeAmount: 5 },
  { rank: 2, username: "ByteWarrior", avatarColor: "#06B6D4", level: 39, xp: 2640, problemsSolved: 38, winRate: 88, streak: 7, change: "up", changeAmount: 3 },
  { rank: 3, username: "AlgoMaster", avatarColor: "#EC4899", level: 42, xp: 2520, problemsSolved: 35, winRate: 92, streak: 7, change: "down", changeAmount: 2 },
  { rank: 4, username: "NewChallenger", avatarColor: "#10B981", level: 22, xp: 2380, problemsSolved: 34, winRate: 86, streak: 7, change: "up", changeAmount: 12 },
  { rank: 5, username: "CodeNinja", avatarColor: "#8B5CF6", level: 25, xp: 2210, problemsSolved: 31, winRate: 82, streak: 5, change: "up", changeAmount: 8 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function getRankIcon(rank: number) {
  switch (rank) {
    case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
    case 2: return <Medal className="h-6 w-6 text-gray-400" />;
    case 3: return <Medal className="h-6 w-6 text-amber-600" />;
    default: return null;
  }
}

function getRankStyle(rank: number): string {
  switch (rank) {
    case 1: return "bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border-yellow-500/30";
    case 2: return "bg-gradient-to-r from-gray-400/20 to-gray-400/5 border-gray-400/30";
    case 3: return "bg-gradient-to-r from-amber-600/20 to-amber-600/5 border-amber-600/30";
    default: return "";
  }
}

function ChangeIndicator({ change, amount }: { change: string; amount: number }) {
  if (change === "same" || amount === 0) {
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
  if (change === "up") {
    return (
      <span className="flex items-center gap-1 text-green-500 text-sm">
        <TrendingUp className="h-4 w-4" />
        +{amount}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-red-500 text-sm">
      <TrendingDown className="h-4 w-4" />
      -{amount}
    </span>
  );
}

function LeaderboardRow({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser: boolean }) {
  return (
    <motion.div
      variants={itemVariants}
      className={`flex items-center gap-4 p-4 rounded-lg ${getRankStyle(entry.rank)} ${isCurrentUser ? "ring-2 ring-primary" : ""} hover-elevate`}
    >
      <div className="w-12 flex justify-center">
        {getRankIcon(entry.rank) || (
          <span className="text-xl font-bold text-muted-foreground">#{entry.rank}</span>
        )}
      </div>
      <div className="w-8">
        <ChangeIndicator change={entry.change} amount={entry.changeAmount} />
      </div>
      <AvatarDisplay username={entry.username} color={entry.avatarColor} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold truncate">{entry.username}</p>
          {isCurrentUser && <Badge variant="outline" className="text-xs">You</Badge>}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LevelBadge level={entry.level} size="sm" />
          <span>Level {entry.level}</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="font-semibold">{entry.problemsSolved}</p>
          <p className="text-xs text-muted-foreground">Solved</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">{entry.winRate}%</p>
          <p className="text-xs text-muted-foreground">Win Rate</p>
        </div>
        <div className="text-center flex items-center gap-1">
          <Flame className="h-4 w-4 text-orange-500" />
          <p className="font-semibold">{entry.streak}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono font-bold text-lg text-primary">{entry.xp.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">XP</p>
      </div>
    </motion.div>
  );
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("global");

  const currentUserRank = {
    rank: 1247,
    username: user?.username || "Player",
    avatarColor: user?.avatarColor || "#8B5CF6",
    level: user?.level || 1,
    xp: user?.xp || 0,
    problemsSolved: 45,
    winRate: 62,
    streak: 5,
    change: "up" as const,
    changeAmount: 15,
  };

  return (
    <DashboardLayout title="Leaderboard" icon={<Trophy className="h-5 w-5 text-yellow-500" />}>
      <motion.div
        className="max-w-5xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-yellow-500/10 via-card to-primary/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <AvatarDisplay username={currentUserRank.username} color={currentUserRank.avatarColor} size="xl" />
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                      <LevelBadge level={currentUserRank.level} size="sm" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{currentUserRank.username}</h2>
                    <p className="text-muted-foreground">Your Current Standing</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold">#{currentUserRank.rank.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Global Rank</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-green-500">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-xl font-bold">+{currentUserRank.changeAmount}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover-elevate">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">{currentUserRank.problemsSolved}</p>
                <p className="text-xs text-muted-foreground">Problems Solved</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-4 text-center">
                <Swords className="h-8 w-8 mx-auto text-destructive mb-2" />
                <p className="text-2xl font-bold">{currentUserRank.winRate}%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-4 text-center">
                <Flame className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                <p className="text-2xl font-bold">{currentUserRank.streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                <p className="text-2xl font-bold">{currentUserRank.xp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total XP</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Rankings
                </CardTitle>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="global">Global</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>
                {activeTab === "global" ? "All-time top performers" : "This week's rising stars"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                className="space-y-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {(activeTab === "global" ? globalLeaderboard : weeklyLeaderboard).map((entry) => (
                  <LeaderboardRow
                    key={entry.rank}
                    entry={entry}
                    isCurrentUser={entry.username === currentUserRank.username}
                  />
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
