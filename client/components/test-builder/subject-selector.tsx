"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Calculator,
  Atom,
  Landmark,
  Globe,
  Code,
  LucideIcon,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Subject } from "@/types";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Calculator,
  Atom,
  Landmark,
  Globe,
  Code,
};

interface SubjectSelectorProps {
  subjects: Subject[];
  selectedSubject: string | null;
  onSelect: (subjectId: string) => void;
}

export function SubjectSelector({
  subjects,
  selectedSubject,
  onSelect,
}: SubjectSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Select Subject</h3>
        <p className="text-sm text-muted-foreground">
          Choose the subject you want to be tested on
        </p>
      </div>

      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {subjects.map((subject) => {
          const Icon = iconMap[subject.icon] || BookOpen;
          const isSelected = selectedSubject === subject.id;

          return (
            <motion.button
              key={subject.id}
              variants={staggerItemVariants}
              onClick={() => onSelect(subject.id)}
              className={cn(
                "relative flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all hover:shadow-md",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50"
              )}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors",
                  isSelected ? "bg-primary/10" : "bg-muted"
                )}
                style={
                  isSelected ? { backgroundColor: `${subject.color}20` } : {}
                }
              >
                <Icon
                  className="h-6 w-6"
                  style={isSelected ? { color: subject.color } : {}}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium">{subject.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {subject.questionCount} questions
                </p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
