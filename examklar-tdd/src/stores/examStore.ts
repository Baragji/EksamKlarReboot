import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User, Subject, StudyPlan, Progress } from '../types'

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
  
  // Actions
  setUser: (user: User) => void
  addSubject: (subject: Subject) => void
  removeSubject: (subjectId: string) => void
  setCurrentSubject: (subject: Subject) => void
  updateStudyPlan: (plan: StudyPlan) => void
  updateProgress: (progress: Progress) => void
  completeOnboarding: () => void
  
  // Study Session Actions
  addScheduledSession: (session: Omit<ScheduledSession, 'id' | 'createdAt'>) => void
  updateSession: (session: StudySession) => void
  deleteSession: (sessionId: string) => void
  completeSession: (sessionId: string, topicsStudied: string[]) => void
  
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
  scheduledSessions: []
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
        
        completeSession: (sessionId, topicsStudied) => set((state) => {
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
            
            return {
              studySessions: [...state.studySessions, completedSession],
              scheduledSessions: state.scheduledSessions.filter(s => s.id !== sessionId)
            }
          }
          return state
        }, false, 'completeSession'),
        
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
