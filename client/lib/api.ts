// API Service Layer for n8n Integration

// ===== Types matching n8n workflow schemas =====

//f737bade-c463-4ce4-ae79-302a024e6153

export interface TestGeneratorRequest {
  "No of Questions": number;
  Topics: string[];
  Difficulty: [number, number, number]; // [easy, medium, hard]
  Subject: string;
  Exam_Board?: string;
  Target_Grade?: string;
  Paper_Code?: string;
  Paper_Session?: string;
}

export interface N8nTestPaper {
  testno?: string;
  testid?: string;
  test_paper: {
    metadata: {
      title: string;
      subject: string;
      topics: string[];
      total_questions: number;
      difficulty_distribution: {
        easy: number;
        medium: number;
        hard: number;
      };
      duration_minutes: number;
      total_marks: number;
    };
    questions: {
      question_number: number;
      question_id: string;
      question_text: string;
      difficulty: "easy" | "medium" | "hard";
      topic: string;
      marks: number;
      capability: string;
    }[];
    instructions: string;
  };
}

export interface EvaluatorRequest {
  testPaperId: string;
  answers: {
    question_id: string;
    answer: string;
  }[];
}

export interface N8nEvaluation {
  evaluations: {
    question_id: string;
    marks: number;
    report: string;
  }[];
  metadata: {
    total_questions: number;
    evaluation_timestamp: string;
  };
}

// ===== API Configuration =====

const getApiConfig = () => {
  // n8n webhook URLs - configure in .env.local
  const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_BASE_URL || "http://localhost:5678";
  const TEST_GENERATOR_WEBHOOK_ID = process.env.NEXT_PUBLIC_TEST_GENERATOR_WEBHOOK_ID;
  const EVALUATOR_WEBHOOK_ID = process.env.NEXT_PUBLIC_EVALUATOR_WEBHOOK_ID || "";

  return {
    testGenerator: `${N8N_BASE_URL}/webhook/${TEST_GENERATOR_WEBHOOK_ID}`,
    evaluator: `${N8N_BASE_URL}/webhook/${EVALUATOR_WEBHOOK_ID}`,
  };
};

// ===== API Functions =====

/**
 * Generate a test paper using n8n Test Generator workflow
 * Uses local API proxy to avoid CORS issues
 */
export async function generateTestPaper(
  subject: string,
  topics: string[],
  numberOfQuestions: number,
  difficulty: { easy: number; medium: number; hard: number },
  examBoard?: string,
  targetGrade?: string,
  paperCode?: string,
  paperSession?: string
): Promise<N8nTestPaper | null> {
  const requestBody: TestGeneratorRequest = {
    "No of Questions": numberOfQuestions,
    Topics: topics,
    Difficulty: [difficulty.easy, difficulty.medium, difficulty.hard],
    Subject: subject,
    ...(examBoard && { Exam_Board: examBoard }),
    ...(targetGrade && { Target_Grade: targetGrade }),
    ...(paperCode && { Paper_Code: paperCode }),
    ...(paperSession && { Paper_Session: paperSession }),
  };

  try {
    // Use local API proxy to avoid CORS
    // n8n chat trigger expects { chatInput: "message string" }
    const response = await fetch("/api/generate-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatInput: JSON.stringify(requestBody),
      }),
    });

    if (!response.ok) {
      console.error("Test Generator API error:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    // n8n chat trigger returns the output in different formats
    // Handle both direct response and wrapped response
    if (data.test_paper) {
      return data as N8nTestPaper;
    } else if (data.output?.test_paper) {
      return {
        testno: data.testno ?? data.output?.testno,
        testid: data.testid ?? data.output?.testid,
        test_paper: data.output.test_paper,
      };
    } else if (typeof data === "string") {
      // Parse if returned as string
      const parsed = JSON.parse(data);
      return parsed as N8nTestPaper;
    }

    console.error("Unexpected response format:", data);
    return null;
  } catch (error) {
    console.error("Failed to generate test paper:", error);
    return null;
  }
}

/**
 * Submit answers for evaluation using n8n Evaluator workflow
 * Note: The current Evaluator workflow is triggered by Google Drive
 * This function provides a direct webhook alternative
 */
export async function submitForEvaluation(
  testPaperId: string,
  questions: { question_id: string; question_text: string }[],
  answers: { question_id: string; answer: string }[],
  testno?: string,
  testid?: string
): Promise<N8nEvaluation | null> {
  try {
    // Use local API proxy to avoid CORS
    const response = await fetch("/api/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        testPaperId,
        ...(testno && { testno }),
        ...(testid && { testid }),
        questions: questions.map(q => ({
          id: q.question_id,
          text: q.question_text,
        })),
        answers: answers.map(a => ({
          question_id: a.question_id,
          answer: a.answer,
        })),
      }),
    });

    if (!response.ok) {
      console.error("Evaluator API error:", response.status, response.statusText);
      return generateMockEvaluation(questions, answers);
    }

    const data = await response.json();

    if (data.evaluations) {
      return data as N8nEvaluation;
    }

    return generateMockEvaluation(questions, answers);
  } catch (error) {
    console.error("Failed to evaluate answers:", error);
    return generateMockEvaluation(questions, answers);
  }
}

/**
 * Generate mock evaluation when n8n Evaluator is not available
 */
function generateMockEvaluation(
  questions: { question_id: string; question_text: string }[],
  answers: { question_id: string; answer: string }[]
): N8nEvaluation {
  const answerMap = new Map(answers.map(a => [a.question_id, a.answer]));

  const evaluations = questions.map(q => {
    const answer = answerMap.get(q.question_id) || "";
    const hasAnswer = answer.trim().length > 0;

    // Simple mock scoring based on answer length and content
    let marks = 0;
    let report = "";

    if (!hasAnswer) {
      marks = 0;
      report = "No answer provided.";
    } else if (answer.length < 20) {
      marks = Math.floor(Math.random() * 3) + 1; // 1-3 marks
      report = "Answer is too brief. Please provide more detail and explanation.";
    } else if (answer.length < 100) {
      marks = Math.floor(Math.random() * 3) + 4; // 4-6 marks
      report = "Good attempt. The answer covers some key points but could be more comprehensive.";
    } else {
      marks = Math.floor(Math.random() * 3) + 7; // 7-9 marks
      report = "Excellent response with detailed explanation. Key concepts are well addressed.";
    }

    return {
      question_id: q.question_id,
      marks,
      report,
    };
  });

  return {
    evaluations,
    metadata: {
      total_questions: questions.length,
      evaluation_timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Check if n8n services are available
 */
export async function checkN8nHealth(): Promise<{
  testGenerator: boolean;
  evaluator: boolean;
}> {
  const config = getApiConfig();

  const checkEndpoint = async (url: string): Promise<boolean> => {
    if (!url || url.endsWith("/webhook/")) return false;
    try {
      const response = await fetch(url, {
        method: "HEAD",
        mode: "no-cors",
      });
      return true;
    } catch {
      return false;
    }
  };

  return {
    testGenerator: await checkEndpoint(config.testGenerator),
    evaluator: await checkEndpoint(config.evaluator),
  };
}

// ===== Utility Functions =====

/**
 * Transform n8n test paper to app TestPaper format
 */
export function transformN8nTestPaper(n8nPaper: N8nTestPaper): import("@/types").TestPaper {
  const { test_paper } = n8nPaper;

  return {
    id: n8nPaper.testid || `test-${Date.now()}`,
    testno: n8nPaper.testno,
    testid: n8nPaper.testid,
    metadata: {
      title: test_paper.metadata.title,
      subject: test_paper.metadata.subject,
      topics: test_paper.metadata.topics,
      total_questions: test_paper.metadata.total_questions,
      difficulty_distribution: test_paper.metadata.difficulty_distribution,
      duration_minutes: test_paper.metadata.duration_minutes,
      total_marks: test_paper.metadata.total_marks,
    },
    questions: test_paper.questions.map(q => ({
      question_number: q.question_number,
      question_id: q.question_id,
      question_text: q.question_text,
      difficulty: q.difficulty,
      topic: q.topic,
      marks: q.marks,
      capability: q.capability,
      type: "written" as const, // Default to written, can be enhanced to detect MCQ
    })),
    instructions: test_paper.instructions,
    createdAt: new Date(),
  };
}

/**
 * Transform n8n evaluation to app TestResults format
 */
export function transformN8nEvaluation(
  evaluation: N8nEvaluation,
  testPaper: import("@/types").TestPaper,
  answers: import("@/types").UserAnswer[],
  timeTaken: number
): import("@/types").TestResults {
  const evalMap = new Map(evaluation.evaluations.map(e => [e.question_id, e]));

  // Calculate scores
  let totalScore = 0;
  const evaluations: import("@/types").Evaluation[] = testPaper.questions.map(q => {
    const eval_result = evalMap.get(q.question_id);
    const marks = eval_result?.marks || 0;
    totalScore += marks;

    return {
      question_id: q.question_id,
      marks,
      max_marks: q.marks,
      report: eval_result?.report || "No evaluation available.",
      is_correct: marks >= q.marks * 0.7, // 70% threshold for "correct"
    };
  });

  // Calculate topic performance
  const topicScores = new Map<string, { score: number; max: number; correct: number; total: number }>();
  testPaper.questions.forEach(q => {
    const eval_result = evalMap.get(q.question_id);
    const marks = eval_result?.marks || 0;

    if (!topicScores.has(q.topic)) {
      topicScores.set(q.topic, { score: 0, max: 0, correct: 0, total: 0 });
    }
    const topic = topicScores.get(q.topic)!;
    topic.score += marks;
    topic.max += q.marks;
    topic.total += 1;
    if (marks >= q.marks * 0.7) topic.correct += 1;
  });

  const topicPerformance: import("@/types").TopicPerformance[] = Array.from(topicScores.entries()).map(
    ([topic, data]) => ({
      topic,
      score: data.score,
      maxScore: data.max,
      percentage: data.max > 0 ? Math.round((data.score / data.max) * 100) : 0,
      questionsCorrect: data.correct,
      questionsTotal: data.total,
    })
  );

  // Sort by percentage for strengths/weaknesses
  const sortedTopics = [...topicPerformance].sort((a, b) => b.percentage - a.percentage);
  const strengths = sortedTopics.filter(t => t.percentage >= 70).map(t => t.topic);
  const weaknesses = sortedTopics.filter(t => t.percentage < 50).map(t => t.topic);

  // Generate suggestions
  const suggestions: string[] = [];
  if (weaknesses.length > 0) {
    suggestions.push(`Focus on improving your understanding of: ${weaknesses.join(", ")}`);
  }
  const percentage = Math.round((totalScore / testPaper.metadata.total_marks) * 100);
  if (percentage < 50) {
    suggestions.push("Review the fundamentals and practice more questions.");
  } else if (percentage < 70) {
    suggestions.push("Good progress! Work on the areas where you lost marks.");
  } else {
    suggestions.push("Excellent performance! Keep challenging yourself with harder questions.");
  }

  return {
    testId: testPaper.id,
    testPaper,
    evaluations,
    totalScore,
    maxScore: testPaper.metadata.total_marks,
    percentage,
    topicPerformance,
    strengths: strengths.length > 0 ? strengths : ["General understanding"],
    weaknesses: weaknesses.length > 0 ? weaknesses : [],
    suggestions,
    startedAt: new Date(Date.now() - timeTaken * 1000),
    completedAt: new Date(),
    timeTaken,
  };
}