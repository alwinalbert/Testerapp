"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  Atom,
  Landmark,
  Globe,
  Code,
  TrendingUp,
  TrendingDown,
  Minus,
  LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Subject } from "@/types";
import { cardVariants } from "@/lib/animations";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Calculator,
  Atom,
  Landmark,
  Globe,
  Code,
};

interface SubjectCardProps {
  subject: Subject;
  index?: number;
  predictedGrade?: string;
  lastScore?: number;
  trend?: "up" | "stable" | "down";
  isPriority?: boolean;
}

const TrendIcon = ({ trend }: { trend?: "up" | "stable" | "down" }) => {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  if (trend === "stable") return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  return null;
};

export function SubjectCard({ subject, index = 0, predictedGrade, lastScore, trend, isPriority }: SubjectCardProps) {
  const Icon = iconMap[subject.icon] || BookOpen;
  const hasPerformance = predictedGrade !== undefined;

  return (
    <Link href={`/dashboard/test-builder?subject=${subject.id}`}>
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        transition={{ delay: index * 0.05 }}
      >
        <Card className={`cursor-pointer h-full transition-all hover:shadow-md border-2 rounded-xl ${isPriority ? "border-orange-300 dark:border-orange-800" : ""}`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${subject.color}15` }}
              >
                <Icon className="h-6 w-6" style={{ color: subject.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg truncate">{subject.name}</h3>
                  {isPriority && (
                    <span className="shrink-0 text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 rounded-full px-2 py-0.5">
                      Focus
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {subject.description}
                </p>
              </div>
            </div>

            {/* Performance row — shown when the student has test history */}
            {hasPerformance && (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Predicted</p>
                  <p className="font-bold text-base">{predictedGrade}</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Last score</p>
                  <p className="font-semibold text-sm">{lastScore}%</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <TrendIcon trend={trend} />
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{subject.questionCount} questions</Badge>
              <Badge variant="outline">{subject.topics.length} topics</Badge>
            </div>

            {/* Topics preview */}
            <div className="mt-3 flex flex-wrap gap-1">
              {subject.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded"
                >
                  {topic}
                </span>
              ))}
              {subject.topics.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{subject.topics.length - 3} more
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

// Compact version for smaller displays
export function SubjectCardCompact({ subject }: { subject: Subject }) {
  const Icon = iconMap[subject.icon] || BookOpen;

  return (
    <Link href={`/dashboard/test-builder?subject=${subject.id}`}>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${subject.color}15` }}
            >
              <Icon className="h-5 w-5" style={{ color: subject.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{subject.name}</h3>
              <p className="text-xs text-muted-foreground">
                {subject.questionCount} questions
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
