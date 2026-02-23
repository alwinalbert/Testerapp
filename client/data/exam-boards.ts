// Exam board and grade boundary data

export type ExamBoard =
  | "cambridge_igcse"
  | "edexcel_igcse"
  | "ib_diploma"
  | "a_levels"
  | "general";

export interface GradeBoundary {
  grade: string;
  minPercentage: number;
  color: string;
  description: string;
}

export interface ExamBoardInfo {
  id: ExamBoard;
  name: string;
  shortName: string;
  description: string;
  icon: string; // emoji
  gradeBoundaries: GradeBoundary[]; // sorted highest → lowest
  targetGrades: string[];
}

export const EXAM_BOARDS: ExamBoardInfo[] = [
  {
    id: "cambridge_igcse",
    name: "Cambridge IGCSE",
    shortName: "IGCSE",
    description: "Cambridge International GCSE — Grades A* to G",
    icon: "🎓",
    gradeBoundaries: [
      { grade: "A*", minPercentage: 90, color: "#8b5cf6", description: "Outstanding" },
      { grade: "A",  minPercentage: 80, color: "#3b82f6", description: "Excellent" },
      { grade: "B",  minPercentage: 70, color: "#22c55e", description: "Good" },
      { grade: "C",  minPercentage: 60, color: "#eab308", description: "Satisfactory" },
      { grade: "D",  minPercentage: 50, color: "#f97316", description: "Limited" },
      { grade: "E",  minPercentage: 40, color: "#ef4444", description: "Very Limited" },
      { grade: "U",  minPercentage: 0,  color: "#6b7280", description: "Ungraded" },
    ],
    targetGrades: ["A*", "A", "B", "C"],
  },
  {
    id: "edexcel_igcse",
    name: "Edexcel IGCSE",
    shortName: "Edexcel",
    description: "Pearson Edexcel International GCSE — Grades A* to G",
    icon: "📘",
    gradeBoundaries: [
      { grade: "A*", minPercentage: 90, color: "#8b5cf6", description: "Outstanding" },
      { grade: "A",  minPercentage: 80, color: "#3b82f6", description: "Excellent" },
      { grade: "B",  minPercentage: 70, color: "#22c55e", description: "Good" },
      { grade: "C",  minPercentage: 60, color: "#eab308", description: "Satisfactory" },
      { grade: "D",  minPercentage: 50, color: "#f97316", description: "Limited" },
      { grade: "E",  minPercentage: 40, color: "#ef4444", description: "Very Limited" },
      { grade: "U",  minPercentage: 0,  color: "#6b7280", description: "Ungraded" },
    ],
    targetGrades: ["A*", "A", "B", "C"],
  },
  {
    id: "ib_diploma",
    name: "IB Diploma",
    shortName: "IB",
    description: "International Baccalaureate Diploma Programme — Grades 1–7",
    icon: "🌐",
    gradeBoundaries: [
      { grade: "7", minPercentage: 86, color: "#8b5cf6", description: "Excellent" },
      { grade: "6", minPercentage: 72, color: "#3b82f6", description: "Very Good" },
      { grade: "5", minPercentage: 58, color: "#22c55e", description: "Good" },
      { grade: "4", minPercentage: 46, color: "#eab308", description: "Satisfactory" },
      { grade: "3", minPercentage: 32, color: "#f97316", description: "Mediocre" },
      { grade: "2", minPercentage: 18, color: "#ef4444", description: "Poor" },
      { grade: "1", minPercentage: 0,  color: "#6b7280", description: "Very Poor" },
    ],
    targetGrades: ["7", "6", "5", "4"],
  },
  {
    id: "a_levels",
    name: "A-Levels",
    shortName: "A-Level",
    description: "Advanced Level Qualifications — Grades A* to E",
    icon: "📚",
    gradeBoundaries: [
      { grade: "A*", minPercentage: 90, color: "#8b5cf6", description: "Outstanding" },
      { grade: "A",  minPercentage: 80, color: "#3b82f6", description: "Excellent" },
      { grade: "B",  minPercentage: 70, color: "#22c55e", description: "Good" },
      { grade: "C",  minPercentage: 60, color: "#eab308", description: "Satisfactory" },
      { grade: "D",  minPercentage: 50, color: "#f97316", description: "Limited" },
      { grade: "E",  minPercentage: 40, color: "#ef4444", description: "Very Limited" },
      { grade: "U",  minPercentage: 0,  color: "#6b7280", description: "Ungraded" },
    ],
    targetGrades: ["A*", "A", "B", "C"],
  },
  {
    id: "general",
    name: "General Practice",
    shortName: "General",
    description: "Flexible practice without exam board criteria",
    icon: "✏️",
    gradeBoundaries: [
      { grade: "A", minPercentage: 80, color: "#3b82f6", description: "Excellent" },
      { grade: "B", minPercentage: 65, color: "#22c55e", description: "Good" },
      { grade: "C", minPercentage: 50, color: "#eab308", description: "Average" },
      { grade: "D", minPercentage: 35, color: "#ef4444", description: "Below Average" },
    ],
    targetGrades: ["A", "B", "C"],
  },
];

export function getExamBoard(id: ExamBoard): ExamBoardInfo {
  return EXAM_BOARDS.find((b) => b.id === id) ?? EXAM_BOARDS[EXAM_BOARDS.length - 1];
}

/** Returns the grade boundary the student achieved for a given percentage. */
export function getGradeForScore(examBoardId: ExamBoard, percentage: number): GradeBoundary {
  const board = getExamBoard(examBoardId);
  // boundaries are sorted highest → lowest, find first one the student meets
  return (
    board.gradeBoundaries.find((b) => percentage >= b.minPercentage) ??
    board.gradeBoundaries[board.gradeBoundaries.length - 1]
  );
}

/** Returns the next grade up from the current grade, or null if already at top. */
export function getNextGrade(examBoardId: ExamBoard, currentGrade: string): GradeBoundary | null {
  const board = getExamBoard(examBoardId);
  const idx = board.gradeBoundaries.findIndex((b) => b.grade === currentGrade);
  if (idx <= 0) return null;
  return board.gradeBoundaries[idx - 1];
}

/**
 * Difficulty presets calibrated to typical question demand for each target grade.
 * Each preset is scaled to 10 questions total.
 */
export const TARGET_GRADE_PRESETS: Record<string, { easy: number; medium: number; hard: number }> = {
  "A*": { easy: 1, medium: 3, hard: 6 },
  "7":  { easy: 1, medium: 3, hard: 6 },
  "A":  { easy: 2, medium: 4, hard: 4 },
  "6":  { easy: 2, medium: 4, hard: 4 },
  "B":  { easy: 3, medium: 4, hard: 3 },
  "5":  { easy: 3, medium: 4, hard: 3 },
  "C":  { easy: 5, medium: 3, hard: 2 },
  "4":  { easy: 5, medium: 3, hard: 2 },
  "D":  { easy: 6, medium: 3, hard: 1 },
  "3":  { easy: 6, medium: 3, hard: 1 },
};
