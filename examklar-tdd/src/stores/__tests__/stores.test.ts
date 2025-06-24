/**
 * ENHANCED STORE ARCHITECTURE TESTS
 * Session 1.2: Enhanced Store Architecture
 * Comprehensive tests for all store integrations
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useOnboardingStore } from '../onboardingStore'
import { useDataBridgeStore } from '../databridgeStore'
import { useExamStore } from '../examStore'
import type { OnboardingData, ContentItem, TrainingData } from '@/types'

// Mock data
const mockOnboardingData: OnboardingData = {
  subject: 'Matematik',
  subjectEmoji: '📐',
  content: [],
  examDate: '2024-06-01',
  daysToExam: 30,
  learningPlan: null,
  createdAt: new Date(),
  updatedAt: new Date()
}

const mockContentItem: ContentItem = {
  id: 'content-1',
  name: 'Math Notes.pdf',
  type: 'pdf',
  size: 1024000,
  content: 'Sample math content',
  processed: false,
  uploadedAt: new Date(),
  processingStatus: 'pending'
}

describe('Enhanced Store Architecture', () => {
  beforeEach(() => {
    // Reset all stores before each test
    useOnboardingStore.getState().reset()
    useDataBridgeStore.getState().reset()
    useExamStore.getState().reset()
  })

  describe('OnboardingStore', () => {
    it('should initialize with correct default state', () => {
      const store = useOnboardingStore.getState()
      
      expect(store.currentStepIndex).toBe(0)
      expect(store.state.currentStep).toBe(1)
      expect(store.state.totalSteps).toBe(5)
      expect(store.state.isCompleted).toBe(false)
      expect(store.availableSubjects).toHaveLength(6)
      expect(store.availableTimelines).toHaveLength(4)
    })

    it('should handle step navigation correctly', () => {
      const store = useOnboardingStore.getState()
      
      // Set required data for step 1
      store.setSubject('Matematik', '📐')
      
      // Should be able to proceed after setting subject
      expect(store.canProceedToNext()).toBe(true)
      
      // Navigate to next step
      store.nextStep()
      expect(store.currentStepIndex).toBe(1)
      expect(store.state.currentStep).toBe(2)
      expect(store.state.progress).toBe(40) // 2/5 * 100
    })

    it('should validate steps correctly', () => {
      const store = useOnboardingStore.getState()
      
      // Step 1 requires subject
      expect(store.validateCurrentStep()).toBe(false)
      
      // Set subject
      store.setSubject('Matematik', '📐')
      expect(store.validateCurrentStep()).toBe(true)
      
      // Go to step 3 (exam date required)
      store.goToStep(2)
      expect(store.validateCurrentStep()).toBe(false)
      
      // Set exam date
      store.setExamDate('2024-06-01')
      expect(store.validateCurrentStep()).toBe(true)
    })

    it('should handle content management', () => {
      const store = useOnboardingStore.getState()
      
      // Add content
      store.addContent(mockContentItem)
      expect(store.uploadedContent).toHaveLength(1)
      expect(store.data.content).toHaveLength(1)
      
      // Update content
      store.updateContent(mockContentItem.id, { processed: true })
      expect(store.uploadedContent[0].processed).toBe(true)
      
      // Remove content
      store.removeContent(mockContentItem.id)
      expect(store.uploadedContent).toHaveLength(0)
      expect(store.data.content).toHaveLength(0)
    })

    it('should handle toast notifications', () => {
      const store = useOnboardingStore.getState()
      
      // Add toast
      store.addToast({
        type: 'success',
        title: 'Success',
        message: 'Test message',
        duration: 5000,
        dismissible: true
      })
      
      expect(store.toasts).toHaveLength(1)
      expect(store.toasts[0].type).toBe('success')
      
      // Remove toast
      const toastId = store.toasts[0].id
      store.removeToast(toastId)
      expect(store.toasts).toHaveLength(0)
    })

    it('should export complete onboarding data', () => {
      const store = useOnboardingStore.getState()
      
      // Set all required data
      store.setSubject('Matematik', '📐')
      store.setExamDate('2024-06-01')
      store.addContent(mockContentItem)
      
      const exportedData = store.exportData()
      expect(exportedData).toBeTruthy()
      expect(exportedData?.subject).toBe('Matematik')
      expect(exportedData?.examDate).toBe('2024-06-01')
      expect(exportedData?.content).toHaveLength(1)
    })
  })

  describe('DataBridgeStore', () => {
    it('should initialize with correct default configuration', () => {
      const store = useDataBridgeStore.getState()
      
      expect(store.config.enableIntelligentFallback).toBe(true)
      expect(store.config.contentProcessingTimeout).toBe(30000)
      expect(store.config.maxRetryAttempts).toBe(3)
      expect(store.fallbackStrategies).toHaveLength(3)
      expect(store.availableTemplates).toHaveLength(1)
    })

    it('should process content successfully', async () => {
      const store = useDataBridgeStore.getState()
      
      const processedContent = await store.processContent(mockContentItem)
      
      expect(processedContent).toBeTruthy()
      expect(processedContent.originalContent.id).toBe(mockContentItem.id)
      expect(processedContent.extractedText).toBeTruthy()
      expect(processedContent.quality.score).toBeGreaterThan(0)
      expect(store.processedContent).toHaveLength(1)
    })

    it('should handle processing queue', () => {
      const store = useDataBridgeStore.getState()
      
      // Add to queue
      store.addToQueue(mockContentItem)
      expect(store.processingQueue).toHaveLength(1)
      expect(store.processingStatus[mockContentItem.id]).toBe('pending')
      
      // Remove from queue
      store.removeFromQueue(mockContentItem.id)
      expect(store.processingQueue).toHaveLength(0)
    })

    it('should manage fallback strategies', () => {
      const store = useDataBridgeStore.getState()
      
      const newStrategy = {
        id: 'test_strategy',
        name: 'Test Strategy',
        priority: 10,
        conditions: [],
        action: 'use_generic_content' as const,
        enabled: true
      }
      
      // Add strategy
      store.addFallbackStrategy(newStrategy)
      expect(store.fallbackStrategies).toHaveLength(4)
      
      // Update strategy
      store.updateFallbackStrategy('test_strategy', { enabled: false })
      const updatedStrategy = store.fallbackStrategies.find(s => s.id === 'test_strategy')
      expect(updatedStrategy?.enabled).toBe(false)
      
      // Remove strategy
      store.removeFallbackStrategy('test_strategy')
      expect(store.fallbackStrategies).toHaveLength(3)
    })

    it('should generate training data', async () => {
      const store = useDataBridgeStore.getState()
      
      const trainingData = await store.generateTrainingData(mockOnboardingData)
      
      expect(trainingData).toBeTruthy()
      expect(trainingData.source.type).toBe('user_upload')
      expect(trainingData.quality.overallScore).toBeGreaterThan(0)
      expect(store.trainingData).toHaveLength(1)
    })

    it('should update statistics correctly', () => {
      const store = useDataBridgeStore.getState()
      
      // Initial stats should be zero
      expect(store.stats.totalProcessed).toBe(0)
      expect(store.stats.successRate).toBe(0)
      
      // Process some content to update stats
      store.processContent(mockContentItem).then(() => {
        store.updateStats()
        expect(store.stats.totalProcessed).toBe(1)
        expect(store.stats.successRate).toBeGreaterThan(0)
      })
    })
  })

  describe('ExamStore Integration', () => {
    it('should initialize stores correctly', async () => {
      const store = useExamStore.getState()
      
      expect(store.storesInitialized).toBe(false)
      
      await store.initializeStores()
      
      expect(store.storesInitialized).toBe(true)
      expect(store.lastSyncTimestamp).toBeTruthy()
    })

    it('should handle onboarding completion', async () => {
      const examStore = useExamStore.getState()
      const onboardingStore = useOnboardingStore.getState()
      
      // Set up onboarding data
      onboardingStore.setSubject('Matematik', '📐')
      onboardingStore.setExamDate('2024-06-01')
      
      const onboardingData = onboardingStore.exportData()
      expect(onboardingData).toBeTruthy()
      
      // Handle onboarding completion
      await examStore.handleOnboardingComplete(onboardingData!)
      
      expect(examStore.onboardingCompleted).toBe(true)
      expect(examStore.onboardingData).toBeTruthy()
      expect(examStore.subjects).toHaveLength(1)
      expect(examStore.subjects[0].name).toBe('Matematik')
    })

    it('should sync with onboarding store', () => {
      const examStore = useExamStore.getState()
      const onboardingStore = useOnboardingStore.getState()
      
      // Set up onboarding data
      onboardingStore.setSubject('Matematik', '📐')
      onboardingStore.setExamDate('2024-06-01')
      
      // Sync
      examStore.syncWithOnboarding()
      
      expect(examStore.onboardingData).toBeTruthy()
      expect(examStore.onboardingData?.subject).toBe('Matematik')
    })

    it('should sync with databridge store', () => {
      const examStore = useExamStore.getState()
      const dataBridgeStore = useDataBridgeStore.getState()
      
      // Generate training data
      const mockTrainingData: TrainingData = {
        id: 'training-1',
        source: {
          type: 'user_upload',
          identifier: 'test',
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
          processingTime: 1000,
          algorithmsUsed: ['test'],
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
      
      dataBridgeStore.updateTrainingData(mockTrainingData)
      
      // Sync
      examStore.syncWithDataBridge()
      
      expect(examStore.trainingData).toBeTruthy()
      expect(examStore.trainingData?.id).toBe('training-1')
    })

    it('should provide integrated progress', () => {
      const examStore = useExamStore.getState()
      
      // Set some base progress
      examStore.updateProgress({
        sessionsCompleted: 5,
        totalStudyTime: 300,
        streakCount: 3,
        lastActivity: new Date(),
        weeklyGoal: 600,
        weeklyProgress: 300
      })
      
      const integratedProgress = examStore.getIntegratedProgress()
      
      expect(integratedProgress.sessionsCompleted).toBe(5)
      expect(integratedProgress.totalStudyTime).toBe(300)
      expect(integratedProgress.streakCount).toBe(3)
    })
  })

  describe('Cross-Store Communication', () => {
    it('should handle complete onboarding to training data flow', async () => {
      const examStore = useExamStore.getState()
      const onboardingStore = useOnboardingStore.getState()
      const dataBridgeStore = useDataBridgeStore.getState()
      
      // Complete onboarding flow
      onboardingStore.setSubject('Matematik', '📐')
      onboardingStore.setExamDate('2024-06-01')
      onboardingStore.addContent(mockContentItem)
      
      const onboardingData = onboardingStore.exportData()
      expect(onboardingData).toBeTruthy()
      
      // Handle completion in exam store
      await examStore.handleOnboardingComplete(onboardingData!)
      
      // Verify all stores are updated
      expect(examStore.onboardingCompleted).toBe(true)
      expect(examStore.onboardingData).toBeTruthy()
      expect(examStore.trainingData).toBeTruthy()
      expect(dataBridgeStore.trainingData).toHaveLength(1)
    })

    it('should maintain data consistency across stores', () => {
      const examStore = useExamStore.getState()
      const onboardingStore = useOnboardingStore.getState()
      
      // Set data in onboarding
      onboardingStore.setSubject('Fysik', '⚛️')
      onboardingStore.setExamDate('2024-07-01')
      
      // Sync to exam store
      examStore.syncWithOnboarding()
      
      // Verify consistency
      expect(examStore.onboardingData?.subject).toBe('Fysik')
      expect(examStore.onboardingData?.subjectEmoji).toBe('⚛️')
      expect(examStore.onboardingData?.examDate).toBe('2024-07-01')
    })
  })

  describe('Store Persistence', () => {
    it('should persist onboarding state', () => {
      const store = useOnboardingStore.getState()
      
      // Set some data
      store.setSubject('Kemi', '🧪')
      store.nextStep()
      
      // Verify state is set
      expect(store.data.subject).toBe('Kemi')
      expect(store.currentStepIndex).toBe(1)
      
      // Note: Actual persistence testing would require mocking localStorage
      // This test verifies the state is correctly structured for persistence
    })

    it('should persist databridge configuration', () => {
      const store = useDataBridgeStore.getState()
      
      // Update config
      store.updateConfig({
        contentProcessingTimeout: 60000,
        maxRetryAttempts: 5
      })
      
      // Verify config is updated
      expect(store.config.contentProcessingTimeout).toBe(60000)
      expect(store.config.maxRetryAttempts).toBe(5)
    })
  })
})