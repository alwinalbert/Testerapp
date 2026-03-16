"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, SkipForward, Brain, Target, Zap } from "lucide-react";

// 5 questions progressing from easy → hard to calibrate level
const QUESTIONS = [
  {
    id: 1,
    difficulty: "easy",
    question: "A car travels 120 km in 2 hours. What is its average speed?",
    options: ["40 km/h", "60 km/h", "80 km/h", "240 km/h"],
    correct: 1,
    subject: "Mathematics",
  },
  {
    id: 2,
    difficulty: "easy",
    question: "Which of the following is a chemical change?",
    options: ["Melting ice", "Dissolving salt in water", "Burning wood", "Cutting paper"],
    correct: 2,
    subject: "Chemistry",
  },
  {
    id: 3,
    difficulty: "medium",
    question: "Solve for x: 3x² - 12 = 0",
    options: ["x = ±1", "x = ±2", "x = ±3", "x = ±4"],
    correct: 1,
    subject: "Mathematics",
  },
  {
    id: 4,
    difficulty: "medium",
    question: "A cell membrane is described as 'fluid mosaic'. What does 'fluid' refer to?",
    options: [
      "The cell is filled with liquid",
      "Phospholipids can move laterally within the bilayer",
      "Water freely passes through the membrane",
      "Proteins are dissolved in the cytoplasm",
    ],
    correct: 1,
    subject: "Biology",
  },
  {
    id: 5,
    difficulty: "hard",
    question: "In a competitive market, if supply decreases while demand remains constant, what happens?",
    options: [
      "Price falls, quantity rises",
      "Price rises, quantity falls",
      "Both price and quantity fall",
      "Both price and quantity rise",
    ],
    correct: 1,
    subject: "Economics",
  },
];

type Screen = "intro" | "question" | "result";

const LEVEL_MAP = [
  { min: 0, max: 1, level: "Foundations", desc: "We'll start with core concepts and build your confidence step by step.", color: "text-blue-500", icon: "🌱" },
  { min: 2, max: 3, level: "Developing", desc: "You have a solid base. We'll target the gaps and push you toward exam-ready.", color: "text-yellow-500", icon: "📈" },
  { min: 4, max: 5, level: "Advanced", desc: "Strong foundations. We'll focus on high-mark questions and exam technique.", color: "text-green-500", icon: "🚀" },
];

function getLevel(score: number) {
  return LEVEL_MAP.find((l) => score >= l.min && score <= l.max) ?? LEVEL_MAP[0];
}

export default function BaselinePage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("intro");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const score = answers.filter(Boolean).length;
  const level = getLevel(score);

  const handleSkip = () => {
    localStorage.setItem("baselineSkipped", "true");
    router.push("/dashboard");
  };

  const handleStart = () => setScreen("question");

  const handleSelect = (idx: number) => {
    if (confirmed) return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const correct = selected === QUESTIONS[current].correct;
    setConfirmed(true);

    setTimeout(() => {
      const newAnswers = [...answers, correct];
      setAnswers(newAnswers);
      setSelected(null);
      setConfirmed(false);

      if (current + 1 < QUESTIONS.length) {
        setCurrent((c) => c + 1);
      } else {
        const finalScore = newAnswers.filter(Boolean).length;
        const finalLevel = getLevel(finalScore);
        localStorage.setItem("baselineLevel", finalLevel.level);
        localStorage.setItem("baselineScore", String(finalScore));
        localStorage.setItem("baselineComplete", "true");
        setScreen("result");
      }
    }, 900);
  };

  const handleToDashboard = () => router.push("/dashboard");

  const q = QUESTIONS[current];
  const progress = ((current) / QUESTIONS.length) * 100;

  return (
    <div className="w-full max-w-xl">
      <AnimatePresence mode="wait">

        {/* ── INTRO ── */}
        {screen === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="text-center space-y-3 pb-4">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">Quick Baseline Check</CardTitle>
                <CardDescription className="text-base">
                  5 short questions — takes about 2 minutes. We use your answers to calibrate your starting level and personalise your first recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { icon: <Target className="h-5 w-5 mx-auto mb-1 text-primary" />, label: "5 questions" },
                    { icon: <Zap className="h-5 w-5 mx-auto mb-1 text-primary" />, label: "~2 minutes" },
                    { icon: <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-primary" />, label: "No pressure" },
                  ].map((item, i) => (
                    <div key={i} className="rounded-lg border p-3 text-sm text-muted-foreground">
                      {item.icon}
                      {item.label}
                    </div>
                  ))}
                </div>

                <Button className="w-full" onClick={handleStart}>
                  Start Diagnostic
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>

                <button
                  onClick={handleSkip}
                  className="w-full flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipForward className="h-4 w-4" />
                  Skip for now — my first test will set my baseline
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── QUESTION ── */}
        {screen === "question" && (
          <motion.div
            key={`q-${current}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Question {current + 1} of {QUESTIONS.length}</span>
                    <span className="capitalize">{q.difficulty} · {q.subject}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: `${progress}%` }}
                      animate={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-medium text-base leading-snug">{q.question}</p>

                <div className="space-y-2">
                  {q.options.map((opt, idx) => {
                    let cls = "w-full rounded-lg border px-4 py-3 text-left text-sm transition-all ";
                    if (!confirmed) {
                      cls += selected === idx
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50";
                    } else {
                      if (idx === q.correct) cls += "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
                      else if (idx === selected && selected !== q.correct) cls += "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
                      else cls += "border-border opacity-50";
                    }
                    return (
                      <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={confirmed}>
                        <span className="font-medium mr-2 text-muted-foreground">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <Button
                  className="w-full"
                  disabled={selected === null || confirmed}
                  onClick={handleConfirm}
                >
                  {confirmed ? "Next..." : current + 1 === QUESTIONS.length ? "Finish" : "Confirm"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {screen === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="text-center space-y-3 pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                  {level.icon}
                </div>
                <CardTitle className="text-2xl">Your Starting Level</CardTitle>
                <div className={`text-2xl font-bold ${level.color}`}>{level.level}</div>
                <CardDescription className="text-sm">{level.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Score breakdown */}
                <div className="rounded-lg border p-4 space-y-3">
                  <p className="text-sm font-medium text-center">
                    {score} / {QUESTIONS.length} correct
                  </p>
                  <div className="flex gap-1.5 justify-center">
                    {QUESTIONS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          answers[i] ? "bg-green-500" : "bg-red-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  This calibration adjusts your first set of recommended tests. You can retake it anytime from Settings.
                </p>

                <Button className="w-full" onClick={handleToDashboard}>
                  Go to Dashboard
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
