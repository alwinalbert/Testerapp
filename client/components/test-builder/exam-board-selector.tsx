"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  EXAM_BOARDS,
  TARGET_GRADE_PRESETS,
  type ExamBoard,
  getExamBoard,
} from "@/data/exam-boards";
import { DifficultyDistribution } from "@/types";

interface ExamBoardSelectorProps {
  selectedBoard: ExamBoard;
  selectedTargetGrade: string;
  onBoardChange: (board: ExamBoard) => void;
  onTargetGradeChange: (grade: string, preset: DifficultyDistribution) => void;
}

export function ExamBoardSelector({
  selectedBoard,
  selectedTargetGrade,
  onBoardChange,
  onTargetGradeChange,
}: ExamBoardSelectorProps) {
  const boardInfo = getExamBoard(selectedBoard);

  const handleGradeSelect = (grade: string) => {
    const preset = TARGET_GRADE_PRESETS[grade] ?? { easy: 3, medium: 4, hard: 3 };
    onTargetGradeChange(grade, preset);
  };

  return (
    <div className="space-y-6">
      {/* Exam Board */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Exam Board</h3>
          <p className="text-sm text-muted-foreground">
            Select your exam board so questions match the exact syllabus and assessment criteria
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXAM_BOARDS.map((board) => {
            const isSelected = selectedBoard === board.id;
            return (
              <motion.button
                key={board.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onBoardChange(board.id as ExamBoard)}
                className={cn(
                  "relative flex flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-all hover:bg-accent/50",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-primary" />
                )}
                <span className="text-2xl">{board.icon}</span>
                <p className="font-semibold leading-tight">{board.name}</p>
                <p className="text-xs text-muted-foreground leading-snug">
                  {board.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Target Grade */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Target Grade</h3>
          <p className="text-sm text-muted-foreground">
            Questions will be weighted to the difficulty level needed to achieve this grade
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {boardInfo.targetGrades.map((grade) => {
            const boundary = boardInfo.gradeBoundaries.find((b) => b.grade === grade);
            const isSelected = selectedTargetGrade === grade;
            const preset = TARGET_GRADE_PRESETS[grade];

            return (
              <motion.button
                key={grade}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGradeSelect(grade)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border-2 px-6 py-4 transition-all hover:bg-accent/50 min-w-[90px]",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border"
                )}
              >
                <span
                  className="text-2xl font-extrabold"
                  style={{ color: isSelected ? boundary?.color : undefined }}
                >
                  {grade}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {boundary?.description}
                </span>
                {preset && (
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-[10px] px-1 py-0 text-success border-success/40">
                      {preset.easy}E
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 text-warning border-warning/40">
                      {preset.medium}M
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 text-destructive border-destructive/40">
                      {preset.hard}H
                    </Badge>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {selectedTargetGrade && (
          <p className="text-xs text-muted-foreground">
            Difficulty preset applied — you can still fine-tune the distribution in the next step.
          </p>
        )}
      </div>
    </div>
  );
}
