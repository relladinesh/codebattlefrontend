import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import {
  MapPin,
  Lock,
  Check,
  Star,
  Gift,
  Trophy,
  Play,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// --- Types ---
type QuestStatus = "locked" | "available" | "completed";
type NodeType = "battle" | "chest" | "boss";

interface QuestNodeData {
  id: string;
  title: string;
  type: NodeType;
  status: QuestStatus;
  x: number;
  y: number;
  connections: string[];
  rewards?: string;
}

// --- Mock Data ---
const questNodes: QuestNodeData[] = [
  {
    id: "q1",
    title: "Array Basics",
    type: "battle",
    status: "completed",
    x: 10,
    y: 50,
    connections: ["q2"],
  },
  {
    id: "q2",
    title: "Two Pointers",
    type: "battle",
    status: "completed",
    x: 25,
    y: 50,
    connections: ["q3", "chest1"],
  },
  {
    id: "chest1",
    title: "Bonus Chest",
    type: "chest",
    status: "completed",
    x: 25,
    y: 25,
    connections: [],
    rewards: "50 XP",
  },
  {
    id: "q3",
    title: "Sliding Window",
    type: "battle",
    status: "available",
    x: 40,
    y: 50,
    connections: ["q4"],
  },
  {
    id: "q4",
    title: "Stack & Queue",
    type: "battle",
    status: "locked",
    x: 55,
    y: 40,
    connections: ["q5", "q6"],
  },
  {
    id: "q5",
    title: "Recursion I",
    type: "battle",
    status: "locked",
    x: 70,
    y: 25,
    connections: ["boss1"],
  },
  {
    id: "q6",
    title: "Recursion II",
    type: "battle",
    status: "locked",
    x: 70,
    y: 55,
    connections: ["boss1"],
  },
  {
    id: "boss1",
    title: "Graph Guardian",
    type: "boss",
    status: "locked",
    x: 90,
    y: 40,
    connections: [],
    rewards: "Rare Badge",
  },
];

const MapBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Animated gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />

    {/* Floating particles */}
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}

    {/* Grid overlay */}
    <div className="absolute inset-0 opacity-[0.03]">
      <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
        {Array.from({ length: 96 }).map((_, i) => (
          <div key={i} className="border border-primary" />
        ))}
      </div>
    </div>
  </div>
);

const ConnectionLines = ({ nodes }: { nodes: QuestNodeData[] }) => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {nodes.map((node) =>
        node.connections.map((targetId) => {
          const target = nodes.find((n) => n.id === targetId);
          if (!target) return null;

          const midX = (node.x + target.x) / 2;
          const isActivePath = node.status === "completed";

          return (
            <motion.path
              key={`${node.id}-${targetId}`}
              d={`M ${node.x} ${node.y} C ${midX} ${node.y}, ${midX} ${target.y}, ${target.x} ${target.y}`}
              fill="none"
              strokeWidth="0.3"
              className={isActivePath ? "stroke-primary/50" : "stroke-muted/20"}
              strokeDasharray={isActivePath ? "none" : "1,1"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          );
        })
      )}
    </svg>
  );
};

const QuestNode = ({
  node,
  onClick,
}: {
  node: QuestNodeData;
  onClick: (n: QuestNodeData) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStyles = () => {
    if (node.status === "locked")
      return "bg-card/80 backdrop-blur-sm border-muted text-muted-foreground grayscale opacity-60";
    if (node.status === "completed")
      return "bg-gradient-to-br from-primary/30 to-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(var(--primary),0.4)]";
    return "bg-gradient-to-br from-destructive/20 to-destructive/5 border-destructive text-foreground shadow-[0_0_20px_rgba(239,68,68,0.3)]";
  };

  const getIcon = () => {
    if (node.type === "chest") return <Gift className="w-5 h-5" />;
    if (node.type === "boss") return <Trophy className="w-8 h-8" />;
    if (node.status === "completed") return <Check className="w-6 h-6" />;
    if (node.status === "locked") return <Lock className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  return (
    <div
      className="absolute flex flex-col items-center gap-2 transition-all duration-300"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        whileHover={
          node.status !== "locked" ? { scale: 1.15, rotate: [0, -5, 5, 0] } : {}
        }
        whileTap={node.status !== "locked" ? { scale: 0.9 } : {}}
        onClick={() => onClick(node)}
        className={`
          relative flex items-center justify-center rounded-full border-2 transition-all duration-300 backdrop-blur-sm
          ${node.type === "boss" ? "w-16 h-16 border-4" : "w-12 h-12"}
          ${getStyles()}
          ${node.status !== "locked" ? "cursor-pointer" : "cursor-not-allowed"}
        `}
      >
        {getIcon()}

        {/* Sparkle effect for available nodes */}
        {node.status === "available" && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-destructive"
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute -inset-1 rounded-full bg-destructive/20 blur-md"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </>
        )}

        {/* Glow effect for completed nodes */}
        {node.status === "completed" && (
          <motion.div
            className="absolute -inset-2 rounded-full bg-primary/20 blur-lg"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Title Label with hover effect */}
      <motion.span
        animate={{
          scale: isHovered && node.status !== "locked" ? 1.05 : 1,
          y: isHovered && node.status !== "locked" ? -2 : 0,
        }}
        className={`
          text-xs font-medium whitespace-nowrap px-3 py-1.5 rounded-full border transition-all
          ${node.type === "boss" ? "font-bold text-sm" : ""}
          ${
            node.status === "completed"
              ? "bg-primary/10 border-primary/30 text-primary"
              : node.status === "available"
              ? "bg-destructive/10 border-destructive/30 text-foreground"
              : "bg-muted/50 border-muted text-muted-foreground"
          }
        `}
      >
        {node.title}
      </motion.span>

      {/* Hover tooltip for locked nodes */}
      {isHovered && node.status === "locked" && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-2 bg-card border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground whitespace-nowrap shadow-lg z-10"
        >
          🔒 Complete previous quests
        </motion.div>
      )}
    </div>
  );
};

export default function Quests() {
  const [selectedNode, setSelectedNode] = useState<QuestNodeData | null>(null);

  const completedCount = questNodes.filter(
    (n) => n.status === "completed"
  ).length;
  const totalCount = questNodes.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <DashboardLayout
      title="Quest Map"
      icon={<MapPin className="w-6 h-6" />}
      badge={
        <Badge variant="outline" className="ml-2">
          Season 1
        </Badge>
      }
    >
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Campaign Progress
                </span>
                <Trophy className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold mb-2">
                {completedCount}/{totalCount} Nodes
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(progress)}% Complete
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Total Rewards
                </span>
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold mb-2">1,250 XP</div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Gift className="w-3 h-3 mr-1" />3 Badges
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />2 Bonuses
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Current Challenge
                </span>
                <Sparkles className="w-4 h-4 text-destructive" />
              </div>
              <div className="text-lg font-bold mb-1">Sliding Window</div>
              <p className="text-xs text-muted-foreground mb-2">
                Master array algorithms
              </p>
              <Button size="sm" className="w-full" variant="destructive">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Map Area */}
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm">
        <div className="overflow-auto max-h-[600px]">
          <div className="relative min-w-[800px] min-h-[600px] w-full h-[600px]">
            <MapBackground />
            <ConnectionLines nodes={questNodes} />
            {questNodes.map((node) => (
              <QuestNode key={node.id} node={node} onClick={setSelectedNode} />
            ))}
          </div>
        </div>
      </Card>

      {/* Selected Node Panel */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed top-20 right-6 w-80 z-50"
        >
          <Card className="border-2 shadow-2xl bg-card/95 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        selectedNode.status === "completed"
                          ? "default"
                          : selectedNode.status === "available"
                          ? "destructive"
                          : "outline"
                      }
                      className="uppercase text-xs"
                    >
                      {selectedNode.type}
                    </Badge>
                    {selectedNode.status === "completed" && (
                      <Badge
                        variant="outline"
                        className="text-primary border-primary"
                      >
                        <Check className="w-3 h-3 mr-1" /> Completed
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">
                    {selectedNode.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {selectedNode.status === "locked"
                      ? "🔒 Complete previous nodes to unlock this challenge."
                      : selectedNode.status === "completed"
                      ? "✅ You've mastered this concept! Review anytime."
                      : "⚔️ Master this concept to advance your journey."}
                  </CardDescription>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSelectedNode(null)}
                  className="shrink-0"
                >
                  <span className="text-xl">✕</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Quest Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Reward</span>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {selectedNode.rewards || "100 XP + Knowledge"}
                  </span>
                </div>

                {selectedNode.type === "boss" && (
                  <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-destructive" />
                      <span className="text-sm font-medium">Boss Battle</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This is a challenging encounter that will test everything
                      you've learned. Prepare well!
                    </p>
                  </div>
                )}

                {selectedNode.type === "chest" && (
                  <div className="p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Bonus Chest</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Discover extra rewards and hidden knowledge!
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  variant={
                    selectedNode.status === "available" ? "default" : "outline"
                  }
                  disabled={selectedNode.status === "locked"}
                >
                  {selectedNode.status === "completed" ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Review
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Quest
                    </>
                  )}
                </Button>

                {selectedNode.status !== "locked" && (
                  <Button size="icon" variant="outline">
                    <Star className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Prerequisites */}
              {selectedNode.status === "locked" && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Prerequisites</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Complete the connected quests to unlock this challenge.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
