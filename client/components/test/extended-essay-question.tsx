"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { TestQuestion } from "@/types";

interface ExtendedEssayQuestionProps {
  question: TestQuestion;
  answer: string | undefined;
  onAnswerChange: (answer: string) => void;
}

export function ExtendedEssayQuestion({
  question,
  answer,
  onAnswerChange,
}: ExtendedEssayQuestionProps) {
  const [localAnswer, setLocalAnswer] = useState(answer || "");
  const wordCount = localAnswer.trim().split(/\s+/).filter(Boolean).length;
  const rubric = question.rubric || [];
  const guidance = question.word_guidance || (question.marks >= 20 ? "800–1000" : question.marks >= 12 ? "500–700" : "300–500");

  useEffect(() => {
    if (answer !== undefined && answer !== localAnswer) setLocalAnswer(answer);
  }, [answer]);

  useEffect(() => {
    const timer = setTimeout(() => onAnswerChange(localAnswer), 300);
    return () => clearTimeout(timer);
  }, [localAnswer, onAnswerChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Rubric panel */}
      {rubric.length > 0 && (
        <div className="rounded-lg border bg-muted/20 overflow-hidden">
          <div className="px-4 py-3 border-b bg-muted/40">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Marking Criteria
            </p>
          </div>
          <div className="divide-y">
            {rubric.map((r, i) => (
              <div key={i} className="flex items-start gap-4 px-4 py-3 text-sm">
                <div className="shrink-0 text-center">
                  <span className="font-bold text-base">{r.max_marks}</span>
                  <p className="text-[10px] text-muted-foreground leading-none">marks</p>
                </div>
                <div>
                  <p className="font-medium">{r.criterion}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.descriptor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Writing area */}
      <div className="space-y-2">
        <Textarea
          value={localAnswer}
          onChange={(e) => setLocalAnswer(e.target.value)}
          placeholder="Write your extended response here. Structure your answer with clear paragraphs — introduction, body paragraphs with evidence, and conclusion."
          className="min-h-[320px] resize-y leading-relaxed"
        />

        {/* Stats row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Suggested length: <span className="font-medium">{guidance} words</span>
          </span>
          <span className={wordCount === 0 ? "" : wordCount < 100 ? "text-warning" : "text-success"}>
            {wordCount} words
          </span>
        </div>

        {/* Word count progress */}
        {question.marks >= 8 && (
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, (wordCount / (question.marks * 40)) * 100)}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: Plan before writing — allocate roughly equal time to each rubric criterion.
      </p>
    </motion.div>
  );
}
