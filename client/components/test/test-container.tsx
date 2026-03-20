"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { TestTimer, CompactTimer } from "./test-timer";
import { TestProgress, LinearTestProgress } from "./test-progress";
import { QuestionCard } from "./question-card";
import { NavigationButtons, FloatingNavigation } from "./navigation-buttons";
import { SubmitDialog } from "./submit-dialog";
import { useTimer } from "@/hooks/use-timer";
import { useTest } from "@/hooks/use-test";
import { useIntegrity } from "@/hooks/use-integrity";
import { useQuestionTimer } from "@/hooks/use-question-timer";
import { TestPaper, TestResults } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { saveTestResult } from "@/lib/test-storage";
import { IntegrityOverlay, QuestionTimerBar } from "./integrity-overlay";

interface TestContainerProps {
  testPaper: TestPaper;
}

export function TestContainer({ testPaper }: TestContainerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [direction, setDirection] = useState(0);

  // Timer hook
  const timer = useTimer({
    durationMinutes: testPaper.metadata.duration_minutes,
    onTimeUp: () => setShowSubmitDialog(true),
    autoStart: true,
  });

  // Test management hook
  const test = useTest({
    testPaper,
    onSubmit: (results: TestResults) => {
      if (user?.email) {
        saveTestResult(user.email, results);
      }
      sessionStorage.setItem("testResults", JSON.stringify(results));
      router.push(`/dashboard/results/${testPaper.id}`);
    },
  });

  const integritySettings = testPaper.metadata.integrity;

  // Integrity hook — tab detection, copy/paste, right-click, fullscreen
  const integrity = useIntegrity(integritySettings, async () => {
    await test.submitTest();
  });

  // Per-question countdown timer
  const questionTimer = useQuestionTimer({
    limitSeconds: integritySettings?.timePerQuestionSeconds ?? 0,
    questionIndex: test.currentIndex,
    onTimeUp: () => {
      if (test.canGoNext) {
        setDirection(1);
        test.nextQuestion();
      } else {
        setShowSubmitDialog(true);
      }
    },
  });

  const handleNavigate = useCallback(
    (newIndex: number) => {
      setDirection(newIndex > test.currentIndex ? 1 : -1);
      test.goToQuestion(newIndex);
    },
    [test.currentIndex, test.goToQuestion]
  );

  const handleNext = useCallback(() => {
    if (test.canGoNext) {
      setDirection(1);
      test.nextQuestion();
    }
  }, [test.canGoNext, test.nextQuestion]);

  const handlePrevious = useCallback(() => {
    if (test.canGoPrevious) {
      setDirection(-1);
      test.previousQuestion();
    }
  }, [test.canGoPrevious, test.previousQuestion]);

  const handleSubmitClick = () => {
    setShowSubmitDialog(true);
  };

  const handleConfirmSubmit = async () => {
    await test.submitTest();
    // Navigation is handled in the onSubmit callback
  };

  // Get flagged question IDs
  const flaggedQuestionIds = testPaper.questions
    .filter((q) => test.isFlagged(q.question_id))
    .map((q) => q.question_id);

  // Get answered question IDs
  const answeredQuestionIds = Object.keys(test.session.answers).filter(
    (id) => test.session.answers[id].answer.trim().length > 0
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Integrity overlay — warnings, paused state */}
      <IntegrityOverlay
        message={integrity.warningMessage}
        isPaused={integrity.isTestPaused}
        tabSwitchCount={integrity.tabSwitchCount}
        onDismiss={integrity.dismissWarning}
        onRequestFullScreen={integrity.requestFullScreen}
      />

      {/* Linear progress bar at top */}
      <LinearTestProgress
        current={test.currentIndex}
        total={test.totalQuestions}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Test title */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold truncate">
                  {testPaper.metadata.title}
                </h1>
                {testPaper.metadata.paper_style && (
                  <Badge variant="outline" className="shrink-0 text-xs capitalize">
                    {testPaper.metadata.paper_style.replace("_", " ")}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {testPaper.metadata.subject}
              </p>
            </div>

            {/* Timer */}
            <div className="hidden sm:block">
              <TestTimer
                formattedTime={timer.formattedTime}
                isRunning={timer.isRunning}
                isLowTime={timer.isLowTime}
                isCriticalTime={timer.isCriticalTime}
                percentageRemaining={timer.percentageRemaining}
              />
            </div>
            <div className="sm:hidden">
              <CompactTimer
                formattedTime={timer.formattedTime}
                isLowTime={timer.isLowTime}
                isCriticalTime={timer.isCriticalTime}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Per-question countdown timer bar */}
      {questionTimer.enabled && (
        <QuestionTimerBar
          secondsLeft={questionTimer.secondsLeft}
          percentage={questionTimer.percentage}
          isLow={questionTimer.isLow}
          isCritical={questionTimer.isCritical}
        />
      )}

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Question Card - Main content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait" custom={direction}>
              {test.currentQuestion && (
                <QuestionCard
                  key={test.currentQuestion.question_id}
                  question={test.currentQuestion}
                  questionNumber={test.currentIndex + 1}
                  totalQuestions={test.totalQuestions}
                  answer={test.currentAnswer}
                  isFlagged={test.isFlagged(test.currentQuestion.question_id)}
                  direction={direction}
                  onAnswerChange={(answer, optionId) => {
                    test.setAnswer(
                      test.currentQuestion!.question_id,
                      answer,
                      optionId
                    );
                  }}
                  onToggleFlag={() => {
                    test.toggleFlag(test.currentQuestion!.question_id);
                  }}
                />
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="mt-6">
              <NavigationButtons
                canGoPrevious={test.canGoPrevious}
                canGoNext={test.canGoNext}
                isLastQuestion={test.currentIndex === test.totalQuestions - 1}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleSubmitClick}
              />
            </div>
          </div>

          {/* Sidebar - Progress */}
          <div className="hidden lg:block">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <TestProgress
                  currentIndex={test.currentIndex}
                  totalQuestions={test.totalQuestions}
                  answeredQuestions={answeredQuestionIds}
                  flaggedQuestions={flaggedQuestionIds}
                  questionIds={testPaper.questions.map((q) => q.question_id)}
                  onQuestionClick={handleNavigate}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile floating navigation */}
      <FloatingNavigation
        canGoPrevious={test.canGoPrevious}
        canGoNext={test.canGoNext}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      {/* Submit dialog */}
      <SubmitDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        totalQuestions={test.totalQuestions}
        answeredQuestions={answeredQuestionIds.length}
        flaggedQuestions={flaggedQuestionIds.length}
        onConfirmSubmit={handleConfirmSubmit}
      />
    </div>
  );
}
