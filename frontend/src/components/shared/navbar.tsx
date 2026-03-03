import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Swords, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLanding = location === "/";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          <Link href="/" data-testid="link-home">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <Swords className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                BRAWL
              </span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {isLanding && (
              <>
                <a href="#features" className="text-muted-foreground transition-colors hover:text-foreground" data-testid="link-features">
                  Features
                </a>
                <a href="#testimonials" className="text-muted-foreground transition-colors hover:text-foreground" data-testid="link-testimonials">
                  Testimonials
                </a>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isLanding ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" data-testid="button-login">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button data-testid="button-signup">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button data-testid="button-dashboard">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {isLanding && (
                <>
                  <a
                    href="#features"
                    className="block py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a
                    href="#testimonials"
                    className="block py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Testimonials
                  </a>
                </>
              )}
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
