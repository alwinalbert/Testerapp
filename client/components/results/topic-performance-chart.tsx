"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopicPerformance } from "@/types";
import { chartRevealVariants } from "@/lib/animations";

interface TopicPerformanceChartProps {
  data: TopicPerformance[];
}

export function TopicPerformanceChart({ data }: TopicPerformanceChartProps) {
  const chartData = data.map((item) => ({
    topic: item.topic.length > 15 ? item.topic.slice(0, 15) + "..." : item.topic,
    fullTopic: item.topic,
    percentage: item.percentage,
    score: item.score,
    maxScore: item.maxScore,
    fill: getBarColor(item.percentage),
  }));

  return (
    <motion.div
      variants={chartRevealVariants}
      initial="initial"
      animate="animate"
    >
      <Card>
        <CardHeader>
          <CardTitle>Performance by Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  fontSize={12}
                />
                <YAxis
                  type="category"
                  dataKey="topic"
                  width={120}
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="percentage"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={30}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-success" />
              <span className="text-muted-foreground">80%+ (Strong)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-warning" />
              <span className="text-muted-foreground">60-79% (Moderate)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-destructive" />
              <span className="text-muted-foreground">&lt;60% (Needs Work)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function getBarColor(percentage: number): string {
  if (percentage >= 80) return "#22c55e"; // success green
  if (percentage >= 60) return "#eab308"; // warning yellow
  return "#ef4444"; // destructive red
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border bg-popover p-3 shadow-lg">
      <p className="font-medium">{data.fullTopic}</p>
      <p className="text-2xl font-bold" style={{ color: data.fill }}>
        {data.percentage}%
      </p>
      <p className="text-sm text-muted-foreground">
        {data.score} / {data.maxScore} marks
      </p>
    </div>
  );
}
