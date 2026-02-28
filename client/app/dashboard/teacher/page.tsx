"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Users,
  BookOpen,
  BarChart3,
  ClipboardList,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { CreateClassModal } from "@/components/teacher/create-class-modal";
import {
  getClasses,
  createClass,
  getTestsForClass,
  computeClassStats,
  TeacherClass,
} from "@/lib/teacher-storage";
import { EXAM_BOARDS } from "@/data/exam-boards";
import { ExamBoard } from "@/types";
import { pageVariants } from "@/lib/animations";
import { useAuth } from "@/contexts/auth-context";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const load = useCallback(() => {
    if (user?.email) setClasses(getClasses(user.email));
  }, [user?.email]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = (name: string, subject: string, examBoard: ExamBoard) => {
    if (!user?.email) return;
    createClass(user.email, name, subject, examBoard);
    load();
  };

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const totalStudents = classes.reduce((sum, cls) => {
    return sum + computeClassStats(cls.id).submitted;
  }, 0);

  const totalTests = classes.reduce((sum, cls) => {
    return sum + (user?.email ? getTestsForClass(user.email, cls.id).length : 0);
  }, 0);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <PageHeader
        title="Teacher Dashboard"
        description="Manage your classes, assign tests and track student performance."
        actions={
          <Button className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            New Class
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Classes", value: classes.length, icon: BookOpen, color: "text-blue-500" },
          { label: "Tests Assigned", value: totalTests, icon: ClipboardList, color: "text-green-500" },
          { label: "Students Active", value: totalStudents, icon: Users, color: "text-purple-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Classes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">My Classes</h2>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            Add Class
          </Button>
        </div>

        {classes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Users className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">No classes yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first class and share the join code with students.
                </p>
              </div>
              <Button className="gap-2 mt-2" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" />
                Create Class
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => {
              const board = EXAM_BOARDS.find((b) => b.id === cls.examBoard);
              const stats = computeClassStats(cls.id);
              const tests = user?.email ? getTestsForClass(user.email, cls.id) : [];

              return (
                <Card
                  key={cls.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/dashboard/teacher/class/${cls.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{cls.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">{cls.subject}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {board?.icon} {board?.shortName}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Join code */}
                    <div
                      className="flex items-center justify-between rounded-md bg-muted px-3 py-2"
                      onClick={(e) => { e.stopPropagation(); handleCopyCode(cls.code); }}
                    >
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Join Code</p>
                        <p className="font-mono font-bold text-sm tracking-widest">{cls.code}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        {copiedCode === cls.code
                          ? <Check className="h-3.5 w-3.5 text-green-500" />
                          : <Copy className="h-3.5 w-3.5" />
                        }
                      </Button>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {stats.submitted} students
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ClipboardList className="h-3.5 w-3.5" />
                        {tests.length} tests
                      </span>
                      {stats.avgScore > 0 && (
                        <span className="flex items-center gap-1.5">
                          <BarChart3 className="h-3.5 w-3.5" />
                          {stats.avgScore}% avg
                        </span>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full gap-2 justify-between"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/teacher/class/${cls.id}`);
                      }}
                    >
                      View Class
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateClassModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </motion.div>
  );
}
