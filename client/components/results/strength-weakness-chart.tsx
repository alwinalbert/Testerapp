"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopicPerformance } from "@/types";
import { chartRevealVariants } from "@/lib/animations";

interface StrengthWeaknessChartProps {
  data: TopicPerformance[];
  strengths: string[];
  weaknesses: string[];
}

export function StrengthWeaknessChart({
  data,
  strengths,
  weaknesses,
}: StrengthWeaknessChartProps) {
  const radarData = data.map((item) => ({
    topic: item.topic.length > 12 ? item.topic.slice(0, 12) + "..." : item.topic,
    fullTopic: item.topic,
    score: item.percentage,
    fullMark: 100,
  }));

  return (
    <motion.div
      variants={chartRevealVariants}
      initial="initial"
      animate="animate"
    >
      <Card>
        <CardHeader>
          <CardTitle>Skills Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="topic"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                  tickCount={5}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#4285f4"
                  fill="#4285f4"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip content={<RadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-success/30 bg-success/5 p-4">
              <h4 className="font-semibold text-success mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                Strengths
              </h4>
              <ul className="space-y-1 text-sm">
                {strengths.map((strength) => (
                  <li key={strength} className="text-muted-foreground">
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <h4 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                Areas to Improve
              </h4>
              <ul className="space-y-1 text-sm">
                {weaknesses.map((weakness) => (
                  <li key={weakness} className="text-muted-foreground">
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RadarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border bg-popover p-3 shadow-lg">
      <p className="font-medium">{data.fullTopic}</p>
      <p className="text-2xl font-bold text-primary">{data.score}%</p>
    </div>
  );
}

// Score distribution pie chart
interface ScoreDistributionChartProps {
  correct: number;
  incorrect: number;
  unanswered?: number;
}

export function ScoreDistributionChart({
  correct,
  incorrect,
  unanswered = 0,
}: ScoreDistributionChartProps) {
  const data = [
    { name: "Correct", value: correct, color: "#22c55e" },
    { name: "Incorrect", value: incorrect, color: "#ef4444" },
  ];

  if (unanswered > 0) {
    data.push({ name: "Unanswered", value: unanswered, color: "#94a3b8" });
  }

  const total = correct + incorrect + unanswered;

  return (
    <motion.div
      variants={chartRevealVariants}
      initial="initial"
      animate="animate"
    >
      <Card>
        <CardHeader>
          <CardTitle>Answer Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value} (${Math.round((value / total) * 100)}%)`,
                    name,
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
