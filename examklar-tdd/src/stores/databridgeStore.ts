/**
 * DATABRIDGE STORE
 * Session 1.2: Enhanced Store Architecture
 * Comprehensive Zustand store for DataBridge functionality
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  DataBridgeConfig,
  ProcessedContent,
  SubjectIntelligence,
  ContentTemplate,
  LearningPathway,
  TrainingData,
  ContentItem,
  FallbackStrategy,
  QualityThresholds,
  OnboardingData,
  QualityReport,
  AnalyticsData
} from '@/types'

/**
 * DataBridge Store Interface
 * Manages intelligent content processing and fallback strategies
 */
interface DataBridgeStore {
  // Configuration
  config: DataBridgeConfig
  
  // Content Processing State
  processedContent: ProcessedContent[]
  processingQueue: ContentItem[]
  processingStatus: Record<string, 'pending' | 'processing' | 'completed' | 'failed'>
  
  // Subject Intelligence
  subjectIntelligence: Record<string, SubjectIntelligence>
  availableTemplates: ContentTemplate[]
  learningPathways: LearningPathway[]
  
  // Training Data
  trainingData: TrainingData[]
  generationHistory: TrainingData[]
  
  // Fallback System
  fallbackStrategies: FallbackStrategy[]
  fallbackHistory: Array<{
    contentId: string
    strategy: string
    timestamp: Date
    success: boolean
    reason: string
  }>
  
  // Quality Control
  qualityThresholds: QualityThresholds
  qualityReports: Array<{
    contentId: string
    score: number
    issues: string[]
    timestamp: Date
  }>
  
  // Processing Statistics
  stats: {
    totalProcessed: number
    successRate: number
    averageProcessingTime: number
    fallbackUsageRate: number
    qualityScoreAverage: number
  }
  
  // Configuration Actions
  updateConfig: (updates: Partial<DataBridgeConfig>) => void
  resetConfig: () => void
  
  // Content Processing Actions
  processContent: (content: ContentItem) => Promise<ProcessedContent>
  batchProcessContent: (contents: ContentItem[]) => Promise<ProcessedContent[]>
  reprocessContent: (contentId: string) => Promise<ProcessedContent>
  getProcessedContent: (contentId: string) => ProcessedContent | null
  
  // Queue Management
  addToQueue: (content: ContentItem) => void
  removeFromQueue: (contentId: string) => void
  clearQueue: () => void
  processQueue: () => Promise<void>
  
  // Subject Intelligence Actions
  loadSubjectIntelligence: (subject: string) => Promise<SubjectIntelligence>
  updateSubjectIntelligence: (subject: string, intelligence: SubjectIntelligence) => void
  getSubjectTemplates: (subject: string) => ContentTemplate[]
  getLearningPathways: (subject: string) => LearningPathway[]
  
  // Training Data Generation
  generateTrainingData: (onboardingData: OnboardingData) => Promise<TrainingData>
  updateTrainingData: (trainingData: TrainingData) => void
  getTrainingData: (id: string) => TrainingData | null
  clearTrainingData: () => void
  
  // Fallback System Actions
  addFallbackStrategy: (strategy: FallbackStrategy) => void
  updateFallbackStrategy: (strategyId: string, updates: Partial<FallbackStrategy>) => void
  removeFallbackStrategy: (strategyId: string) => void
  executeFallback: (contentId: string, reason: string) => Promise<ProcessedContent | null>
  
  // Quality Control Actions
  updateQualityThresholds: (thresholds: Partial<QualityThresholds>) => void
  runQualityCheck: (content: ProcessedContent) => Promise<boolean>
  getQualityReport: (contentId: string) => QualityReport | null
  
  // Analytics & Statistics
  updateStats: () => void
  getProcessingStats: () => typeof initialState.stats
  exportAnalytics: () => AnalyticsData
  
  // Utility Actions
  reset: () => void
  exportConfig: () => DataBridgeConfig
  importConfig: (config: DataBridgeConfig) => void
}

// Default configuration
const defaultConfig: DataBridgeConfig = {
  enableIntelligentFallback: true,
  contentProcessingTimeout: 30000,
  maxRetryAttempts: 3,
  fallbackStrategies: [
    {
      id: 'low_quality_content',
      name: 'Low Quality Content Fallback',
      priority: 1,
      conditions: [
        {
          type: 'content_quality',
          field: 'quality.score',
          operator: 'less_than',
          value: 50,
          weight: 1.0
        }
      ],
      action: 'generate_subject_content',
      enabled: true
    },
    {
      id: 'insufficient_content',
      name: 'Insufficient Content Fallback',
      priority: 2,
      conditions: [
        {
          type: 'content_length',
          field: 'content.length',
          operator: 'less_than',
          value: 100,
          weight: 1.0
        }
      ],
      action: 'use_generic_content',
      enabled: true
    },
    {
      id: 'processing_timeout',
      name: 'Processing Timeout Fallback',
      priority: 3,
      conditions: [
        {
          type: 'processing_time',
          field: 'processingTime',
          operator: 'greater_than',
          value: 30000,
          weight: 1.0
        }
      ],
      action: 'use_uploaded_content',
      enabled: true
    }
  ],
  qualityThresholds: {
    minimumContentLength: 100,
    minimumQualityScore: 70,
    maximumProcessingTime: 30000,
    requiredConcepts: 5,
    acceptableErrorRate: 0.1
  }
}

// Default subject templates
const defaultTemplates: ContentTemplate[] = [
  {
    id: 'flashcard_basic',
    name: 'Basic Flashcards',
    type: 'flashcard_set',
    subject: 'general',
    difficulty: 'easy',
    structure: {
      sections: [
        {
          id: 'front',
          name: 'Question/Term',
          order: 1,
          required: true,
          content: '{{concept}}',
          variables: ['concept']
        },
        {
          id: 'back',
          name: 'Answer/Definition',
          order: 2,
          required: true,
          content: '{{definition}}',
          variables: ['definition']
        }
      ],
      requiredElements: ['front', 'back'],
      optionalElements: ['hint', 'example'],
      formatting: {
        maxLineLength: 80,
        indentation: '  ',
        listStyle: '- ',
        headingStyle: '# '
      }
    },
    variables: [
      {
        name: 'concept',
        type: 'string',
        description: 'The concept or term to learn',
        required: true
      },
      {
        name: 'definition',
        type: 'string',
        description: 'The definition or explanation',
        required: true
      }
    ],
    examples: [
      {
        name: 'Math Example',
        description: 'Basic algebra flashcard',
        variables: {
          concept: 'Quadratic Formula',
          definition: 'x = (-b ± √(b²-4ac)) / 2a'
        },
        expectedOutput: 'Front: Quadratic Formula\nBack: x = (-b ± √(b²-4ac)) / 2a'
      }
    ]
  }
]

// Initial state
const initialState = {
  config: defaultConfig,
  processedContent: [] as ProcessedContent[],
  processingQueue: [] as ContentItem[],
  processingStatus: {} as Record<string, 'pending' | 'processing' | 'completed' | 'failed'>,
  subjectIntelligence: {} as Record<string, SubjectIntelligence>,
  availableTemplates: defaultTemplates,
  learningPathways: [] as LearningPathway[],
  trainingData: [] as TrainingData[],
  generationHistory: [] as TrainingData[],
  fallbackStrategies: defaultConfig.fallbackStrategies,
  fallbackHistory: [] as Array<{
    contentId: string
    strategy: string
    timestamp: Date
    success: boolean
    reason: string
  }>,
  qualityThresholds: defaultConfig.qualityThresholds,
  qualityReports: [] as Array<{
    contentId: string
    score: number
    issues: string[]
    timestamp: Date
  }>,
  stats: {
    totalProcessed: 0,
    successRate: 0,
    averageProcessingTime: 0,
    fallbackUsageRate: 0,
    qualityScoreAverage: 0
  }
}

/**
 * DataBridge Zustand Store
 * Manages intelligent content processing with persistence
 */
export const useDataBridgeStore = create<DataBridgeStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Configuration Actions
        updateConfig: (updates) => {
          set((state) => ({
            config: { ...state.config, ...updates }
          }), false, 'updateConfig')
        },

        resetConfig: () => {
          set({ config: defaultConfig }, false, 'resetConfig')
        },

        // Content Processing Actions
        processContent: async (content) => {
          const state = get()
          
          // Set processing status
          set((state) => ({
            processingStatus: {
              ...state.processingStatus,
              [content.id]: 'processing'
            }
          }), false, 'processContent:start')

          try {
            // Simulate content processing (replace with actual implementation)
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const processed: ProcessedContent = {
              id: `processed_${content.id}`,
              originalContent: content,
              extractedText: content.content || '',
              keyTopics: ['topic1', 'topic2'], // Mock data
              concepts: [],
              difficulty: {
                overall: 'medium',
                vocabulary: 'easy',
                concepts: 'medium',
                structure: 'easy',
                reasoning: 'medium'
              },
              readingTime: Math.ceil((content.content?.length || 0) / 200),
              wordCount: (content.content?.split(' ') || []).length,
              language: 'da',
              quality: {
                score: 85,
                factors: [],
                issues: [],
                recommendations: []
              },
              processingMetadata: {
                processingTime: 1000,
                algorithm: 'standard',
                version: '1.0',
                confidence: 0.9,
                warnings: []
              }
            }

            // Check quality thresholds
            const qualityPassed = await get().runQualityCheck(processed)
            
            if (!qualityPassed && state.config.enableIntelligentFallback) {
              // Execute fallback strategy
              const fallbackResult = await get().executeFallback(content.id, 'quality_threshold_failed')
              if (fallbackResult) {
                set((state) => ({
                  processedContent: [...state.processedContent, fallbackResult],
                  processingStatus: {
                    ...state.processingStatus,
                    [content.id]: 'completed'
                  }
                }), false, 'processContent:fallback_success')
                
                get().updateStats()
                return fallbackResult
              }
            }

            // Store processed content
            set((state) => ({
              processedContent: [...state.processedContent, processed],
              processingStatus: {
                ...state.processingStatus,
                [content.id]: 'completed'
              }
            }), false, 'processContent:success')

            get().updateStats()
            return processed

          } catch (error) {
            // Handle processing error
            set((state) => ({
              processingStatus: {
                ...state.processingStatus,
                [content.id]: 'failed'
              }
            }), false, 'processContent:error')

            // Try fallback on error
            if (state.config.enableIntelligentFallback) {
              const fallbackResult = await get().executeFallback(content.id, 'processing_error')
              if (fallbackResult) {
                set((state) => ({
                  processedContent: [...state.processedContent, fallbackResult],
                  processingStatus: {
                    ...state.processingStatus,
                    [content.id]: 'completed'
                  }
                }), false, 'processContent:fallback_after_error')
                
                return fallbackResult
              }
            }

            throw error
          }
        },

        batchProcessContent: async (contents) => {
          const results: ProcessedContent[] = []
          
          for (const content of contents) {
            try {
              const processed = await get().processContent(content)
              results.push(processed)
            } catch (error) {
              console.error(`Failed to process content ${content.id}:`, error)
            }
          }
          
          return results
        },

        reprocessContent: async (contentId) => {
          const state = get()
          const existingProcessed = state.processedContent.find(pc => pc.originalContent.id === contentId)
          
          if (!existingProcessed) {
            throw new Error(`No processed content found for ID: ${contentId}`)
          }
          
          // Remove existing processed content
          set((state) => ({
            processedContent: state.processedContent.filter(pc => pc.originalContent.id !== contentId)
          }), false, 'reprocessContent:remove_existing')
          
          // Reprocess
          return await get().processContent(existingProcessed.originalContent)
        },

        getProcessedContent: (contentId) => {
          const state = get()
          return state.processedContent.find(pc => pc.originalContent.id === contentId) || null
        },

        // Queue Management
        addToQueue: (content) => {
          set((state) => ({
            processingQueue: [...state.processingQueue, content],
            processingStatus: {
              ...state.processingStatus,
              [content.id]: 'pending'
            }
          }), false, 'addToQueue')
        },

        removeFromQueue: (contentId) => {
          set((state) => ({
            processingQueue: state.processingQueue.filter(c => c.id !== contentId)
          }), false, 'removeFromQueue')
        },

        clearQueue: () => {
          set({ processingQueue: [] }, false, 'clearQueue')
        },

        processQueue: async () => {
          const state = get()
          const queue = [...state.processingQueue]
          
          // Clear queue
          get().clearQueue()
          
          // Process all items in queue
          await get().batchProcessContent(queue)
        },

        // Subject Intelligence Actions
        loadSubjectIntelligence: async (subject) => {
          // Simulate loading subject intelligence (replace with actual API call)
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const mockIntelligence: SubjectIntelligence = {
            subjectId: subject,
            subjectName: subject,
            knowledgeBase: {
              coreTopics: [],
              prerequisites: [],
              learningObjectives: [],
              commonMisconceptions: [],
              studyStrategies: []
            },
            contentTemplates: [],
            learningPathways: [],
            assessmentStrategies: [],
            lastUpdated: new Date()
          }
          
          set((state) => ({
            subjectIntelligence: {
              ...state.subjectIntelligence,
              [subject]: mockIntelligence
            }
          }), false, 'loadSubjectIntelligence')
          
          return mockIntelligence
        },

        updateSubjectIntelligence: (subject, intelligence) => {
          set((state) => ({
            subjectIntelligence: {
              ...state.subjectIntelligence,
              [subject]: intelligence
            }
          }), false, 'updateSubjectIntelligence')
        },

        getSubjectTemplates: (subject) => {
          const state = get()
          return state.availableTemplates.filter(t => t.subject === subject || t.subject === 'general')
        },

        getLearningPathways: (subject) => {
          const state = get()
          return state.learningPathways.filter(lp => lp.subject === subject)
        },

        // Training Data Generation
        generateTrainingData: async () => {
          // Simulate training data generation
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const trainingData: TrainingData = {
            id: `training_${Date.now()}`,
            source: {
              type: 'user_upload',
              identifier: 'onboarding_data',
              timestamp: new Date(),
              version: '1.0',
              reliability: 0.9
            },
            content: [],
            flashcards: [],
            quizzes: [],
            studyMaterials: [],
            metadata: {
              generatedAt: new Date(),
              processingTime: 2000,
              algorithmsUsed: ['nlp', 'content_analysis'],
              dataVersion: '1.0',
              qualityChecks: []
            },
            quality: {
              overallScore: 85,
              completeness: 90,
              accuracy: 85,
              relevance: 80,
              freshness: 95,
              consistency: 85,
              issues: []
            }
          }
          
          set((state) => ({
            trainingData: [...state.trainingData, trainingData],
            generationHistory: [...state.generationHistory, trainingData]
          }), false, 'generateTrainingData')
          
          return trainingData
        },

        updateTrainingData: (trainingData) => {
          set((state) => ({
            trainingData: state.trainingData.map(td => 
              td.id === trainingData.id ? trainingData : td
            )
          }), false, 'updateTrainingData')
        },

        getTrainingData: (id) => {
          const state = get()
          return state.trainingData.find(td => td.id === id) || null
        },

        clearTrainingData: () => {
          set({ trainingData: [] }, false, 'clearTrainingData')
        },

        // Fallback System Actions
        addFallbackStrategy: (strategy) => {
          set((state) => ({
            fallbackStrategies: [...state.fallbackStrategies, strategy]
          }), false, 'addFallbackStrategy')
        },

        updateFallbackStrategy: (strategyId, updates) => {
          set((state) => ({
            fallbackStrategies: state.fallbackStrategies.map(fs => 
              fs.id === strategyId ? { ...fs, ...updates } : fs
            )
          }), false, 'updateFallbackStrategy')
        },

        removeFallbackStrategy: (strategyId) => {
          set((state) => ({
            fallbackStrategies: state.fallbackStrategies.filter(fs => fs.id !== strategyId)
          }), false, 'removeFallbackStrategy')
        },

        executeFallback: async (contentId, reason) => {
          const state = get()
          
          // Find applicable fallback strategy
          const applicableStrategy = state.fallbackStrategies
            .filter(fs => fs.enabled)
            .sort((a, b) => a.priority - b.priority)[0]
          
          if (!applicableStrategy) {
            return null
          }
          
          try {
            // Simulate fallback execution
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Record fallback usage
            set((state) => ({
              fallbackHistory: [...state.fallbackHistory, {
                contentId,
                strategy: applicableStrategy.name,
                timestamp: new Date(),
                success: true,
                reason
              }]
            }), false, 'executeFallback:record')
            
            // Return mock processed content (replace with actual fallback logic)
            const fallbackContent: ProcessedContent = {
              id: `fallback_${contentId}`,
              originalContent: { id: contentId } as ContentItem,
              extractedText: 'Fallback content generated',
              keyTopics: ['fallback_topic'],
              concepts: [],
              difficulty: {
                overall: 'medium',
                vocabulary: 'easy',
                concepts: 'medium',
                structure: 'easy',
                reasoning: 'medium'
              },
              readingTime: 5,
              wordCount: 50,
              language: 'da',
              quality: {
                score: 75,
                factors: [],
                issues: [],
                recommendations: []
              },
              processingMetadata: {
                processingTime: 500,
                algorithm: 'fallback',
                version: '1.0',
                confidence: 0.7,
                warnings: ['Generated using fallback strategy']
              }
            }
            
            return fallbackContent
            
          } catch (error) {
            // Record failed fallback
            set((state) => ({
              fallbackHistory: [...state.fallbackHistory, {
                contentId,
                strategy: applicableStrategy.name,
                timestamp: new Date(),
                success: false,
                reason: `${reason} - ${error}`
              }]
            }), false, 'executeFallback:record_failure')
            
            return null
          }
        },

        // Quality Control Actions
        updateQualityThresholds: (thresholds) => {
          set((state) => ({
            qualityThresholds: { ...state.qualityThresholds, ...thresholds }
          }), false, 'updateQualityThresholds')
        },

        runQualityCheck: async (content) => {
          const state = get()
          const thresholds = state.qualityThresholds
          
          const issues: string[] = []
          let passed = true
          
          // Check content length
          if (content.wordCount < thresholds.minimumContentLength) {
            issues.push('Content too short')
            passed = false
          }
          
          // Check quality score
          if (content.quality.score < thresholds.minimumQualityScore) {
            issues.push('Quality score below threshold')
            passed = false
          }
          
          // Check processing time
          if (content.processingMetadata.processingTime > thresholds.maximumProcessingTime) {
            issues.push('Processing time exceeded')
            passed = false
          }
          
          // Record quality report
          set((state) => ({
            qualityReports: [...state.qualityReports, {
              contentId: content.id,
              score: content.quality.score,
              issues,
              timestamp: new Date()
            }]
          }), false, 'runQualityCheck')
          
          return passed
        },

        getQualityReport: (contentId) => {
          const state = get()
          const report = state.qualityReports.find(qr => qr.contentId === contentId)
          if (!report) return null
          
          // Convert to QualityReport format
          return {
            contentId: report.contentId,
            overallScore: report.score,
            quality: {
              score: report.score,
              factors: [],
              issues: report.issues.map(issue => ({
                type: 'low_readability' as const,
                severity: 'moderate' as const,
                description: issue,
                suggestion: `Improve ${issue}`,
                affectedContent: ''
              })),
              recommendations: []
            },
            recommendations: [],
            issues: report.issues.map(issue => ({
              type: 'low_readability' as const,
              severity: 'moderate' as const,
              description: issue,
              suggestion: `Improve ${issue}`,
              affectedContent: ''
            })),
            generatedAt: report.timestamp
          }
        },

        // Analytics & Statistics
        updateStats: () => {
          set((state) => {
            const totalProcessed = state.processedContent.length
            const successfulProcessing = state.processedContent.filter(pc => 
              pc.processingMetadata.confidence > 0.5
            ).length
            const totalFallbacks = state.fallbackHistory.length
            const totalQualityScores = state.processedContent.reduce((sum, pc) => 
              sum + pc.quality.score, 0
            )
            const totalProcessingTime = state.processedContent.reduce((sum, pc) => 
              sum + pc.processingMetadata.processingTime, 0
            )
            
            return {
              stats: {
                totalProcessed,
                successRate: totalProcessed > 0 ? (successfulProcessing / totalProcessed) * 100 : 0,
                averageProcessingTime: totalProcessed > 0 ? totalProcessingTime / totalProcessed : 0,
                fallbackUsageRate: totalProcessed > 0 ? (totalFallbacks / totalProcessed) * 100 : 0,
                qualityScoreAverage: totalProcessed > 0 ? totalQualityScores / totalProcessed : 0
              }
            }
          }, false, 'updateStats')
        },

        getProcessingStats: () => {
          return get().stats
        },

        exportAnalytics: () => {
          const state = get()
          return {
            processingStats: {
              totalContentProcessed: state.stats.totalProcessed,
              averageProcessingTime: state.stats.averageProcessingTime,
              successRate: state.stats.successRate,
              errorRate: 1 - state.stats.successRate,
              fallbackUsage: state.stats.fallbackUsageRate
            },
            qualityMetrics: {
              averageQualityScore: state.stats.qualityScoreAverage,
              qualityDistribution: {},
              topIssues: [],
              improvementTrends: []
            },
            userEngagement: {
              activeUsers: 0,
              contentViews: 0,
              studySessionDuration: 0,
              completionRates: {}
            },
            systemPerformance: {
              responseTime: state.stats.averageProcessingTime,
              throughput: state.stats.totalProcessed,
              resourceUsage: 0,
              errorCounts: {}
            },
            trends: []
          }
        },

        // Utility Actions
        reset: () => {
          set(initialState, false, 'reset')
        },

        exportConfig: () => {
          return get().config
        },

        importConfig: (config) => {
          set({ config }, false, 'importConfig')
        }
      }),
      {
        name: 'examklar-databridge-store',
        version: 1
      }
    ),
    {
      name: 'DataBridgeStore'
    }
  )
)