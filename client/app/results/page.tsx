"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { RecentTests } from "@/components/dashboard";
import { pageVariants } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { getRecentTests } from "@/lib/test-storage";

export default function ResultsIndexPage() {
  const router = useRouter();
  const { user } = useAuth();
  const recentTests = useMemo(() => getRecentTests(user?.email || "", 50), [user?.email]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <PageHeader
        title="Test Results"
        description="View all your completed test results"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Results" },
        ]}
      />

      <div className="max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Tests</h3>
            {recentTests.length > 0 ? (
              <div className="space-y-3">
                {recentTests.map((test) => (
                  <div
                    key={test.id}
                    onClick={() => router.push(`/results/${test.id}`)}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{test.subject}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(test.completedAt).toLocaleDateString()} • {test.questionsCount} questions
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{test.percentage}%</div>
                      <p className="text-xs text-muted-foreground">
                        {test.score}/{test.maxScore} points
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't taken any tests yet.
                </p>
                <button
                  onClick={() => router.push("/test-builder")}
                  className="text-primary hover:underline"
                >
                  Create your first test
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
