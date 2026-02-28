"use client";

import { useState } from "react";
import { X, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EXAM_BOARDS, TARGET_GRADE_PRESETS } from "@/data/exam-boards";
import { ExamBoard } from "@/types";

interface AssignTestPanelProps {
  classId: string;
  subject: string;
  examBoard: ExamBoard;
  onClose: () => void;
  onAssign: (title: string, targetGrade: string, numberOfQuestions: number, dueDate?: string) => void;
}

const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30];

export function AssignTestPanel({
  classId,
  subject,
  examBoard,
  onClose,
  onAssign,
}: AssignTestPanelProps) {
  const board = EXAM_BOARDS.find((b) => b.id === examBoard);
  const [targetGrade, setTargetGrade] = useState(board?.targetGrades[1] ?? "B");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [dueDate, setDueDate] = useState("");
  const [title, setTitle] = useState(`${subject} — ${board?.shortName ?? ""} Practice`);

  const handleAssign = () => {
    onAssign(title, targetGrade, numberOfQuestions, dueDate || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Assign Test</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="test-title">Test Title</Label>
            <Input
              id="test-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Target Grade */}
          <div className="space-y-2">
            <Label>Target Grade</Label>
            <div className="flex flex-wrap gap-2">
              {board?.targetGrades.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setTargetGrade(grade)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm font-medium transition-all",
                    targetGrade === grade
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {grade}
                </button>
              ))}
            </div>
            {TARGET_GRADE_PRESETS[targetGrade] && (
              <p className="text-xs text-muted-foreground">
                Difficulty: {TARGET_GRADE_PRESETS[targetGrade].easy}E ·{" "}
                {TARGET_GRADE_PRESETS[targetGrade].medium}M ·{" "}
                {TARGET_GRADE_PRESETS[targetGrade].hard}H (per 10 questions)
              </p>
            )}
          </div>

          {/* Number of Questions */}
          <div className="space-y-2">
            <Label>Number of Questions</Label>
            <div className="flex flex-wrap gap-2">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNumberOfQuestions(n)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm font-medium transition-all",
                    numberOfQuestions === n
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due-date" className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5" />
              Due Date (optional)
            </Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleAssign}>
              Assign to Class
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
