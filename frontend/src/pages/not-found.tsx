import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/shared/navbar";
import { Home, Swords } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="max-w-md text-center">
            <CardContent className="pt-12 pb-8 px-8">
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
                <div className="relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20 border border-primary/30">
                  <Swords className="h-12 w-12 text-primary" />
                </div>
              </div>
              
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent mb-4">
                404
              </h1>
              <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you've wandered into uncharted territory. This page doesn't exist in our arena.
              </p>
              
              <Link href="/">
                <Button size="lg" data-testid="button-go-home">
                  <Home className="mr-2 h-5 w-5" />
                  Return Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
