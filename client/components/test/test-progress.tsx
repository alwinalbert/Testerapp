"use client";

import { motion } from "framer-motion";
import { Check, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface TestProgressProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: string[];
  flaggedQuestions: string[];
  questionIds: string[];
  onQuestionClick?: (index: number) => void;
}

export function TestProgress({
  currentIndex,
  totalQuestions,
  answeredQuestions,
  flaggedQuestions,
  questionIds,
  onQuestionClick,
}: TestProgressProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="font-medium">
            {answeredQuestions.length} answered
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question dots/numbers */}
      <div className="flex flex-wrap gap-2">
        {questionIds.map((questionId, index) => {
          const isAnswered = answeredQuestions.includes(questionId);
          const isFlagged = flaggedQuestions.includes(questionId);
          const isCurrent = index === currentIndex;

          return (
            <button
              key={questionId}
              onClick={() => onQuestionClick?.(index)}
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all",
                isCurrent
                  ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                  : isAnswered
                  ? "bg-success/20 text-success hover:bg-success/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {isAnswered ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}

              {/* Flag indicator */}
              {isFlagged && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning">
                  <Flag className="h-2.5 w-2.5 text-warning-foreground" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-success/20" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-muted" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-1">
          <Flag className="h-3 w-3 text-warning" />
          <span>Flagged</span>
        </div>
      </div>
    </div>
  );
}

// Linear progress for top of screen (Google Forms style)
export function LinearTestProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
      <motion.div
        className="h-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}
