"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import {
  SubjectSelector,
  TopicSelector,
  DifficultySelector,
  TestConfigSummary,
  ExamBoardSelector,
} from "@/components/test-builder";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { mockSubjects, generateMockTestPaper } from "@/data/mock";
import { TestConfig, DifficultyDistribution, QuestionType, ExamBoard } from "@/types";
import { pageVariants } from "@/lib/animations";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { generateTestPaper, transformN8nTestPaper } from "@/lib/api";

function TestBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedSubject = searchParams.get("subject");

  const [config, setConfig] = useState<TestConfig>({
    subject: preSelectedSubject || "",
    topics: [],
    questionType: "mixed",
    difficulty: { easy: 3, medium: 4, hard: 3 },
    numberOfQuestions: 10,
    examBoard: "cambridge_igcse",
    targetGrade: "B",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [testMode, setTestMode] = useState<"subject" | "general">("subject");

  // Get the selected subject data
  const selectedSubject = mockSubjects.find((s) => s.id === config.subject);

  // Auto-select all topics when subject changes
  useEffect(() => {
    if (selectedSubject && config.topics.length === 0) {
      setConfig((prev) => ({
        ...prev,
        topics: selectedSubject.topics.slice(0, 3), // Select first 3 topics by default
      }));
    }
  }, [config.subject]);

  // Update handlers
  const handleSubjectSelect = (subjectId: string) => {
    const subject = mockSubjects.find((s) => s.id === subjectId);
    setConfig((prev) => ({
      ...prev,
      subject: subjectId,
      topics: subject?.topics.slice(0, 3) || [],
    }));
  };

  const handleTopicToggle = (topic: string) => {
    setConfig((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const handleSelectAllTopics = () => {
    if (selectedSubject) {
      setConfig((prev) => ({
        ...prev,
        topics: selectedSubject.topics,
      }));
    }
  };

  const handleClearAllTopics = () => {
    setConfig((prev) => ({
      ...prev,
      topics: [],
    }));
  };

  const handleDifficultyChange = (distribution: DifficultyDistribution) => {
    setConfig((prev) => ({
      ...prev,
      difficulty: distribution,
    }));
  };

  const handleQuestionTypeChange = (type: QuestionType) => {
    setConfig((prev) => ({
      ...prev,
      questionType: type,
    }));
  };

  const handleTotalQuestionsChange = (count: number) => {
    setConfig((prev) => ({
      ...prev,
      numberOfQuestions: count,
    }));
  };

  const handleExamBoardChange = (board: ExamBoard) => {
    setConfig((prev) => ({ ...prev, examBoard: board, targetGrade: "" }));
  };

  const handleTargetGradeChange = (grade: string, preset: DifficultyDistribution) => {
    const total = preset.easy + preset.medium + preset.hard;
    setConfig((prev) => ({
      ...prev,
      targetGrade: grade,
      difficulty: preset,
      numberOfQuestions: total,
    }));
  };

  // Validation — general mode only needs a target grade; subject mode needs subject + topics
  const isValid =
    testMode === "general"
      ? config.targetGrade !== "" && config.numberOfQuestions > 0
      : config.subject !== "" && config.topics.length > 0 && config.numberOfQuestions > 0;

  // Start test
  const handleStartTest = async () => {
    if (!isValid) return;

    setIsLoading(true);

    try {
      const subjectName =
        testMode === "general"
          ? `General ${config.examBoard.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Practice`
          : selectedSubject?.name || config.subject;
      const topicsForRequest = testMode === "general" ? [] : config.topics;

      // Try to generate test paper using n8n API
      const n8nResponse = await generateTestPaper(
        subjectName,
        topicsForRequest,
        config.numberOfQuestions,
        config.difficulty,
        config.examBoard,
        config.targetGrade
      );

      let testPaper;

      if (n8nResponse) {
        // Transform n8n response to app format
        testPaper = transformN8nTestPaper(n8nResponse);
        testPaper.metadata.examBoard = config.examBoard;
        testPaper.metadata.targetGrade = config.targetGrade;
        console.log("Test generated via n8n API");
      } else {
        // Fallback to mock data if n8n is unavailable
        console.log("n8n unavailable, using mock data");
        testPaper = generateMockTestPaper({
          subject: testMode === "general" ? "general" : config.subject,
          topics: testMode === "general" ? [] : config.topics,
          numberOfQuestions: config.numberOfQuestions,
          difficulty: config.difficulty,
        });
        testPaper.metadata.examBoard = config.examBoard;
        testPaper.metadata.targetGrade = config.targetGrade;
      }

      // Store test paper in sessionStorage for the test page
      sessionStorage.setItem("currentTest", JSON.stringify(testPaper));

      // Navigate to test page
      router.push(`/dashboard/test/${testPaper.id}`);
    } catch (error) {
      console.error("Error generating test:", error);
      // Fallback to mock on error
      const testPaper = generateMockTestPaper({
        subject: testMode === "general" ? "general" : config.subject,
        topics: testMode === "general" ? [] : config.topics,
        numberOfQuestions: config.numberOfQuestions,
        difficulty: config.difficulty,
      });
      testPaper.metadata.examBoard = config.examBoard;
      testPaper.metadata.targetGrade = config.targetGrade;
      sessionStorage.setItem("currentTest", JSON.stringify(testPaper));
      router.push(`/dashboard/test/${testPaper.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <PageHeader
        title="Create Test"
        description="Configure your syllabus-specific test — calibrated to real grade boundaries and assessment criteria."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Create Test" },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Configuration Section */}
        <div className="lg:col-span-2 space-y-8">

          {/* Mode Toggle */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                mode: "subject" as const,
                label: "Subject Test",
                description: "Pick subject, topics & difficulty",
                icon: "📖",
              },
              {
                mode: "general" as const,
                label: "General Practice",
                description: "Grade-level test across all topics — AI picks the content",
                icon: "🎯",
              },
            ].map(({ mode, label, description, icon }) => (
              <Card
                key={mode}
                onClick={() => setTestMode(mode)}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  testMode === mode
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border"
                }`}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          {/* Step 0: Exam Board & Target Grade */}
          <section>
            <ExamBoardSelector
              selectedBoard={config.examBoard}
              selectedTargetGrade={config.targetGrade}
              onBoardChange={handleExamBoardChange}
              onTargetGradeChange={handleTargetGradeChange}
            />
          </section>

          {/* Subject + Topic selection — only in subject mode */}
          {testMode === "subject" && (
            <>
              <Separator />

              <section>
                <SubjectSelector
                  subjects={mockSubjects}
                  selectedSubject={config.subject}
                  onSelect={handleSubjectSelect}
                />
              </section>

              <Separator />

              <section>
                <TopicSelector
                  topics={selectedSubject?.topics || []}
                  selectedTopics={config.topics}
                  onToggle={handleTopicToggle}
                  onSelectAll={handleSelectAllTopics}
                  onClearAll={handleClearAllTopics}
                />
              </section>
            </>
          )}

          <Separator />

          {/* Question Type & Difficulty */}
          <section>
            <DifficultySelector
              distribution={config.difficulty}
              questionType={config.questionType}
              totalQuestions={config.numberOfQuestions}
              onDistributionChange={handleDifficultyChange}
              onQuestionTypeChange={handleQuestionTypeChange}
              onTotalQuestionsChange={handleTotalQuestionsChange}
              maxQuestions={50}
            />
          </section>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <TestConfigSummary
            config={config}
            subject={selectedSubject}
            onStartTest={handleStartTest}
            isValid={isValid}
            isLoading={isLoading}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function TestBuilderPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TestBuilderContent />
    </Suspense>
  );
}
