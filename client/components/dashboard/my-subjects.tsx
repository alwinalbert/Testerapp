"use client";

import { useState, useEffect } from "react";
import { Plus, X, Lock, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockSubjects } from "@/data/subjects";
import { cn } from "@/lib/utils";

const FREE_SUBJECT_LIMIT = 2;

interface MySubjectsProps {
  userEmail: string;
  onSubjectSelect: (subjectId: string) => void;
}

export function MySubjects({ userEmail, onSubjectSelect }: MySubjectsProps) {
  const [mySubjectIds, setMySubjectIds] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const storageKey = `my_subjects_${userEmail}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setMySubjectIds(JSON.parse(saved));
  }, [storageKey]);

  const saveSubjects = (ids: string[]) => {
    setMySubjectIds(ids);
    localStorage.setItem(storageKey, JSON.stringify(ids));
  };

  const addSubject = (id: string) => {
    if (mySubjectIds.includes(id)) return;
    if (mySubjectIds.length >= FREE_SUBJECT_LIMIT) return;
    saveSubjects([...mySubjectIds, id]);
    setShowPicker(false);
  };

  const removeSubject = (id: string) => {
    saveSubjects(mySubjectIds.filter((s) => s !== id));
  };

  const mySubjects = mockSubjects.filter((s) => mySubjectIds.includes(s.id));
  const availableToAdd = mockSubjects.filter((s) => !mySubjectIds.includes(s.id));
  const atLimit = mySubjectIds.length >= FREE_SUBJECT_LIMIT;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" />
            My Subjects
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {mySubjectIds.length}/{FREE_SUBJECT_LIMIT} free
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Selected subjects */}
        {mySubjects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            No subjects selected yet
          </p>
        ) : (
          <div className="space-y-2">
            {mySubjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors group"
                onClick={() => onSubjectSelect(subject.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{subject.icon}</span>
                  <span className="text-sm font-medium">{subject.name}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeSubject(subject.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add subject button */}
        {!showPicker ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => setShowPicker(true)}
            disabled={atLimit}
          >
            {atLimit ? (
              <>
                <Lock className="h-3.5 w-3.5" />
                Upgrade for more subjects
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Add a subject
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Select a subject to add:</p>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {availableToAdd.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => addSubject(subject.id)}
                  className={cn(
                    "w-full flex items-center gap-2 rounded-lg p-2 text-sm text-left hover:bg-muted transition-colors",
                  )}
                >
                  <span>{subject.icon}</span>
                  <span>{subject.name}</span>
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setShowPicker(false)}
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Upgrade CTA */}
        {atLimit && (
          <p className="text-xs text-center text-muted-foreground">
            <span
              className="text-primary cursor-pointer hover:underline"
              onClick={() => window.location.href = "/pricing"}
            >
              Upgrade to Pro
            </span>{" "}
            to add unlimited subjects
          </p>
        )}
      </CardContent>
    </Card>
  );
}
