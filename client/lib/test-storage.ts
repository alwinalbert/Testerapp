import { TestResults, RecentTest, DashboardStats } from "@/types";

export interface SubjectStat {
  subjectId: string;
  subjectName: string;
  lastScore: number;       // percentage 0-100
  predictedGrade: string;  // A*, A, B… or 7, 6, 5…
  trend: "up" | "stable" | "down";
  testCount: number;
  isPriority: boolean;     // weakest predicted grade = focus subject
}

function gradeFromPct(pct: number, syllabus?: string): string {
  if (syllabus === "ib") {
    if (pct >= 88) return "7";
    if (pct >= 72) return "6";
    if (pct >= 58) return "5";
    if (pct >= 46) return "4";
    if (pct >= 35) return "3";
    if (pct >= 25) return "2";
    return "1";
  }
  if (pct >= 90) return "A*";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  if (pct >= 40) return "E";
  return "U";
}

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

export function computeSubjectStats(userEmail: string, syllabus?: string): SubjectStat[] {
  const results = getTestResults(userEmail);
  if (results.length === 0) return [];

  // Group by subject
  const subjectMap: Record<string, { name: string; scores: { pct: number; date: Date }[] }> = {};

  for (const r of results) {
    const id = r.testPaper.metadata.subject?.toLowerCase().replace(/\s+/g, "-") || "unknown";
    const name = r.testPaper.metadata.subject || "Unknown";
    if (!subjectMap[id]) subjectMap[id] = { name, scores: [] };
    subjectMap[id].scores.push({ pct: r.percentage, date: new Date(r.completedAt) });
  }

  const stats: SubjectStat[] = Object.entries(subjectMap).map(([id, data]) => {
    const sorted = data.scores.sort((a, b) => a.date.getTime() - b.date.getTime());
    const lastScore = sorted[sorted.length - 1].pct;
    const prevScore = sorted.length >= 2 ? sorted[sorted.length - 2].pct : lastScore;
    const diff = lastScore - prevScore;
    const trend: "up" | "stable" | "down" = diff > 5 ? "up" : diff < -5 ? "down" : "stable";

    return {
      subjectId: id,
      subjectName: data.name,
      lastScore: Math.round(lastScore),
      predictedGrade: gradeFromPct(lastScore, syllabus),
      trend,
      testCount: sorted.length,
      isPriority: false,
    };
  });

  // Mark the weakest predicted grade as priority
  if (stats.length > 0) {
    const weakest = stats.reduce((min, s) => s.lastScore < min.lastScore ? s : min, stats[0]);
    weakest.isPriority = true;
  }

  return stats;
}

export interface ProgressDataPoint {
  name: string;        // "Test 1", "Test 2" …
  date: string;        // "1 Mar"
  [subject: string]: string | number;
}

export function getDailyQuestionsCount(userEmail: string): number {
  const results = getTestResults(userEmail);
  const today = new Date().toDateString();
  return results
    .filter((r) => new Date(r.completedAt).toDateString() === today)
    .reduce((sum, r) => sum + r.testPaper.questions.length, 0);
}

export function getProgressOverTime(userEmail: string): {
  data: ProgressDataPoint[];
  subjects: string[];
} {
  const results = getTestResults(userEmail);
  if (results.length === 0) return { data: [], subjects: [] };

  const sorted = [...results].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );

  const subjectsSet = new Set<string>();
  for (const r of sorted) subjectsSet.add(r.testPaper.metadata.subject || "General");

  const data: ProgressDataPoint[] = sorted.map((r, i) => ({
    name: `#${i + 1}`,
    date: new Date(r.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    [r.testPaper.metadata.subject || "General"]: Math.round(r.percentage),
  }));

  return { data, subjects: Array.from(subjectsSet) };
}

export function computeStreak(userEmail: string): number {
  const results = getTestResults(userEmail);
  if (results.length === 0) return 0;

  const days = new Set(
    results.map((r) => new Date(r.completedAt).toDateString())
  );

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (days.has(d.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}
