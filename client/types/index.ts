// ===== Exam Board Types =====
export type ExamBoard =
  | "cambridge_igcse"
  | "edexcel_igcse"
  | "ib_diploma"
  | "a_levels"
  | "general";

// ===== User & Authentication Types =====

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  syllabus: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ===== Question Types =====

export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "mcq" | "written" | "mixed";
export type AnswerType = "free_text" | "structured" | "code" | "numeric" | "boolean";

export interface EvaluationContract {
  answer_type: AnswerType;
  must_include: string[];
  must_not_include: string[];
  required_steps: string[];
  format_constraints?: string;
  example_valid_answer?: string;
  example_invalid_answer?: string;
}

export interface Question {
  id: string;
  question_text: string;
  difficulty: Difficulty;
  Subject: string;
  Topic: string[];
  capability: string;
  evaluation_contract?: EvaluationContract;
}

export interface MCQOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface MCQQuestion extends Question {
  type: "mcq";
  options: MCQOption[];
}

export interface WrittenQuestion extends Question {
  type: "written";
  maxLength?: number;
}

// ===== Test Paper Types (from n8n Test Generator) =====

export interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

export interface TestMetadata {
  title: string;
  subject: string;
  topics: string[];
  total_questions: number;
  difficulty_distribution: DifficultyDistribution;
  duration_minutes: number;
  total_marks: number;
  examBoard?: ExamBoard;
  targetGrade?: string;
}

export interface TestQuestion {
  question_number: number;
  question_id: string;
  question_text: string;
  difficulty: Difficulty;
  topic: string;
  marks: number;
  capability: string;
  type?: QuestionType;
  options?: MCQOption[]; // For MCQ questions
}

export interface TestPaper {
  id: string;
  metadata: TestMetadata;
  questions: TestQuestion[];
  instructions: string;
  createdAt: Date;
}

// ===== User Answer Types =====

export interface UserAnswer {
  question_id: string;
  answer: string;
  selected_option_id?: string; // For MCQ
  time_spent_seconds: number;
  flagged?: boolean;
}

// ===== Test Session Types =====

export interface TestSession {
  testId: string;
  testPaper: TestPaper;
  answers: Record<string, UserAnswer>;
  currentQuestionIndex: number;
  startTime: Date;
  isSubmitted: boolean;
  isPaused: boolean;
}

// ===== Evaluation Types (from n8n Evaluator) =====

export interface Evaluation {
  question_id: string;
  marks: number;
  max_marks: number;
  report: string;
  is_correct: boolean;
}

export interface TopicPerformance {
  topic: string;
  score: number;
  maxScore: number;
  percentage: number;
  questionsCorrect: number;
  questionsTotal: number;
}

export interface TestResults {
  testId: string;
  testPaper: TestPaper;
  evaluations: Evaluation[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  topicPerformance: TopicPerformance[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  completedAt: Date;
  timeTaken: number; // in seconds
}

// ===== Test Builder Types =====

export interface TestConfig {
  subject: string;
  topics: string[];
  questionType: QuestionType;
  difficulty: DifficultyDistribution;
  numberOfQuestions: number;
  examBoard: ExamBoard;
  targetGrade: string;
}

// ===== Subject & Topic Types =====

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  topics: string[];
  questionCount: number;
  color: string;
}

// ===== Dashboard Types =====

export interface DashboardFilters {
  subject?: string;
  topic?: string;
  questionType?: QuestionType;
  difficulty?: Difficulty;
}

export interface RecentTest {
  id: string;
  title: string;
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: Date;
  questionsCount: number;
}

export interface DashboardStats {
  totalTests: number;
  averageScore: number;
  totalQuestions: number;
  strongestTopic: string;
  weakestTopic: string;
}

// ===== API Response Types =====

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
