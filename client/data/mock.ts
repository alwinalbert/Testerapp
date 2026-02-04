import {
  Subject,
  TestPaper,
  TestQuestion,
  RecentTest,
  DashboardStats,
  TestResults,
  Evaluation,
  TopicPerformance,
  MCQOption,
} from "@/types";

// ===== Subjects =====

export const mockSubjects: Subject[] = [
  {
    id: "english",
    name: "English Language Arts",
    description: "Reading comprehension, writing skills, grammar, and literature",
    icon: "BookOpen",
    topics: [
      "Literary Analysis",
      "Writing Skills",
      "Grammar & Syntax",
      "Vocabulary",
      "Reading Comprehension",
      "Creative Writing",
    ],
    questionCount: 156,
    color: "#4285f4",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Algebra, geometry, calculus, and statistics",
    icon: "Calculator",
    topics: [
      "Algebra",
      "Geometry",
      "Trigonometry",
      "Calculus",
      "Statistics",
      "Number Theory",
    ],
    questionCount: 203,
    color: "#34a853",
  },
  {
    id: "science",
    name: "Science",
    description: "Physics, chemistry, biology, and environmental science",
    icon: "Atom",
    topics: [
      "Physics",
      "Chemistry",
      "Biology",
      "Environmental Science",
      "Earth Science",
    ],
    questionCount: 178,
    color: "#fbbc04",
  },
  {
    id: "history",
    name: "History",
    description: "World history, civilizations, and historical events",
    icon: "Landmark",
    topics: [
      "Ancient History",
      "Medieval History",
      "Modern History",
      "World Wars",
      "Political History",
    ],
    questionCount: 124,
    color: "#ea4335",
  },
  {
    id: "geography",
    name: "Geography",
    description: "Physical geography, human geography, and cartography",
    icon: "Globe",
    topics: [
      "Physical Geography",
      "Human Geography",
      "Cartography",
      "Climate & Weather",
      "Population Studies",
    ],
    questionCount: 98,
    color: "#9c27b0",
  },
  {
    id: "computer-science",
    name: "Computer Science",
    description: "Programming, algorithms, data structures, and systems",
    icon: "Code",
    topics: [
      "Programming Basics",
      "Data Structures",
      "Algorithms",
      "Web Development",
      "Database Systems",
    ],
    questionCount: 145,
    color: "#00bcd4",
  },
];

// ===== Generate MCQ Options =====

function generateMCQOptions(questionId: string, topic: string): MCQOption[] {
  // Generate plausible options based on topic
  const options = [
    { id: `${questionId}-a`, text: "Option A - This is the first choice", isCorrect: true },
    { id: `${questionId}-b`, text: "Option B - This is the second choice", isCorrect: false },
    { id: `${questionId}-c`, text: "Option C - This is the third choice", isCorrect: false },
    { id: `${questionId}-d`, text: "Option D - This is the fourth choice", isCorrect: false },
  ];

  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
}

// ===== Mock Test Questions =====

export const mockQuestions: TestQuestion[] = [
  {
    question_number: 1,
    question_id: "q1",
    question_text: "Analyze the use of symbolism in the following passage and explain how it contributes to the overall theme of the text.",
    difficulty: "medium",
    topic: "Literary Analysis",
    marks: 5,
    capability: "Critical thinking and textual analysis",
    type: "written",
  },
  {
    question_number: 2,
    question_id: "q2",
    question_text: "Which of the following best describes the author's tone in the passage?",
    difficulty: "easy",
    topic: "Reading Comprehension",
    marks: 3,
    capability: "Tone identification",
    type: "mcq",
    options: generateMCQOptions("q2", "Reading Comprehension"),
  },
  {
    question_number: 3,
    question_id: "q3",
    question_text: "Identify and correct the grammatical errors in the following sentence: 'The team have been playing good since the start of the season.'",
    difficulty: "easy",
    topic: "Grammar & Syntax",
    marks: 3,
    capability: "Grammar correction",
    type: "written",
  },
  {
    question_number: 4,
    question_id: "q4",
    question_text: "What is the primary function of a thesis statement in an essay?",
    difficulty: "easy",
    topic: "Writing Skills",
    marks: 3,
    capability: "Essay structure understanding",
    type: "mcq",
    options: generateMCQOptions("q4", "Writing Skills"),
  },
  {
    question_number: 5,
    question_id: "q5",
    question_text: "Write a paragraph (100-150 words) arguing for or against the use of social media in education. Support your argument with at least two specific examples.",
    difficulty: "hard",
    topic: "Writing Skills",
    marks: 8,
    capability: "Argumentative writing",
    type: "written",
  },
];

// ===== Mock Test Paper =====

export const mockTestPaper: TestPaper = {
  id: "test-001",
  metadata: {
    title: "English Language Arts Assessment",
    subject: "English Language Arts",
    topics: ["Literary Analysis", "Writing Skills", "Grammar & Syntax", "Reading Comprehension"],
    total_questions: 10,
    difficulty_distribution: {
      easy: 4,
      medium: 4,
      hard: 2,
    },
    duration_minutes: 45,
    total_marks: 50,
  },
  questions: [
    {
      question_number: 1,
      question_id: "q1",
      question_text: "Which of the following best describes the primary purpose of a metaphor in literature?",
      difficulty: "easy",
      topic: "Literary Analysis",
      marks: 3,
      capability: "Literary device identification",
      type: "mcq",
      options: [
        { id: "q1-a", text: "To create a direct comparison using 'like' or 'as'", isCorrect: false },
        { id: "q1-b", text: "To make an implicit comparison between two unlike things", isCorrect: true },
        { id: "q1-c", text: "To give human qualities to non-human things", isCorrect: false },
        { id: "q1-d", text: "To exaggerate for emphasis or effect", isCorrect: false },
      ],
    },
    {
      question_number: 2,
      question_id: "q2",
      question_text: "Read the following passage and identify the author's main argument. Provide evidence from the text to support your answer.",
      difficulty: "medium",
      topic: "Reading Comprehension",
      marks: 5,
      capability: "Text analysis and evidence extraction",
      type: "written",
    },
    {
      question_number: 3,
      question_id: "q3",
      question_text: "Select the sentence that uses correct subject-verb agreement:",
      difficulty: "easy",
      topic: "Grammar & Syntax",
      marks: 3,
      capability: "Grammar rules application",
      type: "mcq",
      options: [
        { id: "q3-a", text: "The group of students are studying for their exam.", isCorrect: false },
        { id: "q3-b", text: "Neither the teacher nor the students was prepared.", isCorrect: false },
        { id: "q3-c", text: "Each of the participants has completed the survey.", isCorrect: true },
        { id: "q3-d", text: "The news are surprising to everyone.", isCorrect: false },
      ],
    },
    {
      question_number: 4,
      question_id: "q4",
      question_text: "Explain how the protagonist's character develops throughout the story. Use specific examples from the text.",
      difficulty: "hard",
      topic: "Literary Analysis",
      marks: 8,
      capability: "Character analysis",
      type: "written",
    },
    {
      question_number: 5,
      question_id: "q5",
      question_text: "Which transition word would best connect these two sentences: 'The experiment failed. The scientists learned valuable information.'",
      difficulty: "easy",
      topic: "Writing Skills",
      marks: 3,
      capability: "Transition usage",
      type: "mcq",
      options: [
        { id: "q5-a", text: "Therefore", isCorrect: false },
        { id: "q5-b", text: "However", isCorrect: false },
        { id: "q5-c", text: "Nevertheless", isCorrect: true },
        { id: "q5-d", text: "Furthermore", isCorrect: false },
      ],
    },
    {
      question_number: 6,
      question_id: "q6",
      question_text: "Write a thesis statement for an essay about the impact of technology on modern communication.",
      difficulty: "medium",
      topic: "Writing Skills",
      marks: 5,
      capability: "Thesis development",
      type: "written",
    },
    {
      question_number: 7,
      question_id: "q7",
      question_text: "What is the effect of using short, choppy sentences in a narrative?",
      difficulty: "medium",
      topic: "Literary Analysis",
      marks: 5,
      capability: "Style analysis",
      type: "mcq",
      options: [
        { id: "q7-a", text: "It creates a sense of calm and reflection", isCorrect: false },
        { id: "q7-b", text: "It builds tension or urgency", isCorrect: true },
        { id: "q7-c", text: "It shows the character is educated", isCorrect: false },
        { id: "q7-d", text: "It indicates a formal tone", isCorrect: false },
      ],
    },
    {
      question_number: 8,
      question_id: "q8",
      question_text: "Identify the type of irony used in this situation: 'A fire station burns down.'",
      difficulty: "easy",
      topic: "Literary Analysis",
      marks: 3,
      capability: "Irony identification",
      type: "mcq",
      options: [
        { id: "q8-a", text: "Verbal irony", isCorrect: false },
        { id: "q8-b", text: "Dramatic irony", isCorrect: false },
        { id: "q8-c", text: "Situational irony", isCorrect: true },
        { id: "q8-d", text: "Cosmic irony", isCorrect: false },
      ],
    },
    {
      question_number: 9,
      question_id: "q9",
      question_text: "Compare and contrast two characters from the text, focusing on their motivations and how they respond to conflict.",
      difficulty: "hard",
      topic: "Literary Analysis",
      marks: 8,
      capability: "Comparative analysis",
      type: "written",
    },
    {
      question_number: 10,
      question_id: "q10",
      question_text: "Rewrite the following sentence in active voice: 'The ball was thrown by the player across the field.'",
      difficulty: "medium",
      topic: "Grammar & Syntax",
      marks: 5,
      capability: "Voice transformation",
      type: "written",
    },
  ],
  instructions: "Read all questions carefully before answering. For multiple-choice questions, select the best answer. For written responses, provide clear and well-structured answers. You have 45 minutes to complete this assessment.",
  createdAt: new Date(),
};

// ===== Recent Tests =====

export const mockRecentTests: RecentTest[] = [
  {
    id: "test-001",
    title: "English Literature Midterm",
    subject: "English Language Arts",
    score: 42,
    maxScore: 50,
    percentage: 84,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    questionsCount: 10,
  },
  {
    id: "test-002",
    title: "Mathematics Quiz - Algebra",
    subject: "Mathematics",
    score: 35,
    maxScore: 40,
    percentage: 88,
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    questionsCount: 8,
  },
  {
    id: "test-003",
    title: "Science Assessment - Physics",
    subject: "Science",
    score: 28,
    maxScore: 40,
    percentage: 70,
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    questionsCount: 10,
  },
  {
    id: "test-004",
    title: "History Chapter Test",
    subject: "History",
    score: 38,
    maxScore: 50,
    percentage: 76,
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    questionsCount: 12,
  },
];

// ===== Dashboard Stats =====

export const mockDashboardStats: DashboardStats = {
  totalTests: 24,
  averageScore: 79,
  totalQuestions: 312,
  strongestTopic: "Literary Analysis",
  weakestTopic: "Calculus",
};

// ===== Mock Test Results =====

export const mockTestResults: TestResults = {
  testId: "test-001",
  testPaper: mockTestPaper,
  evaluations: [
    { question_id: "q1", marks: 3, max_marks: 3, report: "Correct identification of metaphor.", is_correct: true },
    { question_id: "q2", marks: 4, max_marks: 5, report: "Good analysis but could include more textual evidence.", is_correct: true },
    { question_id: "q3", marks: 3, max_marks: 3, report: "Correct answer selected.", is_correct: true },
    { question_id: "q4", marks: 6, max_marks: 8, report: "Solid character analysis. Consider exploring more subtle character traits.", is_correct: true },
    { question_id: "q5", marks: 3, max_marks: 3, report: "Correct transition word identified.", is_correct: true },
    { question_id: "q6", marks: 4, max_marks: 5, report: "Clear thesis but could be more specific.", is_correct: true },
    { question_id: "q7", marks: 5, max_marks: 5, report: "Excellent understanding of narrative pacing.", is_correct: true },
    { question_id: "q8", marks: 3, max_marks: 3, report: "Correct identification of situational irony.", is_correct: true },
    { question_id: "q9", marks: 5, max_marks: 8, report: "Good comparison but needs more depth in conflict analysis.", is_correct: false },
    { question_id: "q10", marks: 4, max_marks: 5, report: "Correct transformation with minor word order adjustment needed.", is_correct: true },
  ],
  totalScore: 40,
  maxScore: 48,
  percentage: 83,
  topicPerformance: [
    { topic: "Literary Analysis", score: 17, maxScore: 19, percentage: 89, questionsCorrect: 4, questionsTotal: 5 },
    { topic: "Reading Comprehension", score: 4, maxScore: 5, percentage: 80, questionsCorrect: 1, questionsTotal: 1 },
    { topic: "Grammar & Syntax", score: 7, maxScore: 8, percentage: 88, questionsCorrect: 2, questionsTotal: 2 },
    { topic: "Writing Skills", score: 7, maxScore: 8, percentage: 88, questionsCorrect: 2, questionsTotal: 2 },
  ],
  strengths: [
    "Literary Analysis",
    "Grammar & Syntax",
    "Writing Skills",
  ],
  weaknesses: [
    "Comparative Analysis",
    "Extended Written Responses",
  ],
  suggestions: [
    "Practice writing comparative essays focusing on multiple characters",
    "Work on providing more detailed textual evidence in analytical responses",
    "Review techniques for expanding written responses while maintaining focus",
    "Consider creating outlines before writing longer responses",
  ],
  completedAt: new Date(),
  timeTaken: 2340, // 39 minutes in seconds
};

// ===== Generate Test Paper Function =====

export function generateMockTestPaper(config: {
  subject: string;
  topics: string[];
  numberOfQuestions: number;
  difficulty: { easy: number; medium: number; hard: number };
}): TestPaper {
  const subject = mockSubjects.find((s) => s.id === config.subject) || mockSubjects[0];
  const questions: TestQuestion[] = [];
  let questionNumber = 1;

  // Helper to create questions
  const createQuestion = (difficulty: "easy" | "medium" | "hard", topic: string): TestQuestion => {
    const isMCQ = Math.random() > 0.4; // 60% MCQ
    const marks = difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 8;
    const questionId = `q${questionNumber}`;

    return {
      question_number: questionNumber++,
      question_id: questionId,
      question_text: isMCQ
        ? `Sample MCQ question about ${topic} (${difficulty} difficulty)?`
        : `Sample written question about ${topic}. Explain your understanding in detail. (${difficulty} difficulty)`,
      difficulty,
      topic,
      marks,
      capability: `${topic} comprehension`,
      type: isMCQ ? "mcq" : "written",
      options: isMCQ ? generateMCQOptions(questionId, topic) : undefined,
    };
  };

  // Generate questions based on difficulty distribution
  const difficulties: Array<{ level: "easy" | "medium" | "hard"; count: number }> = [
    { level: "easy", count: config.difficulty.easy },
    { level: "medium", count: config.difficulty.medium },
    { level: "hard", count: config.difficulty.hard },
  ];

  for (const { level, count } of difficulties) {
    for (let i = 0; i < count; i++) {
      const topic = config.topics[i % config.topics.length] || subject.topics[0];
      questions.push(createQuestion(level, topic));
    }
  }

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  return {
    id: `test-${Date.now()}`,
    metadata: {
      title: `${subject.name} Assessment`,
      subject: subject.name,
      topics: config.topics.length > 0 ? config.topics : subject.topics.slice(0, 3),
      total_questions: questions.length,
      difficulty_distribution: config.difficulty,
      duration_minutes: Math.max(30, questions.length * 4),
      total_marks: totalMarks,
    },
    questions,
    instructions: `Read all questions carefully. You have ${Math.max(30, questions.length * 4)} minutes to complete this assessment. For MCQ questions, select the best answer. For written questions, provide clear and detailed responses.`,
    createdAt: new Date(),
  };
}
