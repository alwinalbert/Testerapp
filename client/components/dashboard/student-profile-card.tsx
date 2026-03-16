"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Clock, BookOpen, AlertTriangle } from "lucide-react";
import type { SubjectStat } from "@/lib/test-storage";

interface StudentProfileCardProps {
  name: string;
  school?: string;
  syllabus?: string;
  yearGroup?: string;
  targetExamSession?: string;
  weakestTopic: string;
  streak: number;
  totalQuestions: number;
  subjectStats: SubjectStat[];
}

function daysUntilSession(session?: string): number | null {
  if (!session) return null;
  const [month, year] = session.split(" ");
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const m = months[month];
  if (m === undefined || !year) return null;
  // Use the 15th of the month as the target date
  const target = new Date(parseInt(year), m, 15);
  const diff = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

function syllabusLabel(s?: string): string {
  const map: Record<string, string> = {
    cambridge: "Cambridge IGCSE",
    edexcel: "Edexcel",
    ib: "IB Diploma",
    ap: "AP",
    national: "National Curriculum",
    other: "Other",
  };
  return s ? (map[s] ?? s) : "—";
}

export function StudentProfileCard({
  name,
  school,
  syllabus,
  yearGroup,
  targetExamSession,
  weakestTopic,
  streak,
  totalQuestions,
  subjectStats,
}: StudentProfileCardProps) {
  const daysLeft = useMemo(() => daysUntilSession(targetExamSession), [targetExamSession]);
  const prioritySubject = subjectStats.find((s) => s.isPriority);

  return (
    <Card className="border-2">
      <CardContent className="p-5 space-y-4">

        {/* Profile Header */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold text-lg leading-tight">{name}</h2>
              {school && <p className="text-xs text-muted-foreground">{school}</p>}
            </div>
            {daysLeft !== null && (
              <div className="flex items-center gap-1 shrink-0 rounded-full bg-primary/10 px-2.5 py-1">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">{daysLeft}d</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {yearGroup && (
              <Badge variant="secondary" className="text-xs">{yearGroup}</Badge>
            )}
            {syllabus && (
              <Badge variant="outline" className="text-xs">{syllabusLabel(syllabus)}</Badge>
            )}
            {targetExamSession && (
              <Badge variant="outline" className="text-xs">{targetExamSession}</Badge>
            )}
          </div>
        </div>

        {/* Motivation layer */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-lg font-bold">{streak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Day streak</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold">{totalQuestions}</span>
            </div>
            <p className="text-xs text-muted-foreground">Questions done</p>
          </div>
        </div>

        {/* Priority subject */}
        {prioritySubject && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 p-3 space-y-1">
            <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide">
              Focus here this week
            </p>
            <p className="font-medium text-sm">{prioritySubject.subjectName}</p>
            <p className="text-xs text-muted-foreground">
              Predicted grade: <span className="font-semibold">{prioritySubject.predictedGrade}</span>
              {" · "}{prioritySubject.lastScore}% last score
            </p>
          </div>
        )}

        {/* Weakest topic */}
        {weakestTopic && weakestTopic !== "N/A" && (
          <div className="flex items-start gap-2.5 rounded-lg border p-3">
            <div className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            </div>
            <div>
              <p className="text-xs font-semibold text-destructive uppercase tracking-wide">Your weakest topic right now</p>
              <p className="text-sm font-medium mt-0.5">{weakestTopic}</p>
              <p className="text-xs text-muted-foreground">Revise this before your next test</p>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
