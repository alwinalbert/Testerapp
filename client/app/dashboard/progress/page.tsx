"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getProgressOverTime, computeSubjectStats } from "@/lib/test-storage";
import { pageVariants } from "@/lib/animations";

const LINE_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

const TrendIcon = ({ trend }: { trend: "up" | "stable" | "down" }) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

export default function ProgressPage() {
  const { user } = useAuth();
  const { data, subjects } = useMemo(
    () => getProgressOverTime(user?.email || ""),
    [user?.email]
  );
  const subjectStats = useMemo(
    () => computeSubjectStats(user?.email || "", user?.syllabus),
    [user?.email, user?.syllabus]
  );

  const isEmpty = data.length === 0;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <PageHeader
        title="Progress"
        description="Track your score trend across all subjects over time."
      />

      {/* Subject summary cards */}
      {subjectStats.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {subjectStats.map((s) => (
            <Card key={s.subjectId}>
              <CardContent className="p-4 space-y-1">
                <p className="text-xs text-muted-foreground truncate">{s.subjectName}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{s.lastScore}%</span>
                  <TrendIcon trend={s.trend} />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Grade {s.predictedGrade}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{s.testCount} test{s.testCount !== 1 ? "s" : ""}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Line chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <p className="font-medium">No tests yet</p>
              <p className="text-sm mt-1">Complete a test to start tracking your progress.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => [`${value ?? 0}%`, String(name ?? "")]}
                  labelFormatter={(label, payload) => {
                    const pt = payload?.[0]?.payload;
                    return pt ? `${label} · ${pt.date}` : label;
                  }}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Pass", position: "right", fontSize: 11 }} />
                <ReferenceLine y={80} stroke="#10b981" strokeDasharray="4 4" label={{ value: "A grade", position: "right", fontSize: 11 }} />
                {subjects.map((subject, i) => (
                  <Line
                    key={subject}
                    type="monotone"
                    dataKey={subject}
                    stroke={LINE_COLORS[i % LINE_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
