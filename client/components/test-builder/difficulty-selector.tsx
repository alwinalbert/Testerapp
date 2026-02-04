"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DifficultyDistribution, QuestionType } from "@/types";
import { cn } from "@/lib/utils";

interface DifficultySelectorProps {
  distribution: DifficultyDistribution;
  questionType: QuestionType;
  totalQuestions: number;
  onDistributionChange: (distribution: DifficultyDistribution) => void;
  onQuestionTypeChange: (type: QuestionType) => void;
  onTotalQuestionsChange: (count: number) => void;
  maxQuestions?: number;
}

export function DifficultySelector({
  distribution,
  questionType,
  totalQuestions,
  onDistributionChange,
  onQuestionTypeChange,
  onTotalQuestionsChange,
  maxQuestions = 50,
}: DifficultySelectorProps) {
  const currentTotal = distribution.easy + distribution.medium + distribution.hard;

  const updateDifficulty = (
    level: keyof DifficultyDistribution,
    change: number
  ) => {
    const newValue = Math.max(0, distribution[level] + change);
    const newDistribution = { ...distribution, [level]: newValue };
    const newTotal =
      newDistribution.easy + newDistribution.medium + newDistribution.hard;

    if (newTotal <= maxQuestions) {
      onDistributionChange(newDistribution);
      onTotalQuestionsChange(newTotal);
    }
  };

  const setDifficulty = (level: keyof DifficultyDistribution, value: number) => {
    const newDistribution = { ...distribution, [level]: Math.max(0, value) };
    const newTotal =
      newDistribution.easy + newDistribution.medium + newDistribution.hard;

    if (newTotal <= maxQuestions) {
      onDistributionChange(newDistribution);
      onTotalQuestionsChange(newTotal);
    }
  };

  const difficultyLevels: {
    key: keyof DifficultyDistribution;
    label: string;
    color: string;
    bgColor: string;
  }[] = [
    { key: "easy", label: "Easy", color: "text-success", bgColor: "bg-success/10" },
    { key: "medium", label: "Medium", color: "text-warning", bgColor: "bg-warning/10" },
    { key: "hard", label: "Hard", color: "text-destructive", bgColor: "bg-destructive/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Question Type */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Question Type</h3>
          <p className="text-sm text-muted-foreground">
            Choose the type of questions for your test
          </p>
        </div>

        <RadioGroup
          value={questionType}
          onValueChange={(value) => onQuestionTypeChange(value as QuestionType)}
          className="grid gap-3 sm:grid-cols-3"
        >
          {[
            { value: "mcq", label: "Multiple Choice", description: "Select from options" },
            { value: "written", label: "Written", description: "Free-form answers" },
            { value: "mixed", label: "Mixed", description: "Both types" },
          ].map((type) => (
            <label
              key={type.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all hover:bg-accent/50",
                questionType === type.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <RadioGroupItem value={type.value} className="mt-0.5" />
              <div>
                <p className="font-medium">{type.label}</p>
                <p className="text-xs text-muted-foreground">{type.description}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Difficulty Distribution */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Difficulty Distribution</h3>
            <p className="text-sm text-muted-foreground">
              Set the number of questions for each difficulty level
            </p>
          </div>
          <Badge variant="outline" className="text-base">
            Total: {currentTotal}
          </Badge>
        </div>

        <div className="space-y-4">
          {difficultyLevels.map(({ key, label, color, bgColor }) => (
            <div
              key={key}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              {/* Label */}
              <div className="w-24">
                <Badge variant={key as "easy" | "medium" | "hard"}>{label}</Badge>
              </div>

              {/* Counter */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateDifficulty(key, -1)}
                  disabled={distribution[key] === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <Input
                  type="number"
                  min={0}
                  max={maxQuestions}
                  value={distribution[key]}
                  onChange={(e) => setDifficulty(key, parseInt(e.target.value) || 0)}
                  className="w-16 text-center"
                />

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateDifficulty(key, 1)}
                  disabled={currentTotal >= maxQuestions}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress bar */}
              <div className="flex-1">
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full", bgColor.replace("/10", ""))}
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        currentTotal > 0
                          ? `${(distribution[key] / currentTotal) * 100}%`
                          : "0%",
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      backgroundColor:
                        key === "easy"
                          ? "#22c55e"
                          : key === "medium"
                          ? "#eab308"
                          : "#ef4444",
                    }}
                  />
                </div>
              </div>

              {/* Percentage */}
              <div className={cn("w-12 text-right text-sm font-medium", color)}>
                {currentTotal > 0
                  ? Math.round((distribution[key] / currentTotal) * 100)
                  : 0}
                %
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
