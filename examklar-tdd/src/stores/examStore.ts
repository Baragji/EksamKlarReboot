import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User, Subject, StudyPlan, Progress } from '../types'

/**
 * ExamKlar application state store
 * Manages user data, subjects, study plans, and progress tracking
 */
interface ExamStore {
  // State
  user: User | null
  subjects: Subject[]
  currentSubject: Subject | null
  studyPlan: StudyPlan | null
  progress: Progress | null
  
  // Actions
  setUser: (user: User) => void
  addSubject: (subject: Subject) => void
  removeSubject: (subjectId: string) => void
  setCurrentSubject: (subject: Subject) => void
  updateStudyPlan: (plan: StudyPlan) => void
  updateProgress: (progress: Progress) => void
  
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
  progress: null
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
