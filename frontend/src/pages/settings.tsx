import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { AvatarDisplay } from "@/components/shared/avatar-display";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Lock,
  Trash2,
  Save,
} from "lucide-react";

const avatarColors = [
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#EF4444",
  "#6366F1",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Settings() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [selectedColor, setSelectedColor] = useState(user?.avatarColor || "#8B5CF6");
  
  const [notifications, setNotifications] = useState({
    battleInvites: true,
    achievements: true,
    streakReminders: true,
    weeklyDigest: false,
    friendActivity: true,
  });

  const [preferences, setPreferences] = useState({
    soundEffects: true,
    animations: true,
    compactMode: false,
    publicProfile: true,
    showOnLeaderboard: true,
  });

  const handleSaveProfile = () => {
    if (user) {
      setUser({
        ...user,
        username,
        email,
        avatarColor: selectedColor,
      });
    }
    toast({
      title: "Profile updated!",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <DashboardLayout title="Settings" icon={<SettingsIcon className="h-5 w-5 text-muted-foreground" />}>
      <motion.div
        className="max-w-3xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Settings
              </CardTitle>
              <CardDescription>Manage your account information and avatar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-4">
                  <AvatarDisplay
                    username={username || "Player"}
                    color={selectedColor}
                    size="xl"
                  />
                  <div className="flex gap-2 flex-wrap justify-center">
                    {avatarColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          selectedColor === color ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Battle Invites</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone challenges you</p>
                </div>
                <Switch
                  checked={notifications.battleInvites}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, battleInvites: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Achievement Unlocks</Label>
                  <p className="text-sm text-muted-foreground">Celebrate when you earn new achievements</p>
                </div>
                <Switch
                  checked={notifications.achievements}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, achievements: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Streak Reminders</Label>
                  <p className="text-sm text-muted-foreground">Remind me to maintain my daily streak</p>
                </div>
                <Switch
                  checked={notifications.streakReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, streakReminders: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">Get a weekly summary of your progress</p>
                </div>
                <Switch
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Friend Activity</Label>
                  <p className="text-sm text-muted-foreground">Know when friends complete challenges</p>
                </div>
                <Switch
                  checked={notifications.friendActivity}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, friendActivity: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">Play sounds for actions and achievements</p>
                </div>
                <Switch
                  checked={preferences.soundEffects}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, soundEffects: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable motion and transitions</p>
                </div>
                <Switch
                  checked={preferences.animations}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, animations: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Show more content with less spacing</p>
                </div>
                <Switch
                  checked={preferences.compactMode}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, compactMode: checked })}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Manage your privacy settings and account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                </div>
                <Switch
                  checked={preferences.publicProfile}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, publicProfile: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show on Leaderboard</Label>
                  <p className="text-sm text-muted-foreground">Display your rank publicly</p>
                </div>
                <Switch
                  checked={preferences.showOnLeaderboard}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, showOnLeaderboard: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Change Password</Label>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
                <Button variant="outline" size="sm">
                  <Lock className="mr-2 h-4 w-4" />
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Delete Account</Label>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
