/**
 * DATABRIDGE SYSTEM TYPE DEFINITIONS
 * Session 1.1: Type System Foundation
 * Comprehensive type definitions for DataBridge functionality
 */

import { OnboardingData, ContentItem, LearningPlan } from './onboarding'
import { Flashcard, Quiz, StudySession } from './index'

// Core DataBridge Types
export interface DataBridgeConfig {
  enableIntelligentFallback: boolean
  contentProcessingTimeout: number
  maxRetryAttempts: number
  fallbackStrategies: FallbackStrategy[]
  qualityThresholds: QualityThresholds
}

export interface FallbackStrategy {
  id: string
  name: string
  priority: number
  conditions: FallbackCondition[]
  action: FallbackAction
  enabled: boolean
}

export interface FallbackCondition {
  type: ConditionType
  field: string
  operator: ComparisonOperator
  value: any
  weight: number
}

export type ConditionType = 
  | 'content_length' 
  | 'content_quality' 
  | 'processing_time' 
  | 'error_count' 
  | 'user_preference'

export type ComparisonOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'matches'

export type FallbackAction = 
  | 'use_uploaded_content' 
  | 'generate_subject_content' 
  | 'use_generic_content' 
  | 'prompt_user' 
  | 'skip_step'

// Content Processing Types
export interface ProcessedContent {
  id: string
  originalContent: ContentItem
  extractedText: string
  keyTopics: string[]
  concepts: ConceptMap[]
  difficulty: ContentDifficulty
  readingTime: number
  wordCount: number
  language: string
  quality: ContentQuality
  processingMetadata: ProcessingMetadata
}

export interface ConceptMap {
  concept: string
  importance: number // 0-1
  relatedConcepts: string[]
  examples: string[]
  definitions: string[]
  category: ConceptCategory
}

export type ConceptCategory = 
  | 'fundamental' 
  | 'intermediate' 
  | 'advanced' 
  | 'application' 
  | 'theory' 
  | 'practice'

export interface ContentDifficulty {
  overall: DifficultyScore
  vocabulary: DifficultyScore
  concepts: DifficultyScore
  structure: DifficultyScore
  reasoning: DifficultyScore
}

export type DifficultyScore = 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard'

export interface ContentQuality {
  score: number // 0-100
  factors: QualityFactor[]
  issues: QualityIssue[]
  recommendations: string[]
}

export interface QualityFactor {
  name: string
  score: number // 0-100
  weight: number
  description: string
}

export interface QualityIssue {
  type: QualityIssueType
  severity: IssueSeverity
  description: string
  suggestion: string
  affectedContent: string
}

export type QualityIssueType = 
  | 'low_readability' 
  | 'insufficient_content' 
  | 'poor_structure' 
  | 'missing_examples' 
  | 'unclear_concepts'

export type IssueSeverity = 'minor' | 'moderate' | 'major' | 'critical'

export interface ProcessingMetadata {
  processingTime: number
  algorithm: string
  version: string
  confidence: number // 0-1
  warnings: string[]
  debugInfo?: Record<string, any>
}

export interface QualityThresholds {
  minimumContentLength: number
  minimumQualityScore: number
  maximumProcessingTime: number
  requiredConcepts: number
  acceptableErrorRate: number
}

// Subject Intelligence Types
export interface SubjectIntelligence {
  subjectId: string
  subjectName: string
  knowledgeBase: KnowledgeBase
  contentTemplates: ContentTemplate[]
  learningPathways: LearningPathway[]
  assessmentStrategies: AssessmentStrategy[]
  lastUpdated: Date
}

export interface KnowledgeBase {
  coreTopics: Topic[]
  prerequisites: Prerequisite[]
  learningObjectives: LearningObjective[]
  commonMisconceptions: Misconception[]
  studyStrategies: StudyStrategy[]
}

export interface Topic {
  id: string
  name: string
  description: string
  importance: number // 0-1
  difficulty: DifficultyScore
  estimatedHours: number
  subtopics: string[]
  resources: TopicResource[]
  assessments: string[]
}

export interface TopicResource {
  type: ResourceType
  title: string
  url?: string
  content?: string
  difficulty: DifficultyScore
  estimatedTime: number
  quality: number // 0-1
}

export type ResourceType = 
  | 'article' 
  | 'video' 
  | 'exercise' 
  | 'example' 
  | 'reference' 
  | 'interactive'

export interface Prerequisite {
  topicId: string
  requiredTopics: string[]
  optionalTopics: string[]
  minimumMastery: number // 0-1
  assessmentRequired: boolean
}

export interface LearningObjective {
  id: string
  description: string
  level: BloomLevel
  assessmentCriteria: string[]
  relatedTopics: string[]
  timeToMaster: number
}

export type BloomLevel = 
  | 'remember' 
  | 'understand' 
  | 'apply' 
  | 'analyze' 
  | 'evaluate' 
  | 'create'

export interface Misconception {
  id: string
  description: string
  commonErrors: string[]
  correctConcept: string
  clarificationStrategies: string[]
  relatedTopics: string[]
}

export interface StudyStrategy {
  id: string
  name: string
  description: string
  effectiveness: number // 0-1
  timeRequired: number
  difficulty: DifficultyScore
  applicableTopics: string[]
  steps: string[]
}

// Content Generation Types
export interface ContentTemplate {
  id: string
  name: string
  type: TemplateType
  subject: string
  difficulty: DifficultyScore
  structure: TemplateStructure
  variables: TemplateVariable[]
  examples: TemplateExample[]
}

export type TemplateType = 
  | 'flashcard_set' 
  | 'quiz' 
  | 'study_guide' 
  | 'practice_problems' 
  | 'concept_map' 
  | 'summary'

export interface TemplateStructure {
  sections: TemplateSection[]
  requiredElements: string[]
  optionalElements: string[]
  formatting: FormattingRules
}

export interface TemplateSection {
  id: string
  name: string
  order: number
  required: boolean
  content: string
  variables: string[]
}

export interface TemplateVariable {
  name: string
  type: VariableType
  description: string
  required?: boolean
  defaultValue?: any
  constraints?: VariableConstraints
}

export type VariableType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date'

export interface VariableConstraints {
  minLength?: number
  maxLength?: number
  pattern?: string
  options?: any[]
  required: boolean
}

export interface TemplateExample {
  name: string
  description: string
  variables: Record<string, any>
  expectedOutput: string
}

export interface FormattingRules {
  maxLineLength: number
  indentation: string
  listStyle: string
  headingStyle: string
  codeStyle?: string
}

// Learning Pathway Types
export interface LearningPathway {
  id: string
  name: string
  description: string
  subject: string
  difficulty: DifficultyScore
  estimatedDuration: number
  prerequisites: string[]
  outcomes: LearningOutcome[]
  milestones: PathwayMilestone[]
  adaptiveRules: AdaptiveRule[]
}

export interface LearningOutcome {
  id: string
  description: string
  measurable: boolean
  assessmentMethod: string
  successCriteria: string[]
  bloomLevel: BloomLevel
}

export interface PathwayMilestone {
  id: string
  name: string
  description: string
  position: number // 0-1 (percentage through pathway)
  requirements: MilestoneRequirement[]
  rewards: MilestoneReward[]
  assessments: string[]
}

export interface MilestoneRequirement {
  type: RequirementType
  description: string
  target: any
  current?: any
  completed: boolean
}

export type RequirementType = 
  | 'topic_mastery' 
  | 'time_spent' 
  | 'assessments_passed' 
  | 'activities_completed' 
  | 'streak_maintained'

export interface MilestoneReward {
  type: RewardType
  value: any
  description: string
  unlocked: boolean
}

export type RewardType = 
  | 'badge' 
  | 'points' 
  | 'content_unlock' 
  | 'feature_unlock' 
  | 'certificate'

export interface AdaptiveRule {
  id: string
  condition: AdaptiveCondition
  action: AdaptiveAction
  priority: number
  enabled: boolean
}

export interface AdaptiveCondition {
  metric: AdaptiveMetric
  operator: ComparisonOperator
  threshold: number
  timeWindow?: number
}

export type AdaptiveMetric = 
  | 'performance_score' 
  | 'time_spent' 
  | 'error_rate' 
  | 'engagement_level' 
  | 'completion_rate'

export interface AdaptiveAction {
  type: AdaptiveActionType
  parameters: Record<string, any>
  description: string
}

export type AdaptiveActionType = 
  | 'adjust_difficulty' 
  | 'provide_hint' 
  | 'suggest_review' 
  | 'skip_content' 
  | 'add_practice'

// Assessment Strategy Types
export interface AssessmentStrategy {
  id: string
  name: string
  type: AssessmentType
  subject: string
  difficulty: DifficultyScore
  duration: number
  questionTypes: QuestionType[]
  scoringRules: ScoringRule[]
  adaptiveSettings?: AdaptiveAssessmentSettings
}

export type AssessmentType = 
  | 'diagnostic' 
  | 'formative' 
  | 'summative' 
  | 'adaptive' 
  | 'peer_assessment' 
  | 'self_assessment'

export type QuestionType = 
  | 'multiple_choice' 
  | 'true_false' 
  | 'short_answer' 
  | 'essay' 
  | 'matching' 
  | 'ordering' 
  | 'fill_blank'

export interface ScoringRule {
  questionType: QuestionType
  pointsCorrect: number
  pointsIncorrect: number
  partialCredit: boolean
  timeBonus?: number
  difficultyMultiplier?: number
}

export interface AdaptiveAssessmentSettings {
  startingDifficulty: DifficultyScore
  adjustmentAlgorithm: string
  terminationCriteria: TerminationCriteria
  minimumQuestions: number
  maximumQuestions: number
}

export interface TerminationCriteria {
  confidenceLevel: number // 0-1
  standardError: number
  timeLimit?: number
  consecutiveCorrect?: number
  consecutiveIncorrect?: number
}

// Training Data Generation Types
export interface TrainingData {
  id: string
  source: DataSource
  content: ProcessedContent[]
  flashcards: GeneratedFlashcard[]
  quizzes: GeneratedQuiz[]
  studyMaterials: StudyMaterial[]
  metadata: TrainingMetadata
  quality: DataQuality
}

export interface DataSource {
  type: SourceType
  identifier: string
  timestamp: Date
  version: string
  reliability: number // 0-1
}

export type SourceType = 
  | 'user_upload' 
  | 'subject_template' 
  | 'knowledge_base' 
  | 'external_api' 
  | 'generated_content'

export interface GeneratedFlashcard extends Flashcard {
  generationMethod: string
  confidence: number // 0-1
  sourceContent: string[]
  reviewCount: number
  effectiveness: number // 0-1
}

export interface GeneratedQuiz extends Quiz {
  generationMethod: string
  difficulty: DifficultyScore
  topicsCovered: string[]
  learningObjectives: string[]
  adaptiveSettings?: AdaptiveAssessmentSettings
}

export interface StudyMaterial {
  id: string
  type: StudyMaterialType
  title: string
  content: string
  difficulty: DifficultyScore
  estimatedTime: number
  topics: string[]
  format: MaterialFormat
  interactive: boolean
}

export type StudyMaterialType = 
  | 'summary' 
  | 'outline' 
  | 'concept_map' 
  | 'timeline' 
  | 'formula_sheet' 
  | 'glossary' 
  | 'practice_problems'

export type MaterialFormat = 'text' | 'html' | 'markdown' | 'json' | 'interactive'

export interface TrainingMetadata {
  generatedAt: Date
  processingTime: number
  algorithmsUsed: string[]
  dataVersion: string
  qualityChecks: QualityCheck[]
  userFeedback?: UserFeedback[]
}

export interface QualityCheck {
  name: string
  passed: boolean
  score: number // 0-1
  details: string
  timestamp: Date
}

export interface UserFeedback {
  type: FeedbackType
  rating: number // 1-5
  comment?: string
  timestamp: Date
  userId?: string
}

export type FeedbackType = 
  | 'content_quality' 
  | 'difficulty_appropriate' 
  | 'relevance' 
  | 'clarity' 
  | 'usefulness'

export interface DataQuality {
  overallScore: number // 0-100
  completeness: number // 0-100
  accuracy: number // 0-100
  relevance: number // 0-100
  freshness: number // 0-100
  consistency: number // 0-100
  issues: DataQualityIssue[]
}

export interface DataQualityIssue {
  type: DataIssueType
  severity: IssueSeverity
  description: string
  affectedItems: string[]
  recommendation: string
}

export type DataIssueType = 
  | 'missing_data' 
  | 'inconsistent_format' 
  | 'outdated_content' 
  | 'low_quality_source' 
  | 'insufficient_coverage'

// Quality Reporting Types
export interface QualityReport {
  contentId: string
  overallScore: number
  quality: ContentQuality
  recommendations: string[]
  issues: QualityIssue[]
  generatedAt: Date
}

// Analytics Types
export interface AnalyticsData {
  processingStats: ProcessingStats
  qualityMetrics: QualityMetrics
  userEngagement: EngagementMetrics
  systemPerformance: PerformanceMetrics
  trends: TrendData[]
}

export interface ProcessingStats {
  totalContentProcessed: number
  averageProcessingTime: number
  successRate: number
  errorRate: number
  fallbackUsage: number
}

export interface QualityMetrics {
  averageQualityScore: number
  qualityDistribution: Record<string, number>
  topIssues: QualityIssue[]
  improvementTrends: number[]
}

export interface EngagementMetrics {
  activeUsers: number
  contentViews: number
  studySessionDuration: number
  completionRates: Record<string, number>
}

export interface PerformanceMetrics {
  responseTime: number
  throughput: number
  resourceUsage: number
  errorCounts: Record<string, number>
}

export interface TrendData {
  metric: string
  timeSeriesData: Array<{ timestamp: Date; value: number }>
  trend: 'increasing' | 'decreasing' | 'stable'
}