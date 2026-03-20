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
  PaperSelector,
  IntegritySettingsPanel,
} from "@/components/test-builder";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { generateMockTestPaper } from "@/data/mock";
import { getSubjectsForBoard } from "@/data/subjects";
import { TestConfig, DifficultyDistribution, QuestionType, ExamBoard, DEFAULT_INTEGRITY } from "@/types";
import { PastPaper } from "@/data/past-papers";
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
    integrity: DEFAULT_INTEGRITY,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [testMode, setTestMode] = useState<"subject" | "general" | "paper">("subject");
  const [selectedPaper, setSelectedPaper] = useState<PastPaper | null>(null);
  const [selectedSession, setSelectedSession] = useState<string>("");

  // Subjects filtered by selected exam board
  const boardSubjects = getSubjectsForBoard(config.examBoard);

  // Get the selected subject data
  const selectedSubject = boardSubjects.find((s) => s.id === config.subject);

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
    const subject = boardSubjects.find((s) => s.id === subjectId);
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
    setConfig((prev) => ({ ...prev, examBoard: board, targetGrade: "", subject: "", topics: [] }));
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

  // Validation
  const isValid =
    testMode === "paper"
      ? selectedPaper !== null && selectedSession !== ""
      : testMode === "general"
      ? config.targetGrade !== "" && config.numberOfQuestions > 0
      : config.subject !== "" && config.topics.length > 0 && config.numberOfQuestions > 0;

  // Start test
  const handleStartTest = async () => {
    if (!isValid) return;

    setIsLoading(true);

    try {
      const subjectName =
        testMode === "paper"
          ? selectedPaper!.subject
          : testMode === "general"
          ? `General ${config.examBoard.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Practice`
          : selectedSubject?.name || config.subject;
      const topicsForRequest = testMode === "subject" ? config.topics : [];
      const questionsCount =
        testMode === "paper"
          ? selectedPaper!.sections.reduce((sum, s) => sum + s.questionCount, 0)
          : config.numberOfQuestions;

      // Try to generate test paper using n8n API
      const n8nResponse = await generateTestPaper(
        subjectName,
        topicsForRequest,
        questionsCount,
        config.difficulty,
        testMode === "paper" ? selectedPaper!.examBoard : config.examBoard,
        config.targetGrade,
        testMode === "paper" ? selectedPaper!.code : undefined,
        testMode === "paper" ? selectedSession : undefined
      );

      let testPaper;
      const activeExamBoard = testMode === "paper" ? selectedPaper!.examBoard : config.examBoard;

      if (n8nResponse) {
        testPaper = transformN8nTestPaper(n8nResponse);
        testPaper.metadata.examBoard = activeExamBoard;
        testPaper.metadata.targetGrade = config.targetGrade;
        testPaper.metadata.integrity = config.integrity;
        console.log("Test generated via n8n API");
      } else {
        console.log("n8n unavailable, using mock data");
        testPaper = generateMockTestPaper({
          subject: testMode === "paper" ? selectedPaper!.subject : testMode === "general" ? "general" : config.subject,
          topics: testMode === "subject" ? config.topics : [],
          numberOfQuestions: questionsCount,
          difficulty: config.difficulty,
        });
        testPaper.metadata.examBoard = activeExamBoard;
        testPaper.metadata.targetGrade = config.targetGrade;
        testPaper.metadata.integrity = config.integrity;
      }

      // Store test paper in sessionStorage for the test page
      sessionStorage.setItem("currentTest", JSON.stringify(testPaper));

      // Navigate to test page
      router.push(`/dashboard/test/${testPaper.id}`);
    } catch (error) {
      console.error("Error generating test:", error);
      const fallback = generateMockTestPaper({
        subject: testMode === "paper" ? selectedPaper!.subject : testMode === "general" ? "general" : config.subject,
        topics: testMode === "subject" ? config.topics : [],
        numberOfQuestions: config.numberOfQuestions,
        difficulty: config.difficulty,
      });
      fallback.metadata.examBoard = testMode === "paper" ? selectedPaper!.examBoard : config.examBoard;
      fallback.metadata.targetGrade = config.targetGrade;
      fallback.metadata.integrity = config.integrity;
      sessionStorage.setItem("currentTest", JSON.stringify(fallback));
      router.push(`/dashboard/test/${fallback.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8 pb-24"
    >
      <PageHeader
        title="Create Test"
        description="Configure your syllabus-specific test — calibrated to real grade boundaries and assessment criteria."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Configuration Section */}
        <div className="lg:col-span-2 space-y-8">

          {/* Mode Toggle */}
          <div className="grid grid-cols-3 gap-3">
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
                description: "Grade-level test across all topics",
                icon: "🎯",
              },
              {
                mode: "paper" as const,
                label: "Exam Paper",
                description: "Recreate a real exam paper by code & session",
                icon: "📄",
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

          {/* Subject + Topic selection — subject mode only */}
          {testMode === "subject" && (
            <>
              <Separator />
              <section>
                <SubjectSelector
                  subjects={boardSubjects}
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
                  topicCodes={selectedSubject?.topicCodes}
                />
              </section>
            </>
          )}

          {/* Paper selector — paper mode only */}
          {testMode === "paper" && (
            <>
              <Separator />
              <section>
                <PaperSelector
                  examBoard={config.examBoard}
                  selectedPaper={selectedPaper}
                  selectedSession={selectedSession}
                  onPaperChange={setSelectedPaper}
                  onSessionChange={setSelectedSession}
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

          <Separator />

          {/* Academic Integrity Settings */}
          <section>
            <IntegritySettingsPanel
              settings={config.integrity}
              onChange={(integrity) => setConfig((prev) => ({ ...prev, integrity }))}
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
