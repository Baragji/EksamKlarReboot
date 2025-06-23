import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User, Subject, StudyPlan, Progress } from '@/types'
import { useAchievementStore, type ProgressData } from './achievementStore'
import type { GeneratedContent } from '@/utils/dataBridge'

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
  
  // DataBridge Content Generation (V5 Onboarding)
  generatedContent: GeneratedContent | null
  
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
  
  // DataBridge Actions
  storeGeneratedContent: (content: GeneratedContent) => void
  clearGeneratedContent: () => void
  getGeneratedContent: () => GeneratedContent | null
  
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
  generatedContent: null
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
        
        // DataBridge Content Generation (V5 Onboarding)
        storeGeneratedContent: (content) => set({ generatedContent: content }, false, 'storeGeneratedContent'),
        clearGeneratedContent: () => set({ generatedContent: null }, false, 'clearGeneratedContent'),
        getGeneratedContent: () => get().generatedContent,
        
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
