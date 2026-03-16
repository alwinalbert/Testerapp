"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionHeader } from "@/components/shared/page-header";
import {
  SubjectGrid,
  Filters,
  RecentTests,
  StatsOverview,
  QuickInsights,
} from "@/components/dashboard";
import { mockSubjects } from "@/data/subjects";
import { DashboardFilters } from "@/types";
import { pageVariants } from "@/lib/animations";
import { useAuth } from "@/contexts/auth-context";
import { computeStats, getRecentTests, computeSubjectStats } from "@/lib/test-storage";

export default function DashboardPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [searchQuery, setSearchQuery] = useState("");

  const stats = useMemo(() => computeStats(user?.email || ""), [user?.email]);
  const recentTests = useMemo(() => getRecentTests(user?.email || ""), [user?.email]);
  const subjectStats = useMemo(
    () => computeSubjectStats(user?.email || "", user?.syllabus),
    [user?.email, user?.syllabus]
  );

  const filteredSubjects = useMemo(() => {
    return mockSubjects.filter((subject) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = subject.name.toLowerCase().includes(query);
        const matchesDescription = subject.description.toLowerCase().includes(query);
        const matchesTopics = subject.topics.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDescription && !matchesTopics) return false;
      }
      if (filters.subject && subject.id !== filters.subject) return false;
      return true;
    });
  }, [searchQuery, filters]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <PageHeader
        title="Dashboard"
        description={`Welcome back${user?.name ? `, ${user.name}` : ""}! Continue your learning journey.`}
      />

      <StatsOverview stats={stats} />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Subjects Section */}
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader
            title="Browse Subjects"
            description="Select a subject to start a new test"
          />
          <Filters
            subjects={mockSubjects}
            filters={filters}
            onFiltersChange={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          {filteredSubjects.length > 0 ? (
            <SubjectGrid subjects={filteredSubjects} subjectStats={subjectStats} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-2">No subjects match your filters</p>
              <Button variant="link" onClick={() => { setFilters({}); setSearchQuery(""); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <QuickInsights
            strongestTopic={stats.strongestTopic}
            weakestTopic={stats.weakestTopic}
          />
          <RecentTests tests={recentTests} />
        </div>
      </div>
    </motion.div>
  );
}
