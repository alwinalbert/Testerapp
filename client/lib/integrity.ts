/**
 * Academic Integrity Utilities — Tier 1 Passive (Always On)
 *
 * - seededShuffle: deterministic shuffle using question_id as seed
 *   (same student, same question → same order; different question_id → different order)
 * - generateAttemptId: unique session ID per test attempt
 * - FAST_ANSWER_THRESHOLD_SECONDS: flag suspiciously quick answers for teacher review
 */

// ── Seeded PRNG (xorshift32) ───────────────────────────────────────────────────
function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  // xorshift to avoid low-entropy starting state
  h ^= h << 13;
  h ^= h >> 17;
  h ^= h << 5;

  return () => {
    h ^= h << 13;
    h ^= h >> 17;
    h ^= h << 5;
    return (h >>> 0) / 0xffffffff;
  };
}

/** Shuffle an array deterministically using `seed`. Same seed = same order always. */
export function seededShuffle<T>(arr: T[], seed: string): T[] {
  const result = [...arr];
  const rand = seededRandom(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Generate a unique attempt ID for each test session. */
export function generateAttemptId(testPaperId: string): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${testPaperId}_${ts}_${rand}`;
}

/**
 * Minimum seconds a student should spend on a question before an answer
 * is considered suspiciously fast. Used per-mark: 3s × marks.
 */
export const FAST_ANSWER_SECONDS_PER_MARK = 3;

export function isSuspiciouslyFast(
  timeSpentSeconds: number,
  marks: number
): boolean {
  const threshold = Math.max(5, marks * FAST_ANSWER_SECONDS_PER_MARK);
  return timeSpentSeconds < threshold && timeSpentSeconds > 0;
}
