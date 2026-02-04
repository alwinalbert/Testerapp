"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Target,
  TrendingUp,
  Award,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardStats } from "@/types";
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

// Single stat card for flexibility
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color?: string;
  bgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
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
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${bgColor}`}
            >
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm ${
                trend.isPositive ? "text-success" : "text-destructive"
              }`}
            >
              <TrendingUp
                className={`h-4 w-4 ${
                  !trend.isPositive ? "rotate-180" : ""
                }`}
              />
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Quick insights section
interface QuickInsightsProps {
  strongestTopic: string;
  weakestTopic: string;
}

export function QuickInsights({
  strongestTopic,
  weakestTopic,
}: QuickInsightsProps) {
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
