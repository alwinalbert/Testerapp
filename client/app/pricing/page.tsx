"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Zap,
  GraduationCap,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pageVariants, staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "annual";

const plans = [
  {
    id: "free",
    name: "Free",
    icon: Zap,
    description: "Perfect for getting started",
    monthlyPrice: 0,
    annualPrice: 0,
    badge: null,
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    borderColor: "border",
    ctaLabel: "Get Started Free",
    ctaVariant: "outline" as const,
    stripeReady: false,
    features: [
      { text: "5 tests per month", included: true },
      { text: "MCQ questions only", included: true },
      { text: "Basic score summary", included: true },
      { text: "All exam boards", included: true },
      { text: "AI feedback on answers", included: false },
      { text: "Predicted grade", included: false },
      { text: "Progress over time", included: false },
      { text: "Flashcard revision mode", included: false },
      { text: "Unlimited tests", included: false },
    ],
  },
  {
    id: "student",
    name: "Student Pro",
    icon: GraduationCap,
    description: "For serious exam prep",
    monthlyPrice: 9.99,
    annualPrice: 7.99,
    badge: "Most Popular",
    color: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/50",
    ctaLabel: "Start Free Trial",
    ctaVariant: "default" as const,
    stripeReady: false,
    features: [
      { text: "Unlimited tests", included: true },
      { text: "All question types", included: true },
      { text: "AI examiner feedback", included: true },
      { text: "Predicted grade engine", included: true },
      { text: "Progress over time charts", included: true },
      { text: "Flashcard revision mode", included: true },
      { text: "Streak & gamification", included: true },
      { text: "Audio examiner feedback", included: true },
      { text: "Teacher dashboard", included: false },
    ],
  },
  {
    id: "school",
    name: "School",
    icon: Building2,
    description: "For institutions & teachers",
    monthlyPrice: null,
    annualPrice: null,
    badge: "B2B",
    color: "text-violet-500",
    bgColor: "bg-violet-500/5",
    borderColor: "border-violet-500/30",
    ctaLabel: "Contact Us",
    ctaVariant: "outline" as const,
    stripeReady: false,
    features: [
      { text: "Everything in Student Pro", included: true },
      { text: "Teacher dashboard", included: true },
      { text: "Class roster management", included: true },
      { text: "Academic integrity tools", included: true },
      { text: "ManageBac / Google Classroom sync", included: true, comingSoon: true },
      { text: "Grade passback to gradebook", included: true, comingSoon: true },
      { text: "Peer benchmarking", included: true, comingSoon: true },
      { text: "Custom branding", included: true, comingSoon: true },
      { text: "Dedicated support", included: true },
    ],
  },
];

const integrations = [
  { name: "ManageBac", status: "coming_soon" },
  { name: "Google Classroom", status: "coming_soon" },
  { name: "Microsoft Teams", status: "coming_soon" },
  { name: "Canvas LMS", status: "coming_soon" },
  { name: "Google SSO", status: "coming_soon" },
  { name: "Apple SSO", status: "coming_soon" },
  { name: "Google Doc AI", status: "coming_soon" },
  { name: "Booking Edukko", status: "coming_soon" },
  { name: "Zapier / Make", status: "coming_soon" },
  { name: "ElevenLabs", status: "coming_soon" },
  { name: "Stripe", status: "coming_soon" },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>("annual");

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="py-16 px-4 text-center space-y-4">
        <Badge variant="secondary" className="rounded-full px-4 py-1 text-xs">
          <Sparkles className="h-3 w-3 mr-1.5" />
          Simple, transparent pricing
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Choose your plan
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Start free, upgrade when you're ready. No hidden fees.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-1 rounded-full border bg-muted p-1 mt-2">
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "rounded-full px-5 py-1.5 text-sm font-medium transition-all",
              billing === "monthly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={cn(
              "rounded-full px-5 py-1.5 text-sm font-medium transition-all flex items-center gap-1.5",
              billing === "annual"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Annual
            <Badge className="rounded-full text-xs px-1.5 py-0 bg-green-500/15 text-green-600 border-0">
              Save 20%
            </Badge>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
        className="max-w-5xl mx-auto px-4 grid gap-6 sm:grid-cols-3 pb-16"
      >
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price =
            plan.monthlyPrice === null
              ? null
              : billing === "annual"
              ? plan.annualPrice
              : plan.monthlyPrice;

          return (
            <motion.div key={plan.id} variants={staggerItemVariants}>
              <Card
                className={cn(
                  "relative h-full flex flex-col border-2 rounded-2xl",
                  plan.borderColor,
                  plan.badge === "Most Popular" && "shadow-lg"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge
                      className={cn(
                        "rounded-full px-3 text-xs font-semibold",
                        plan.id === "student"
                          ? "bg-primary text-primary-foreground"
                          : "bg-violet-500 text-white"
                      )}
                    >
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4 pt-7">
                  <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl mb-3", plan.bgColor)}>
                    <Icon className={cn("h-5 w-5", plan.color)} />
                  </div>
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>

                  <div className="pt-2">
                    {price === null ? (
                      <p className="text-3xl font-bold">Custom</p>
                    ) : price === 0 ? (
                      <p className="text-3xl font-bold">Free</p>
                    ) : (
                      <div className="flex items-end gap-1">
                        <p className="text-3xl font-bold">${price}</p>
                        <p className="text-muted-foreground text-sm mb-1">/mo</p>
                      </div>
                    )}
                    {billing === "annual" && price !== null && price > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Billed annually · ${(price * 12).toFixed(0)}/yr
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col flex-1 gap-5">
                  <Button
                    variant={plan.ctaVariant}
                    className="w-full rounded-full gap-2"
                    disabled={!plan.stripeReady && plan.id !== "free"}
                    onClick={() => {
                      if (plan.id === "free") window.location.href = "/signup";
                      if (plan.id === "school") window.location.href = "mailto:hello@testprep.app";
                    }}
                  >
                    {plan.ctaLabel}
                    {plan.id !== "school" && <ArrowRight className="h-4 w-4" />}
                    {!plan.stripeReady && plan.id === "student" && (
                      <span className="text-xs opacity-70 ml-1">(soon)</span>
                    )}
                  </Button>

                  <Separator />

                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        {f.included ? (
                          <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                        )}
                        <span className={cn(!f.included && "text-muted-foreground/60")}>
                          {f.text}
                          {"comingSoon" in f && f.comingSoon && (
                            <Badge variant="outline" className="ml-1.5 text-xs rounded-full px-1.5 py-0 border-violet-400/40 text-violet-500">
                              soon
                            </Badge>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Integrations coming soon */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <Separator className="mb-12" />
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl font-bold">Integrations</h2>
          <p className="text-muted-foreground text-sm">
            Connecting with the tools schools already use
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {integrations.map((int) => (
            <div
              key={int.name}
              className="flex flex-col items-center gap-2 rounded-xl border bg-muted/30 p-4 text-center"
            >
              <p className="text-sm font-medium">{int.name}</p>
              <Badge variant="outline" className="text-xs rounded-full px-2 text-muted-foreground">
                Coming soon
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
