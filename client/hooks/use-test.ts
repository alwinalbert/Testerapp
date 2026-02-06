"use client";

import { useState, useCallback, useEffect } from "react";
import { TestPaper, TestSession, UserAnswer, TestResults, Evaluation } from "@/types";
import { mockTestResults } from "@/data/mock";
import { submitForEvaluation, transformN8nEvaluation } from "@/lib/api";

interface UseTestOptions {
  testPaper: TestPaper;
  onSubmit?: (results: TestResults) => void;
}

interface UseTestReturn {
  /** Current test session */
  session: TestSession;
  /** Current question index (0-based) */
  currentIndex: number;
  /** Current question */
  currentQuestion: TestPaper["questions"][0] | undefined;
  /** Current answer for the question */
  currentAnswer: UserAnswer | undefined;
  /** Total number of questions */
  totalQuestions: number;
  /** Number of answered questions */
  answeredCount: number;
  /** Whether all questions are answered */
  allAnswered: boolean;
  /** Progress percentage */
  progress: number;
  /** Set answer for a question */
  setAnswer: (questionId: string, answer: string, optionId?: string) => void;
  /** Navigate to specific question */
  goToQuestion: (index: number) => void;
  /** Go to next question */
  nextQuestion: () => void;
  /** Go to previous question */
  previousQuestion: () => void;
  /** Flag/unflag question */
  toggleFlag: (questionId: string) => void;
  /** Check if question is flagged */
  isFlagged: (questionId: string) => boolean;
  /** Submit the test */
  submitTest: () => Promise<TestResults>;
  /** Whether the test is submitted */
  isSubmitted: boolean;
  /** Check if can go next */
  canGoNext: boolean;
  /** Check if can go previous */
  canGoPrevious: boolean;
}

export function useTest({ testPaper, onSubmit }: UseTestOptions): UseTestReturn {
  const [session, setSession] = useState<TestSession>({
    testId: testPaper.id,
    testPaper,
    answers: {},
    currentQuestionIndex: 0,
    startTime: new Date(),
    isSubmitted: false,
    isPaused: false,
  });

  const [startTimes, setStartTimes] = useState<Record<string, number>>({});

  // Track time spent on each question
  useEffect(() => {
    const questionId = testPaper.questions[session.currentQuestionIndex]?.question_id;
    if (questionId && !startTimes[questionId]) {
      setStartTimes((prev) => ({
        ...prev,
        [questionId]: Date.now(),
      }));
    }
  }, [session.currentQuestionIndex, testPaper.questions, startTimes]);

  const currentQuestion = testPaper.questions[session.currentQuestionIndex];
  const currentAnswer = currentQuestion
    ? session.answers[currentQuestion.question_id]
    : undefined;

  const totalQuestions = testPaper.questions.length;
  const answeredCount = Object.keys(session.answers).length;
  const allAnswered = answeredCount === totalQuestions;
  const progress = (answeredCount / totalQuestions) * 100;

  const setAnswer = useCallback(
    (questionId: string, answer: string, optionId?: string) => {
      const timeSpent = startTimes[questionId]
        ? Math.floor((Date.now() - startTimes[questionId]) / 1000)
        : 0;

      setSession((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: {
            question_id: questionId,
            answer,
            selected_option_id: optionId,
            time_spent_seconds:
              (prev.answers[questionId]?.time_spent_seconds || 0) + timeSpent,
            flagged: prev.answers[questionId]?.flagged || false,
          },
        },
      }));

      // Reset start time for this question
      setStartTimes((prev) => ({
        ...prev,
        [questionId]: Date.now(),
      }));
    },
    [startTimes]
  );

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalQuestions) {
        setSession((prev) => ({
          ...prev,
          currentQuestionIndex: index,
        }));
      }
    },
    [totalQuestions]
  );

  const nextQuestion = useCallback(() => {
    goToQuestion(session.currentQuestionIndex + 1);
  }, [session.currentQuestionIndex, goToQuestion]);

  const previousQuestion = useCallback(() => {
    goToQuestion(session.currentQuestionIndex - 1);
  }, [session.currentQuestionIndex, goToQuestion]);

  const toggleFlag = useCallback((questionId: string) => {
    setSession((prev) => {
      const currentAnswer = prev.answers[questionId];
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: {
            ...currentAnswer,
            question_id: questionId,
            answer: currentAnswer?.answer || "",
            time_spent_seconds: currentAnswer?.time_spent_seconds || 0,
            flagged: !currentAnswer?.flagged,
          },
        },
      };
    });
  }, []);

  const isFlagged = useCallback(
    (questionId: string) => {
      return session.answers[questionId]?.flagged || false;
    },
    [session.answers]
  );

  const submitTest = useCallback(async (): Promise<TestResults> => {
    // Calculate time taken
    const timeTaken = Math.floor(
      (Date.now() - session.startTime.getTime()) / 1000
    );

    // Prepare questions and answers for API
    const questions = testPaper.questions.map((q) => ({
      question_id: q.question_id,
      question_text: q.question_text,
    }));

    const answers = Object.values(session.answers).map((a) => ({
      question_id: a.question_id,
      answer: a.answer,
    }));

    let results: TestResults;

    try {
      // Try to evaluate using n8n API
      const n8nEvaluation = await submitForEvaluation(
        session.testId,
        questions,
        answers
      );

      if (n8nEvaluation) {
        // Transform n8n evaluation to app format
        results = transformN8nEvaluation(
          n8nEvaluation,
          testPaper,
          Object.values(session.answers),
          timeTaken
        );
        console.log("Test evaluated via n8n API");
      } else {
        // Fallback to mock evaluation
        results = generateMockResults();
      }
    } catch (error) {
      console.error("Error evaluating test:", error);
      // Fallback to mock evaluation on error
      results = generateMockResults();
    }

    setSession((prev) => ({
      ...prev,
      isSubmitted: true,
    }));

    onSubmit?.(results);

    return results;

    // Helper function for mock results
    function generateMockResults(): TestResults {
      const evaluations: Evaluation[] = testPaper.questions.map((q) => {
        const answer = session.answers[q.question_id];
        const hasAnswer = answer && answer.answer.trim().length > 0;

        // Random scoring for demo
        const scorePercentage = hasAnswer ? Math.random() * 0.4 + 0.5 : 0;
        const marks = Math.round(q.marks * scorePercentage);

        return {
          question_id: q.question_id,
          marks,
          max_marks: q.marks,
          report: hasAnswer
            ? marks >= q.marks * 0.7
              ? "Good answer with strong understanding."
              : "Partial understanding. Consider reviewing this topic."
            : "No answer provided.",
          is_correct: marks >= q.marks * 0.7,
        };
      });

      const totalScore = evaluations.reduce((sum, e) => sum + e.marks, 0);
      const maxScore = evaluations.reduce((sum, e) => sum + e.max_marks, 0);

      return {
        ...mockTestResults,
        testId: session.testId,
        testPaper,
        evaluations,
        totalScore,
        maxScore,
        percentage: Math.round((totalScore / maxScore) * 100),
        completedAt: new Date(),
        timeTaken,
      };
    }
  }, [session, testPaper, onSubmit]);

  return {
    session,
    currentIndex: session.currentQuestionIndex,
    currentQuestion,
    currentAnswer,
    totalQuestions,
    answeredCount,
    allAnswered,
    progress,
    setAnswer,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    toggleFlag,
    isFlagged,
    submitTest,
    isSubmitted: session.isSubmitted,
    canGoNext: session.currentQuestionIndex < totalQuestions - 1,
    canGoPrevious: session.currentQuestionIndex > 0,
  };
}
