import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/**
 * Achievement System - V5 Gamification Engine
 * Manages user achievements, progress tracking, and motivation
 */

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  criteria: {
    type: 'sessions' | 'study_time' | 'streak' | 'flashcards' | 'quiz_score'
    value: number
    operator: 'gte' | 'eq' | 'lte'
  }
  category: 'learning' | 'consistency' | 'mastery' | 'exploration'
  points: number
  unlocked?: boolean
}

export interface AchievementProgress {
  current: number
  required: number
  percentage: number
}

export interface ProgressData {
  sessionsCompleted: number
  totalStudyTime: number
  streakCount: number
  flashcardsReviewed: number
  averageQuizScore?: number
}

interface AchievementState {
  // Core state
  achievements: Achievement[]
  unlockedAchievements: string[]
  
  // Computed getters
  getTotalPoints: () => number
  getAchievementProgress: (achievementId: string) => AchievementProgress
  isAchievementUnlocked: (achievementId: string) => boolean
  
  // Actions
  unlockAchievement: (achievementId: string) => void
  checkAchievements: (progressData: ProgressData) => string[]
  resetAchievements: () => void
}

// Predefined achievements based on V5 gamification plan
const defaultAchievements: Achievement[] = [
  {
    id: 'first-session',
    title: 'First Steps',
    description: 'Complete your first study session',
    icon: '🚀',
    criteria: {
      type: 'sessions',
      value: 1,
      operator: 'gte'
    },
    category: 'learning',
    points: 10
  },
  {
    id: 'streak-3',
    title: 'Study Streak',
    description: 'Study for 3 consecutive days',
    icon: '🔥',
    criteria: {
      type: 'streak',
      value: 3,
      operator: 'gte'
    },
    category: 'consistency',
    points: 25
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Study for 7 consecutive days',
    icon: '⚡',
    criteria: {
      type: 'streak',
      value: 7,
      operator: 'gte'
    },
    category: 'consistency',
    points: 50
  },
  {
    id: 'session-master',
    title: 'Session Master',
    description: 'Complete 10 study sessions',
    icon: '🎯',
    criteria: {
      type: 'sessions',
      value: 10,
      operator: 'gte'
    },
    category: 'learning',
    points: 30
  },
  {
    id: 'time-scholar',
    title: 'Time Scholar',
    description: 'Study for 5 hours total',
    icon: '⏰',
    criteria: {
      type: 'study_time',
      value: 300, // 5 hours in minutes
      operator: 'gte'
    },
    category: 'learning',
    points: 40
  },
  {
    id: 'flashcard-explorer',
    title: 'Flashcard Explorer',
    description: 'Review 50 flashcards',
    icon: '📚',
    criteria: {
      type: 'flashcards',
      value: 50,
      operator: 'gte'
    },
    category: 'exploration',
    points: 20
  },
  {
    id: 'flashcard-master',
    title: 'Flashcard Master',
    description: 'Review 200 flashcards',
    icon: '🧠',
    criteria: {
      type: 'flashcards',
      value: 200,
      operator: 'gte'
    },
    category: 'mastery',
    points: 75
  },
  {
    id: 'dedication-streak',
    title: 'Dedication Champion',
    description: 'Study for 30 consecutive days',
    icon: '👑',
    criteria: {
      type: 'streak',
      value: 30,
      operator: 'gte'
    },
    category: 'consistency',
    points: 100
  }
]

export const useAchievementStore = create<AchievementState>()(
  devtools(
    (set, get) => ({
      // Initial state
      achievements: defaultAchievements,
      unlockedAchievements: [],

      // Computed getters
      getTotalPoints: () => {
        const { achievements, unlockedAchievements } = get()
        return unlockedAchievements.reduce((total, achievementId) => {
          const achievement = achievements.find(a => a.id === achievementId)
          return total + (achievement?.points || 0)
        }, 0)
      },

      getAchievementProgress: (achievementId: string) => {
        const { achievements } = get()
        const achievement = achievements.find(a => a.id === achievementId)
        
        if (!achievement) {
          return { current: 0, required: 1, percentage: 0 }
        }

        // For now, return default progress structure
        // This will be enhanced when we integrate with actual progress data
        return {
          current: 0,
          required: achievement.criteria.value,
          percentage: 0
        }
      },

      isAchievementUnlocked: (achievementId: string) => {
        const { unlockedAchievements } = get()
        return unlockedAchievements.includes(achievementId)
      },

      // Actions
      unlockAchievement: (achievementId: string) => {
        set((state) => {
          if (state.unlockedAchievements.includes(achievementId)) {
            return state // Already unlocked
          }
          
          return {
            ...state,
            unlockedAchievements: [...state.unlockedAchievements, achievementId]
          }
        })
      },

      checkAchievements: (progressData: ProgressData) => {
        const { achievements, unlockedAchievements } = get()
        const newlyUnlocked: string[] = []

        achievements.forEach(achievement => {
          // Skip if already unlocked
          if (unlockedAchievements.includes(achievement.id)) {
            return
          }

          // Check if criteria is met
          let currentValue = 0
          switch (achievement.criteria.type) {
            case 'sessions':
              currentValue = progressData.sessionsCompleted
              break
            case 'study_time':
              currentValue = progressData.totalStudyTime
              break
            case 'streak':
              currentValue = progressData.streakCount
              break
            case 'flashcards':
              currentValue = progressData.flashcardsReviewed
              break
            case 'quiz_score':
              currentValue = progressData.averageQuizScore || 0
              break
          }

          // Check if criteria is met based on operator
          let criteriaMet = false
          switch (achievement.criteria.operator) {
            case 'gte':
              criteriaMet = currentValue >= achievement.criteria.value
              break
            case 'eq':
              criteriaMet = currentValue === achievement.criteria.value
              break
            case 'lte':
              criteriaMet = currentValue <= achievement.criteria.value
              break
          }

          if (criteriaMet) {
            newlyUnlocked.push(achievement.id)
          }
        })

        // Unlock all newly achieved
        if (newlyUnlocked.length > 0) {
          set((state) => ({
            ...state,
            unlockedAchievements: [...state.unlockedAchievements, ...newlyUnlocked]
          }))
        }

        return newlyUnlocked
      },

      resetAchievements: () => {
        set({
          achievements: defaultAchievements,
          unlockedAchievements: []
        })
      }
    }),
    {
      name: 'achievement-store',
      partialize: (state: AchievementState) => ({
        unlockedAchievements: state.unlockedAchievements
      })
    }
  )
)
