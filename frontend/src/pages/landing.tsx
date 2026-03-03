import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/shared/navbar";
import { 
  Swords, 
  Target, 
  Flame, 
  TrendingUp, 
  Trophy, 
  Medal, 
  Zap,
  ChevronRight,
  Users,
  Timer,
  Shield,
  Star
} from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { AvatarDisplay } from "@/components/shared/avatar-display";

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatarColor: string;
}

const features: Feature[] = [
  { id: 1, title: "Gamified Challenges", description: "Turn boring problems into exciting quests with XP rewards and achievements", icon: "target" },
  { id: 2, title: "Live Duels", description: "Battle other coders in real-time 1v1 DSA showdowns", icon: "swords" },
  { id: 3, title: "Daily Streak XP", description: "Maintain your streak to earn bonus XP and exclusive rewards", icon: "flame" },
  { id: 4, title: "Level Progression", description: "Watch your skills grow as you level up through challenges", icon: "trending" },
  { id: 5, title: "Ranked Ladders", description: "Climb the global leaderboard and prove your skills", icon: "trophy" },
  { id: 6, title: "Rewards & Badges", description: "Collect achievements and show off your accomplishments", icon: "medal" },
];

const testimonials: Testimonial[] = [
  { id: 1, name: "Alex Chen", role: "Software Engineer at Google", quote: "BRAWL made DSA practice actually fun. I went from dreading LeetCode to looking forward to my daily challenges.", avatarColor: "#8B5CF6" },
  { id: 2, name: "Sarah Kim", role: "CS Student at MIT", quote: "The battle mode is addictive! I've improved more in 2 weeks than months of traditional practice.", avatarColor: "#06B6D4" },
  { id: 3, name: "Mike Johnson", role: "Full Stack Developer", quote: "Finally, a platform that makes learning algorithms feel like playing a game. Absolutely genius.", avatarColor: "#EC4899" },
  { id: 4, name: "Emily Zhang", role: "Product Manager", quote: "The gamification elements kept me motivated. I actually finished my interview prep this time!", avatarColor: "#F59E0B" },
];

const iconMap: Record<string, React.ElementType> = {
  target: Target,
  swords: Swords,
  flame: Flame,
  trending: TrendingUp,
  trophy: Trophy,
  medal: Medal,
};

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

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-hero-gradient dark:bg-hero-gradient bg-hero-gradient-light" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIG9wYWNpdHk9Ii4wMiIgZmlsbD0iI2ZmZiIvPjwvZz48L3N2Zz4=')] opacity-20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Now in Open Beta</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              DSA Training
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
              Reinvented
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            A fun, gamified challenge-based way to master Data Structures & Algorithms. 
            Level up your coding skills through battles, streaks, and achievements.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="text-lg px-8 animate-float" data-testid="button-start-training">
                  Start Your Training
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <a href="#features">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="outline" className="text-lg px-8" data-testid="button-view-challenges">
                  View Challenges
                </Button>
              </motion.div>
            </a>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 flex items-center justify-center gap-8 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="text-sm">10K+ Active Players</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <span className="text-sm">500+ Challenges</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            <span className="text-sm">Weekly Tournaments</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent"> Level Up</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make your DSA journey engaging and effective
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div key={feature.id} variants={itemVariants}>
                <Card className="group relative overflow-visible h-full hover-elevate active-elevate-2 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function DifferentiatorsSection() {
  const points = [
    { icon: Zap, title: "Not Boring Like LeetCode", description: "Transform dry algorithm practice into an engaging game experience" },
    { icon: Shield, title: "Competitive Learning", description: "Race against friends and rivals to stay motivated and accountable" },
    { icon: Timer, title: "Battle DSA Players", description: "Challenge others in timed duels to test your skills under pressure" },
  ];

  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why We're
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent"> Different</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((point, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <point.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{point.title}</h3>
              <p className="text-muted-foreground">{point.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-20 relative rounded-xl overflow-hidden border border-border bg-background/50 backdrop-blur"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-chart-2/5" />
          <div className="relative p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to See the Dashboard?</h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Experience the full power of gamified learning with our feature-rich dashboard
            </p>
            <Link href="/dashboard">
              <Button size="lg" data-testid="button-preview-dashboard">
                Preview Dashboard
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Loved by
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent"> Coders</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who've transformed their DSA practice
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={itemVariants}>
              <Card className="h-full" data-testid={`card-testimonial-${testimonial.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <AvatarDisplay
                      username={testimonial.name}
                      color={testimonial.avatarColor}
                      size="lg"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Your
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent"> Training?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are leveling up their DSA skills the fun way
          </p>
          <Link href="/signup">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Button size="lg" className="text-lg px-10" data-testid="button-join-now">
                Join BRAWL Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Swords className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">BRAWL</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              The gamified platform that makes mastering Data Structures & Algorithms actually fun.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="transition-colors hover:text-foreground" data-testid="link-about">About</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground" data-testid="link-careers">Careers</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground" data-testid="link-blog">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="transition-colors hover:text-foreground" data-testid="link-terms">Terms of Service</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground" data-testid="link-privacy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2024 BRAWL. All rights reserved.
          </p>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            data-testid="link-discord"
          >
            <SiDiscord className="h-5 w-5" />
            <span>Join our Discord</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DifferentiatorsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
