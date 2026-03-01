"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Users,
  GraduationCap,
  BarChart3,
  Plug,
  CreditCard,
  Shield,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { pageVariants, cardVariants } from "@/lib/animations";

const mockSchoolStats = [
  { label: "Teachers", value: "8", icon: GraduationCap, change: "+2 this month" },
  { label: "Students", value: "247", icon: Users, change: "+31 this month" },
  { label: "Classes", value: "14", icon: Building2, change: "Across 4 subjects" },
  { label: "Avg School Score", value: "71%", icon: BarChart3, change: "+4% vs last term" },
];

const mockTeachers = [
  { name: "Ms. Alwin", email: "alwin@school.edu", subject: "Mathematics", classes: 3, students: 68 },
  { name: "Mr. Carter", email: "carter@school.edu", subject: "Physics", classes: 2, students: 44 },
  { name: "Dr. Patel", email: "patel@school.edu", subject: "Chemistry", classes: 2, students: 51 },
  { name: "Ms. Nguyen", email: "nguyen@school.edu", subject: "Biology", classes: 2, students: 47 },
];

const integrations = [
  { name: "ManageBac", status: "coming_soon", description: "Sync class rosters and units automatically." },
  { name: "Google Classroom", status: "coming_soon", description: "Import rosters and push assignments." },
  { name: "Microsoft Teams", status: "coming_soon", description: "Post assignments inside Teams channels." },
];

const plans = [
  {
    name: "School",
    price: "$299",
    period: "/month",
    features: ["Up to 500 students", "Unlimited teachers", "All exam boards", "ManageBac integration", "Class reports", "Priority support"],
    current: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Unlimited students", "Multi-campus", "Custom branding", "API access", "Dedicated account manager", "SLA guarantee"],
    current: false,
  },
];

export default function AdminPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8 pb-12"
    >
      <PageHeader
        title="School Admin"
        description="Manage your institution's teachers, students and integrations."
        actions={
          <Badge variant="secondary" className="gap-1.5 px-3 py-1">
            <Building2 className="h-3.5 w-3.5" />
            Edukko International School
          </Badge>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockSchoolStats.map((stat) => (
          <motion.div key={stat.label} variants={cardVariants}>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-[11px] text-primary mt-0.5">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Teachers */}
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Teachers
              </CardTitle>
              <Button size="sm" variant="outline" disabled>
                Invite Teacher
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Subject</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Classes</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Students</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTeachers.map((t, i) => (
                    <tr key={t.email} className={i < mockTeachers.length - 1 ? "border-b" : ""}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.email}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{t.subject}</td>
                      <td className="px-4 py-3 text-center">{t.classes}</td>
                      <td className="px-4 py-3 text-center">{t.students}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Integrations */}
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {integrations.map((integration, i) => (
                <div key={integration.name}>
                  {i > 0 && <Separator className="mb-3" />}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{integration.name}</p>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Soon</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                    </div>
                    <Button variant="outline" size="sm" disabled className="shrink-0 gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Connect
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Billing */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing & Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-lg border p-5 space-y-4 ${plan.current ? "border-primary/50 bg-primary/5" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{plan.name}</p>
                      <p className="text-2xl font-bold mt-1">
                        {plan.price}
                        <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                      </p>
                    </div>
                    {plan.current && <Badge>Current Plan</Badge>}
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.current ? "outline" : "default"}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : "Contact Sales"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Billing is managed by your school administrator. Contact{" "}
              <span className="text-primary cursor-pointer hover:underline">support@edukko.com</span>{" "}
              to upgrade or manage your subscription.
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data & Privacy */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>All student data is stored securely and never shared with third parties. TestPrep is GDPR compliant and supports data export on request.</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {["GDPR Compliant", "Data Export Available", "Student Data Encrypted", "SOC 2 (In Progress)"].map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
