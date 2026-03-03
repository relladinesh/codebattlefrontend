import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { AvatarDisplay } from "@/components/shared/avatar-display";
import {
  Swords,
  Zap,
  Clock,
  Users,
  Trophy,
  Target,
  Flame,
  Crown,
  Play,
  Search,
  Gamepad2,
  Sparkles,
} from "lucide-react";

interface ActiveBattle {
  id: number;
  player1: { username: string; avatarColor: string; level: number };
  player2: { username: string; avatarColor: string; level: number };
  problem: string;
  timeRemaining: string;
  viewers: number;
}

interface BattleMode {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  players: string;
  duration: string;
  xpMultiplier: number;
}

const activeBattles: ActiveBattle[] = [
  { id: 1, player1: { username: "AlgoMaster", avatarColor: "#EC4899", level: 42 }, player2: { username: "ByteWarrior", avatarColor: "#06B6D4", level: 39 }, problem: "Longest Palindrome", timeRemaining: "2:34", viewers: 156 },
  { id: 2, player1: { username: "DataNinja", avatarColor: "#F59E0B", level: 37 }, player2: { username: "CodePhoenix", avatarColor: "#10B981", level: 35 }, problem: "Binary Tree Paths", timeRemaining: "5:12", viewers: 89 },
  { id: 3, player1: { username: "BinaryBoss", avatarColor: "#3B82F6", level: 34 }, player2: { username: "RecursionKing", avatarColor: "#8B5CF6", level: 31 }, problem: "Valid Sudoku", timeRemaining: "1:45", viewers: 234 },
];

const battleModes: BattleMode[] = [
  { id: "quick", title: "Quick Match", description: "Fast 5-minute battles for quick XP", icon: <Zap className="h-6 w-6" />, color: "from-yellow-500 to-orange-500", players: "1v1", duration: "5 min", xpMultiplier: 1 },
  { id: "ranked", title: "Ranked Battle", description: "Competitive matches that affect your rank", icon: <Trophy className="h-6 w-6" />, color: "from-primary to-chart-2", players: "1v1", duration: "10 min", xpMultiplier: 2 },
  { id: "team", title: "Team Battle", description: "Team up with friends for glory", icon: <Users className="h-6 w-6" />, color: "from-green-500 to-emerald-500", players: "2v2", duration: "15 min", xpMultiplier: 1.5 },
  { id: "tournament", title: "Tournament", description: "Bracket-style elimination rounds", icon: <Crown className="h-6 w-6" />, color: "from-purple-500 to-pink-500", players: "8+", duration: "30 min", xpMultiplier: 3 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function BattleModeCard({ mode }: { mode: BattleMode }) {
  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card className="hover-elevate cursor-pointer overflow-hidden group">
        <div className={`h-2 bg-gradient-to-r ${mode.color}`} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${mode.color} text-white`}>
              {mode.icon}
            </div>
            <Badge variant="secondary" className="text-xs">
              {mode.xpMultiplier}x XP
            </Badge>
          </div>
          <h3 className="text-lg font-bold mb-2">{mode.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{mode.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {mode.players}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {mode.duration}
              </span>
            </div>
            <Button size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
              <Play className="mr-1 h-3 w-3" />
              Play
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LiveBattleCard({ battle }: { battle: ActiveBattle }) {
  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }}>
      <Card className="hover-elevate">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="destructive" className="animate-pulse">
              LIVE
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-3 w-3" />
              {battle.viewers} watching
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AvatarDisplay username={battle.player1.username} color={battle.player1.avatarColor} size="sm" />
              <div>
                <p className="font-medium text-sm">{battle.player1.username}</p>
                <p className="text-xs text-muted-foreground">Lvl {battle.player1.level}</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Swords className="h-5 w-5 text-destructive" />
              <span className="text-xs font-mono text-destructive">{battle.timeRemaining}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-medium text-sm">{battle.player2.username}</p>
                <p className="text-xs text-muted-foreground">Lvl {battle.player2.level}</p>
              </div>
              <AvatarDisplay username={battle.player2.username} color={battle.player2.avatarColor} size="sm" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{battle.problem}</span>
            <Button variant="outline" size="sm">
              Watch
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Arena() {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <DashboardLayout
      title="Battle Arena"
      icon={<Swords className="h-5 w-5 text-destructive" />}
      badge={<Badge variant="destructive" className="animate-pulse ml-2">LIVE</Badge>}
    >
      <motion.div
        className="max-w-6xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-destructive/10 via-card to-orange-500/10 border-destructive/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(239,68,68,0.15),transparent)]" />
            <CardContent className="p-6 relative">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Gamepad2 className="h-8 w-8 text-destructive" />
                    Ready for Battle?
                  </h2>
                  <p className="text-muted-foreground mb-4">Challenge other coders in real-time algorithm battles. The fastest correct solution wins!</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-green-500">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span>1,247 players online</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Swords className="h-4 w-4" />
                      <span>89 active battles</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    variant="destructive"
                    className="animate-pulse-glow text-lg px-8"
                    onClick={() => setIsSearching(!isSearching)}
                  >
                    {isSearching ? (
                      <>
                        <Search className="mr-2 h-5 w-5 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Swords className="mr-2 h-5 w-5" />
                        Find Opponent
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">Average wait: ~15 seconds</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Battle Modes
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {battleModes.map((mode) => (
              <BattleModeCard key={mode.id} mode={mode} />
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Live Battles
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              <CardDescription>Watch ongoing battles and learn from the best</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeBattles.map((battle) => (
                  <LiveBattleCard key={battle.id} battle={battle} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover-elevate">
              <CardContent className="p-6 text-center">
                <Trophy className="h-10 w-10 mx-auto text-yellow-500 mb-3" />
                <p className="text-3xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Battles Won</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6 text-center">
                <Target className="h-10 w-10 mx-auto text-primary mb-3" />
                <p className="text-3xl font-bold">68%</p>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6 text-center">
                <Flame className="h-10 w-10 mx-auto text-orange-500 mb-3" />
                <p className="text-3xl font-bold">7</p>
                <p className="text-sm text-muted-foreground">Win Streak</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
