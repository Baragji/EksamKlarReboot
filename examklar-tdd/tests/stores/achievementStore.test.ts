import { describe, it, expect, beforeEach } from 'vitest'
import { useAchievementStore } from '../../src/stores/achievementStore'

/**
 * Achievement Store Tests - TDD V5 Fase 1 Day 3-5
 * Testing achievement definitions, unlocking logic, and integration
 */
describe('Achievement Store - TDD V5', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useAchievementStore.getState()
    store.resetAchievements?.()
  })

  describe('Achievement Definitions', () => {
    it('should have predefined achievements with correct structure', () => {
      const { achievements } = useAchievementStore.getState()
      
      expect(achievements).toBeDefined()
      expect(Array.isArray(achievements)).toBe(true)
      expect(achievements.length).toBeGreaterThan(0)
      
      // Check first achievement structure
      const firstAchievement = achievements[0]
      expect(firstAchievement).toHaveProperty('id')
      expect(firstAchievement).toHaveProperty('title')
      expect(firstAchievement).toHaveProperty('description')
      expect(firstAchievement).toHaveProperty('icon')
      expect(firstAchievement).toHaveProperty('criteria')
      expect(firstAchievement).toHaveProperty('category')
      expect(firstAchievement).toHaveProperty('points')
    })

    it('should include basic learning achievements', () => {
      const { achievements } = useAchievementStore.getState()
      
      // Check for essential achievement categories
      const achievementTitles = achievements.map(a => a.title)
      
      expect(achievementTitles).toContain('First Steps')
      expect(achievementTitles).toContain('Study Streak')
      expect(achievementTitles).toContain('Session Master')
      expect(achievementTitles).toContain('Flashcard Explorer')
    })

    it('should have achievements with different difficulty levels', () => {
      const { achievements } = useAchievementStore.getState()
      
      // Check for different point values indicating difficulty
      const pointValues = achievements.map(a => a.points)
      const uniquePoints = [...new Set(pointValues)]
      
      expect(uniquePoints.length).toBeGreaterThan(1) // Multiple difficulty levels
      expect(Math.min(...pointValues)).toBeGreaterThanOrEqual(10) // Minimum points
      expect(Math.max(...pointValues)).toBeGreaterThanOrEqual(100) // Maximum points
    })
  })

  describe('Achievement State Management', () => {
    it('should start with no unlocked achievements', () => {
      const { unlockedAchievements } = useAchievementStore.getState()
      
      expect(unlockedAchievements).toBeDefined()
      expect(Array.isArray(unlockedAchievements)).toBe(true)
      expect(unlockedAchievements.length).toBe(0)
    })

    it('should calculate total points from unlocked achievements', () => {
      const { getTotalPoints } = useAchievementStore.getState()
      
      expect(getTotalPoints).toBeDefined()
      expect(typeof getTotalPoints).toBe('function')
      expect(getTotalPoints()).toBe(0) // No achievements unlocked initially
    })

    it('should get progress for specific achievement criteria', () => {
      const { getAchievementProgress } = useAchievementStore.getState()
      
      expect(getAchievementProgress).toBeDefined()
      expect(typeof getAchievementProgress).toBe('function')
      
      // Test with a basic achievement ID
      const progress = getAchievementProgress('first-session')
      expect(typeof progress).toBe('object')
      expect(progress).toHaveProperty('current')
      expect(progress).toHaveProperty('required')
      expect(progress).toHaveProperty('percentage')
    })
  })

  describe('Achievement Unlocking Logic', () => {
    it('should unlock achievement when criteria is met', () => {
      const { unlockAchievement, achievements } = useAchievementStore.getState()
      
      expect(unlockAchievement).toBeDefined()
      expect(typeof unlockAchievement).toBe('function')
      
      const achievementId = achievements[0].id
      unlockAchievement(achievementId)
      
      const updatedState = useAchievementStore.getState()
      expect(updatedState.unlockedAchievements).toContain(achievementId)
    })

    it('should not unlock the same achievement twice', () => {
      const { unlockAchievement, achievements } = useAchievementStore.getState()
      
      const achievementId = achievements[0].id
      
      // Unlock twice
      unlockAchievement(achievementId)
      unlockAchievement(achievementId)
      
      const { unlockedAchievements } = useAchievementStore.getState()
      const occurrences = unlockedAchievements.filter(id => id === achievementId).length
      expect(occurrences).toBe(1)
    })

    it('should update total points when achievement is unlocked', () => {
      const { unlockAchievement, getTotalPoints, achievements } = useAchievementStore.getState()
      
      const achievement = achievements[0]
      const initialPoints = getTotalPoints()
      
      unlockAchievement(achievement.id)
      
      const newPoints = useAchievementStore.getState().getTotalPoints()
      expect(newPoints).toBe(initialPoints + achievement.points)
    })

    it('should check if specific achievement is unlocked', () => {
      const { unlockAchievement, isAchievementUnlocked, achievements } = useAchievementStore.getState()
      
      expect(isAchievementUnlocked).toBeDefined()
      expect(typeof isAchievementUnlocked).toBe('function')
      
      const achievementId = achievements[0].id
      
      expect(isAchievementUnlocked(achievementId)).toBe(false)
      
      unlockAchievement(achievementId)
      
      expect(useAchievementStore.getState().isAchievementUnlocked(achievementId)).toBe(true)
    })
  })

  describe('Achievement Integration Logic', () => {
    it('should check achievements automatically when progress updates', () => {
      const { checkAchievements } = useAchievementStore.getState()
      
      expect(checkAchievements).toBeDefined()
      expect(typeof checkAchievements).toBe('function')
      
      // Mock progress data that should trigger achievements
      const mockProgress = {
        sessionsCompleted: 1,
        totalStudyTime: 30,
        streakCount: 1,
        flashcardsReviewed: 10
      }
      
      const newlyUnlocked = checkAchievements(mockProgress)
      
      expect(Array.isArray(newlyUnlocked)).toBe(true)
      // Should unlock "First Steps" achievement for completing first session
      expect(newlyUnlocked.length).toBeGreaterThan(0)
    })

    it('should return newly unlocked achievements from check', () => {
      const { checkAchievements, achievements } = useAchievementStore.getState()
      
      // Find the "first session" achievement
      const firstSessionAchievement = achievements.find(a => a.id === 'first-session')
      expect(firstSessionAchievement).toBeDefined()
      
      const mockProgress = {
        sessionsCompleted: 1,
        totalStudyTime: 30,
        streakCount: 1,
        flashcardsReviewed: 5
      }
      
      const newlyUnlocked = checkAchievements(mockProgress)
      expect(newlyUnlocked).toContain('first-session')
    })

    it('should not return already unlocked achievements from check', () => {
      const { checkAchievements, unlockAchievement } = useAchievementStore.getState()
      
      // Pre-unlock an achievement
      unlockAchievement('first-session')
      
      const mockProgress = {
        sessionsCompleted: 1,
        totalStudyTime: 30,
        streakCount: 1,
        flashcardsReviewed: 5
      }
      
      const newlyUnlocked = checkAchievements(mockProgress)
      expect(newlyUnlocked).not.toContain('first-session')
    })
  })
})
