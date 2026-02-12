import { TestResults, RecentTest, DashboardStats } from "@/types";

const STORAGE_PREFIX = "testprep-results-";

function getStorageKey(userEmail: string): string {
  return `${STORAGE_PREFIX}${userEmail}`;
}

export function saveTestResult(userEmail: string, result: TestResults): void {
  const key = getStorageKey(userEmail);
  const existing = getTestResults(userEmail);

  // Avoid duplicates by testId
  const filtered = existing.filter((r) => r.testId !== result.testId);
  filtered.push(result);

  localStorage.setItem(key, JSON.stringify(filtered));
}

export function getTestResults(userEmail: string): TestResults[] {
  if (typeof window === "undefined") return [];

  const key = getStorageKey(userEmail);
  const stored = localStorage.getItem(key);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return parsed.map((r: TestResults) => ({
      ...r,
      completedAt: new Date(r.completedAt),
      testPaper: {
        ...r.testPaper,
        createdAt: new Date(r.testPaper.createdAt),
      },
    }));
  } catch {
    return [];
  }
}

export function getRecentTests(userEmail: string, limit = 5): RecentTest[] {
  const results = getTestResults(userEmail);

  return results
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, limit)
    .map((r) => ({
      id: r.testId,
      title: r.testPaper.metadata.title,
      subject: r.testPaper.metadata.subject,
      score: r.totalScore,
      maxScore: r.maxScore,
      percentage: r.percentage,
      completedAt: new Date(r.completedAt),
      questionsCount: r.testPaper.questions.length,
    }));
}

export function computeStats(userEmail: string): DashboardStats {
  const results = getTestResults(userEmail);

  if (results.length === 0) {
    return {
      totalTests: 0,
      averageScore: 0,
      totalQuestions: 0,
      strongestTopic: "N/A",
      weakestTopic: "N/A",
    };
  }

  const totalTests = results.length;
  const averageScore = Math.round(
    results.reduce((sum, r) => sum + r.percentage, 0) / totalTests
  );
  const totalQuestions = results.reduce(
    (sum, r) => sum + r.testPaper.questions.length,
    0
  );

  // Aggregate topic performance across all tests
  const topicMap: Record<string, { score: number; maxScore: number }> = {};

  for (const result of results) {
    for (const tp of result.topicPerformance) {
      if (!topicMap[tp.topic]) {
        topicMap[tp.topic] = { score: 0, maxScore: 0 };
      }
      topicMap[tp.topic].score += tp.score;
      topicMap[tp.topic].maxScore += tp.maxScore;
    }
  }

  const topics = Object.entries(topicMap)
    .map(([topic, data]) => ({
      topic,
      percentage: data.maxScore > 0 ? (data.score / data.maxScore) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const strongestTopic = topics.length > 0 ? topics[0].topic : "N/A";
  const weakestTopic =
    topics.length > 0 ? topics[topics.length - 1].topic : "N/A";

  return {
    totalTests,
    averageScore,
    totalQuestions,
    strongestTopic,
    weakestTopic,
  };
}
