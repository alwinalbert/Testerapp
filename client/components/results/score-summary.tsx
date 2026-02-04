"use client";

import { motion } from "framer-motion";
import { Trophy, Target, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TestResults } from "@/types";
import { formatTime, getScoreColor } from "@/lib/utils";
import { scoreRevealVariants, staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

interface ScoreSummaryProps {
  results: TestResults;
}

export function ScoreSummary({ results }: ScoreSummaryProps) {
  const scoreColor = getScoreColor(results.percentage);
  const correctCount = results.evaluations.filter((e) => e.is_correct).length;
  const incorrectCount = results.evaluations.length - correctCount;

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Main Score Card */}
      <motion.div variants={scoreRevealVariants}>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8">
              <div className="flex flex-col items-center text-center">
                {/* Trophy/Badge */}
                {results.percentage >= 80 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="mb-4"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/20">
                      <Trophy className="h-8 w-8 text-warning" />
                    </div>
                  </motion.div>
                )}

                {/* Score Circle */}
                <div className="relative mb-4">
                  <svg className="h-40 w-40 -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 440" }}
                      animate={{
                        strokeDasharray: `${(results.percentage / 100) * 440} 440`,
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={scoreColor}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className={`text-4xl font-bold ${scoreColor}`}
                    >
                      {results.percentage}%
                    </motion.span>
                    <span className="text-sm text-muted-foreground">Score</span>
                  </div>
                </div>

                {/* Score Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-center"
                >
                  <p className="text-2xl font-bold">
                    {results.totalScore} / {results.maxScore} marks
                  </p>
                  <p className="text-muted-foreground">
                    {results.percentage >= 80
                      ? "Excellent performance!"
                      : results.percentage >= 60
                      ? "Good effort! Keep practicing."
                      : "Keep working hard. You'll improve!"}
                  </p>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{correctCount}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{incorrectCount}</p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {results.testPaper.questions.length}
                </p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatTime(results.timeTaken)}
                </p>
                <p className="text-sm text-muted-foreground">Time Taken</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
