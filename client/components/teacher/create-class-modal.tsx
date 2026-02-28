"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EXAM_BOARDS } from "@/data/exam-boards";
import { getSubjectsForBoard } from "@/data/subjects";
import { ExamBoard } from "@/types";

interface CreateClassModalProps {
  onClose: () => void;
  onCreate: (name: string, subject: string, examBoard: ExamBoard) => void;
}

export function CreateClassModal({ onClose, onCreate }: CreateClassModalProps) {
  const [name, setName] = useState("");
  const [examBoard, setExamBoard] = useState<ExamBoard>("cambridge_igcse");
  const [subject, setSubject] = useState("");

  const boards = EXAM_BOARDS.filter((b) => b.id !== "general");
  const subjects = getSubjectsForBoard(examBoard);

  const isValid = name.trim() !== "" && subject !== "";

  const handleCreate = () => {
    if (!isValid) return;
    onCreate(name.trim(), subject, examBoard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Create New Class</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Class name */}
          <div className="space-y-2">
            <Label htmlFor="class-name">Class Name</Label>
            <Input
              id="class-name"
              placeholder="e.g. Grade 10 Mathematics — Period 2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Exam board */}
          <div className="space-y-2">
            <Label>Exam Board</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {boards.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => { setExamBoard(b.id as ExamBoard); setSubject(""); }}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-sm transition-all",
                    examBoard === b.id
                      ? "border-primary bg-primary/10 font-medium"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span>{b.icon}</span>
                  <p className="mt-1 font-medium text-xs">{b.shortName}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label>Subject</Label>
            <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSubject(s.name)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left text-xs transition-all",
                    subject === s.name
                      ? "border-primary bg-primary/10 font-medium"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {s.name}
                  {s.code && <span className="ml-1 text-muted-foreground">({s.code})</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" disabled={!isValid} onClick={handleCreate}>
              Create Class
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
