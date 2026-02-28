"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  BarChart3,
  FileText,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Generated Questions",
    description:
      "Fresh questions every time — no fixed question bank. Powered by AI calibrated to your exact syllabus.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Target,
    title: "Grade Boundary Calibration",
    description:
      "Set your target grade (A*, A, B…) and the difficulty automatically adjusts to match real exam boundaries.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: FileText,
    title: "Past Paper Recreation",
    description:
      "Recreate Cambridge, IB and A-Level past papers by paper code and session — same format, fresh questions.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: BarChart3,
    title: "Actionable Analytics",
    description:
      "Topic-level performance breakdown, strengths, weaknesses and AI suggestions after every test.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

const examBoards = [
  { name: "Cambridge IGCSE", icon: "🎓", subjects: "Maths · Physics · Chemistry · Biology · English · Economics" },
  { name: "IB Diploma", icon: "🌐", subjects: "HL/SL Maths · Sciences · Language A · History · Economics" },
  { name: "A-Levels", icon: "📚", subjects: "Maths · Further Maths · Sciences · English · History" },
  { name: "Edexcel IGCSE", icon: "📘", subjects: "Maths · Sciences · English · History · Geography" },
];

const benefits = [
  "No teacher required — self-directed revision",
  "AI marks your answers with detailed feedback",
  "Exam-board-specific grade boundaries",
  "Share results or download AI-written report",
  "Works on any device",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-semibold text-lg leading-tight block">TestPrep</span>
              <span className="text-[10px] text-muted-foreground leading-none">powered by Edukko</span>
            </div>
          </div>
          <div className=" gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Exam Revision
          </Badge>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Revision tests calibrated{" "}
            <span className="text-primary">to your grade boundary</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI generates fresh exam-style questions for Cambridge IGCSE, IB Diploma and A-Levels —
            calibrated to your target grade, your subject, your syllabus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/auth/signup">
                Start Revising Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            No credit card required · Free to get started
          </p>
        </motion.div>
      </section>

      {/* Exam Boards */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest">
            Supported Exam Boards
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {examBoards.map((board) => (
              <Card key={board.name} className="border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{board.icon}</span>
                    <span className="font-semibold">{board.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{board.subjects}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Everything you need to hit your target grade</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Unlike platforms with fixed question banks, TestPrep generates fresh AI questions
            calibrated to your exact exam board and target grade every single time.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.bg}`}>
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-4xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Built for students, not just schools</h2>
              <p className="text-muted-foreground">
                Most assessment platforms require a school subscription and a teacher to set things up.
                TestPrep puts control in your hands — log in and start revising in under two minutes.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Button asChild className="gap-2">
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Mini preview card */}
            <div className="space-y-3">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Cambridge IGCSE Mathematics</span>
                    <Badge>Target A*</Badge>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[72%] rounded-full bg-primary" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[["72%", "Score"], ["A", "Grade"], ["8/10", "Correct"]].map(([val, label]) => (
                      <div key={label} className="rounded-lg bg-muted p-3">
                        <p className="font-bold text-lg">{val}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground border-t pt-3">
                    📈 18% more for A* · Algebra and Trigonometry need work
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-xl mx-auto"
        >
          <h2 className="text-3xl font-bold">Ready to hit your target grade?</h2>
          <p className="text-muted-foreground">
            Join students using AI-powered revision to prepare smarter for Cambridge, IB and A-Level exams.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/auth/signup">
              Start Revising Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        © 2026 TestPrep by Edukko. All rights reserved.
      </footer>
    </div>
  );
}
