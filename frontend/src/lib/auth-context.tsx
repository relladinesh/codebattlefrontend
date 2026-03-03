import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  avatarColor?: string;
  level?: number;
  xp?: number;
  streak?: number;
  problemsSolved?: number;
  winRate?: number;
  rank?: number;
  badges?: number;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("brawl-user");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("brawl-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("brawl-user");
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("brawl-user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
