"use client";

import { useState } from "react";
import { Clock, BookOpen, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  PastPaper,
  getSubjectsForBoard,
  getPapersBySubject,
} from "@/data/past-papers";
import { ExamBoard } from "@/types";

interface PaperSelectorProps {
  examBoard: ExamBoard;
  selectedPaper: PastPaper | null;
  selectedSession: string;
  onPaperChange: (paper: PastPaper | null) => void;
  onSessionChange: (session: string) => void;
}

const questionTypeLabel: Record<string, string> = {
  multiple_choice: "MCQ",
  short_answer: "Short Answer",
  essay: "Essay",
  mixed: "Mixed",
};

export function PaperSelector({
  examBoard,
  selectedPaper,
  selectedSession,
  onPaperChange,
  onSessionChange,
}: PaperSelectorProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>(
    selectedPaper?.subject ?? ""
  );

  const subjects = getSubjectsForBoard(examBoard);
  const papers = selectedSubject
    ? getPapersBySubject(examBoard, selectedSubject)
    : [];

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
    onPaperChange(null);
    onSessionChange("");
  };

  return (
    <div className="space-y-6">
      {/* Subject */}
      <div>
        <p className="text-sm font-semibold mb-2">Select Subject</p>
        {subjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No past papers available for this exam board yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => handleSubjectClick(subject)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                  selectedSubject === subject
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                )}
              >
                {subject}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Paper */}
      {selectedSubject && papers.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-3">Select Paper</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {papers.map((paper) => (
              <Card
                key={paper.id}
                onClick={() => {
                  onPaperChange(paper);
                  onSessionChange("");
                }}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedPaper?.id === paper.id
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/40"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-snug">
                        {paper.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                        {paper.code}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 tabular-nums">
                      {paper.totalMarks}m
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {paper.totalDuration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {paper.sections.length} section
                      {paper.sections.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-1 border-t pt-2">
                    {paper.sections.map((section) => (
                      <div
                        key={section.name}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-muted-foreground truncate flex-1 mr-2">
                          {section.name}
                        </span>
                        <span className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {questionTypeLabel[section.questionType]}
                          </Badge>
                          {section.questionCount}q · {section.marks}m
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Session */}
      {selectedPaper && (
        <div>
          <p className="text-sm font-semibold mb-2">Select Session</p>
          <div className="flex flex-wrap gap-2">
            {selectedPaper.sessions.map((session) => (
              <button
                key={session}
                onClick={() => onSessionChange(session)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                  selectedSession === session
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                )}
              >
                {session}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirm summary */}
      {selectedPaper && selectedSession && (
        <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-primary">
              {selectedPaper.name} — {selectedSession}
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">
              {selectedPaper.totalDuration} min &middot;{" "}
              {selectedPaper.totalMarks} marks &middot;{" "}
              {selectedPaper.sections.reduce(
                (sum, s) => sum + s.questionCount,
                0
              )}{" "}
              questions
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
