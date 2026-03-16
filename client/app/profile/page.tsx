"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, BookOpen, Trophy, Target, TrendingUp, TrendingDown,
  Minus, Edit2, Save, X, Flame, Clock, AlertTriangle,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { computeStats, getRecentTests, computeSubjectStats, computeStreak } from "@/lib/test-storage";
import { pageVariants, cardVariants } from "@/lib/animations";
import { formatDate, getScoreColor } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { EXAM_BOARDS } from "@/data/exam-boards";
import { ExamBoard } from "@/types";

function daysUntilSession(session?: string): number | null {
  if (!session) return null;
  const [month, year] = session.split(" ");
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const m = months[month];
  if (m === undefined || !year) return null;
  const target = new Date(parseInt(year), m, 15);
  const diff = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

const TrendIcon = ({ trend }: { trend: "up" | "stable" | "down" }) => {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "Guest",
    email: user?.email || "",
    examBoard: "cambridge_igcse" as ExamBoard,
    school: user?.school || "",
  });
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => { setProfile(editedProfile); setIsEditing(false); };
  const handleCancel = () => { setEditedProfile(profile); setIsEditing(false); };

  const stats = useMemo(() => computeStats(user?.email || ""), [user?.email]);
  const recentTests = useMemo(() => getRecentTests(user?.email || ""), [user?.email]);
  const subjectStats = useMemo(
    () => computeSubjectStats(user?.email || "", user?.syllabus),
    [user?.email, user?.syllabus]
  );
  const streak = useMemo(() => computeStreak(user?.email || ""), [user?.email]);
  const daysLeft = daysUntilSession(user?.targetExamSession);
  const prioritySubject = subjectStats.find((s) => s.isPriority);
  const isStudent = user?.role === "student";

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-8">
          <PageHeader title="My Profile" description="View and manage your profile information." />

          <div className="grid gap-8 lg:grid-cols-3">
            {/* ── LEFT CARD ── */}
            <div className="lg:col-span-1">
              <motion.div variants={cardVariants}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <User className="h-10 w-10 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">{profile.name}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
                      <div className="flex gap-2 mt-3 flex-wrap justify-center">
                        <Badge variant="secondary">
                          {EXAM_BOARDS.find((b) => b.id === profile.examBoard)?.icon}{" "}
                          {EXAM_BOARDS.find((b) => b.id === profile.examBoard)?.shortName}
                        </Badge>
                        <Badge
                          variant={user?.role === "admin" ? "destructive" : user?.role === "teacher" ? "default" : "outline"}
                          className="capitalize"
                        >
                          {user?.role ?? "student"}
                        </Badge>
                        {user?.yearGroup && <Badge variant="outline">{user.yearGroup}</Badge>}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Motivation layer — students only */}
                    {isStudent && (
                      <>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="rounded-lg border p-3 text-center">
                            <div className="flex items-center justify-center gap-1 mb-0.5">
                              <Flame className="h-4 w-4 text-orange-500" />
                              <span className="text-lg font-bold">{streak}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Day streak</p>
                          </div>
                          <div className="rounded-lg border p-3 text-center">
                            {daysLeft !== null ? (
                              <>
                                <div className="flex items-center justify-center gap-1 mb-0.5">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <span className="text-lg font-bold">{daysLeft}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Days to exam</p>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center justify-center gap-1 mb-0.5">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">—</span>
                                </div>
                                <p className="text-xs text-muted-foreground">No exam set</p>
                              </>
                            )}
                          </div>
                        </div>
                        <Separator className="mb-4" />
                      </>
                    )}

                    {/* Quick Stats */}
                    <div className="space-y-4">
                      {[
                        { icon: Trophy, label: "Tests Taken", value: stats.totalTests },
                        { icon: Target, label: "Average Score", value: `${stats.averageScore}%` },
                        { icon: BookOpen, label: "Questions Answered", value: stats.totalQuestions },
                        { icon: TrendingUp, label: "Strongest Topic", value: stats.strongestTopic, small: true },
                      ].map(({ icon: Icon, label, value, small }) => (
                        <div key={label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon className="h-4 w-4" />
                            {label}
                          </div>
                          <span className={`font-semibold ${small ? "text-xs" : ""}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Personal Information */}
              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    {!isEditing ? (
                      <Button variant="ghost" size="sm" className="gap-2" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4" /> Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCancel}><X className="h-4 w-4" /></Button>
                        <Button size="sm" className="gap-2" onClick={handleSave}><Save className="h-4 w-4" /> Save</Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        {isEditing ? (
                          <Input value={editedProfile.name} onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })} />
                        ) : (
                          <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />{profile.name}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        {isEditing ? (
                          <Input type="email" value={editedProfile.email} onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })} />
                        ) : (
                          <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />{profile.email}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>School</Label>
                        {isEditing ? (
                          <Input value={editedProfile.school} placeholder="e.g. International School of Geneva" onChange={(e) => setEditedProfile({ ...editedProfile, school: e.target.value })} />
                        ) : (
                          <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            {profile.school || <span className="text-muted-foreground">Not set</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Exam Board</Label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {EXAM_BOARDS.filter((b) => b.id !== "general").map((board) => (
                          <button
                            key={board.id} type="button" disabled={!isEditing}
                            onClick={() => isEditing && setEditedProfile({ ...editedProfile, examBoard: board.id as ExamBoard })}
                            className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-all
                              ${(isEditing ? editedProfile.examBoard : profile.examBoard) === board.id
                                ? "border-primary bg-primary/10 text-primary font-medium"
                                : "border-border bg-card text-muted-foreground"}
                              ${isEditing ? "hover:border-primary/60 cursor-pointer" : "cursor-default"}`}
                          >
                            <span className="text-base">{board.icon}</span>
                            <p className="mt-1 font-medium leading-none text-foreground">{board.shortName}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{board.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* ── SUBJECT PERFORMANCE — students with test history ── */}
              {isStudent && subjectStats.length > 0 && (
                <motion.div variants={cardVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Subject Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">

                      {/* Priority / weakest topic callouts */}
                      {prioritySubject && (
                        <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 px-4 py-3 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-0.5">
                              Focus here this week
                            </p>
                            <p className="font-medium text-sm">{prioritySubject.subjectName}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Predicted <span className="font-semibold">{prioritySubject.predictedGrade}</span>
                              {" · "}{prioritySubject.lastScore}% last score
                            </p>
                          </div>
                          <span className="text-2xl">🎯</span>
                        </div>
                      )}

                      {stats.weakestTopic !== "N/A" && (
                        <div className="flex items-start gap-3 rounded-lg border p-3">
                          <div className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-destructive uppercase tracking-wide">Your weakest topic right now</p>
                            <p className="text-sm font-medium mt-0.5">{stats.weakestTopic}</p>
                            <p className="text-xs text-muted-foreground">Revise this before your next test</p>
                          </div>
                        </div>
                      )}

                      {/* Subject rows */}
                      <div className="space-y-2 pt-1">
                        {subjectStats.map((s) => (
                          <div
                            key={s.subjectId}
                            className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${s.isPriority ? "border-orange-300 dark:border-orange-800" : ""}`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">{s.subjectName}</p>
                                {s.isPriority && (
                                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 rounded-full px-2 py-0.5 shrink-0">
                                    Focus
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{s.testCount} test{s.testCount !== 1 ? "s" : ""} taken</p>
                            </div>
                            <div className="text-center shrink-0">
                              <p className="text-xs text-muted-foreground">Predicted</p>
                              <p className="font-bold text-base">{s.predictedGrade}</p>
                            </div>
                            <div className="text-center shrink-0">
                              <p className="text-xs text-muted-foreground">Last score</p>
                              <p className={`font-semibold text-sm ${getScoreColor(s.lastScore)}`}>{s.lastScore}%</p>
                            </div>
                            <TrendIcon trend={s.trend} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Recent Activity */}
              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentTests.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No tests taken yet.</p>
                      ) : recentTests.map((test) => (
                        <div key={test.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium text-sm">{test.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {test.subject} · {test.questionsCount} questions · {formatDate(test.completedAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${getScoreColor(test.percentage)}`}>{test.percentage}%</p>
                            <p className="text-xs text-muted-foreground">{test.score}/{test.maxScore}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        © 2026 TestPrep by Edukko. All rights reserved.
      </footer>
    </div>
  );
}
