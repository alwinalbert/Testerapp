"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { TestQuestion } from "@/types";

interface WrittenQuestionProps {
  question: TestQuestion;
  answer: string | undefined;
  onAnswerChange: (answer: string) => void;
  maxLength?: number;
}

export function WrittenQuestion({
  question,
  answer,
  onAnswerChange,
  maxLength = 2000,
}: WrittenQuestionProps) {
  const [localAnswer, setLocalAnswer] = useState(answer || "");
  const characterCount = localAnswer.length;
  const wordCount = localAnswer.trim().split(/\s+/).filter(Boolean).length;

  // Sync with external answer
  useEffect(() => {
    if (answer !== undefined && answer !== localAnswer) {
      setLocalAnswer(answer);
    }
  }, [answer]);

  // Debounce the answer update
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnswerChange(localAnswer);
    }, 300);

    return () => clearTimeout(timer);
  }, [localAnswer, onAnswerChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setLocalAnswer(value);
    }
  };

  // Determine min-height based on question marks/difficulty
  const getMinHeight = () => {
    if (question.marks >= 8) return "min-h-[250px]";
    if (question.marks >= 5) return "min-h-[180px]";
    return "min-h-[120px]";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <Textarea
        value={localAnswer}
        onChange={handleChange}
        placeholder="Type your answer here..."
        className={`${getMinHeight()} resize-y`}
      />

      {/* Character and word count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span className="text-border">|</span>
          <span
            className={
              characterCount >= maxLength * 0.9 ? "text-warning" : ""
            }
          >
            {characterCount}/{maxLength} characters
          </span>
        </div>

        {/* Writing tips */}
        {question.marks >= 5 && (
          <span className="text-muted-foreground/70">
            Tip: Support your answer with specific examples
          </span>
        )}
      </div>

      {/* Progress indicator for longer answers */}
      {question.marks >= 5 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Recommended length</span>
            <span>
              {Math.min(100, Math.round((wordCount / (question.marks * 15)) * 100))}%
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, (wordCount / (question.marks * 15)) * 100)}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
