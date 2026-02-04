"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TestResults, Evaluation } from "@/types";
import { cn } from "@/lib/utils";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

interface QuestionReviewProps {
  results: TestResults;
}

export function QuestionReview({ results }: QuestionReviewProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect">("all");

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const filteredEvaluations = results.evaluations.filter((evaluation) => {
    if (filter === "correct") return evaluation.is_correct;
    if (filter === "incorrect") return !evaluation.is_correct;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Question Review</CardTitle>
          <div className="flex gap-2">
            {(["all", "correct", "incorrect"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f === "all"
                  ? `All (${results.evaluations.length})`
                  : f === "correct"
                  ? `Correct (${results.evaluations.filter((e) => e.is_correct).length})`
                  : `Incorrect (${results.evaluations.filter((e) => !e.is_correct).length})`}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {filteredEvaluations.map((evaluation, index) => {
            const question = results.testPaper.questions.find(
              (q) => q.question_id === evaluation.question_id
            );
            if (!question) return null;

            const isExpanded = expandedQuestions.includes(evaluation.question_id);

            return (
              <motion.div key={evaluation.question_id} variants={staggerItemVariants}>
                <QuestionReviewItem
                  question={question}
                  evaluation={evaluation}
                  questionNumber={index + 1}
                  isExpanded={isExpanded}
                  onToggle={() => toggleQuestion(evaluation.question_id)}
                />
              </motion.div>
            );
          })}

          {filteredEvaluations.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No questions match the selected filter.
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}

interface QuestionReviewItemProps {
  question: TestResults["testPaper"]["questions"][0];
  evaluation: Evaluation;
  questionNumber: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function QuestionReviewItem({
  question,
  evaluation,
  questionNumber,
  isExpanded,
  onToggle,
}: QuestionReviewItemProps) {
  return (
    <div
      className={cn(
        "rounded-lg border transition-colors",
        evaluation.is_correct
          ? "border-success/30 bg-success/5"
          : "border-destructive/30 bg-destructive/5"
      )}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          {/* Status icon */}
          {evaluation.is_correct ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success">
              <CheckCircle2 className="h-4 w-4 text-success-foreground" />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive">
              <XCircle className="h-4 w-4 text-destructive-foreground" />
            </div>
          )}

          {/* Question info */}
          <div>
            <p className="font-medium">Question {questionNumber}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{question.topic}</span>
              <span className="text-border">|</span>
              <Badge variant={question.difficulty as "easy" | "medium" | "hard"} className="text-xs">
                {question.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Score */}
          <div className="text-right">
            <p className="font-bold">
              {evaluation.marks}/{evaluation.max_marks}
            </p>
            <p className="text-xs text-muted-foreground">marks</p>
          </div>

          {/* Expand icon */}
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t p-4 space-y-4">
              {/* Question text */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Question
                </p>
                <p>{question.question_text}</p>
              </div>

              {/* Feedback */}
              <div className="flex items-start gap-2 rounded-lg bg-muted p-3">
                <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Feedback</p>
                  <p className="text-sm text-muted-foreground">
                    {evaluation.report}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
