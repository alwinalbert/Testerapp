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
export type QuestionType =
  | "mcq"
  | "written"
  | "mixed"
  | "data_response"
  | "source_analysis"
  | "label_diagram"
  | "calculation"
  | "extended_essay"
  | "true_false_justify";

export type AnswerType = "free_text" | "structured" | "code" | "numeric" | "boolean";

// IB markband scoring
export interface BandDescriptor {
  band: number;
  range: string; // e.g. "3–4"
  descriptor: string;
}

// Sub-question used in data_response and source_analysis
export interface SubQuestion {
  id: string;
  text: string;
  marks: number;
  answer_guidance?: string;
}

// Calculation step
export interface CalculationStep {
  id: string;
  instruction: string;
  marks: number;
  expected?: string; // model answer for this step
}

// Extended essay rubric criterion
export interface RubricCriterion {
  criterion: string;
  max_marks: number;
  descriptor: string;
}

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
  paper_style?: "paper_1" | "paper_2" | "paper_3";
  integrity?: IntegritySettings;
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
  options?: MCQOption[];
  // Multimedia fields — populated by n8n when available
  image_url?: string;
  image_alt?: string;
  passage?: string;
  table?: { headers: string[]; rows: string[][] };
  audio_url?: string;
  video_url?: string;
  // Label-the-diagram fields
  label_positions?: LabelPosition[];
  // Data Response / Source Analysis — sub-questions
  sub_questions?: SubQuestion[];
  stimulus?: { type: "table" | "image" | "text"; content?: string; image_url?: string; headers?: string[]; rows?: string[][] };
  // Calculation with steps
  steps?: CalculationStep[];
  worked_solution?: string;
  // Extended essay
  rubric?: RubricCriterion[];
  word_guidance?: string;
  // True/False with justification
  statement?: string;
  is_true?: boolean;
  justification_prompt?: string;
  // IB-specific
  is_hl_extension?: boolean;
  markband_max?: 4 | 8;
  band_descriptors?: BandDescriptor[];
}

export interface LabelPosition {
  id: string;
  x: number; // % from left
  y: number; // % from top
  hint?: string;
}

export interface TestPaper {
  id: string;
  testno?: string;
  testid?: string;
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
  startedAt: Date;
  completedAt: Date;
  timeTaken: number; // in seconds
}

// ===== Academic Integrity Types =====

export interface IntegritySettings {
  /** Tier 2 — teacher-enabled per test */
  tabSwitchDetection: boolean;
  copyPasteBlocking: boolean;
  rightClickDisable: boolean;
  fullScreenMode: boolean;
  /** 0 = no limit per question */
  timePerQuestionSeconds: number;
  /** ISO datetime strings — empty string = no restriction */
  accessWindowStart: string;
  accessWindowEnd: string;
  singleAttemptLock: boolean;
}

export const DEFAULT_INTEGRITY: IntegritySettings = {
  tabSwitchDetection: false,
  copyPasteBlocking: false,
  rightClickDisable: false,
  fullScreenMode: false,
  timePerQuestionSeconds: 0,
  accessWindowStart: "",
  accessWindowEnd: "",
  singleAttemptLock: false,
};

// ===== Test Builder Types =====

export interface TestConfig {
  subject: string;
  topics: string[];
  questionType: QuestionType;
  difficulty: DifficultyDistribution;
  numberOfQuestions: number;
  examBoard: ExamBoard;
  targetGrade: string;
  integrity: IntegritySettings;
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
