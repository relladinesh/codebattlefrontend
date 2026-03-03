import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import {
  Medal,
  Trophy,
  Target,
  Flame,
  Zap,
  Swords,
  Star,
  Clock,
  Users,
  Crown,
  Shield,
  Sparkles,
  Lock,
  CheckCircle,
  Brain,
  Code,
  Timer,
} from "lucide-react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  xpReward: number;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: string;
}

const achievements: Achievement[] = [
  { id: 1, title: "First Blood", description: "Complete your first challenge", icon: <Target className="h-6 w-6" />, category: "Challenges", rarity: "Common", xpReward: 50, isUnlocked: true, unlockedAt: "2 days ago" },
  { id: 2, title: "Speed Demon", description: "Solve a challenge in under 2 minutes", icon: <Timer className="h-6 w-6" />, category: "Speed", rarity: "Rare", xpReward: 150, isUnlocked: true, unlockedAt: "1 day ago" },
  { id: 3, title: "On Fire", description: "Maintain a 7-day streak", icon: <Flame className="h-6 w-6" />, category: "Streaks", rarity: "Common", xpReward: 100, isUnlocked: true, unlockedAt: "5 hours ago" },
  { id: 4, title: "Battle Victor", description: "Win your first battle", icon: <Swords className="h-6 w-6" />, category: "Battles", rarity: "Common", xpReward: 75, isUnlocked: true, unlockedAt: "3 days ago" },
  { id: 5, title: "Problem Solver", description: "Solve 50 challenges", icon: <Code className="h-6 w-6" />, category: "Challenges", rarity: "Rare", xpReward: 200, isUnlocked: false, progress: 45, maxProgress: 50 },
  { id: 6, title: "Undefeated", description: "Win 10 battles in a row", icon: <Shield className="h-6 w-6" />, category: "Battles", rarity: "Epic", xpReward: 500, isUnlocked: false, progress: 7, maxProgress: 10 },
  { id: 7, title: "Early Bird", description: "Complete a challenge before 6 AM", icon: <Clock className="h-6 w-6" />, category: "Special", rarity: "Rare", xpReward: 100, isUnlocked: false },
  { id: 8, title: "Social Butterfly", description: "Add 10 friends", icon: <Users className="h-6 w-6" />, category: "Social", rarity: "Common", xpReward: 75, isUnlocked: false, progress: 3, maxProgress: 10 },
  { id: 9, title: "Algorithm Master", description: "Complete all Easy challenges", icon: <Brain className="h-6 w-6" />, category: "Challenges", rarity: "Epic", xpReward: 750, isUnlocked: false, progress: 18, maxProgress: 25 },
  { id: 10, title: "Legendary Warrior", description: "Reach Level 50", icon: <Crown className="h-6 w-6" />, category: "Progression", rarity: "Legendary", xpReward: 2000, isUnlocked: false, progress: 24, maxProgress: 50 },
  { id: 11, title: "Streak Lord", description: "Maintain a 30-day streak", icon: <Flame className="h-6 w-6" />, category: "Streaks", rarity: "Epic", xpReward: 500, isUnlocked: false, progress: 7, maxProgress: 30 },
  { id: 12, title: "Champion", description: "Win a tournament", icon: <Trophy className="h-6 w-6" />, category: "Battles", rarity: "Legendary", xpReward: 1500, isUnlocked: false },
];

const categories = ["All", "Challenges", "Battles", "Streaks", "Progression", "Social", "Special", "Speed"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

function getRarityColor(rarity: string): string {
  switch (rarity) {
    case "Common": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    case "Rare": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "Epic": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "Legendary": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    default: return "bg-muted text-muted-foreground";
  }
}

function getRarityGlow(rarity: string): string {
  switch (rarity) {
    case "Legendary": return "ring-2 ring-yellow-500/50 shadow-lg shadow-yellow-500/20";
    case "Epic": return "ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20";
    case "Rare": return "ring-1 ring-blue-500/30";
    default: return "";
  }
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card className={`hover-elevate transition-all ${!achievement.isUnlocked ? "opacity-60" : ""} ${achievement.isUnlocked ? getRarityGlow(achievement.rarity) : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${achievement.isUnlocked ? `bg-gradient-to-br ${
              achievement.rarity === "Legendary" ? "from-yellow-500 to-orange-500" :
              achievement.rarity === "Epic" ? "from-purple-500 to-pink-500" :
              achievement.rarity === "Rare" ? "from-blue-500 to-cyan-500" :
              "from-gray-400 to-gray-500"
            } text-white` : "bg-muted text-muted-foreground"}`}>
              {achievement.isUnlocked ? achievement.icon : <Lock className="h-6 w-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{achievement.title}</h3>
                {achievement.isUnlocked && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                  {achievement.rarity}
                </Badge>
                <span className="text-sm text-primary font-medium flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  +{achievement.xpReward} XP
                </span>
              </div>
              {achievement.progress !== undefined && achievement.maxProgress !== undefined && !achievement.isUnlocked && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                </div>
              )}
              {achievement.isUnlocked && achievement.unlockedAt && (
                <p className="text-xs text-muted-foreground mt-2">Unlocked {achievement.unlockedAt}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalXpEarned = achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.xpReward, 0);

  const filteredAchievements = achievements.filter(
    a => selectedCategory === "All" || a.category === selectedCategory
  );

  return (
    <DashboardLayout title="Achievements" icon={<Medal className="h-5 w-5 text-chart-2" />}>
      <motion.div
        className="max-w-5xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-chart-2/10 via-card to-primary/10 border-chart-2/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-chart-2" />
                    Your Trophy Case
                  </h2>
                  <p className="text-muted-foreground">Keep completing challenges to unlock more achievements!</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{unlockedCount}/{achievements.length}</p>
                    <p className="text-sm text-muted-foreground">Unlocked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-chart-2">{totalXpEarned.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">XP Earned</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Collection Progress</span>
                  <span>{Math.round((unlockedCount / achievements.length) * 100)}%</span>
                </div>
                <Progress value={(unlockedCount / achievements.length) * 100} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover-elevate">
              <CardContent className="p-4 text-center">
                <div className="h-10 w-10 mx-auto rounded-full bg-gray-500/20 flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-xl font-bold">{achievements.filter(a => a.rarity === "Common" && a.isUnlocked).length}</p>
                <p className="text-xs text-muted-foreground">Common</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-4 text-center">
                <div className="h-10 w-10 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-xl font-bold">{achievements.filter(a => a.rarity === "Rare" && a.isUnlocked).length}</p>
                <p className="text-xs text-muted-foreground">Rare</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-4 text-center">
                <div className="h-10 w-10 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-xl font-bold">{achievements.filter(a => a.rarity === "Epic" && a.isUnlocked).length}</p>
                <p className="text-xs text-muted-foreground">Epic</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-4 text-center">
                <div className="h-10 w-10 mx-auto rounded-full bg-yellow-500/20 flex items-center justify-center mb-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-xl font-bold">{achievements.filter(a => a.rarity === "Legendary" && a.isUnlocked).length}</p>
                <p className="text-xs text-muted-foreground">Legendary</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
        >
          {filteredAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
