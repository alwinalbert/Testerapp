"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TestQuestion } from "@/types";
import { MathText } from "./question-stem";

interface CalculationQuestionProps {
  question: TestQuestion;
  answers: Record<string, string>;
  onAnswerChange: (answers: Record<string, string>) => void;
}

export function CalculationQuestion({
  question,
  answers,
  onAnswerChange,
}: CalculationQuestionProps) {
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>(answers || {});
  const steps = question.steps || [];

  useEffect(() => {
    if (JSON.stringify(answers) !== JSON.stringify(localAnswers)) {
      setLocalAnswers(answers || {});
    }
  }, [answers]);

  const handleChange = (stepId: string, value: string) => {
    const updated = { ...localAnswers, [stepId]: value };
    setLocalAnswers(updated);
    onAnswerChange(updated);
  };

  const filledSteps = steps.filter((s) => (localAnswers[s.id] || "").trim().length > 0).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Progress indicator */}
      {steps.length > 0 && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(filledSteps / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs shrink-0">{filledSteps}/{steps.length} steps</span>
        </div>
      )}

      {/* Step-by-step inputs */}
      {steps.length > 0 ? (
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={step.id} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm leading-relaxed">
                    <MathText text={step.instruction} />
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 text-xs">
                  {step.marks} {step.marks === 1 ? "mark" : "marks"}
                </Badge>
              </div>
              <Textarea
                value={localAnswers[step.id] || ""}
                onChange={(e) => handleChange(step.id, e.target.value)}
                placeholder={`Show your working for step ${idx + 1}...`}
                className="min-h-[80px] resize-y font-mono text-sm"
              />
            </div>
          ))}
        </div>
      ) : (
        // Fallback: free-form working area
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Show all working
          </p>
          <Textarea
            value={localAnswers["working"] || ""}
            onChange={(e) => handleChange("working", e.target.value)}
            placeholder="Show all steps of your calculation here. Marks are awarded for method, not just the final answer."
            className="min-h-[160px] resize-y font-mono text-sm"
          />
          <Textarea
            value={localAnswers["answer"] || ""}
            onChange={(e) => handleChange("answer", e.target.value)}
            placeholder="Final answer (with units if applicable)"
            className="min-h-[50px] resize-y font-semibold"
          />
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Marks are awarded for each correct step — always show your working.
      </p>
    </motion.div>
  );
}
