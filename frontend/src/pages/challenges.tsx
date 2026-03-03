import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import {
  Target,
  Search,
  Zap,
  Clock,
  Users,
  Flame,
  Star,
  Lock,
  CheckCircle,
  Play,
} from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  xpReward: number;
  timeEstimate: string;
  completions: number;
  isCompleted: boolean;
  isLocked: boolean;
  tags: string[];
}

const challenges: Challenge[] = [
  { id: 1, title: "Two Sum", category: "Arrays", difficulty: "Easy", xpReward: 50, timeEstimate: "15 min", completions: 15420, isCompleted: true, isLocked: false, tags: ["Hash Table", "Array"] },
  { id: 2, title: "Valid Parentheses", category: "Stacks", difficulty: "Easy", xpReward: 50, timeEstimate: "20 min", completions: 12380, isCompleted: true, isLocked: false, tags: ["Stack", "String"] },
  { id: 3, title: "Merge Two Sorted Lists", category: "Linked Lists", difficulty: "Easy", xpReward: 50, timeEstimate: "25 min", completions: 11200, isCompleted: false, isLocked: false, tags: ["Linked List", "Recursion"] },
  { id: 4, title: "Binary Search", category: "Searching", difficulty: "Easy", xpReward: 60, timeEstimate: "15 min", completions: 9870, isCompleted: false, isLocked: false, tags: ["Binary Search", "Array"] },
  { id: 5, title: "Maximum Subarray", category: "Dynamic Programming", difficulty: "Medium", xpReward: 100, timeEstimate: "30 min", completions: 8450, isCompleted: false, isLocked: false, tags: ["DP", "Array", "Divide & Conquer"] },
  { id: 6, title: "3Sum", category: "Arrays", difficulty: "Medium", xpReward: 120, timeEstimate: "35 min", completions: 7200, isCompleted: false, isLocked: false, tags: ["Two Pointers", "Sorting"] },
  { id: 7, title: "LRU Cache", category: "Design", difficulty: "Medium", xpReward: 150, timeEstimate: "45 min", completions: 5600, isCompleted: false, isLocked: false, tags: ["Hash Table", "Linked List", "Design"] },
  { id: 8, title: "Word Ladder", category: "Graphs", difficulty: "Hard", xpReward: 200, timeEstimate: "50 min", completions: 3200, isCompleted: false, isLocked: true, tags: ["BFS", "Hash Table"] },
  { id: 9, title: "Median of Two Sorted Arrays", category: "Arrays", difficulty: "Hard", xpReward: 250, timeEstimate: "60 min", completions: 2100, isCompleted: false, isLocked: true, tags: ["Binary Search", "Divide & Conquer"] },
  { id: 10, title: "Regular Expression Matching", category: "Dynamic Programming", difficulty: "Hard", xpReward: 300, timeEstimate: "60 min", completions: 1800, isCompleted: false, isLocked: true, tags: ["String", "DP", "Recursion"] },
];

const categories = ["All", "Arrays", "Linked Lists", "Stacks", "Trees", "Graphs", "Dynamic Programming", "Searching", "Design"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20";
    case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20";
    default: return "bg-muted text-muted-foreground";
  }
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
      <Card className={`hover-elevate transition-all ${challenge.isLocked ? "opacity-60" : ""} ${challenge.isCompleted ? "border-green-500/30 bg-green-500/5" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {challenge.isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                {challenge.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                <h3 className="font-semibold truncate">{challenge.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {challenge.category}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {challenge.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{challenge.timeEstimate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{challenge.completions.toLocaleString()} solved</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 text-primary font-semibold">
                <Zap className="h-4 w-4" />
                <span>+{challenge.xpReward} XP</span>
              </div>
              <Button
                size="sm"
                disabled={challenge.isLocked}
                variant={challenge.isCompleted ? "outline" : "default"}
              >
                {challenge.isCompleted ? "Retry" : challenge.isLocked ? "Locked" : "Solve"}
                {!challenge.isLocked && <Play className="ml-1 h-3 w-3" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Challenges() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || challenge.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || challenge.difficulty.toLowerCase() === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <DashboardLayout title="Challenges" icon={<Target className="h-5 w-5 text-primary" />}>
      <motion.div
        className="max-w-6xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-primary/10 via-card to-chart-2/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Flame className="h-6 w-6 text-orange-500" />
                    Daily Challenge Streak
                  </h2>
                  <p className="text-muted-foreground">Complete 3 challenges today to maintain your streak!</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">2/3</p>
                    <p className="text-sm text-muted-foreground">Today's Progress</p>
                  </div>
                  <Button size="lg">
                    <Star className="mr-2 h-4 w-4" />
                    Daily Bonus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search challenges or tags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="easy" className="text-green-500">Easy</TabsTrigger>
              <TabsTrigger value="medium" className="text-yellow-500">Medium</TabsTrigger>
              <TabsTrigger value="hard" className="text-red-500">Hard</TabsTrigger>
            </TabsList>
          </Tabs>
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

        <motion.div variants={containerVariants} className="space-y-3">
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))
          ) : (
            <Card className="p-8 text-center">
              <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No challenges found matching your criteria.</p>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
