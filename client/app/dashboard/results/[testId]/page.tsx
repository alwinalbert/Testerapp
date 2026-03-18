"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/loading-spinner";
import {
  ScoreSummary,
  QuestionReview,
  TopicPerformanceChart,
  StrengthWeaknessChart,
  SuggestionsSection,
  GradeBoundaryPanel,
  ResultActions,
} from "@/components/results";
import { ExamBoard } from "@/types";
import { TestResults } from "@/types";
import { mockTestResults } from "@/data/mock";
import { pageVariants } from "@/lib/animations";

interface ResultsPageProps {
  params: Promise<{ testId: string }>;
}

export default function ResultsPage(_: ResultsPageProps) {
  const router = useRouter();
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      // Try to get results from sessionStorage (from test submission)
      const storedResults = sessionStorage.getItem("testResults");

      if (storedResults) {
        try {
          const parsed = JSON.parse(storedResults);
          setResults(parsed);
          setLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse stored results:", e);
        }
      }

      // Fallback to mock results
      await new Promise((resolve) => setTimeout(resolve, 500));
      setResults(mockTestResults);
      setLoading(false);
    };

    loadResults();
  }, []);

  if (loading) {
    return <PageLoader message="Loading your results..." />;
  }

  if (!results) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Results Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The results you&apos;re looking for don&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-primary hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Get weak topics for suggestions
  const weakTopics = results.topicPerformance
    .filter((t) => t.percentage < 70)
    .map((t) => t.topic);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8 pb-12"
    >
      <PageHeader
        title="Test Results"
        description={results.testPaper.metadata.title}
        actions={
          <ResultActions
            testTitle={results.testPaper.metadata.title}
            percentage={results.percentage}
            grade={results.testPaper.metadata.targetGrade}
            results={results}
          />
        }
      />

      {/* Score Summary */}
      <ScoreSummary results={results} />

      {/* Grade Boundary Panel — shown when exam board is recorded */}
      {results.testPaper.metadata.examBoard && (
        <GradeBoundaryPanel
          percentage={results.percentage}
          examBoard={results.testPaper.metadata.examBoard as ExamBoard}
          targetGrade={results.testPaper.metadata.targetGrade}
        />
      )}

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopicPerformanceChart data={results.topicPerformance} />
        <StrengthWeaknessChart
          data={results.topicPerformance}
          strengths={results.strengths}
          weaknesses={results.weaknesses}
        />
      </div>

      {/* Question Review */}
      <QuestionReview results={results} />

      {/* Book a Tutor CTA — shown when score is below 60% */}
      {results.percentage < 60 && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">🎓</div>
          <div className="flex-1">
            <p className="font-semibold">Struggling with this topic?</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Book a 1-to-1 session with a qualified tutor on the Edukko marketplace — tailored to your syllabus and weak areas.
            </p>
          </div>
          <a
            href="https://edukko.ae"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Find a Tutor →
          </a>
        </div>
      )}

      {/* Suggestions */}
      <SuggestionsSection
        suggestions={results.suggestions}
        weakTopics={weakTopics}
        subjectId={
          results.testPaper.metadata.subject === "English Language Arts"
            ? "english"
            : undefined
        }
      />
    </motion.div>
  );
}
