"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { computeStats, getRecentTests } from "@/lib/test-storage";
import { pageVariants, cardVariants } from "@/lib/animations";
import { formatDate, getScoreColor } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { EXAM_BOARDS } from "@/data/exam-boards";
import { ExamBoard } from "@/types";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "Guest",
    email: user?.email || "",
    examBoard: "cambridge_igcse" as ExamBoard,
    school: "",
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const stats = useMemo(() => computeStats(user?.email || ""), [user?.email]);
  const recentTests = useMemo(() => getRecentTests(user?.email || ""), [user?.email]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          <PageHeader
            title="My Profile"
            description="View and manage your profile information."
          />

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <motion.div variants={cardVariants}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <User className="h-10 w-10 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">{profile.name}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile.email}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="secondary">
                          {EXAM_BOARDS.find((b) => b.id === profile.examBoard)?.icon}{" "}
                          {EXAM_BOARDS.find((b) => b.id === profile.examBoard)?.shortName}
                        </Badge>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Quick Stats */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Trophy className="h-4 w-4" />
                          Tests Taken
                        </div>
                        <span className="font-semibold">{stats.totalTests}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Target className="h-4 w-4" />
                          Average Score
                        </div>
                        <span className="font-semibold">{stats.averageScore}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          Questions Answered
                        </div>
                        <span className="font-semibold">{stats.totalQuestions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          Strongest Topic
                        </div>
                        <span className="font-semibold text-xs">{stats.strongestTopic}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    {!isEditing ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="gap-2" onClick={handleSave}>
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={editedProfile.name}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                name: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {profile.name}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={editedProfile.email}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                email: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {profile.email}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="school">School</Label>
                        {isEditing ? (
                          <Input
                            id="school"
                            value={editedProfile.school}
                            placeholder="e.g. International School of Geneva"
                            onChange={(e) =>
                              setEditedProfile({ ...editedProfile, school: e.target.value })
                            }
                          />
                        ) : (
                          <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            {profile.school || <span className="text-muted-foreground">Not set</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Exam Board */}
                    <div className="space-y-2">
                      <Label>Exam Board</Label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {EXAM_BOARDS.filter((b) => b.id !== "general").map((board) => (
                          <button
                            key={board.id}
                            type="button"
                            disabled={!isEditing}
                            onClick={() =>
                              isEditing &&
                              setEditedProfile({ ...editedProfile, examBoard: board.id as ExamBoard })
                            }
                            className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-all
                              ${(isEditing ? editedProfile.examBoard : profile.examBoard) === board.id
                                ? "border-primary bg-primary/10 text-primary font-medium"
                                : "border-border bg-card text-muted-foreground"
                              }
                              ${isEditing ? "hover:border-primary/60 cursor-pointer" : "cursor-default"}
                            `}
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

              {/* Recent Activity */}
              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentTests.map((test) => (
                        <div
                          key={test.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <p className="font-medium text-sm">{test.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {test.subject} &middot; {test.questionsCount} questions &middot;{" "}
                              {formatDate(test.completedAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold text-lg ${getScoreColor(test.percentage)}`}
                            >
                              {test.percentage}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {test.score}/{test.maxScore}
                            </p>
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
