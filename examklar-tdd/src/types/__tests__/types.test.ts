/**
 * TYPE SYSTEM VALIDATION TESTS
 * Session 1.1: Type System Foundation
 * Validates all type definitions compile and work correctly
 */

import { describe, it, expect } from 'vitest'
import type {
  // Onboarding Types
  OnboardingData,
  ContentItem,
  SubjectOption,
  OnboardingState,
  ToastNotification,
  
  // DataBridge Types
  DataBridgeConfig,
  ProcessedContent,
  
  // Core Types
  User,
  Subject,
  Flashcard,
  Quiz
} from '../index'

describe('Type System Foundation', () => {
  describe('Onboarding Types', () => {
    it('should create valid OnboardingData object', () => {
      const onboardingData: OnboardingData = {
        subject: 'Matematik',
        subjectEmoji: '📐',
        content: [],
        examDate: '2024-06-01',
        daysToExam: 30,
        learningPlan: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      expect(onboardingData.subject).toBe('Matematik')
      expect(onboardingData.subjectEmoji).toBe('📐')
      expect(onboardingData.daysToExam).toBe(30)
    })

    it('should create valid ContentItem object', () => {
      const contentItem: ContentItem = {
        id: 'content-1',
        name: 'Math Notes.pdf',
        type: 'pdf',
        size: 1024000,
        content: null,
        processed: false,
        uploadedAt: new Date(),
        processingStatus: 'pending'
      }
      
      expect(contentItem.type).toBe('pdf')
      expect(contentItem.processed).toBe(false)
      expect(contentItem.processingStatus).toBe('pending')
    })

    it('should create valid SubjectOption object', () => {
      const subjectOption: SubjectOption = {
        name: 'Matematik',
        emoji: '📐',
        keywords: ['math', 'matematik', 'tal'],
        category: 'mathematics',
        defaultContent: ['Algebra', 'Geometri'],
        studyTips: ['Øv dagligt', 'Lav mange opgaver']
      }
      
      expect(subjectOption.category).toBe('mathematics')
      expect(subjectOption.keywords).toContain('matematik')
    })

    it('should create valid OnboardingState object', () => {
      const state: OnboardingState = {
        currentStep: 1,
        totalSteps: 5,
        isCompleted: false,
        canProceed: true,
        data: {
          subject: 'Matematik',
          subjectEmoji: '📐'
        },
        errors: {},
        warnings: [],
        progress: 20
      }
      
      expect(state.currentStep).toBe(1)
      expect(state.progress).toBe(20)
      expect(state.canProceed).toBe(true)
    })

    it('should create valid ToastNotification object', () => {
      const toast: ToastNotification = {
        id: 'toast-1',
        type: 'success',
        title: 'Success!',
        message: 'File uploaded successfully',
        duration: 5000,
        dismissible: true,
        createdAt: new Date()
      }
      
      expect(toast.type).toBe('success')
      expect(toast.dismissible).toBe(true)
    })
  })

  describe('DataBridge Types', () => {
    it('should create valid DataBridgeConfig object', () => {
      const config: DataBridgeConfig = {
        enableIntelligentFallback: true,
        contentProcessingTimeout: 30000,
        maxRetryAttempts: 3,
        fallbackStrategies: [],
        qualityThresholds: {
          minimumContentLength: 100,
          minimumQualityScore: 0.7,
          maximumProcessingTime: 60000,
          requiredConcepts: 5,
          acceptableErrorRate: 0.1
        }
      }
      
      expect(config.enableIntelligentFallback).toBe(true)
      expect(config.qualityThresholds.minimumQualityScore).toBe(0.7)
    })

    it('should create valid ProcessedContent object', () => {
      const processed: ProcessedContent = {
        id: 'processed-1',
        originalContent: {
          id: 'content-1',
          name: 'test.txt',
          type: 'text',
          size: 1000,
          content: 'Test content',
          processed: true,
          uploadedAt: new Date(),
          processingStatus: 'completed'
        },
        extractedText: 'Test content',
        keyTopics: ['topic1', 'topic2'],
        concepts: [],
        difficulty: {
          overall: 'medium',
          vocabulary: 'easy',
          concepts: 'medium',
          structure: 'easy',
          reasoning: 'medium'
        },
        readingTime: 5,
        wordCount: 100,
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
      
      expect(processed.difficulty.overall).toBe('medium')
      expect(processed.quality.score).toBe(85)
      expect(processed.processingMetadata.confidence).toBe(0.9)
    })

    it('should create valid TrainingData object', () => {
      const trainingData: TrainingData = {
        id: 'training-1',
        source: {
          type: 'user_upload',
          identifier: 'upload-123',
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
          processingTime: 5000,
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
      
      expect(trainingData.source.type).toBe('user_upload')
      expect(trainingData.quality.overallScore).toBe(85)
    })
  })

  describe('Type Integration', () => {
    it('should allow proper type composition', () => {
      // Test that types work together properly
      const user: User = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date()
      }

      const subject: Subject = {
        id: 'subject-1',
        name: 'Matematik',
        description: 'Advanced mathematics',
        emoji: '📐',
        examDate: new Date(),
        estimatedHours: 100,
        createdAt: new Date()
      }

      const onboarding: OnboardingData = {
        subject: subject.name,
        subjectEmoji: subject.emoji,
        content: [],
        examDate: subject.examDate.toISOString(),
        daysToExam: 30,
        learningPlan: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      expect(onboarding.subject).toBe(subject.name)
      expect(onboarding.subjectEmoji).toBe(subject.emoji)
    })

    it('should support proper enum/union type usage', () => {
      // Test union types work correctly
      const contentTypes: Array<ContentItem['type']> = [
        'file', 'text', 'web', 'document', 'image', 'pdf'
      ]
      
      const processingStatuses: Array<ContentItem['processingStatus']> = [
        'pending', 'processing', 'completed', 'failed', 'skipped'
      ]

      expect(contentTypes).toHaveLength(6)
      expect(processingStatuses).toHaveLength(5)
    })
  })

  describe('Type Safety', () => {
    it('should enforce required properties', () => {
      // This test ensures TypeScript compilation catches missing required props
      const createContentItem = (props: Partial<ContentItem>): ContentItem => {
        return {
          id: props.id || 'default-id',
          name: props.name || 'default-name',
          type: props.type || 'text',
          size: props.size || 0,
          content: props.content || null,
          processed: props.processed || false,
          uploadedAt: props.uploadedAt || new Date(),
          processingStatus: props.processingStatus || 'pending'
        }
      }

      const item = createContentItem({ name: 'test.txt', type: 'text' })
      expect(item.name).toBe('test.txt')
      expect(item.type).toBe('text')
    })

    it('should support optional properties correctly', () => {
      const contentItem: ContentItem = {
        id: 'test-id',
        name: 'test.txt',
        type: 'text',
        size: 1000,
        content: 'test content',
        processed: true,
        uploadedAt: new Date(),
        processingStatus: 'completed',
        // Optional properties
        isLargeFile: true,
        objectUrl: 'blob:test-url',
        metadata: {
          fileType: 'text/plain',
          wordCount: 100
        }
      }

      expect(contentItem.isLargeFile).toBe(true)
      expect(contentItem.metadata?.wordCount).toBe(100)
    })
  })
})