"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TestQuestion } from "@/types";
import { MathText } from "./question-stem";

interface SourceAnalysisQuestionProps {
  question: TestQuestion;
  answers: Record<string, string>;
  onAnswerChange: (answers: Record<string, string>) => void;
}

export function SourceAnalysisQuestion({
  question,
  answers,
  onAnswerChange,
}: SourceAnalysisQuestionProps) {
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>(answers || {});
  const subQuestions = question.sub_questions || [];

  useEffect(() => {
    if (JSON.stringify(answers) !== JSON.stringify(localAnswers)) {
      setLocalAnswers(answers || {});
    }
  }, [answers]);

  const handleChange = (subId: string, value: string) => {
    const updated = { ...localAnswers, [subId]: value };
    setLocalAnswers(updated);
    onAnswerChange(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Source passage */}
      {question.passage && (
        <div className="rounded-lg border-l-4 border-blue-400/60 bg-blue-50/30 dark:bg-blue-950/20 px-5 py-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Source Extract
          </p>
          <p className="text-sm leading-relaxed whitespace-pre-line max-h-52 overflow-y-auto text-foreground/90">
            {question.passage}
          </p>
        </div>
      )}

      {/* Sub-questions */}
      {subQuestions.length > 0 ? (
        <div className="space-y-5">
          {subQuestions.map((sub, idx) => {
            const letter = String.fromCharCode(97 + idx);
            const minH = sub.marks >= 8 ? "min-h-[200px]" : sub.marks >= 4 ? "min-h-[140px]" : "min-h-[90px]";
            return (
              <div key={sub.id} className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-sm shrink-0 mt-0.5">({letter})</span>
                  <div className="flex-1 flex items-start justify-between gap-2">
                    <p className="text-sm leading-relaxed">
                      <MathText text={sub.text} />
                    </p>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {sub.marks} {sub.marks === 1 ? "mark" : "marks"}
                    </Badge>
                  </div>
                </div>
                <Textarea
                  value={localAnswers[sub.id] || ""}
                  onChange={(e) => handleChange(sub.id, e.target.value)}
                  placeholder="Analyse the source, using evidence to support your answer..."
                  className={`${minH} resize-y ml-5`}
                />
                <div className="ml-5 flex justify-between text-xs text-muted-foreground">
                  <span>Quote and evaluate the source directly</span>
                  <span>{(localAnswers[sub.id] || "").trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Textarea
          value={localAnswers["main"] || ""}
          onChange={(e) => handleChange("main", e.target.value)}
          placeholder="Analyse the source extract, using evidence from the text..."
          className="min-h-[160px] resize-y"
        />
      )}
    </motion.div>
  );
}
