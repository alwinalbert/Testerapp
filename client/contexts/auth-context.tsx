"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "student" | "teacher" | "admin";

interface User {
  name: string;
  email: string;
  role: UserRole;
  yearGroup?: string;
  syllabus?: string;
  targetExamSession?: string;
  school?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (name: string, email: string, password: string, role?: UserRole, extraData?: Record<string, unknown>) => Promise<{ error: string | null }>;
  loginWithOAuth: (provider: "google" | "apple") => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  const email = supabaseUser.email || "";
  const meta = supabaseUser.user_metadata ?? {};
  const name =
    meta.name ||
    email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const role: UserRole = meta.role ?? "student";
  return {
    name,
    email,
    role,
    yearGroup: meta.year_group,
    syllabus: meta.syllabus,
    targetExamSession: meta.target_exam_session,
    school: meta.school,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user: supabaseUser } }) => {
      if (supabaseUser) {
        setUser(mapSupabaseUser(supabaseUser));
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const login = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      router.push("/dashboard");
      router.refresh();
      return { error: null };
    },
    [supabase.auth, router]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string, role: UserRole = "student", extraData: Record<string, unknown> = {}): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role, ...extraData },
        },
      });

      if (error) {
        return { error: error.message };
      }

      const destination = role === "student" ? "/onboarding/baseline" : "/dashboard";
      router.push(destination);
      router.refresh();
      return { error: null };
    },
    [supabase.auth, router]
  );

  const loginWithOAuth = useCallback(
    async (provider: "google" | "apple"): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) return { error: error.message };
      return { error: null };
    },
    [supabase.auth]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth/login");
    router.refresh();
  }, [supabase.auth, router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, loginWithOAuth, logout }}>
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
