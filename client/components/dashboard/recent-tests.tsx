"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ChevronRight, Trophy, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RecentTest } from "@/types";
import { formatDate, getScoreColor } from "@/lib/utils";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

interface RecentTestsProps {
  tests: RecentTest[];
}

export function RecentTests({ tests }: RecentTestsProps) {
  if (tests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">No tests yet</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Start your first test to see your progress here
          </p>
          <Button asChild>
            <Link href="/test-builder">Create Your First Test</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Tests</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/history" className="gap-1">
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {tests.map((test) => (
            <RecentTestItem key={test.id} test={test} />
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}

function RecentTestItem({ test }: { test: RecentTest }) {
  const scoreColor = getScoreColor(test.percentage);

  return (
    <motion.div variants={staggerItemVariants}>
      <Link href={`/results/${test.id}`}>
        <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50">
          {/* Score Circle */}
          <div className="relative h-12 w-12 shrink-0">
            <svg className="h-12 w-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-muted"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${(test.percentage / 100) * 126} 126`}
                className={scoreColor}
              />
            </svg>
            <span
              className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${scoreColor}`}
            >
              {test.percentage}%
            </span>
          </div>

          {/* Test Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium truncate">{test.title}</h4>
              {test.percentage >= 80 && (
                <Trophy className="h-4 w-4 text-warning shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span>{test.subject}</span>
              <span className="text-border">|</span>
              <span>{test.questionsCount} questions</span>
            </div>
          </div>

          {/* Date */}
          <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatDate(test.completedAt)}
          </div>

          {/* Arrow */}
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}

// Compact list version
export function RecentTestsList({ tests }: { tests: RecentTest[] }) {
  return (
    <div className="divide-y">
      {tests.map((test) => (
        <Link
          key={test.id}
          href={`/results/${test.id}`}
          className="flex items-center justify-between py-3 hover:bg-accent/50 -mx-2 px-2 rounded transition-colors"
        >
          <div className="min-w-0">
            <p className="font-medium truncate">{test.title}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(test.completedAt)}
            </p>
          </div>
          <Badge
            variant={
              test.percentage >= 80
                ? "success"
                : test.percentage >= 60
                ? "warning"
                : "destructive"
            }
          >
            {test.percentage}%
          </Badge>
        </Link>
      ))}
    </div>
  );
}
