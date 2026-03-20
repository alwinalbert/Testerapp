"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TestContainer } from "@/components/test";
import { PageLoader } from "@/components/shared/loading-spinner";
import { TestPaper } from "@/types";
import { mockTestPaper } from "@/data/mock";
import { seededShuffle, generateAttemptId } from "@/lib/integrity";

interface TestPageProps {
  params: Promise<{ testId: string }>;
}

export default function TestPage({ params }: TestPageProps) {
  const router = useRouter();
  const [testPaper, setTestPaper] = useState<TestPaper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTest = async () => {
      // Try to get test from sessionStorage (from test builder)
      const storedTest = sessionStorage.getItem("currentTest");

      if (storedTest) {
        try {
          const parsed: TestPaper = JSON.parse(storedTest);

          // ── Integrity: unique attempt ID per session ──────────────────────
          parsed.id = generateAttemptId(parsed.id);

          // ── Integrity: question randomisation ─────────────────────────────
          // Shuffle using attempt ID as seed → every attempt has a unique order
          const shuffled = seededShuffle(parsed.questions, parsed.id);
          parsed.questions = shuffled.map((q, i) => ({
            ...q,
            question_number: i + 1,
          }));

          setTestPaper(parsed);
          setLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse stored test:", e);
        }
      }

      // Fallback to mock test
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mock = { ...mockTestPaper, id: generateAttemptId(mockTestPaper.id) };
      mock.questions = seededShuffle(mock.questions, mock.id).map((q, i) => ({
        ...q,
        question_number: i + 1,
      }));
      setTestPaper(mock);
      setLoading(false);
    };

    loadTest();
  }, []);

  if (loading) {
    return <PageLoader message="Loading your test..." />;
  }

  if (!testPaper) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Test Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The test you&apos;re looking for doesn&apos;t exist.
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

  return <TestContainer testPaper={testPaper} />;
}
