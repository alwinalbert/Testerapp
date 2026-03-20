"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { TestQuestion } from "@/types";
import { cn } from "@/lib/utils";

interface TrueFalseJustifyQuestionProps {
  question: TestQuestion;
  answer: string | undefined;
  onAnswerChange: (answer: string) => void;
}

interface TFAnswer {
  value: "true" | "false" | null;
  justification: string;
}

export function TrueFalseJustifyQuestion({
  question,
  answer,
  onAnswerChange,
}: TrueFalseJustifyQuestionProps) {
  const parseAnswer = (raw: string | undefined): TFAnswer => {
    if (!raw) return { value: null, justification: "" };
    try {
      return JSON.parse(raw);
    } catch {
      return { value: null, justification: "" };
    }
  };

  const [local, setLocal] = useState<TFAnswer>(parseAnswer(answer));
  const justificationPrompt = question.justification_prompt || "Justify your answer with reference to the statement above.";

  useEffect(() => {
    if (answer !== undefined) setLocal(parseAnswer(answer));
  }, [answer]);

  const update = (patch: Partial<TFAnswer>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onAnswerChange(JSON.stringify(next));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Statement display */}
      {question.statement && (
        <div className="rounded-lg border border-border bg-muted/30 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Statement
          </p>
          <p className="text-base leading-relaxed font-medium">{question.statement}</p>
        </div>
      )}

      {/* True / False toggle */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Is this statement true or false?</p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => update({ value: "true" })}
            className={cn(
              "h-12 gap-2 text-base transition-all",
              local.value === "true" &&
                "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 ring-2 ring-green-500/30"
            )}
          >
            <CheckCircle2 className="h-5 w-5" />
            True
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => update({ value: "false" })}
            className={cn(
              "h-12 gap-2 text-base transition-all",
              local.value === "false" &&
                "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 ring-2 ring-red-500/30"
            )}
          >
            <XCircle className="h-5 w-5" />
            False
          </Button>
        </div>
      </div>

      {/* Justification textarea — only shown after T/F selected */}
      {local.value !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-2"
        >
          <p className="text-sm font-medium">{justificationPrompt}</p>
          <Textarea
            value={local.justification}
            onChange={(e) => update({ justification: e.target.value })}
            placeholder="Write your justification here..."
            className="min-h-[120px] resize-y"
          />
          <p className="text-xs text-muted-foreground text-right">
            {local.justification.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
