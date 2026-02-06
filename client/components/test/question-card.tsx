"use client";

import { motion } from "framer-motion";
import { Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MCQQuestion } from "./mcq-question";
import { WrittenQuestion } from "./written-question";
import { TestQuestion, UserAnswer } from "@/types";
import { cn } from "@/lib/utils";
import { questionSlideVariants } from "@/lib/animations";

interface QuestionCardProps {
  question: TestQuestion;
  questionNumber: number;
  totalQuestions: number;
  answer: UserAnswer | undefined;
  isFlagged: boolean;
  direction: number;
  onAnswerChange: (answer: string, optionId?: string) => void;
  onToggleFlag: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  answer,
  isFlagged,
  direction,
  onAnswerChange,
  onToggleFlag,
}: QuestionCardProps) {
  const isMCQ = question.type === "mcq" && question.options;

  return (
    <motion.div
      key={question.question_id}
      custom={direction}
      variants={questionSlideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full"
    >
      <Card className="border-2 rounded-xl shadow-sm">
        <CardContent className="p-8 sm:p-10">
          {/* Question Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">
                Question {questionNumber}
              </h3>
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-xs font-medium"
              >
                {question.difficulty.toUpperCase()}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFlag}
              className={cn(
                "rounded-full",
                isFlagged && "text-warning"
              )}
            >
              <Flag className={cn("h-4 w-4", isFlagged && "fill-current")} />
            </Button>
          </div>

          {/* Question Text */}
          <div className="mb-8 mt-6">
            <p className="text-base leading-relaxed text-foreground/90">{question.question_text}</p>
          </div>

          {/* Answer Input */}
          <div className="mt-6">
            {isMCQ ? (
              <MCQQuestion
                question={question}
                selectedOptionId={answer?.selected_option_id}
                onSelect={(optionId, optionText) => {
                  onAnswerChange(optionText, optionId);
                }}
              />
            ) : (
              <WrittenQuestion
                question={question}
                answer={answer?.answer}
                onAnswerChange={(text) => onAnswerChange(text)}
              />
            )}
          </div>

          {/* Question info footer */}
          <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Question {questionNumber} of {totalQuestions}
            </span>
            {answer && (
              <span className="text-success flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-success" />
                Answer saved
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
