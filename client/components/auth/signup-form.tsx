"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cardVariants } from "@/lib/animations";
import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/contexts/auth-context";
import { SSOButtons } from "./sso-buttons";

const syllabuses = [
  { id: "cambridge", name: "Cambridge IGCSE" },
  { id: "edexcel", name: "Edexcel" },
  { id: "ib", name: "International Baccalaureate" },
  { id: "ap", name: "Advanced Placement" },
  { id: "national", name: "National Curriculum" },
  { id: "other", name: "Other" },
];

const yearGroups = ["Year 10", "Year 11", "Year 12", "Year 13"];

const examSessions = ["May 2026", "Nov 2026", "May 2027"];

const teacherRoles = [
  "Classroom Teacher",
  "Head of Department",
  "Private Tutor",
  "IB Coordinator",
];

const teacherSubjects = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "English Language", "English Literature", "History",
  "Geography", "Economics", "Business Studies",
  "Computer Science", "Psychology", "Sociology",
  "Art & Design", "Physical Education",
];

export function SignupForm() {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as UserRole,
    // Student fields
    yearGroup: "",
    syllabus: "",
    hlsl: "",
    targetExamSession: "",
    school: "",
    // Teacher fields
    teacherRole: "",
    subjects: [] as string[],
    institution: "",
    // Both
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isIB = formData.syllabus === "ib";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.role === "student") {
      if (!formData.yearGroup) newErrors.yearGroup = "Please select your year group";
      if (!formData.syllabus) newErrors.syllabus = "Please select your syllabus";
      if (isIB && !formData.hlsl) newErrors.hlsl = "Please select HL or SL";
      if (!formData.targetExamSession) newErrors.targetExamSession = "Please select your target exam session";
    }

    if (formData.role === "teacher") {
      if (formData.subjects.length === 0) newErrors.subjects = "Please select at least one subject";
    }

    if (!formData.termsAccepted) newErrors.terms = "You must accept the Terms of Service to continue";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    const extraData: Record<string, unknown> =
      formData.role === "student"
        ? {
            year_group: formData.yearGroup,
            syllabus: formData.syllabus,
            ...(isIB && { hlsl: formData.hlsl }),
            target_exam_session: formData.targetExamSession,
            ...(formData.school && { school: formData.school }),
          }
        : {
            ...(formData.teacherRole && { teacher_role: formData.teacherRole }),
            subjects: formData.subjects,
            ...(formData.institution && { institution: formData.institution }),
          };

    const { error } = await signup(formData.name, formData.email, formData.password, formData.role, extraData);

    if (error) {
      setErrors({ email: error });
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }));
  };

  const toggleSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
    if (errors.subjects) setErrors((prev) => ({ ...prev, subjects: "" }));
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="w-full max-w-md"
    >
      <Card className="shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your details to get started with TestPrep
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name" name="name" type="text" placeholder="John Doe"
                value={formData.name} onChange={handleChange}
                error={!!errors.name} disabled={isLoading} autoComplete="name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email" name="email" type="email" placeholder="name@example.com"
                value={formData.email} onChange={handleChange}
                error={!!errors.email} disabled={isLoading} autoComplete="email"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>I am a...</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "student", label: "Student", desc: "I take tests" },
                  { value: "teacher", label: "Teacher", desc: "I create tests" },
                ].map((r) => (
                  <button
                    key={r.value} type="button"
                    onClick={() => handleRoleChange(r.value)}
                    disabled={isLoading}
                    className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                      formData.role === r.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* ── STUDENT FIELDS ── */}
            {formData.role === "student" && (
              <>
                {/* Year Group */}
                <div className="space-y-2">
                  <Label>Year Group</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {yearGroups.map((y) => (
                      <button
                        key={y} type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, yearGroup: y }));
                          if (errors.yearGroup) setErrors((prev) => ({ ...prev, yearGroup: "" }));
                        }}
                        disabled={isLoading}
                        className={`rounded-lg border py-2 text-sm font-medium transition-all ${
                          formData.yearGroup === y
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {y.replace("Year ", "")}
                      </button>
                    ))}
                  </div>
                  {errors.yearGroup && <p className="text-sm text-destructive">{errors.yearGroup}</p>}
                </div>

                {/* Syllabus */}
                <div className="space-y-2">
                  <Label htmlFor="syllabus">Syllabus</Label>
                  <Select
                    value={formData.syllabus}
                    onValueChange={(v) => {
                      setFormData((prev) => ({ ...prev, syllabus: v, hlsl: "" }));
                      if (errors.syllabus) setErrors((prev) => ({ ...prev, syllabus: "" }));
                    }}
                    disabled={isLoading}
                  >
                    <SelectTrigger className={errors.syllabus ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select your syllabus" />
                    </SelectTrigger>
                    <SelectContent>
                      {syllabuses.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.syllabus && <p className="text-sm text-destructive">{errors.syllabus}</p>}
                </div>

                {/* HL / SL — IB only */}
                {isIB && (
                  <div className="space-y-2">
                    <Label>IB Level</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "HL", label: "Higher Level (HL)", desc: "240 teaching hours" },
                        { value: "SL", label: "Standard Level (SL)", desc: "150 teaching hours" },
                      ].map((lvl) => (
                        <button
                          key={lvl.value} type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, hlsl: lvl.value }));
                            if (errors.hlsl) setErrors((prev) => ({ ...prev, hlsl: "" }));
                          }}
                          disabled={isLoading}
                          className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                            formData.hlsl === lvl.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <p className="font-medium">{lvl.label}</p>
                          <p className="text-xs text-muted-foreground">{lvl.desc}</p>
                        </button>
                      ))}
                    </div>
                    {errors.hlsl && <p className="text-sm text-destructive">{errors.hlsl}</p>}
                  </div>
                )}

                {/* Target Exam Session */}
                <div className="space-y-2">
                  <Label>Target Exam Session</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {examSessions.map((s) => (
                      <button
                        key={s} type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, targetExamSession: s }));
                          if (errors.targetExamSession) setErrors((prev) => ({ ...prev, targetExamSession: "" }));
                        }}
                        disabled={isLoading}
                        className={`rounded-lg border py-2 text-sm font-medium transition-all ${
                          formData.targetExamSession === s
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.targetExamSession && <p className="text-sm text-destructive">{errors.targetExamSession}</p>}
                </div>

                {/* School (optional) */}
                <div className="space-y-2">
                  <Label htmlFor="school">School <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Input
                    id="school" name="school" type="text" placeholder="Your school name"
                    value={formData.school} onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {/* ── TEACHER FIELDS ── */}
            {formData.role === "teacher" && (
              <>
                {/* Teacher Role */}
                <div className="space-y-2">
                  <Label>Your Role</Label>
                  <Select
                    value={formData.teacherRole}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, teacherRole: v }))}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacherRoles.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject Specialisms */}
                <div className="space-y-2">
                  <Label>Subjects You Teach</Label>
                  <div className="flex flex-wrap gap-2">
                    {teacherSubjects.map((s) => (
                      <button
                        key={s} type="button"
                        onClick={() => toggleSubject(s)}
                        disabled={isLoading}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                          formData.subjects.includes(s)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.subjects && <p className="text-sm text-destructive">{errors.subjects}</p>}
                </div>

                {/* School / Institution */}
                <div className="space-y-2">
                  <Label htmlFor="institution">School / Institution <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Input
                    id="institution" name="institution" type="text"
                    placeholder="School or tutoring centre name"
                    value={formData.institution} onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password} onChange={handleChange}
                  error={!!errors.password} disabled={isLoading}
                  autoComplete="new-password" className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword" name="confirmPassword" type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword} onChange={handleChange}
                error={!!errors.confirmPassword} disabled={isLoading}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Acceptance */}
            <div className="space-y-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
                  }}
                  disabled={isLoading}
                  className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <p className="text-sm text-destructive">{errors.terms}</p>}
            </div>

          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
            <SSOButtons />
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
