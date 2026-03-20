"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TestQuestion } from "@/types";
import { MathText } from "./question-stem";

interface DataResponseQuestionProps {
  question: TestQuestion;
  answers: Record<string, string>;
  onAnswerChange: (answers: Record<string, string>) => void;
}

export function DataResponseQuestion({
  question,
  answers,
  onAnswerChange,
}: DataResponseQuestionProps) {
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
      {/* Stimulus: table or image */}
      {question.stimulus && (
        <div className="rounded-lg border bg-muted/30 overflow-hidden">
          {question.stimulus.type === "table" && question.stimulus.headers && question.stimulus.rows && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {question.stimulus.headers.map((h, i) => (
                      <th key={i} className="px-4 py-2 text-left font-semibold border-b">
                        <MathText text={h} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {question.stimulus.rows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 1 ? "bg-muted/20" : ""}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-2 border-b border-border/50">
                          <MathText text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {question.stimulus.type === "image" && question.stimulus.image_url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={question.stimulus.image_url}
              alt="Data stimulus"
              className="mx-auto max-h-64 object-contain p-2"
            />
          )}
          {question.stimulus.type === "text" && question.stimulus.content && (
            <div className="px-5 py-4 text-sm leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Data / Stimulus
              </p>
              {question.stimulus.content}
            </div>
          )}
        </div>
      )}

      {/* Sub-questions */}
      {subQuestions.length > 0 ? (
        <div className="space-y-5">
          {subQuestions.map((sub, idx) => {
            const letter = String.fromCharCode(97 + idx); // a, b, c...
            const minH = sub.marks >= 6 ? "min-h-[180px]" : sub.marks >= 3 ? "min-h-[120px]" : "min-h-[80px]";
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
                  placeholder="Your answer..."
                  className={`${minH} resize-y ml-5`}
                />
                <div className="ml-5 text-xs text-muted-foreground text-right">
                  {(localAnswers[sub.id] || "").trim().split(/\s+/).filter(Boolean).length} words
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Fallback: single answer textarea if no sub_questions
        <Textarea
          value={localAnswers["main"] || ""}
          onChange={(e) => handleChange("main", e.target.value)}
          placeholder="Your answer..."
          className="min-h-[120px] resize-y"
        />
      )}
    </motion.div>
  );
}
