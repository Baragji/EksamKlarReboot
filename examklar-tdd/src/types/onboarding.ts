/**
 * ONBOARDING SYSTEM TYPE DEFINITIONS
 * Session 1.1: Type System Foundation
 * Comprehensive type definitions for onboarding flow
 */

// Core Onboarding Data Structure
export interface OnboardingData {
  subject: string
  subjectEmoji: string
  content: ContentItem[]
  examDate: string
  daysToExam: number
  learningPlan: LearningPlan | null
  createdAt: Date
  updatedAt: Date
}

// Content Management Types
export interface ContentItem {
  id: string
  name: string
  type: ContentType
  size: number
  content: string | null
  processed: boolean
  isLargeFile?: boolean
  objectUrl?: string
  uploadedAt: Date
  processingStatus: ProcessingStatus
  metadata?: ContentMetadata
}

export type ContentType = 'file' | 'text' | 'web' | 'document' | 'image' | 'pdf'

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'skipped'

export interface ContentMetadata {
  fileType?: string
  encoding?: string
  language?: string
  wordCount?: number
  pageCount?: number
  extractedText?: string
  keyTopics?: string[]
}

// Subject Selection Types
export interface SubjectOption {
  name: string
  emoji: string
  keywords: string[]
  category: SubjectCategory
  defaultContent?: string[]
  studyTips?: string[]
}

export type SubjectCategory = 
  | 'mathematics' 
  | 'science' 
  | 'language' 
  | 'social_studies' 
  | 'arts' 
  | 'technology' 
  | 'business' 
  | 'other'

// Timeline Management Types
export interface TimelineOption {
  id: string
  label: string
  days: number
  description: string
  intensity: TimelineIntensity
  recommendedHours: number
  milestones: string[]
}

export type TimelineIntensity = 'relaxed' | 'moderate' | 'intensive' | 'cramming'

export interface CustomTimeline {
  examDate: string
  startDate: string
  totalDays: number
  weeklyHours: number
  dailyHours: number
  restDays: number[]
}

// Learning Plan Types
export interface LearningPlan {
  id: string
  subjectId: string
  timeline: TimelineOption | CustomTimeline
  phases: LearningPhase[]
  milestones: PlanMilestone[]
  generatedAt: Date
  lastUpdated: Date
}

export interface LearningPhase {
  id: string
  name: string
  description: string
  startDay: number
  endDay: number
  goals: string[]
  activities: LearningActivity[]
  estimatedHours: number
}

export interface LearningActivity {
  id: string
  type: ActivityType
  title: string
  description: string
  estimatedMinutes: number
  difficulty: DifficultyLevel
  resources: string[]
  completed: boolean
}

export type ActivityType = 
  | 'reading' 
  | 'practice' 
  | 'review' 
  | 'quiz' 
  | 'flashcards' 
  | 'project' 
  | 'discussion'

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface PlanMilestone {
  id: string
  title: string
  description: string
  targetDay: number
  completed: boolean
  completedAt?: Date
  requirements: string[]
  rewards: string[]
}

// Onboarding Flow Types
export interface OnboardingStep {
  id: number
  title: string
  description: string
  component: string
  isCompleted: boolean
  isActive: boolean
  canSkip: boolean
  validationRules: ValidationRule[]
}

export interface ValidationRule {
  field: string
  type: ValidationType
  message: string
  required: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
}

export type ValidationType = 
  | 'required' 
  | 'minLength' 
  | 'maxLength' 
  | 'pattern' 
  | 'fileSize' 
  | 'fileType' 
  | 'date'

// Onboarding State Management
export interface OnboardingState {
  currentStep: number
  totalSteps: number
  isCompleted: boolean
  canProceed: boolean
  data: Partial<OnboardingData>
  errors: Record<string, string>
  warnings: string[]
  progress: number // 0-100
}

// File Upload Types
export interface FileUploadConfig {
  maxFileSize: number // in bytes
  allowedTypes: string[]
  maxFiles: number
  compressionEnabled: boolean
  processingTimeout: number // in ms
}

export interface UploadProgress {
  fileId: string
  fileName: string
  progress: number // 0-100
  status: UploadStatus
  error?: string
  startedAt: Date
  completedAt?: Date
}

export type UploadStatus = 
  | 'queued' 
  | 'uploading' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled'

// Web Import Types
export interface WebImportData {
  url: string
  title?: string
  content: string
  extractedAt: Date
  wordCount: number
  readingTime: number
  metadata: WebMetadata
}

export interface WebMetadata {
  domain: string
  author?: string
  publishedDate?: Date
  tags: string[]
  language: string
  contentType: string
}

// Toast Notification Types
export interface ToastNotification {
  id: string
  type: ToastType
  title: string
  message: string
  duration: number
  dismissible: boolean
  actions?: ToastAction[]
  createdAt: Date
}

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface ToastAction {
  label: string
  action: () => void
  style?: 'primary' | 'secondary' | 'danger'
}

// Keyboard Navigation Types
export interface KeyboardShortcut {
  key: string
  modifiers: KeyModifier[]
  action: string
  description: string
  context: string[]
}

export type KeyModifier = 'ctrl' | 'alt' | 'shift' | 'meta'

// Error Handling Types
export interface OnboardingError {
  code: string
  message: string
  field?: string
  severity: ErrorSeverity
  recoverable: boolean
  suggestions: string[]
  timestamp: Date
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

// Analytics Types
export interface OnboardingAnalytics {
  sessionId: string
  userId?: string
  startedAt: Date
  completedAt?: Date
  currentStep: number
  stepsCompleted: number[]
  timeSpentPerStep: Record<number, number>
  errors: OnboardingError[]
  abandonedAt?: Date
  completionRate: number
  userAgent: string
  deviceInfo: DeviceInfo
}

export interface DeviceInfo {
  platform: string
  browser: string
  screenResolution: string
  isMobile: boolean
  isTablet: boolean
  connectionType?: string
}