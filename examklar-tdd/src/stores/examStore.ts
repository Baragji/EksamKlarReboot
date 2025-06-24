import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { 
  User, 
  Subject, 
  StudyPlan, 
  Progress,
  OnboardingData,
  TrainingData
} from '@/types'
import { useAchievementStore, type ProgressData } from './achievementStore'
import { useOnboardingStore } from './onboardingStore'
import { useDataBridgeStore } from './databridgeStore'

/**
 * Study Session types
 */
export interface StudySession {
  id: string
  subjectId: string
  subjectName: string
  date: string
  duration: number
  topicsStudied?: string[]
  topicsPlanned?: string[]
  completed: boolean
  type?: 'scheduled'
  createdAt: Date
}

interface ScheduledSession {
  id: string
  subjectId: string
  subjectName: string
  date: string
  duration: number
  topicsPlanned: string[]
  type: 'scheduled'
  createdAt: Date
}

/**
 * ExamKlar application state store
 * Manages user data, subjects, study plans, progress tracking, and study sessions
 */
interface ExamStore {
  // State
  user: User | null
  subjects: Subject[]
  currentSubject: Subject | null
  studyPlan: StudyPlan | null
  progress: Progress | null
  onboardingCompleted: boolean
  
  // Study Sessions
  studySessions: StudySession[]
  scheduledSessions: ScheduledSession[]
  
  // Streak Counter (V5 Gamification)
  streakCount: number
  longestStreak: number
  lastActivityDate: Date | null
  flashcardsReviewed: number
  recentAchievements: string[]
  
  // Enhanced Integration State
  onboardingData: OnboardingData | null
  trainingData: TrainingData | null
  
  // Store Integration Status
  storesInitialized: boolean
  lastSyncTimestamp: Date | null
  
  // Actions
  setUser: (user: User) => void
  addSubject: (subject: Subject) => void
  removeSubject: (subjectId: string) => void
  setCurrentSubject: (subject: Subject) => void
  updateStudyPlan: (plan: StudyPlan) => void
  updateProgress: (progress: Progress) => void
  completeOnboarding: () => void
  setProgress: (progress: Progress) => void
  setOnboardingCompleted: (completed: boolean) => void
  
  // Study Session Actions
  addScheduledSession: (session: Omit<ScheduledSession, 'id' | 'createdAt'>) => void
  updateSession: (session: StudySession) => void
  deleteSession: (sessionId: string) => void
  completeSession: (sessionId: string, topicsStudied: string[]) => void
  
  // Streak Actions
  recordActivity: (activityDate?: Date) => void
  getStreakMessage: () => string
  
  // Achievement Integration (V5 Gamification)
  triggerAchievementCheck: () => string[]
  getProgressForAchievements: () => ProgressData
  getRecentAchievements: () => string[]
  clearRecentAchievements: () => void
  resetStore: () => void
  
  // Enhanced Integration Actions
  initializeStores: () => Promise<void>
  syncWithOnboarding: () => void
  syncWithDataBridge: () => void
  setOnboardingData: (data: OnboardingData) => void
  setTrainingData: (data: TrainingData) => void
  
  // Cross-Store Communication
  handleOnboardingComplete: (data: OnboardingData) => Promise<void>
  handleTrainingDataGenerated: (data: TrainingData) => void
  getIntegratedProgress: () => Progress
  
  // Computed getters
  getUpcomingDeadlines: () => Subject[]
  getCurrentProgress: () => number
  getTodaysGoal: () => number
  
  // Utility
  reset: () => void
}

const initialState = {
  user: null,
  subjects: [],
  currentSubject: null,
  studyPlan: null,
  progress: null,
  onboardingCompleted: false,
  studySessions: [],
  scheduledSessions: [],
  streakCount: 0,
  longestStreak: 0,
  lastActivityDate: null,
  flashcardsReviewed: 0,
  recentAchievements: [] as string[],
  onboardingData: null,
  trainingData: null,
  storesInitialized: false,
  lastSyncTimestamp: null
}

/**
 * ExamKlar Zustand store with persistence and devtools
 */
export const useExamStore = create<ExamStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // User management
        setUser: (user) => set({ user }, false, 'setUser'),
        
        // Subject management
        addSubject: (subject) => set((state) => ({
          subjects: [...state.subjects, subject]
        }), false, 'addSubject'),
        
        removeSubject: (subjectId) => set((state) => {
          const updatedSubjects = state.subjects.filter(s => s.id !== subjectId)
          const currentSubject = state.currentSubject?.id === subjectId 
            ? null 
            : state.currentSubject
            
          return {
            subjects: updatedSubjects,
            currentSubject
          }
        }, false, 'removeSubject'),
        
        setCurrentSubject: (subject) => set({ currentSubject: subject }, false, 'setCurrentSubject'),
        
        // Study plan management
        updateStudyPlan: (plan) => set({ studyPlan: plan }, false, 'updateStudyPlan'),
        
        // Progress management
        updateProgress: (progress) => set({ progress }, false, 'updateProgress'),
        setProgress: (progress) => set({ progress }, false, 'setProgress'),
        
        // Computed getters
        getUpcomingDeadlines: () => {
          const state = get()
          const now = new Date()
          
          return state.subjects
            .filter(subject => subject.examDate > now)
            .sort((a, b) => a.examDate.getTime() - b.examDate.getTime())
        },
        
        getCurrentProgress: () => {
          const state = get()
          // Calculate current progress based on study sessions and goals
          // This is a simplified implementation
          return state.progress?.weeklyProgress || 0
        },
        
        getTodaysGoal: () => {
          const state = get()
          return state.studyPlan?.dailyGoalMinutes || 30
        },
        
        // Onboarding management
        completeOnboarding: () => set({ onboardingCompleted: true }, false, 'completeOnboarding'),
        setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }, false, 'setOnboardingCompleted'),
        
        // Enhanced Integration Actions
        initializeStores: async () => {
          const state = get()
          if (state.storesInitialized) return
          
          try {
            // Initialize cross-store communication
            set({ storesInitialized: true, lastSyncTimestamp: new Date() }, false, 'initializeStores')
            
            // Sync with other stores
            get().syncWithOnboarding()
            get().syncWithDataBridge()
            
          } catch (error) {
            console.error('Failed to initialize stores:', error)
            set({ storesInitialized: false }, false, 'initializeStores:error')
          }
        },

        syncWithOnboarding: () => {
          // Get onboarding data if available
          const onboardingStore = useOnboardingStore.getState()
          const onboardingData = onboardingStore.exportData()
          
          if (onboardingData) {
            set({ onboardingData, lastSyncTimestamp: new Date() }, false, 'syncWithOnboarding')
            
            // Update subjects based on onboarding data
            if (onboardingData.subject && !get().subjects.find(s => s.name === onboardingData.subject)) {
              const newSubject: Subject = {
                id: `subject_${Date.now()}`,
                name: onboardingData.subject,
                description: `Generated from onboarding`,
                emoji: onboardingData.subjectEmoji,
                examDate: new Date(onboardingData.examDate),
                estimatedHours: onboardingData.daysToExam * 2, // Rough estimate
                createdAt: new Date()
              }
              
              get().addSubject(newSubject)
              get().setCurrentSubject(newSubject)
            }
          }
        },

        syncWithDataBridge: () => {
          // Get training data from DataBridge
          const dataBridgeStore = useDataBridgeStore.getState()
          const trainingData = dataBridgeStore.trainingData[0] // Get latest
          
          if (trainingData) {
            set({ trainingData, lastSyncTimestamp: new Date() }, false, 'syncWithDataBridge')
          }
        },

        setOnboardingData: (data) => {
          set({ onboardingData: data, lastSyncTimestamp: new Date() }, false, 'setOnboardingData')
        },

        setTrainingData: (data) => {
          set({ trainingData: data, lastSyncTimestamp: new Date() }, false, 'setTrainingData')
        },

        handleOnboardingComplete: async (data) => {
          // Store onboarding data
          get().setOnboardingData(data)
          
          // Mark onboarding as completed
          get().completeOnboarding()
          
          // Generate training data via DataBridge
          const dataBridgeStore = useDataBridgeStore.getState()
          try {
            const trainingData = await dataBridgeStore.generateTrainingData(data)
            get().handleTrainingDataGenerated(trainingData)
          } catch (error) {
            console.error('Failed to generate training data:', error)
          }
          
          // Update progress
          const currentProgress = get().progress || {
            sessionsCompleted: 0,
            totalStudyTime: 0,
            streakCount: 0,
            lastActivity: new Date(),
            weeklyGoal: 600,
            weeklyProgress: 0
          }
          
          get().updateProgress({
            ...currentProgress,
            lastActivity: new Date()
          })
        },

        handleTrainingDataGenerated: (data) => {
          get().setTrainingData(data)
          
          // Could trigger additional actions like:
          // - Generate initial flashcards
          // - Create study plan
          // - Set up learning pathways
        },

        getIntegratedProgress: () => {
          const state = get()
          const baseProgress = state.progress || {
            sessionsCompleted: 0,
            totalStudyTime: 0,
            streakCount: state.streakCount,
            lastActivity: new Date(),
            weeklyGoal: 600,
            weeklyProgress: 0
          }
          
          // Enhance with onboarding and training data insights
          let enhancedProgress = { ...baseProgress }
          
          if (state.onboardingData) {
            // Add insights from onboarding
            enhancedProgress = {
              ...enhancedProgress,
              // Could add onboarding-specific metrics
            }
          }
          
          if (state.trainingData) {
            // Add insights from training data
            enhancedProgress = {
              ...enhancedProgress,
              // Could add training data quality metrics
            }
          }
          
          return enhancedProgress
        },
        
        // Study Session Management
        addScheduledSession: (sessionData) => set((state) => {
          const newSession: ScheduledSession = {
            ...sessionData,
            id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date()
          }
          return {
            scheduledSessions: [...state.scheduledSessions, newSession]
          }
        }, false, 'addScheduledSession'),
        
        updateSession: (updatedSession) => set((state) => {
          // Update in studySessions if it's a completed session
          const studySessionIndex = state.studySessions.findIndex(s => s.id === updatedSession.id)
          if (studySessionIndex !== -1) {
            const updatedStudySessions = [...state.studySessions]
            updatedStudySessions[studySessionIndex] = updatedSession
            return { studySessions: updatedStudySessions }
          }
          
          // Update in scheduledSessions if it's a scheduled session
          const scheduledSessionIndex = state.scheduledSessions.findIndex(s => s.id === updatedSession.id)
          if (scheduledSessionIndex !== -1) {
            const updatedScheduledSessions = [...state.scheduledSessions]
            // Convert StudySession back to ScheduledSession format
            const updatedScheduledSession: ScheduledSession = {
              id: updatedSession.id,
              subjectId: updatedSession.subjectId,
              subjectName: updatedSession.subjectName,
              date: updatedSession.date,
              duration: updatedSession.duration,
              topicsPlanned: updatedSession.topicsPlanned || [],
              type: 'scheduled',
              createdAt: updatedScheduledSessions[scheduledSessionIndex].createdAt
            }
            updatedScheduledSessions[scheduledSessionIndex] = updatedScheduledSession
            return { scheduledSessions: updatedScheduledSessions }
          }
          
          return state
        }, false, 'updateSession'),
        
        deleteSession: (sessionId) => set((state) => ({
          studySessions: state.studySessions.filter(s => s.id !== sessionId),
          scheduledSessions: state.scheduledSessions.filter(s => s.id !== sessionId)
        }), false, 'deleteSession'),
        
        completeSession: (sessionId, topicsStudied) => {
          set((state) => {
            const scheduledSessionIndex = state.scheduledSessions.findIndex(s => s.id === sessionId)
            if (scheduledSessionIndex !== -1) {
              const scheduledSession = state.scheduledSessions[scheduledSessionIndex]
              const completedSession: StudySession = {
                id: scheduledSession.id,
                subjectId: scheduledSession.subjectId,
                subjectName: scheduledSession.subjectName,
                date: scheduledSession.date,
                duration: scheduledSession.duration,
                topicsStudied,
                completed: true,
                createdAt: scheduledSession.createdAt
              }
              
              // Automatically record activity when completing session (V5 Gamification)
              const now = new Date()
              const today = now.toDateString()
              
              let streakUpdate = {
                streakCount: state.streakCount,
                longestStreak: state.longestStreak,
                lastActivityDate: state.lastActivityDate
              }
              
              // If not already recorded activity today, update streak
              if (!state.lastActivityDate || state.lastActivityDate.toDateString() !== today) {
                let newStreakCount = 1
                
                // Check if the last activity was yesterday (consecutive days)
                if (state.lastActivityDate) {
                  const yesterday = new Date(now)
                  yesterday.setDate(yesterday.getDate() - 1)
                  
                  if (state.lastActivityDate.toDateString() === yesterday.toDateString()) {
                    // Consecutive day - extend streak
                    newStreakCount = state.streakCount + 1
                  }
                }
                
                streakUpdate = {
                  streakCount: newStreakCount,
                  longestStreak: Math.max(state.longestStreak, newStreakCount),
                  lastActivityDate: now
                }
              }
              
              // Update progress state
              const currentProgress = state.progress || {
                sessionsCompleted: 0,
                totalStudyTime: 0,
                streakCount: 0,
                lastActivity: new Date(),
                weeklyGoal: 600,
                weeklyProgress: 0
              }
              
              const newProgress = {
                ...currentProgress,
                sessionsCompleted: currentProgress.sessionsCompleted + 1,
                totalStudyTime: currentProgress.totalStudyTime + scheduledSession.duration,
                lastActivity: now,
                weeklyProgress: currentProgress.weeklyProgress + scheduledSession.duration
              }
              
              return {
                studySessions: [...state.studySessions, completedSession],
                scheduledSessions: state.scheduledSessions.filter(s => s.id !== sessionId),
                progress: newProgress,
                ...streakUpdate
              }
            }
            return state
          }, false, 'completeSession')
          
          // Trigger achievement check after completing session
          const examState = get()
          examState.triggerAchievementCheck()
        },
        
        // Streak management (V5 Gamification)
        recordActivity: (activityDate?: Date) => {
          set((state) => {
            const now = activityDate || new Date()
            const today = now.toDateString()
            
            // If already recorded activity today, don't change streak
            if (state.lastActivityDate && state.lastActivityDate.toDateString() === today) {
              return state
            }
            
            let newStreakCount = 1
            
            // Check if the last activity was yesterday (consecutive days)
            if (state.lastActivityDate) {
              const yesterday = new Date(now)
              yesterday.setDate(yesterday.getDate() - 1)
              
              if (state.lastActivityDate.toDateString() === yesterday.toDateString()) {
                // Consecutive day - extend streak
                newStreakCount = state.streakCount + 1
              }
              // If not consecutive, streak resets to 1 (already set above)
            }
            
            // Update longest streak if current exceeds it
            const newLongestStreak = Math.max(state.longestStreak, newStreakCount)
            
            return {
              streakCount: newStreakCount,
              longestStreak: newLongestStreak,
              lastActivityDate: now
            }
          }, false, 'recordActivity')
          
          // Trigger achievement check after recording activity
          const examState = get()
          examState.triggerAchievementCheck()
        },
        
        getStreakMessage: () => {
          const state = get()
          const { streakCount } = state
          
          if (streakCount === 0) {
            return "Start your learning journey today! 🌟"
          } else if (streakCount === 1) {
            return "Great start! Keep it going! 🔥 Day 1"
          } else if (streakCount === 7) {
            return "One week strong! 💪 7 days in a row!"
          } else if (streakCount === 30) {
            return "Unstoppable! 🚀 30 days of dedication!"
          } else {
            return `Amazing streak! 🔥 ${streakCount} days in a row!`
          }
        },
        
        // Achievement Integration Methods
        triggerAchievementCheck: () => {
          const state = get()
          const progressData = state.getProgressForAchievements()
          
          const achievementStore = useAchievementStore.getState()
          const newlyUnlocked = achievementStore.checkAchievements(progressData)
          
          // Store recently unlocked achievements for notifications
          if (newlyUnlocked.length > 0) {
            set((currentState) => ({
              recentAchievements: [...currentState.recentAchievements, ...newlyUnlocked]
            }), false, 'triggerAchievementCheck')
          }
          
          return newlyUnlocked
        },
        
        getProgressForAchievements: () => {
          const state = get()
          return {
            sessionsCompleted: state.progress?.sessionsCompleted || 0,
            totalStudyTime: state.progress?.totalStudyTime || 0,
            streakCount: state.streakCount,
            flashcardsReviewed: state.flashcardsReviewed
          }
        },
        
        getRecentAchievements: () => {
          const state = get()
          return state.recentAchievements
        },
        
        clearRecentAchievements: () => {
          set({ recentAchievements: [] }, false, 'clearRecentAchievements')
        },
        
        resetStore: () => {
          set(initialState, false, 'resetStore')
        },
        
        // Utility functions
        reset: () => set(initialState, false, 'reset')
      }),
      {
        name: 'examklar-storage',
        version: 1,
        // Serialize/deserialize dates properly
        partialize: (state) => ({
          ...state,
          user: state.user ? {
            ...state.user,
            createdAt: state.user.createdAt.toISOString()
          } : null,
          subjects: state.subjects.map(subject => ({
            ...subject,
            examDate: subject.examDate.toISOString(),
            createdAt: subject.createdAt.toISOString()
          })),
          currentSubject: state.currentSubject ? {
            ...state.currentSubject,
            examDate: state.currentSubject.examDate.toISOString(),
            createdAt: state.currentSubject.createdAt.toISOString()
          } : null,
          studyPlan: state.studyPlan ? {
            ...state.studyPlan,
            createdAt: state.studyPlan.createdAt.toISOString()
          } : null
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Rehydrate dates from strings
            if (state.user) {
              state.user.createdAt = new Date(state.user.createdAt)
            }
            
            state.subjects = state.subjects.map(subject => ({
              ...subject,
              examDate: new Date(subject.examDate),
              createdAt: new Date(subject.createdAt)
            }))
            
            if (state.currentSubject) {
              state.currentSubject.examDate = new Date(state.currentSubject.examDate)
              state.currentSubject.createdAt = new Date(state.currentSubject.createdAt)
            }
            
            if (state.studyPlan) {
              state.studyPlan.createdAt = new Date(state.studyPlan.createdAt)
            }
          }
        }
      }
    ),
    {
      name: 'examklar-store'
    }
  )
)
