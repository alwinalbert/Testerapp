"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TestContainer } from "@/components/test";
import { PageLoader } from "@/components/shared/loading-spinner";
import { TestPaper } from "@/types";
import { mockTestPaper } from "@/data/mock";

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
          const parsed = JSON.parse(storedTest);
          setTestPaper(parsed);
          setLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse stored test:", e);
        }
      }

      // Fallback to mock test
      // In production, this would fetch from the API using testId
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTestPaper(mockTestPaper);
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
