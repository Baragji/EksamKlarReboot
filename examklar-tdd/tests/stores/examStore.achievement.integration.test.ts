import { describe, it, expect, beforeEach } from 'vitest'
import { useAchievementStore } from '../../src/stores/achievementStore'
import { useExamStore } from '../../src/stores/examStore'

/**
 * Achievement Integration Tests - TDD V5 Fase 1 Day 4-5
 * Testing integration between achievement system and exam store
 */
describe('Achievement Integration - TDD V5', () => {
  beforeEach(() => {
    // Reset both stores before each test
    const achievementStore = useAchievementStore.getState()
    const examStore = useExamStore.getState()
    
    achievementStore.resetAchievements?.()
    // Reset exam store to initial state
    examStore.resetStore?.()
  })

  describe('Automatic Achievement Checking', () => {
    it('should automatically check achievements when completing a session', () => {
      const { addScheduledSession, completeSession } = useExamStore.getState()
      const { unlockedAchievements } = useAchievementStore.getState()
      
      // Initially no achievements unlocked
      expect(unlockedAchievements.length).toBe(0)
      
      // Add a scheduled session first
      addScheduledSession({
        subjectId: 'math',
        subjectName: 'Mathematics',
        date: new Date().toISOString(),
        duration: 30,
        topicsPlanned: ['algebra'],
        type: 'scheduled'
      })
      
      // Get the session ID from the scheduled sessions
      const { scheduledSessions } = useExamStore.getState()
      const sessionId = scheduledSessions[0].id
      
      // Complete the session - should trigger achievement checking
      completeSession(sessionId, ['algebra'])
      
      // Should unlock "First Steps" achievement
      const updatedAchievements = useAchievementStore.getState().unlockedAchievements
      expect(updatedAchievements).toContain('first-session')
    })

    it('should unlock streak achievements when streak milestones are reached', () => {
      const { recordActivity } = useExamStore.getState()
      const { unlockedAchievements } = useAchievementStore.getState()
      
      // Initially no achievements
      expect(unlockedAchievements.length).toBe(0)
      
      // Record activity for 3 consecutive days to reach streak milestone
      const today = new Date()
      for (let i = 0; i < 3; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() - (2 - i)) // 3 days ago, 2 days ago, today
        recordActivity(date)
      }
      
      // Should unlock "Study Streak" achievement (3 day streak)
      const updatedAchievements = useAchievementStore.getState().unlockedAchievements
      expect(updatedAchievements).toContain('streak-3')
    })

    it('should unlock session-based achievements when session count milestones are reached', () => {
      const { addScheduledSession, completeSession } = useExamStore.getState()
      let unlockedAchievements = useAchievementStore.getState().unlockedAchievements
      
      // Complete 10 sessions to unlock "Session Master"
      for (let i = 0; i < 10; i++) {
        addScheduledSession({
          subjectId: `subject-${i}`,
          subjectName: `Subject ${i}`,
          date: new Date().toISOString(),
          duration: 30,
          topicsPlanned: ['topic'],
          type: 'scheduled'
        })
        
        const { scheduledSessions } = useExamStore.getState()
        const sessionId = scheduledSessions[scheduledSessions.length - 1].id
        completeSession(sessionId, ['topic'])
      }
      
      // Should unlock both "First Steps" and "Session Master" achievements
      unlockedAchievements = useAchievementStore.getState().unlockedAchievements
      expect(unlockedAchievements).toContain('first-session')
      expect(unlockedAchievements).toContain('session-master')
    })

    it('should unlock time-based achievements when study time milestones are reached', () => {
      const { addScheduledSession, completeSession } = useExamStore.getState()
      
      // Complete sessions totaling 5+ hours (300+ minutes) to unlock "Time Scholar"
      // Session 1: 200 minutes
      addScheduledSession({
        subjectId: 'math',
        subjectName: 'Mathematics',
        date: new Date().toISOString(),
        duration: 200,
        topicsPlanned: ['algebra'],
        type: 'scheduled'
      })
      
      let { scheduledSessions } = useExamStore.getState()
      completeSession(scheduledSessions[0].id, ['algebra'])
      
      // Session 2: 150 minutes (total: 350 minutes = 5.83 hours)
      addScheduledSession({
        subjectId: 'physics',
        subjectName: 'Physics',
        date: new Date().toISOString(),
        duration: 150,
        topicsPlanned: ['mechanics'],
        type: 'scheduled'
      })
      
      const updatedState = useExamStore.getState()
      completeSession(updatedState.scheduledSessions[0].id, ['mechanics'])
      
      const unlockedAchievements = useAchievementStore.getState().unlockedAchievements
      expect(unlockedAchievements).toContain('time-scholar')
    })
  })

  describe('Achievement Listener Integration', () => {
    it('should have achievement checking integrated into exam store actions', () => {
      const examStore = useExamStore.getState()
      
      // Check that completeSession has achievement integration
      expect(examStore.completeSession).toBeDefined()
      
      // Verify the exam store has methods to trigger achievement checks
      expect(examStore.triggerAchievementCheck).toBeDefined()
      expect(typeof examStore.triggerAchievementCheck).toBe('function')
    })

    it('should provide current progress data for achievement checking', () => {
      const { getProgressForAchievements } = useExamStore.getState()
      
      expect(getProgressForAchievements).toBeDefined()
      expect(typeof getProgressForAchievements).toBe('function')
      
      const progressData = getProgressForAchievements()
      
      expect(progressData).toHaveProperty('sessionsCompleted')
      expect(progressData).toHaveProperty('totalStudyTime')
      expect(progressData).toHaveProperty('streakCount')
      expect(progressData).toHaveProperty('flashcardsReviewed')
    })

    it('should trigger achievement notifications when achievements are unlocked', () => {
      const { getRecentAchievements, clearRecentAchievements, addScheduledSession, completeSession } = useExamStore.getState()
      
      expect(getRecentAchievements).toBeDefined()
      expect(clearRecentAchievements).toBeDefined()
      
      // Complete a session to unlock first achievement
      addScheduledSession({
        subjectId: 'math',
        subjectName: 'Mathematics',
        date: new Date().toISOString(),
        duration: 30,
        topicsPlanned: ['algebra'],
        type: 'scheduled'
      })
      
      const { scheduledSessions } = useExamStore.getState()
      completeSession(scheduledSessions[0].id, ['algebra'])
      
      // Should have recent achievements for notification
      const recentAchievements = getRecentAchievements()
      expect(Array.isArray(recentAchievements)).toBe(true)
      expect(recentAchievements.length).toBeGreaterThan(0)
      expect(recentAchievements[0]).toBe('first-session')
    })
  })

  describe('Cross-Store State Consistency', () => {
    it('should maintain consistent progress data between stores', () => {
      const { addScheduledSession, completeSession, getProgressForAchievements } = useExamStore.getState()
      
      // Complete some sessions
      addScheduledSession({
        subjectId: 'math',
        subjectName: 'Mathematics',
        date: new Date().toISOString(),
        duration: 60,
        topicsPlanned: ['algebra'],
        type: 'scheduled'
      })
      
      const { scheduledSessions } = useExamStore.getState()
      completeSession(scheduledSessions[0].id, ['algebra'])
      
      addScheduledSession({
        subjectId: 'physics',
        subjectName: 'Physics',
        date: new Date().toISOString(),
        duration: 45,
        topicsPlanned: ['mechanics'],
        type: 'scheduled'
      })
      
      const updatedState = useExamStore.getState()
      completeSession(updatedState.scheduledSessions[0].id, ['mechanics'])
      
      const progressData = getProgressForAchievements()
      const examProgress = useExamStore.getState().progress
      
      // Verify consistency
      if (examProgress) {
        expect(progressData.sessionsCompleted).toBe(examProgress.sessionsCompleted)
        expect(progressData.totalStudyTime).toBe(examProgress.totalStudyTime)
      }
      expect(progressData.streakCount).toBe(useExamStore.getState().streakCount)
    })

    it('should handle flashcard progress integration', () => {
      const { getProgressForAchievements } = useExamStore.getState()
      
      const progressData = getProgressForAchievements()
      
      // Should include flashcard review count
      expect(progressData).toHaveProperty('flashcardsReviewed')
      expect(typeof progressData.flashcardsReviewed).toBe('number')
    })

    it('should reset achievement progress when exam data is reset', () => {
      const { addScheduledSession, completeSession, resetStore } = useExamStore.getState()
      
      // Complete session and unlock achievement
      addScheduledSession({
        subjectId: 'math',
        subjectName: 'Mathematics',
        date: new Date().toISOString(),
        duration: 30,
        topicsPlanned: ['algebra'],
        type: 'scheduled'
      })
      
      const { scheduledSessions } = useExamStore.getState()
      completeSession(scheduledSessions[0].id, ['algebra'])
      
      const unlockedAchievements = useAchievementStore.getState().unlockedAchievements
      expect(unlockedAchievements.length).toBeGreaterThan(0)
      
      // Reset exam store
      resetStore()
      
      // Achievement progress should be affected
      const progressData = useExamStore.getState().getProgressForAchievements()
      expect(progressData.sessionsCompleted).toBe(0)
      expect(progressData.totalStudyTime).toBe(0)
    })
  })

  describe('Achievement Milestone Progression', () => {
    it('should unlock multiple streak achievements as streak grows', () => {
      const { recordActivity } = useExamStore.getState()
      
      // Record 7 days of activity
      const today = new Date()
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() - (6 - i))
        recordActivity(date)
      }
      
      const unlockedAchievements = useAchievementStore.getState().unlockedAchievements
      
      // Should unlock both 3-day and 7-day streak achievements
      expect(unlockedAchievements).toContain('streak-3')
      expect(unlockedAchievements).toContain('streak-7')
    })

    it('should unlock flashcard achievements when integrated with flashcard store', () => {
      // This will test flashcard achievement integration once implemented
      const { getProgressForAchievements } = useExamStore.getState()
      
      const progressData = getProgressForAchievements()
      
      // Mock scenario: if we had 50+ flashcards reviewed
      if (progressData.flashcardsReviewed >= 50) {
        const { checkAchievements } = useAchievementStore.getState()
        const newlyUnlocked = checkAchievements(progressData)
        expect(newlyUnlocked).toContain('flashcard-explorer')
      }
      
      // For now, just verify the structure exists
      expect(progressData.flashcardsReviewed).toBeDefined()
    })
  })
})
