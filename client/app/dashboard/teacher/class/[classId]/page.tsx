"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  ClipboardList,
  Users,
  BarChart3,
  Trophy,
  Plus,
  ArrowLeft,
  CalendarDays,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { AssignTestPanel } from "@/components/teacher/assign-test-panel";
import {
  getClass,
  getTestsForClass,
  getStudentResults,
  assignTest,
  seedMockResults,
  computeClassStats,
  AssignedTest,
  StudentResult,
} from "@/lib/teacher-storage";
import { EXAM_BOARDS } from "@/data/exam-boards";
import { ExamBoard } from "@/types";
import { pageVariants } from "@/lib/animations";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ classId: string }>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function gradeColor(grade: string) {
  if (["A*", "7"].includes(grade)) return "text-purple-500";
  if (["A", "6"].includes(grade)) return "text-blue-500";
  if (["B", "5"].includes(grade)) return "text-green-500";
  if (["C", "4"].includes(grade)) return "text-yellow-500";
  return "text-red-500";
}

export default function ClassDetailPage({ params }: Props) {
  const { classId } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [cls, setCls] = useState(getClass(user?.email ?? "", classId));
  const [tests, setTests] = useState<AssignedTest[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [showAssign, setShowAssign] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "students">("overview");

  const load = useCallback(() => {
    if (!user?.email) return;
    const fresh = getClass(user.email, classId);
    setCls(fresh);
    const t = getTestsForClass(user.email, classId);
    setTests(t);
    setResults(getStudentResults(classId));
  }, [user?.email, classId]);

  useEffect(() => { load(); }, [load]);

  const handleCopyCode = async () => {
    if (!cls) return;
    await navigator.clipboard.writeText(cls.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAssign = (
    title: string,
    targetGrade: string,
    numberOfQuestions: number,
    dueDate?: string
  ) => {
    if (!user?.email || !cls) return;
    const test = assignTest(user.email, {
      classId,
      title,
      subject: cls.subject,
      examBoard: cls.examBoard,
      targetGrade,
      numberOfQuestions,
      dueDate,
    });
    // Seed mock student results for demo
    seedMockResults(classId, test.id, cls.examBoard as ExamBoard);
    load();
  };

  if (!cls) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Class not found.</p>
          <Button variant="outline" onClick={() => router.push("/dashboard/teacher")}>
            Back to Teacher Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const board = EXAM_BOARDS.find((b) => b.id === cls.examBoard);
  const stats = computeClassStats(classId);

  // Unique students across all submissions
  const uniqueStudents = Array.from(
    new Map(results.map((r) => [r.studentEmail, r])).values()
  );

  const handleExportReport = () => {
    const studentRows = uniqueStudents.map((s) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${s.studentName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${s.score}%</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:700;color:${
          ["A*","7"].includes(s.grade) ? "#7c3aed" :
          ["A","6"].includes(s.grade) ? "#2563eb" :
          ["B","5"].includes(s.grade) ? "#16a34a" :
          ["C","4"].includes(s.grade) ? "#d97706" : "#dc2626"
        }">${s.grade}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${formatDate(s.submittedAt)}</td>
      </tr>
    `).join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Class Report — ${cls.name}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; color:#111827; padding:40px; max-width:800px; margin:0 auto; }
  @media print { .no-print { display:none; } }
  h1 { font-size:22px; font-weight:700; margin-bottom:4px; }
  h2 { font-size:15px; font-weight:600; margin:28px 0 12px; color:#374151; border-bottom:2px solid #e5e7eb; padding-bottom:6px; }
  table { width:100%; border-collapse:collapse; font-size:14px; }
  th { background:#f9fafb; padding:10px 12px; text-align:left; font-size:12px; text-transform:uppercase; color:#6b7280; border-bottom:2px solid #e5e7eb; }
</style>
</head>
<body>
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px">
  <div>
    <div style="font-size:12px;color:#6b7280;margin-bottom:4px">TestPrep by Edukko · Teacher Report</div>
    <h1>${cls.name}</h1>
    <div style="color:#6b7280;font-size:14px;margin-top:4px">${cls.subject} · ${board?.name ?? cls.examBoard} · Join code: ${cls.code}</div>
  </div>
  <div style="text-align:right;font-size:13px;color:#6b7280">
    <div>Generated ${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
  </div>
</div>

<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px">
  ${[
    ["Students", uniqueStudents.length],
    ["Tests Assigned", tests.length],
    ["Avg Score", stats.avgScore > 0 ? `${stats.avgScore}%` : "—"],
    ["Top Student", stats.topStudent],
  ].map(([label, val]) => `
    <div style="padding:14px;border:1px solid #e5e7eb;border-radius:8px;text-align:center">
      <div style="font-size:20px;font-weight:700;color:#111827">${val}</div>
      <div style="font-size:11px;color:#6b7280;margin-top:4px">${label}</div>
    </div>
  `).join("")}
</div>

<h2>Student Results</h2>
<table>
  <thead><tr>
    <th>Student</th><th style="text-align:center">Score</th><th style="text-align:center">Grade</th><th style="text-align:center">Submitted</th>
  </tr></thead>
  <tbody>${studentRows || `<tr><td colspan="4" style="text-align:center;padding:16px;color:#6b7280">No submissions yet</td></tr>`}</tbody>
</table>

${tests.length > 0 ? `
<h2>Assigned Tests</h2>
<table>
  <thead><tr>
    <th>Title</th><th style="text-align:center">Target Grade</th><th style="text-align:center">Questions</th><th style="text-align:center">Due</th>
  </tr></thead>
  <tbody>
    ${tests.map(t => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${t.title}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${t.targetGrade}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${t.numberOfQuestions}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${t.dueDate ? formatDate(t.dueDate) : "—"}</td>
      </tr>
    `).join("")}
  </tbody>
</table>` : ""}

<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;text-align:center">
  Generated by TestPrep by Edukko · © 2026 All rights reserved
</div>

<div class="no-print" style="margin-top:24px;text-align:center">
  <button onclick="window.print()" style="padding:10px 24px;background:#111827;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer">🖨 Print / Save as PDF</button>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cls.name.replace(/[^a-z0-9]/gi, "_")}_Class_Report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <PageHeader
        title={cls.name}
        description={`${cls.subject} · ${board?.name}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={handleExportReport}>
              <FileDown className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="gap-2" onClick={() => setShowAssign(true)}>
              <Plus className="h-4 w-4" />
              Assign Test
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Students", value: uniqueStudents.length, icon: Users },
          { label: "Tests Assigned", value: tests.length, icon: ClipboardList },
          { label: "Avg Score", value: stats.avgScore > 0 ? `${stats.avgScore}%` : "—", icon: BarChart3 },
          { label: "Top Student", value: stats.topStudent, icon: Trophy },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-bold truncate">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Join Code */}
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Student Join Code — share this with your class
            </p>
            <p className="font-mono font-bold text-2xl tracking-widest">{cls.code}</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleCopyCode}>
            {copiedCode ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copiedCode ? "Copied!" : "Copy Code"}
          </Button>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(["overview", "students"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview — assigned tests */}
      {activeTab === "overview" && (
        <div className="space-y-3">
          {tests.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center py-12 text-center gap-3">
                <ClipboardList className="h-8 w-8 text-muted-foreground" />
                <p className="font-medium">No tests assigned yet</p>
                <p className="text-sm text-muted-foreground">
                  Assign a test to this class to start tracking student performance.
                </p>
                <Button className="gap-2 mt-1" onClick={() => setShowAssign(true)}>
                  <Plus className="h-4 w-4" />
                  Assign First Test
                </Button>
              </CardContent>
            </Card>
          ) : (
            tests.map((test) => {
              const testResults = results.filter((r) => r.assignedTestId === test.id);
              const avg = testResults.length > 0
                ? Math.round(testResults.reduce((s, r) => s + r.percentage, 0) / testResults.length)
                : null;

              return (
                <Card key={test.id}>
                  <CardContent className="flex items-center justify-between p-4 gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{test.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                        <span>Target {test.targetGrade}</span>
                        <span>{test.numberOfQuestions} questions</span>
                        <span>Assigned {formatDate(test.assignedAt)}</span>
                        {test.dueDate && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            Due {formatDate(test.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{testResults.length} submitted</p>
                        {avg !== null && (
                          <p className="font-bold text-lg">{avg}% avg</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Students tab */}
      {activeTab === "students" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Student Results</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {uniqueStudents.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No student submissions yet. Assign a test to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Student</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Score</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Grade</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueStudents
                      .sort((a, b) => b.percentage - a.percentage)
                      .map((student, i) => (
                        <tr key={student.studentEmail} className={cn("border-b last:border-0", i % 2 === 0 ? "" : "bg-muted/20")}>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium">{student.studentName}</p>
                              <p className="text-xs text-muted-foreground">{student.studentEmail}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{ width: `${student.percentage}%` }}
                                />
                              </div>
                              <span className="font-semibold tabular-nums">{student.percentage}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn("font-bold text-base", gradeColor(student.grade))}>
                              {student.grade}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                            {formatDate(student.submittedAt)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showAssign && (
        <AssignTestPanel
          classId={classId}
          subject={cls.subject}
          examBoard={cls.examBoard as ExamBoard}
          onClose={() => setShowAssign(false)}
          onAssign={handleAssign}
        />
      )}
    </motion.div>
  );
}
