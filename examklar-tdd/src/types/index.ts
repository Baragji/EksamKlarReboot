/**
 * Core type definitions for ExamKlar application
 * Enhanced with comprehensive onboarding and databridge types
 */

// Re-export all onboarding and databridge types
export * from './onboarding'
export * from './databridge'

export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

export interface Subject {
  id: string
  name: string
  description: string
  emoji: string
  examDate: Date
  estimatedHours: number
  createdAt: Date
}

export interface WeeklyGoal {
  week: number
  targetHours: number
  targetTopics: string[]
  milestones: string[]
}

export interface Milestone {
  id: string
  title: string
  description: string
  targetDate: Date
  completed: boolean
  completedAt?: Date
}

export interface StudyPlan {
  id: string
  subjectId: string
  totalDays: number
  dailyGoalMinutes: number
  weeklyGoals: WeeklyGoal[]
  milestones: Milestone[]
  createdAt: Date
}

export interface Content {
  id: string
  subjectId: string
  title: string
  type: 'document' | 'video' | 'article' | 'notes'
  content: string
  processingStatus: 'pending' | 'processed' | 'failed'
  extractedKeyPoints: string[]
  estimatedReadTime: number
  createdAt: Date
}

export interface FlashcardDeck {
  id: string
  subjectId: string
  name: string
  description: string
  cards: Flashcard[]
  createdAt: Date
}

export interface Flashcard {
  id: string
  front: string
  back: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  lastReviewed: Date
  nextReview: Date
  correctStreak: number
  totalReviews: number
  subjectId?: string
  createdAt?: Date
}

export interface FlashcardSession {
  id: string
  flashcardIds: string[]
  startedAt: Date
  completedAt?: Date
  totalCards: number
  correctCards: number
  incorrectCards: number
  timeSpent: number // in seconds
}

export interface Quiz {
  id: string
  subjectId?: string
  title: string
  description: string
  questions: QuizQuestion[]
  timeLimit?: number // in seconds
  passingScore: number // percentage
  createdAt?: Date
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number // index of correct option
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
}

export interface QuizAnswer {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
}

export interface QuizResult {
  quizId: string
  score: number // percentage
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  timeSpent: number // in seconds
  passed: boolean
  answers: QuizAnswer[]
  completedAt?: Date
}

export interface QuizHistory {
  quizId: string
  score: number
  passed: boolean
  completedAt: Date
  timeSpent: number
}

export interface StudySession {
  id: string
  subjectId: string
  startTime: Date
  endTime?: Date
  plannedDuration: number
  actualDuration?: number
  status: 'active' | 'completed' | 'paused'
  topics: string[]
  notes?: string
}

export interface Progress {
  sessionsCompleted: number
  totalStudyTime: number
  streakCount: number
  lastActivity: Date
  weeklyGoal: number
  weeklyProgress: number
}
