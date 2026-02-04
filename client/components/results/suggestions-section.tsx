"use client";

import { motion } from "framer-motion";
import { Lightbulb, BookOpen, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

interface SuggestionsSectionProps {
  suggestions: string[];
  weakTopics?: string[];
  subjectId?: string;
}

export function SuggestionsSection({
  suggestions,
  weakTopics = [],
  subjectId,
}: SuggestionsSectionProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Improvement Suggestions */}
      <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground">{suggestion}</p>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommended Actions */}
      <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Practice weak topics */}
              {weakTopics.length > 0 && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">Focus on Weak Areas</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Practice questions from: {weakTopics.join(", ")}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/test-builder${subjectId ? `?subject=${subjectId}` : ""}`}
                    >
                      Create Practice Test
                    </Link>
                  </Button>
                </div>
              )}

              {/* Take another test */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">Track Your Progress</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Take more tests to monitor your improvement over time.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/test-builder">New Test</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Links */}
      <motion.div variants={staggerItemVariants}>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/test-builder">Create New Test</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/history">View Test History</Link>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
