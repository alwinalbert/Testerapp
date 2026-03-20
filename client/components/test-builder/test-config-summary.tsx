"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Tag,
  BarChart3,
  Clock,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TestConfig, Subject } from "@/types";
import { cardVariants } from "@/lib/animations";

interface TestConfigSummaryProps {
  config: TestConfig;
  subject: Subject | undefined;
  onStartTest: () => void;
  isValid: boolean;
  isLoading?: boolean;
}

export function TestConfigSummary({
  config,
  subject,
  onStartTest,
  isValid,
  isLoading,
}: TestConfigSummaryProps) {
  const totalQuestions = config.numberOfQuestions;
  const estimatedTime = Math.max(15, totalQuestions * 3); // ~3 min per question

  const validationErrors: string[] = [];
  if (!config.subject) validationErrors.push("Select a subject");
  if (config.topics.length === 0) validationErrors.push("Select at least one topic");
  if (totalQuestions === 0) validationErrors.push("Add at least one question");

  return (
    <motion.div variants={cardVariants} initial="initial" animate="animate">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Test Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subject */}
          <div className="flex items-start gap-3">
            <BookOpen className="h-4 w-4 mt-1 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Subject</p>
              <p className="font-medium">
                {subject?.name || (
                  <span className="text-muted-foreground italic">
                    Not selected
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Topics */}
          <div className="flex items-start gap-3">
            <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Topics</p>
              {config.topics.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {config.topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {config.topics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{config.topics.length - 3} more
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground italic">None selected</p>
              )}
            </div>
          </div>

          {/* Question Type */}
          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Question Type</p>
              <p className="font-medium capitalize">{config.questionType}</p>
            </div>
          </div>

          <Separator />

          {/* Difficulty Breakdown */}
          <div className="flex items-start gap-3">
            <BarChart3 className="h-4 w-4 mt-1 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-2">
                Difficulty Breakdown
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    Easy
                  </span>
                  <span className="font-medium">{config.difficulty.easy}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-warning" />
                    Medium
                  </span>
                  <span className="font-medium">{config.difficulty.medium}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-destructive" />
                    Hard
                  </span>
                  <span className="font-medium">{config.difficulty.hard}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-2xl font-bold">{totalQuestions}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-2xl font-bold">{estimatedTime}</p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Floating bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          {/* Summary pills */}
          <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground min-w-0">
            {isValid ? (
              <>
                <span className="font-medium text-foreground truncate">{subject?.name}</span>
                <span className="text-border">·</span>
                <span>{totalQuestions} questions</span>
                <span className="text-border">·</span>
                <span>{estimatedTime} min</span>
              </>
            ) : (
              <span className="text-xs">
                {validationErrors[0]}
              </span>
            )}
          </div>

          {/* Start button */}
          <Button
            size="lg"
            onClick={onStartTest}
            disabled={!isValid || isLoading}
            className="shrink-0 gap-2 px-8 rounded-full"
          >
            {isLoading ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Start Test
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
