"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardStats } from "@/types";
import { SubjectStat } from "@/lib/test-storage";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

interface StatsOverviewProps {
  stats: DashboardStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statItems = [
    {
      label: "Total Tests",
      value: stats.totalTests,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Average Score",
      value: `${stats.averageScore}%`,
      icon: Target,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Questions Answered",
      value: stats.totalQuestions,
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Strongest Topic",
      value: stats.strongestTopic,
      icon: Award,
      color: "text-success",
      bgColor: "bg-success/10",
      isText: true,
    },
  ];

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {statItems.map((item, index) => (
        <motion.div key={item.label} variants={staggerItemVariants}>
          <Card className="border-2 rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className={`text-2xl font-semibold ${item.isText ? "text-base" : ""}`}>
                    {item.value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-lg ${item.bgColor}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color?: string;
  bgColor?: string;
  trend?: { value: number; isPositive: boolean };
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-primary",
  bgColor = "bg-primary/10",
  trend,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${bgColor}`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? "text-success" : "text-destructive"}`}>
              <TrendingUp className={`h-4 w-4 ${!trend.isPositive ? "rotate-180" : ""}`} />
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickInsightsProps {
  strongestTopic: string;
  weakestTopic: string;
}

export function QuickInsights({ strongestTopic, weakestTopic }: QuickInsightsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Quick Insights</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
              <Award className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Strongest topic</p>
              <p className="font-medium">{strongestTopic}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Needs improvement</p>
              <p className="font-medium">{weakestTopic}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Predicted Grades ────────────────────────────────────────────────────────

const gradeColor = (grade: string) => {
  if (["7", "A*", "A"].includes(grade)) return "bg-green-500/10 text-green-600 border-green-500/30";
  if (["6", "5", "B", "C"].includes(grade)) return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
  return "bg-red-500/10 text-red-600 border-red-500/30";
};

const trendLabel = (trend: "up" | "stable" | "down", delta: number) => {
  if (trend === "up") return `+${delta}% improving`;
  if (trend === "down") return `${delta}% declining`;
  return "stable";
};

interface PredictedGradesProps {
  subjectStats: SubjectStat[];
}

export function PredictedGrades({ subjectStats }: PredictedGradesProps) {
  if (subjectStats.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          Predicted Grades
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {subjectStats.map((s) => (
          <div key={s.subjectId} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex items-center gap-1.5">
                {s.isPriority && (
                  <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
                )}
                <p className="text-sm font-medium truncate">{s.subjectName}</p>
              </div>
              <Badge
                variant="outline"
                className={`text-sm font-bold px-2.5 shrink-0 ${gradeColor(s.predictedGrade)}`}
              >
                {s.predictedGrade}
              </Badge>
            </div>

            {/* Prediction message + trajectory */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pl-0.5">
              <span>
                Based on {s.testCount} {s.testCount === 1 ? "test" : "tests"} · avg {s.weightedScore}%
              </span>
              <span
                className={`flex items-center gap-0.5 font-medium ${
                  s.trend === "up"
                    ? "text-green-500"
                    : s.trend === "down"
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {s.trend === "up" && <TrendingUp className="h-3 w-3" />}
                {s.trend === "down" && <TrendingDown className="h-3 w-3" />}
                {s.trend === "stable" && <Minus className="h-3 w-3" />}
                {trendLabel(s.trend, s.trendDelta)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
