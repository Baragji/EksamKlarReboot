import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AIService } from '@/services/AIService'
import type { ContentAnalysis } from '@/services/AIService'

describe('AIService - Foundation (Phase 1)', () => {
  let aiService: AIService

  beforeEach(() => {
    aiService = new AIService()
    vi.clearAllMocks()
  })

  it('should initialize with default configuration', () => {
    expect(aiService).toBeDefined()
    expect(aiService.isReady).toBe(true)
  })

  it('should handle content analysis with error handling', async () => {
    // Mock a successful content analysis
    const mockContent = 'This is sample content about mathematics and physics.'
    const result = await aiService.analyzeContent(mockContent)
    
    expect(result).toBeDefined()
    expect(result.topics).toBeInstanceOf(Array)
    expect(result.difficulty).toBeDefined()
    expect(result.estimatedStudyTime).toBeGreaterThan(0)
    expect(result.fallbackUsed).toBe(false)
  })

  it('should handle errors gracefully', async () => {
    // Force an error by passing invalid content
    const mockInvalidContent = null
    
    // Should not throw but return error result
    const result = await aiService.analyzeContent(mockInvalidContent as unknown as string)
    
    expect(result).toBeDefined()
    expect(result.error).toBeDefined()
    expect(result.fallbackUsed).toBe(true)
  })

  it('should provide fallback content when AI service fails', async () => {
    // Simulate AI service failure
    vi.spyOn(aiService as unknown as { callAIService: (content: string) => Promise<Omit<ContentAnalysis, 'fallbackUsed'>> }, 'callAIService').mockRejectedValueOnce(new Error('Service unavailable'))
    
    const result = await aiService.analyzeContent('Valid content that should trigger fallback')
    
    expect(result.fallbackUsed).toBe(true)
    expect(result.topics).toBeInstanceOf(Array) // Should still provide fallback topics
    expect(result.error).toContain('Service unavailable')
  })

  it('should generate flashcards from content analysis', async () => {
    const mockAnalysis: ContentAnalysis = {
      topics: ['mathematics', 'algebra', 'calculus'],
      difficulty: 'intermediate',
      estimatedStudyTime: 120,
      fallbackUsed: false
    }
    
    const flashcards = await aiService.generateFlashcards(mockAnalysis)
    
    expect(flashcards).toBeInstanceOf(Array)
    expect(flashcards.length).toBe(mockAnalysis.topics.length)
    expect(flashcards[0]).toHaveProperty('front')
    expect(flashcards[0]).toHaveProperty('back')
    expect(flashcards[0]).toHaveProperty('difficulty')
  })

  it('should generate quizzes from content analysis', async () => {
    const mockAnalysis: ContentAnalysis = {
      topics: ['mathematics', 'algebra', 'calculus'],
      difficulty: 'intermediate',
      estimatedStudyTime: 120,
      fallbackUsed: false
    }
    
    const quizzes = await aiService.generateQuizzes(mockAnalysis)
    
    expect(quizzes).toBeInstanceOf(Array)
    expect(quizzes.length).toBe(mockAnalysis.topics.length)
    expect(quizzes[0]).toHaveProperty('question')
    expect(quizzes[0]).toHaveProperty('options')
    expect(quizzes[0]).toHaveProperty('correctAnswer')
    expect(quizzes[0]).toHaveProperty('difficulty')
  })

  it('should create learning path based on content analysis and exam date', async () => {
    const mockAnalysis: ContentAnalysis = {
      topics: ['mathematics', 'algebra', 'calculus'],
      difficulty: 'intermediate',
      estimatedStudyTime: 120,
      fallbackUsed: false
    }
    
    const examDate = new Date()
    examDate.setDate(examDate.getDate() + 30) // 30 days from now
    
    const learningPath = await aiService.createLearningPath(mockAnalysis, examDate)
    
    expect(learningPath).toBeDefined()
    expect(learningPath).toHaveProperty('topics')
    expect(learningPath).toHaveProperty('daysUntilExam')
    expect(learningPath).toHaveProperty('dailyStudyTime')
    expect(learningPath).toHaveProperty('milestones')
    expect(learningPath.milestones).toBeInstanceOf(Array)
  })

  it('should track service statistics', async () => {
    // Make a few requests
    await aiService.analyzeContent('Valid content 1')
    await aiService.analyzeContent('Valid content 2')
    await aiService.analyzeContent(null as unknown as string) // This should use fallback
    
    const stats = aiService.getServiceStats()
    
    expect(stats).toHaveProperty('requestCount')
    expect(stats).toHaveProperty('successRate')
    expect(stats).toHaveProperty('fallbackRate')
    expect(stats.requestCount).toBe(3)
    expect(stats.fallbackRate).toBeGreaterThan(0)
  })

  it('should handle timeout gracefully', async () => {
    // Create service with short timeout
    const aiServiceWithShortTimeout = new AIService({ timeout: 1 })
    
    // Mock a delay longer than the timeout
    vi.spyOn(aiServiceWithShortTimeout as unknown as { simulateContentAnalysis: (content: string) => Omit<ContentAnalysis, 'fallbackUsed'> }, 'simulateContentAnalysis').mockImplementationOnce(async (content: string): Promise<Omit<ContentAnalysis, 'fallbackUsed'>> => {
      await new Promise(resolve => setTimeout(resolve, 100))
      return {
        topics: ['delayed'],
        difficulty: 'intermediate',
        estimatedStudyTime: 60
      }
    })
    
    const result = await aiServiceWithShortTimeout.analyzeContent('Content that will timeout')
    
    expect(result.fallbackUsed).toBe(true)
    expect(result.error).toContain('timeout')
  })
})