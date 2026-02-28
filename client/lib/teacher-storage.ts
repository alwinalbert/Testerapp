import { ExamBoard } from "@/types";

// ── Types ────────────────────────────────────────────────────────────────────

export interface TeacherClass {
  id: string;
  name: string;
  code: string; // e.g. "MAT-4B2"
  subject: string;
  examBoard: ExamBoard;
  teacherEmail: string;
  createdAt: string;
}

export interface AssignedTest {
  id: string;
  classId: string;
  title: string;
  subject: string;
  examBoard: ExamBoard;
  targetGrade: string;
  numberOfQuestions: number;
  assignedAt: string;
  dueDate?: string;
}

export interface StudentResult {
  id: string;
  assignedTestId: string;
  studentName: string;
  studentEmail: string;
  percentage: number;
  grade: string;
  score: number;
  maxScore: number;
  submittedAt: string;
}

// ── Storage keys ─────────────────────────────────────────────────────────────

const classesKey = (email: string) => `testprep-classes-${email}`;
const testsKey = (email: string) => `testprep-assigned-${email}`;
const resultsKey = (classId: string) => `testprep-results-class-${classId}`;

// ── Class helpers ─────────────────────────────────────────────────────────────

export function getClasses(teacherEmail: string): TeacherClass[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(classesKey(teacherEmail)) || "[]");
  } catch {
    return [];
  }
}

export function getClass(teacherEmail: string, classId: string): TeacherClass | null {
  return getClasses(teacherEmail).find((c) => c.id === classId) ?? null;
}

export function saveClass(teacherEmail: string, cls: TeacherClass): void {
  const all = getClasses(teacherEmail).filter((c) => c.id !== cls.id);
  localStorage.setItem(classesKey(teacherEmail), JSON.stringify([...all, cls]));
}

export function deleteClass(teacherEmail: string, classId: string): void {
  const all = getClasses(teacherEmail).filter((c) => c.id !== classId);
  localStorage.setItem(classesKey(teacherEmail), JSON.stringify(all));
}

function generateCode(subject: string): string {
  const prefix = subject.slice(0, 3).toUpperCase();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from({ length: 3 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `${prefix}-${suffix}`;
}

export function createClass(
  teacherEmail: string,
  name: string,
  subject: string,
  examBoard: ExamBoard
): TeacherClass {
  const cls: TeacherClass = {
    id: `class-${Date.now()}`,
    name,
    code: generateCode(subject),
    subject,
    examBoard,
    teacherEmail,
    createdAt: new Date().toISOString(),
  };
  saveClass(teacherEmail, cls);
  return cls;
}

// ── Assigned test helpers ─────────────────────────────────────────────────────

export function getAssignedTests(teacherEmail: string): AssignedTest[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(testsKey(teacherEmail)) || "[]");
  } catch {
    return [];
  }
}

export function getTestsForClass(teacherEmail: string, classId: string): AssignedTest[] {
  return getAssignedTests(teacherEmail).filter((t) => t.classId === classId);
}

export function assignTest(teacherEmail: string, test: Omit<AssignedTest, "id" | "assignedAt">): AssignedTest {
  const full: AssignedTest = {
    ...test,
    id: `atest-${Date.now()}`,
    assignedAt: new Date().toISOString(),
  };
  const all = getAssignedTests(teacherEmail);
  localStorage.setItem(testsKey(teacherEmail), JSON.stringify([...all, full]));
  return full;
}

// ── Student result helpers ────────────────────────────────────────────────────

export function getStudentResults(classId: string): StudentResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(resultsKey(classId)) || "[]");
  } catch {
    return [];
  }
}

// ── Mock data seeder (for demo purposes) ─────────────────────────────────────

const MOCK_STUDENTS = [
  { name: "Emma Thompson", email: "emma.t@school.edu" },
  { name: "Liam Patel", email: "liam.p@school.edu" },
  { name: "Sophia Chen", email: "sophia.c@school.edu" },
  { name: "Noah Williams", email: "noah.w@school.edu" },
  { name: "Olivia Nguyen", email: "olivia.n@school.edu" },
  { name: "Ethan Brown", email: "ethan.b@school.edu" },
];

export function seedMockResults(classId: string, assignedTestId: string, examBoard: ExamBoard): void {
  const existing = getStudentResults(classId);
  if (existing.some((r) => r.assignedTestId === assignedTestId)) return;

  const grades: Record<string, string[]> = {
    cambridge_igcse: ["A*", "A", "A", "B", "B", "C"],
    edexcel_igcse:   ["A*", "A", "B", "B", "C", "C"],
    ib_diploma:      ["7", "6", "6", "5", "5", "4"],
    a_levels:        ["A*", "A", "A", "B", "B", "C"],
    general:         ["A", "A", "B", "B", "C", "C"],
  };

  const percentages = [94, 83, 81, 72, 70, 62];

  const results: StudentResult[] = MOCK_STUDENTS.map((student, i) => ({
    id: `result-${Date.now()}-${i}`,
    assignedTestId,
    studentName: student.name,
    studentEmail: student.email,
    percentage: percentages[i],
    grade: (grades[examBoard] ?? grades.general)[i],
    score: Math.round(percentages[i] * 0.1),
    maxScore: 10,
    submittedAt: new Date(Date.now() - i * 3600000).toISOString(),
  }));

  localStorage.setItem(resultsKey(classId), JSON.stringify([...existing, ...results]));
}

// ── Stats helpers ─────────────────────────────────────────────────────────────

export function computeClassStats(classId: string) {
  const results = getStudentResults(classId);
  if (results.length === 0) return { avgScore: 0, submitted: 0, topStudent: "—" };

  const avgScore = Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length);
  const submitted = new Set(results.map((r) => r.studentEmail)).size;
  const top = results.reduce((best, r) => (r.percentage > best.percentage ? r : best), results[0]);

  return { avgScore, submitted, topStudent: top.studentName };
}
