import { ExamBoard } from "@/types";

export interface PaperSection {
  name: string;
  questionType: "multiple_choice" | "short_answer" | "essay" | "mixed";
  questionCount: number;
  marks: number;
  durationMinutes: number;
}

export interface PastPaper {
  id: string;
  code: string;
  name: string;
  subject: string;
  examBoard: ExamBoard;
  sessions: string[];
  totalMarks: number;
  totalDuration: number;
  sections: PaperSection[];
}

export const PAST_PAPERS: PastPaper[] = [
  // ── Cambridge IGCSE Mathematics ──────────────────────────────────────
  {
    id: "cam-math-p1",
    code: "0580/11",
    name: "Paper 1 — Core (Non-calculator)",
    subject: "Mathematics",
    examBoard: "cambridge_igcse",
    sessions: ["May/June 2023", "Oct/Nov 2023", "May/June 2022", "Oct/Nov 2022", "Feb/Mar 2023"],
    totalMarks: 56,
    totalDuration: 60,
    sections: [
      { name: "Section A", questionType: "short_answer", questionCount: 16, marks: 56, durationMinutes: 60 },
    ],
  },
  {
    id: "cam-math-p2",
    code: "0580/21",
    name: "Paper 2 — Extended (Non-calculator)",
    subject: "Mathematics",
    examBoard: "cambridge_igcse",
    sessions: ["May/June 2023", "Oct/Nov 2023", "May/June 2022", "Oct/Nov 2022", "Feb/Mar 2023"],
    totalMarks: 70,
    totalDuration: 90,
    sections: [
      { name: "Section A", questionType: "short_answer", questionCount: 20, marks: 70, durationMinutes: 90 },
    ],
  },
  {
    id: "cam-math-p4",
    code: "0580/41",
    name: "Paper 4 — Extended (Calculator)",
    subject: "Mathematics",
    examBoard: "cambridge_igcse",
    sessions: ["May/June 2023", "Oct/Nov 2023", "May/June 2022", "Oct/Nov 2022", "Feb/Mar 2023"],
    totalMarks: 130,
    totalDuration: 150,
    sections: [
      { name: "Section A — Short questions", questionType: "short_answer", questionCount: 10, marks: 65, durationMinutes: 75 },
      { name: "Section B — Long questions", questionType: "essay", questionCount: 4, marks: 65, durationMinutes: 75 },
    ],
  },

  // ── Cambridge IGCSE English Language ─────────────────────────────────
  {
    id: "cam-eng-p1",
    code: "0500/11",
    name: "Paper 1 — Reading",
    subject: "English Language",
    examBoard: "cambridge_igcse",
    sessions: ["May/June 2023", "Oct/Nov 2023", "May/June 2022", "Oct/Nov 2022"],
    totalMarks: 50,
    totalDuration: 120,
    sections: [
      { name: "Section 1 — Skimming & Scanning", questionType: "short_answer", questionCount: 3, marks: 15, durationMinutes: 30 },
      { name: "Section 2 — Detailed Reading", questionType: "short_answer", questionCount: 4, marks: 20, durationMinutes: 45 },
      { name: "Section 3 — Writing to summarise", questionType: "essay", questionCount: 1, marks: 15, durationMinutes: 45 },
    ],
  },
  {
    id: "cam-eng-p2",
    code: "0500/21",
    name: "Paper 2 — Directed Writing & Composition",
    subject: "English Language",
    examBoard: "cambridge_igcse",
    sessions: ["May/June 2023", "Oct/Nov 2023", "May/June 2022", "Oct/Nov 2022"],
    totalMarks: 50,
    totalDuration: 120,
    sections: [
      { name: "Section 1 — Directed Writing", questionType: "essay", questionCount: 1, marks: 25, durationMinutes: 60 },
      { name: "Section 2 — Composition", questionType: "essay", questionCount: 1, marks: 25, durationMinutes: 60 },
    ],
  },

  // ── Cambridge IGCSE Physics ───────────────────────────────────────────
  {
    id: "cam-phy-p2",
    code: "0625/21",
    name: "Paper 2 — MCQ (Extended)",
    subject: "Physics",
    examBoard: "cambridge_igcse",
    sessions: ["May/June 2023", "Oct/Nov 2023", "May/June 2022", "Oct/Nov 2022"],
    totalMarks: 40,
    totalDuration: 45,
    sections: [
      { name: "Section A — Multiple Choice", questionType: "multiple_choice", questionCount: 40, marks: 40, durationMinutes: 45 },
    ],
  },
  {
    id: "cam-phy-p4",
    code: "0625/41",
    name: "Paper 4 — Extended Theory",
    subject: "Physics",
    examBoard: "cambridge_igcse",
    sessions: ["May/June 2023", "Oct/Nov 2023", "May/June 2022", "Oct/Nov 2022"],
    totalMarks: 80,
    totalDuration: 75,
    sections: [
      { name: "Section A — Short structured", questionType: "short_answer", questionCount: 8, marks: 40, durationMinutes: 37 },
      { name: "Section B — Extended structured", questionType: "essay", questionCount: 2, marks: 40, durationMinutes: 38 },
    ],
  },

  // ── IB Diploma — Mathematics ──────────────────────────────────────────
  {
    id: "ib-math-sl-p1",
    code: "SL Paper 1",
    name: "Mathematics SL — Paper 1 (No Calculator)",
    subject: "Mathematics",
    examBoard: "ib_diploma",
    sessions: ["May 2023", "Nov 2023", "May 2022", "Nov 2022"],
    totalMarks: 80,
    totalDuration: 90,
    sections: [
      { name: "Section A — Short response", questionType: "short_answer", questionCount: 8, marks: 40, durationMinutes: 45 },
      { name: "Section B — Long response", questionType: "essay", questionCount: 3, marks: 40, durationMinutes: 45 },
    ],
  },
  {
    id: "ib-math-sl-p2",
    code: "SL Paper 2",
    name: "Mathematics SL — Paper 2 (Calculator)",
    subject: "Mathematics",
    examBoard: "ib_diploma",
    sessions: ["May 2023", "Nov 2023", "May 2022", "Nov 2022"],
    totalMarks: 80,
    totalDuration: 90,
    sections: [
      { name: "Section A — Short response", questionType: "short_answer", questionCount: 8, marks: 40, durationMinutes: 45 },
      { name: "Section B — Long response", questionType: "essay", questionCount: 3, marks: 40, durationMinutes: 45 },
    ],
  },

  // ── IB Diploma — English ──────────────────────────────────────────────
  {
    id: "ib-eng-sl-p1",
    code: "SL Paper 1",
    name: "English A: Language & Literature SL — Paper 1",
    subject: "English",
    examBoard: "ib_diploma",
    sessions: ["May 2023", "Nov 2023", "May 2022", "Nov 2022"],
    totalMarks: 40,
    totalDuration: 90,
    sections: [
      { name: "Guided Textual Analysis", questionType: "essay", questionCount: 1, marks: 40, durationMinutes: 90 },
    ],
  },

  // ── A-Levels — Mathematics ────────────────────────────────────────────
  {
    id: "al-math-p1",
    code: "9709/12",
    name: "A-Level Mathematics — Paper 1 (Pure 1)",
    subject: "Mathematics",
    examBoard: "a_levels",
    sessions: ["May/June 2023", "Oct/Nov 2023", "May/June 2022", "Oct/Nov 2022", "Feb/Mar 2023"],
    totalMarks: 75,
    totalDuration: 120,
    sections: [
      { name: "Section A — Short questions", questionType: "short_answer", questionCount: 8, marks: 35, durationMinutes: 60 },
      { name: "Section B — Long questions", questionType: "essay", questionCount: 4, marks: 40, durationMinutes: 60 },
    ],
  },
  {
    id: "al-math-p3",
    code: "9709/32",
    name: "A-Level Mathematics — Paper 3 (Pure 3)",
    subject: "Mathematics",
    examBoard: "a_levels",
    sessions: ["May/June 2023", "Oct/Nov 2023", "May/June 2022", "Oct/Nov 2022"],
    totalMarks: 75,
    totalDuration: 120,
    sections: [
      { name: "Section A — Short questions", questionType: "short_answer", questionCount: 8, marks: 35, durationMinutes: 60 },
      { name: "Section B — Long questions", questionType: "essay", questionCount: 4, marks: 40, durationMinutes: 60 },
    ],
  },
];

export function getPastPapersByBoard(examBoard: ExamBoard): PastPaper[] {
  return PAST_PAPERS.filter((p) => p.examBoard === examBoard);
}

export function getSubjectsForBoard(examBoard: ExamBoard): string[] {
  const papers = getPastPapersByBoard(examBoard);
  return [...new Set(papers.map((p) => p.subject))];
}

export function getPapersBySubject(examBoard: ExamBoard, subject: string): PastPaper[] {
  return PAST_PAPERS.filter(
    (p) => p.examBoard === examBoard && p.subject === subject
  );
}
