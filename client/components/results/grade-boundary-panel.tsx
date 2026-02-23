"use client";

import { motion } from "framer-motion";
import { TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getExamBoard,
  getGradeForScore,
  getNextGrade,
  type ExamBoard,
} from "@/data/exam-boards";
import { cn } from "@/lib/utils";

interface GradeBoundaryPanelProps {
  percentage: number;
  examBoard: ExamBoard;
  targetGrade?: string;
}

export function GradeBoundaryPanel({
  percentage,
  examBoard,
  targetGrade,
}: GradeBoundaryPanelProps) {
  const board = getExamBoard(examBoard);
  const achieved = getGradeForScore(examBoard, percentage);
  const next = getNextGrade(examBoard, achieved.grade);

  const marksToNext = next ? next.minPercentage - percentage : 0;
  const metTarget =
    targetGrade && board.gradeBoundaries.findIndex((b) => b.grade === targetGrade) <=
    board.gradeBoundaries.findIndex((b) => b.grade === achieved.grade);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Award className="h-5 w-5 text-primary" />
          Grade Boundary — {board.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Current grade callout */}
        <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
          <div>
            <p className="text-sm text-muted-foreground">You achieved</p>
            <p className="text-3xl font-extrabold" style={{ color: achieved.color }}>
              Grade {achieved.grade}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">{achieved.description}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{percentage}%</p>
            {targetGrade && (
              <Badge
                className="mt-1"
                variant={metTarget ? "default" : "secondary"}
              >
                {metTarget ? `Target ${targetGrade} met ✓` : `Target: ${targetGrade}`}
              </Badge>
            )}
          </div>
        </div>

        {/* Grade boundary bar */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Grade Boundaries
          </p>
          <div className="relative h-8 w-full rounded-full overflow-hidden flex">
            {board.gradeBoundaries
              .slice()
              .reverse() // render lowest first (left) → highest (right)
              .map((boundary, i, arr) => {
                const next = arr[i + 1];
                const width = next
                  ? next.minPercentage - boundary.minPercentage
                  : 100 - boundary.minPercentage;
                return (
                  <motion.div
                    key={boundary.grade}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative flex items-center justify-center text-white text-[11px] font-bold"
                    style={{ width: `${width}%`, backgroundColor: boundary.color }}
                    title={`Grade ${boundary.grade}: ≥${boundary.minPercentage}%`}
                  >
                    {width >= 8 ? boundary.grade : ""}
                  </motion.div>
                );
              })}
            {/* Score marker */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md"
              style={{ left: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          {/* Labels */}
          <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Next grade nudge */}
        {next && marksToNext > 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-dashed p-3 bg-muted/20">
            <TrendingUp className="h-4 w-4 shrink-0" style={{ color: next.color }} />
            <p className="text-sm">
              <span className="font-semibold" style={{ color: next.color }}>
                {marksToNext}% more
              </span>{" "}
              would reach{" "}
              <span className="font-semibold">Grade {next.grade}</span> ({next.description})
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg border border-dashed p-3 bg-muted/20">
            <Award className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm font-semibold text-primary">
              Top grade achieved — outstanding work!
            </p>
          </div>
        )}

        {/* All boundaries legend */}
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {board.gradeBoundaries.map((b) => (
            <div
              key={b.grade}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs",
                achieved.grade === b.grade ? "ring-2 ring-offset-1" : ""
              )}
              style={
                achieved.grade === b.grade
                  ? { backgroundColor: b.color + "22" }
                  : {}
              }
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: b.color }}
              />
              <span className="font-semibold">{b.grade}</span>
              <span className="text-muted-foreground">≥{b.minPercentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
