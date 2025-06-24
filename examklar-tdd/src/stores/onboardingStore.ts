/**
 * ONBOARDING STORE
 * Session 1.2: Enhanced Store Architecture
 * Comprehensive Zustand store for onboarding flow management
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  OnboardingData,
  OnboardingState,
  OnboardingStep,
  ContentItem,
  SubjectOption,
  TimelineOption,
  CustomTimeline,
  LearningPlan,
  ToastNotification,
  UploadProgress,
  WebImportData,
  OnboardingAnalytics,
  OnboardingError
} from '@/types'

/**
 * Onboarding Store Interface
 * Manages complete onboarding flow state and actions
 */
interface OnboardingStore {
  // Core State
  state: OnboardingState
  data: Partial<OnboardingData>
  
  // Step Management
  steps: OnboardingStep[]
  currentStepIndex: number
  
  // Content Management
  uploadedContent: ContentItem[]
  uploadProgress: UploadProgress[]
  webImports: WebImportData[]
  
  // Subject & Timeline
  availableSubjects: SubjectOption[]
  selectedSubject: SubjectOption | null
  availableTimelines: TimelineOption[]
  selectedTimeline: TimelineOption | CustomTimeline | null
  
  // Generated Learning Plan
  generatedPlan: LearningPlan | null
  planGenerationStatus: 'idle' | 'generating' | 'completed' | 'failed'
  
  // UI State
  toasts: ToastNotification[]
  isLoading: boolean
  errors: Record<string, string>
  warnings: string[]
  
  // Analytics
  analytics: OnboardingAnalytics | null
  
  // Navigation Actions
  nextStep: () => void
  previousStep: () => void
  goToStep: (stepIndex: number) => void
  canProceedToNext: () => boolean
  canGoToPrevious: () => boolean
  
  // Data Management Actions
  updateData: (updates: Partial<OnboardingData>) => void
  setSubject: (subject: string, emoji: string) => void
  setExamDate: (date: string) => void
  setTimeline: (timeline: TimelineOption | CustomTimeline) => void
  
  // Content Management Actions
  addContent: (content: ContentItem) => void
  removeContent: (contentId: string) => void
  updateContent: (contentId: string, updates: Partial<ContentItem>) => void
  clearAllContent: () => void
  
  // File Upload Actions
  startUpload: (fileId: string, fileName: string) => void
  updateUploadProgress: (fileId: string, progress: number) => void
  completeUpload: (fileId: string, content: ContentItem) => void
  failUpload: (fileId: string, error: string) => void
  cancelUpload: (fileId: string) => void
  
  // Web Import Actions
  addWebImport: (webData: WebImportData) => void
  removeWebImport: (url: string) => void
  
  // Learning Plan Actions
  generateLearningPlan: () => Promise<void>
  updateLearningPlan: (plan: LearningPlan) => void
  clearLearningPlan: () => void
  
  // Toast Management
  addToast: (toast: Omit<ToastNotification, 'id' | 'createdAt'>) => void
  removeToast: (toastId: string) => void
  clearAllToasts: () => void
  
  // Error Management
  setError: (field: string, message: string) => void
  clearError: (field: string) => void
  clearAllErrors: () => void
  addWarning: (message: string) => void
  clearWarnings: () => void
  
  // Validation
  validateCurrentStep: () => boolean
  validateAllData: () => boolean
  getValidationErrors: () => Record<string, string>
  
  // Analytics Actions
  startAnalytics: (sessionId: string) => void
  updateAnalytics: (updates: Partial<OnboardingAnalytics>) => void
  recordStepCompletion: (stepIndex: number, timeSpent: number) => void
  recordError: (error: OnboardingError) => void
  completeOnboarding: () => void
  abandonOnboarding: () => void
  
  // Utility Actions
  reset: () => void
  exportData: () => OnboardingData | null
  importData: (data: Partial<OnboardingData>) => void
  
  // Loading State
  setLoading: (loading: boolean) => void
}

// Default onboarding steps configuration
const defaultSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Vælg dit fag',
    description: 'Vælg det fag du vil forberede dig til eksamen i',
    component: 'SubjectSelection',
    isCompleted: false,
    isActive: true,
    canSkip: false,
    validationRules: [
      {
        field: 'subject',
        type: 'required',
        message: 'Du skal vælge et fag',
        required: true
      }
    ]
  },
  {
    id: 2,
    title: 'Upload dit materiale',
    description: 'Upload dine noter, bøger eller andet studiemateriale',
    component: 'ContentUpload',
    isCompleted: false,
    isActive: false,
    canSkip: true,
    validationRules: []
  },
  {
    id: 3,
    title: 'Sæt din eksamensdato',
    description: 'Hvornår er din eksamen? Dette hjælper os med at planlægge din læring',
    component: 'ExamDateSelection',
    isCompleted: false,
    isActive: false,
    canSkip: false,
    validationRules: [
      {
        field: 'examDate',
        type: 'required',
        message: 'Du skal vælge en eksamensdato',
        required: true
      },
      {
        field: 'examDate',
        type: 'date',
        message: 'Eksamensdatoen skal være i fremtiden',
        required: true
      }
    ]
  },
  {
    id: 4,
    title: 'Vælg din tidsplan',
    description: 'Hvor meget tid har du til at forberede dig?',
    component: 'TimelineSelection',
    isCompleted: false,
    isActive: false,
    canSkip: false,
    validationRules: [
      {
        field: 'timeline',
        type: 'required',
        message: 'Du skal vælge en tidsplan',
        required: true
      }
    ]
  },
  {
    id: 5,
    title: 'Generer din læringsplan',
    description: 'Vi laver en personlig læringsplan baseret på dit materiale',
    component: 'PlanGeneration',
    isCompleted: false,
    isActive: false,
    canSkip: false,
    validationRules: []
  }
]

// Default subject options
const defaultSubjects: SubjectOption[] = [
  {
    name: 'Matematik',
    emoji: '📐',
    keywords: ['matematik', 'math', 'tal', 'algebra', 'geometri'],
    category: 'mathematics',
    defaultContent: ['Algebra', 'Geometri', 'Statistik'],
    studyTips: ['Øv dagligt med opgaver', 'Forstå teorien før du øver']
  },
  {
    name: 'Dansk',
    emoji: '📚',
    keywords: ['dansk', 'litteratur', 'grammatik', 'sprog'],
    category: 'language',
    defaultContent: ['Grammatik', 'Litteraturanalyse', 'Skriftlig fremstilling'],
    studyTips: ['Læs meget', 'Øv skriftlig fremstilling']
  },
  {
    name: 'Engelsk',
    emoji: '🇬🇧',
    keywords: ['engelsk', 'english', 'grammar', 'vocabulary'],
    category: 'language',
    defaultContent: ['Grammar', 'Vocabulary', 'Literature'],
    studyTips: ['Practice speaking', 'Read English texts daily']
  },
  {
    name: 'Historie',
    emoji: '🏛️',
    keywords: ['historie', 'history', 'samfund', 'politik'],
    category: 'social_studies',
    defaultContent: ['Verdenshistorie', 'Danmarks historie', 'Samfundsforhold'],
    studyTips: ['Lav tidslinjer', 'Forstå sammenhænge']
  },
  {
    name: 'Fysik',
    emoji: '⚛️',
    keywords: ['fysik', 'physics', 'naturvidenskab'],
    category: 'science',
    defaultContent: ['Mekanik', 'Termodynamik', 'Elektricitet'],
    studyTips: ['Forstå formlerne', 'Øv med eksperimenter']
  },
  {
    name: 'Kemi',
    emoji: '🧪',
    keywords: ['kemi', 'chemistry', 'molekyler', 'reaktioner'],
    category: 'science',
    defaultContent: ['Grundstoffer', 'Kemiske reaktioner', 'Organisk kemi'],
    studyTips: ['Lær det periodiske system', 'Forstå reaktionsmekanismer']
  }
]

// Default timeline options
const defaultTimelines: TimelineOption[] = [
  {
    id: 'relaxed',
    label: 'Afslappet (3+ måneder)',
    days: 90,
    description: 'Rolig forberedelse med god tid',
    intensity: 'relaxed',
    recommendedHours: 2,
    milestones: ['Grundlæggende forståelse', 'Dybere analyse', 'Eksamensforberedelse']
  },
  {
    id: 'moderate',
    label: 'Moderat (1-3 måneder)',
    days: 60,
    description: 'Balanceret forberedelse',
    intensity: 'moderate',
    recommendedHours: 3,
    milestones: ['Hurtig gennemgang', 'Fokuseret læring', 'Intensiv træning']
  },
  {
    id: 'intensive',
    label: 'Intensiv (2-4 uger)',
    days: 21,
    description: 'Koncentreret forberedelse',
    intensity: 'intensive',
    recommendedHours: 4,
    milestones: ['Hurtig læring', 'Intensiv træning']
  },
  {
    id: 'cramming',
    label: 'Sidste chance (1-2 uger)',
    days: 7,
    description: 'Maksimal indsats på kort tid',
    intensity: 'cramming',
    recommendedHours: 6,
    milestones: ['Fokus på det vigtigste']
  }
]

// Initial state
const initialState = {
  state: {
    currentStep: 1,
    totalSteps: defaultSteps.length,
    isCompleted: false,
    canProceed: false,
    data: {},
    errors: {},
    warnings: [],
    progress: 0
  } as OnboardingState,
  data: {} as Partial<OnboardingData>,
  steps: defaultSteps,
  currentStepIndex: 0,
  uploadedContent: [] as ContentItem[],
  uploadProgress: [] as UploadProgress[],
  webImports: [] as WebImportData[],
  availableSubjects: defaultSubjects,
  selectedSubject: null,
  availableTimelines: defaultTimelines,
  selectedTimeline: null,
  generatedPlan: null,
  planGenerationStatus: 'idle' as const,
  toasts: [] as ToastNotification[],
  isLoading: false,
  errors: {} as Record<string, string>,
  warnings: [] as string[],
  analytics: null
}

/**
 * Onboarding Zustand Store
 * Manages complete onboarding flow with persistence
 */
export const useOnboardingStore = create<OnboardingStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Navigation Actions
        nextStep: () => {
          const state = get()
          if (state.canProceedToNext()) {
            const nextIndex = Math.min(state.currentStepIndex + 1, state.steps.length - 1)
            const progress = ((nextIndex + 1) / state.steps.length) * 100
            
            set({
              currentStepIndex: nextIndex,
              state: {
                ...state.state,
                currentStep: nextIndex + 1,
                progress
              }
            }, false, 'nextStep')
            
            // Record analytics
            if (state.analytics) {
              state.recordStepCompletion(state.currentStepIndex, Date.now() - (state.analytics.startedAt?.getTime() || 0))
            }
          }
        },

        previousStep: () => {
          const state = get()
          if (state.canGoToPrevious()) {
            const prevIndex = Math.max(state.currentStepIndex - 1, 0)
            const progress = ((prevIndex + 1) / state.steps.length) * 100
            
            set({
              currentStepIndex: prevIndex,
              state: {
                ...state.state,
                currentStep: prevIndex + 1,
                progress
              }
            }, false, 'previousStep')
          }
        },

        goToStep: (stepIndex: number) => {
          const state = get()
          if (stepIndex >= 0 && stepIndex < state.steps.length) {
            const progress = ((stepIndex + 1) / state.steps.length) * 100
            
            set({
              currentStepIndex: stepIndex,
              state: {
                ...state.state,
                currentStep: stepIndex + 1,
                progress
              }
            }, false, 'goToStep')
          }
        },

        canProceedToNext: () => {
          const state = get()
          return state.validateCurrentStep() && state.currentStepIndex < state.steps.length - 1
        },

        canGoToPrevious: () => {
          const state = get()
          return state.currentStepIndex > 0
        },

        // Data Management Actions
        updateData: (updates) => {
          set((state) => ({
            data: { ...state.data, ...updates },
            state: {
              ...state.state,
              data: { ...state.state.data, ...updates }
            }
          }), false, 'updateData')
        },

        setSubject: (subject, emoji) => {
          const selectedSubject = get().availableSubjects.find(s => s.name === subject)
          set((state) => ({
            data: { ...state.data, subject, subjectEmoji: emoji },
            selectedSubject,
            state: {
              ...state.state,
              data: { ...state.state.data, subject, subjectEmoji: emoji }
            }
          }), false, 'setSubject')
        },

        setExamDate: (date) => {
          const examDate = new Date(date)
          const now = new Date()
          const daysToExam = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          
          set((state) => ({
            data: { ...state.data, examDate: date, daysToExam },
            state: {
              ...state.state,
              data: { ...state.state.data, examDate: date, daysToExam }
            }
          }), false, 'setExamDate')
        },

        setTimeline: (timeline) => {
          set((state) => ({
            selectedTimeline: timeline,
            data: { ...state.data, timeline }
          }), false, 'setTimeline')
        },

        // Content Management Actions
        addContent: (content) => {
          set((state) => ({
            uploadedContent: [...state.uploadedContent, content],
            data: {
              ...state.data,
              content: [...(state.data.content || []), content]
            }
          }), false, 'addContent')
        },

        removeContent: (contentId) => {
          set((state) => ({
            uploadedContent: state.uploadedContent.filter(c => c.id !== contentId),
            data: {
              ...state.data,
              content: (state.data.content || []).filter(c => c.id !== contentId)
            }
          }), false, 'removeContent')
        },

        updateContent: (contentId, updates) => {
          set((state) => ({
            uploadedContent: state.uploadedContent.map(c => 
              c.id === contentId ? { ...c, ...updates } : c
            ),
            data: {
              ...state.data,
              content: (state.data.content || []).map(c => 
                c.id === contentId ? { ...c, ...updates } : c
              )
            }
          }), false, 'updateContent')
        },

        clearAllContent: () => {
          set((state) => ({
            uploadedContent: [],
            data: { ...state.data, content: [] }
          }), false, 'clearAllContent')
        },

        // File Upload Actions
        startUpload: (fileId, fileName) => {
          const uploadProgress: UploadProgress = {
            fileId,
            fileName,
            progress: 0,
            status: 'uploading',
            startedAt: new Date()
          }
          
          set((state) => ({
            uploadProgress: [...state.uploadProgress, uploadProgress]
          }), false, 'startUpload')
        },

        updateUploadProgress: (fileId, progress) => {
          set((state) => ({
            uploadProgress: state.uploadProgress.map(up => 
              up.fileId === fileId ? { ...up, progress } : up
            )
          }), false, 'updateUploadProgress')
        },

        completeUpload: (fileId, content) => {
          set((state) => ({
            uploadProgress: state.uploadProgress.map(up => 
              up.fileId === fileId 
                ? { ...up, progress: 100, status: 'completed', completedAt: new Date() }
                : up
            )
          }), false, 'completeUpload')
          
          // Add content to store
          get().addContent(content)
        },

        failUpload: (fileId, error) => {
          set((state) => ({
            uploadProgress: state.uploadProgress.map(up => 
              up.fileId === fileId 
                ? { ...up, status: 'failed', error, completedAt: new Date() }
                : up
            )
          }), false, 'failUpload')
        },

        cancelUpload: (fileId) => {
          set((state) => ({
            uploadProgress: state.uploadProgress.filter(up => up.fileId !== fileId)
          }), false, 'cancelUpload')
        },

        // Web Import Actions
        addWebImport: (webData) => {
          set((state) => ({
            webImports: [...state.webImports, webData]
          }), false, 'addWebImport')
          
          // Convert to ContentItem and add
          const contentItem: ContentItem = {
            id: `web_${Date.now()}`,
            name: webData.title || webData.url,
            type: 'web',
            size: webData.content.length,
            content: webData.content,
            processed: false,
            uploadedAt: webData.extractedAt,
            processingStatus: 'pending',
            metadata: {
              wordCount: webData.wordCount,
              extractedText: webData.content
            }
          }
          
          get().addContent(contentItem)
        },

        removeWebImport: (url) => {
          set((state) => ({
            webImports: state.webImports.filter(wi => wi.url !== url)
          }), false, 'removeWebImport')
        },

        // Learning Plan Actions
        generateLearningPlan: async () => {
          set({ planGenerationStatus: 'generating', isLoading: true }, false, 'generateLearningPlan:start')
          
          try {
            const state = get()
            
            // Simulate plan generation (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            const mockPlan: LearningPlan = {
              id: `plan_${Date.now()}`,
              subjectId: state.data.subject || 'unknown',
              timeline: state.selectedTimeline!,
              phases: [],
              milestones: [],
              generatedAt: new Date(),
              lastUpdated: new Date()
            }
            
            set({
              generatedPlan: mockPlan,
              planGenerationStatus: 'completed',
              isLoading: false,
              data: { ...state.data, learningPlan: mockPlan }
            }, false, 'generateLearningPlan:success')
            
          } catch {
            set({
              planGenerationStatus: 'failed',
              isLoading: false
            }, false, 'generateLearningPlan:error')
            
            get().addToast({
              type: 'error',
              title: 'Fejl',
              message: 'Kunne ikke generere læringsplan. Prøv igen.',
              duration: 5000,
              dismissible: true
            })
          }
        },

        updateLearningPlan: (plan) => {
          set((state) => ({
            generatedPlan: plan,
            data: { ...state.data, learningPlan: plan }
          }), false, 'updateLearningPlan')
        },

        clearLearningPlan: () => {
          set((state) => ({
            generatedPlan: null,
            planGenerationStatus: 'idle',
            data: { ...state.data, learningPlan: null }
          }), false, 'clearLearningPlan')
        },

        // Toast Management
        addToast: (toastData) => {
          const toast: ToastNotification = {
            ...toastData,
            id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date()
          }
          
          set((state) => ({
            toasts: [...state.toasts, toast]
          }), false, 'addToast')
          
          // Auto-remove toast after duration
          if (toast.duration > 0) {
            setTimeout(() => {
              get().removeToast(toast.id)
            }, toast.duration)
          }
        },

        removeToast: (toastId) => {
          set((state) => ({
            toasts: state.toasts.filter(t => t.id !== toastId)
          }), false, 'removeToast')
        },

        clearAllToasts: () => {
          set({ toasts: [] }, false, 'clearAllToasts')
        },

        // Error Management
        setError: (field, message) => {
          set((state) => ({
            errors: { ...state.errors, [field]: message },
            state: {
              ...state.state,
              errors: { ...state.state.errors, [field]: message }
            }
          }), false, 'setError')
        },

        clearError: (field) => {
          set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [field]: _removed, ...restErrors } = state.errors
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [field]: _removedState, ...restStateErrors } = state.state.errors
            
            return {
              errors: restErrors,
              state: {
                ...state.state,
                errors: restStateErrors
              }
            }
          }, false, 'clearError')
        },

        clearAllErrors: () => {
          set((state) => ({
            errors: {},
            state: { ...state.state, errors: {} }
          }), false, 'clearAllErrors')
        },

        addWarning: (message) => {
          set((state) => ({
            warnings: [...state.warnings, message],
            state: {
              ...state.state,
              warnings: [...state.state.warnings, message]
            }
          }), false, 'addWarning')
        },

        clearWarnings: () => {
          set((state) => ({
            warnings: [],
            state: { ...state.state, warnings: [] }
          }), false, 'clearWarnings')
        },

        // Validation
        validateCurrentStep: () => {
          const state = get()
          const currentStep = state.steps[state.currentStepIndex]
          
          if (!currentStep.validationRules.length) return true
          
          let isValid = true
          const errors: Record<string, string> = {}
          
          for (const rule of currentStep.validationRules) {
            const value = (state.data as Record<string, unknown>)[rule.field]
            
            if (rule.type === 'required' && rule.required) {
              if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors[rule.field] = rule.message
                isValid = false
              }
            }
            
            if (rule.type === 'date' && value && typeof value === 'string') {
              const date = new Date(value)
              const now = new Date()
              if (date <= now) {
                errors[rule.field] = rule.message
                isValid = false
              }
            }
            
            if (rule.type === 'minLength' && value && rule.minLength && typeof value === 'string') {
              if (value.length < rule.minLength) {
                errors[rule.field] = rule.message
                isValid = false
              }
            }
          }
          
          // Update errors in state
          set((state) => ({
            errors,
            state: { ...state.state, errors, canProceed: isValid }
          }), false, 'validateCurrentStep')
          
          return isValid
        },

        validateAllData: () => {
          const state = get()
          let isValid = true
          const allErrors: Record<string, string> = {}
          
          // Validate all steps
          for (const step of state.steps) {
            for (const rule of step.validationRules) {
              const value = (state.data as Record<string, unknown>)[rule.field]
              
              if (rule.type === 'required' && rule.required) {
                if (!value || (typeof value === 'string' && value.trim() === '')) {
                  allErrors[rule.field] = rule.message
                  isValid = false
                }
              }
            }
          }
          
          return isValid
        },

        getValidationErrors: () => {
          const state = get()
          return state.errors
        },

        // Analytics Actions
        startAnalytics: (sessionId) => {
          const analytics: OnboardingAnalytics = {
            sessionId,
            startedAt: new Date(),
            currentStep: 1,
            stepsCompleted: [],
            timeSpentPerStep: {},
            errors: [],
            completionRate: 0,
            userAgent: navigator.userAgent,
            deviceInfo: {
              platform: navigator.platform,
              browser: navigator.userAgent.split(' ')[0],
              screenResolution: `${screen.width}x${screen.height}`,
              isMobile: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent),
              isTablet: /iPad|Tablet/.test(navigator.userAgent)
            }
          }
          
          set({ analytics }, false, 'startAnalytics')
        },

        updateAnalytics: (updates) => {
          set((state) => ({
            analytics: state.analytics ? { ...state.analytics, ...updates } : null
          }), false, 'updateAnalytics')
        },

        recordStepCompletion: (stepIndex, timeSpent) => {
          set((state) => {
            if (!state.analytics) return state
            
            return {
              analytics: {
                ...state.analytics,
                stepsCompleted: [...state.analytics.stepsCompleted, stepIndex],
                timeSpentPerStep: {
                  ...state.analytics.timeSpentPerStep,
                  [stepIndex]: timeSpent
                },
                currentStep: stepIndex + 1,
                completionRate: ((stepIndex + 1) / state.steps.length) * 100
              }
            }
          }, false, 'recordStepCompletion')
        },

        recordError: (error) => {
          set((state) => {
            if (!state.analytics) return state
            
            return {
              analytics: {
                ...state.analytics,
                errors: [...state.analytics.errors, error]
              }
            }
          }, false, 'recordError')
        },

        completeOnboarding: () => {
          set((state) => ({
            state: { ...state.state, isCompleted: true, progress: 100 },
            analytics: state.analytics ? {
              ...state.analytics,
              completedAt: new Date(),
              completionRate: 100
            } : null
          }), false, 'completeOnboarding')
        },

        abandonOnboarding: () => {
          set((state) => ({
            analytics: state.analytics ? {
              ...state.analytics,
              abandonedAt: new Date()
            } : null
          }), false, 'abandonOnboarding')
        },

        // Utility Actions
        reset: () => {
          set(initialState, false, 'reset')
        },

        exportData: () => {
          const state = get()
          if (!state.validateAllData()) return null
          
          return {
            subject: state.data.subject!,
            subjectEmoji: state.data.subjectEmoji!,
            content: state.data.content || [],
            examDate: state.data.examDate!,
            daysToExam: state.data.daysToExam!,
            learningPlan: state.data.learningPlan || null,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },

        importData: (data) => {
          set((state) => ({
            data: { ...state.data, ...data },
            state: {
              ...state.state,
              data: { ...state.state.data, ...data }
            }
          }), false, 'importData')
        },

        setLoading: (loading) => {
          set({ isLoading: loading }, false, 'setLoading')
        }
      }),
      {
        name: 'examklar-onboarding-store',
        version: 1
      }
    ),
    {
      name: 'OnboardingStore'
    }
  )
)