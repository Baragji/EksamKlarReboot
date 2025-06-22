/**
 * Core type definitions for ExamKlar application
 */

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
  lastReviewed?: Date
  nextReview?: Date
  repetitions: number
  easinessFactor: number
}

export interface Quiz {
  id: string
  subjectId: string
  title: string
  description: string
  questions: QuizQuestion[]
  timeLimit?: number
  createdAt: Date
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  options?: string[]
  correctAnswer: number | string
  explanation?: string
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
