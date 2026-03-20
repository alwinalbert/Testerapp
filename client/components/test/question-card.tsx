"use client";

import { motion } from "framer-motion";
import { Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MCQQuestion } from "./mcq-question";
import { WrittenQuestion } from "./written-question";
import { QuestionStem } from "./question-stem";
import { LabelDiagramQuestion } from "./label-diagram-question";
import { DataResponseQuestion } from "./data-response-question";
import { SourceAnalysisQuestion } from "./source-analysis-question";
import { CalculationQuestion } from "./calculation-question";
import { ExtendedEssayQuestion } from "./extended-essay-question";
import { TrueFalseJustifyQuestion } from "./true-false-justify-question";
import { MarkbandSelector } from "./markband-selector";
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
  const qType = question.type as string;
  const isMCQ = qType === "mcq" && question.options;
  const isLabelDiagram = qType === "label_diagram";
  const isDataResponse = qType === "data_response";
  const isSourceAnalysis = qType === "source_analysis";
  const isCalculation = qType === "calculation";
  const isExtendedEssay = qType === "extended_essay";
  const isTrueFalseJustify = qType === "true_false_justify";
  const hasMarkband = !!question.markband_max;

  // Helper to parse JSON-stored answers for multi-part types
  const parseJsonAnswer = (raw: string | undefined): Record<string, string> => {
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
  };

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
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold">
                Question {questionNumber}
              </h3>
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-xs font-medium"
              >
                {question.difficulty.toUpperCase()}
              </Badge>
              {question.marks > 0 && (
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                  {question.marks} {question.marks === 1 ? "mark" : "marks"}
                </Badge>
              )}
              {question.is_hl_extension && (
                <Badge className="rounded-full px-3 py-1 text-xs bg-purple-600 text-white">
                  HL Extension
                </Badge>
              )}
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

          {/* Question Stem — renders passage, image, table, audio + math */}
          <div className="mb-8 mt-6">
            <QuestionStem question={question} />
          </div>

          {/* Answer Input */}
          <div className="mt-6">
            {isLabelDiagram ? (
              <LabelDiagramQuestion
                question={question}
                answers={parseJsonAnswer(answer?.answer)}
                onAnswerChange={(labels) => onAnswerChange(JSON.stringify(labels))}
              />
            ) : isDataResponse ? (
              <DataResponseQuestion
                question={question}
                answers={parseJsonAnswer(answer?.answer)}
                onAnswerChange={(answers) => onAnswerChange(JSON.stringify(answers))}
              />
            ) : isSourceAnalysis ? (
              <SourceAnalysisQuestion
                question={question}
                answers={parseJsonAnswer(answer?.answer)}
                onAnswerChange={(answers) => onAnswerChange(JSON.stringify(answers))}
              />
            ) : isCalculation ? (
              <CalculationQuestion
                question={question}
                answers={parseJsonAnswer(answer?.answer)}
                onAnswerChange={(answers) => onAnswerChange(JSON.stringify(answers))}
              />
            ) : isExtendedEssay ? (
              <ExtendedEssayQuestion
                question={question}
                answer={answer?.answer}
                onAnswerChange={(text) => onAnswerChange(text)}
              />
            ) : isTrueFalseJustify ? (
              <TrueFalseJustifyQuestion
                question={question}
                answer={answer?.answer}
                onAnswerChange={(text) => onAnswerChange(text)}
              />
            ) : hasMarkband ? (
              <MarkbandSelector
                question={question}
                selectedBand={answer?.answer ? Number(answer.answer) : null}
                onSelect={(band) => onAnswerChange(String(band))}
              />
            ) : isMCQ ? (
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
