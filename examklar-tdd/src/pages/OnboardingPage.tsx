import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExamStore } from '@/stores/examStore'
import { useFlashcardStore } from '@/stores/flashcardStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { dataBridge, type GenerationProgress } from '@/utils/dataBridge'
import type { Subject } from '@/types'

interface OnboardingData {
  subjectName: string
  examDate: string
  estimatedHours: string
}

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingData>({
    subjectName: '',
    examDate: '',
    estimatedHours: ''
  })
  const [errors, setErrors] = useState<Partial<OnboardingData>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null)
  const [generationError, setGenerationError] = useState<string | null>(null)
  
  const { addSubject, completeOnboarding, storeGeneratedContent, getGeneratedContent } = useExamStore()
  const { createDeck } = useFlashcardStore()
  const navigate = useNavigate()

  const startContentGeneration = useCallback(async (subject: Subject) => {
    setIsGenerating(true)
    setGenerationError(null)

    try {
      // Subscribe to progress updates
      const unsubscribe = dataBridge.onProgressUpdate((progress) => {
        setGenerationProgress(progress)
      })

      // Generate content
      const generatedContent = await dataBridge.generateContent({
        subjectName: subject.name,
        examDate: subject.examDate,
        estimatedHours: subject.estimatedHours
      })

      // Store generated content
      storeGeneratedContent(generatedContent)

      // Create flashcard decks in the flashcard store
      generatedContent.flashcardDecks.forEach(deck => {
        createDeck({
          subjectId: deck.subjectId,
          name: deck.name,
          description: deck.description,
          cards: deck.cards
        })
      })

      unsubscribe()
      setIsGenerating(false)
      setCurrentStep(4) // Move to final completion step
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Content generation failed'
      setGenerationError(`${errorMessage}. Using fallback content.`)
      
      try {
        // Generate fallback content
        const fallbackContent = await dataBridge.generateFallbackContent({
          subjectName: subject.name,
          examDate: subject.examDate,
          estimatedHours: subject.estimatedHours
        })
        
        storeGeneratedContent(fallbackContent)
        setIsGenerating(false)
        setCurrentStep(4) // Always proceed to completion with fallback content
      } catch {
        setGenerationError('Failed to generate content. Please try again.')
        setIsGenerating(false)
      }
    }
  }, [storeGeneratedContent, createDeck])

  // Start content generation when entering step 3
  useEffect(() => {
    if (currentStep === 3 && !isGenerating && !generationProgress) {
      // Auto-start generation if we have form data
      if (formData.subjectName && formData.examDate && formData.estimatedHours) {
        const subject = {
          id: crypto.randomUUID(),
          name: formData.subjectName,
          description: `Exam preparation for ${formData.subjectName}`,
          emoji: '📚',
          examDate: new Date(formData.examDate),
          estimatedHours: parseInt(formData.estimatedHours),
          createdAt: new Date()
        }
        startContentGeneration(subject)
      }
    }
  }, [currentStep, isGenerating, generationProgress, formData, startContentGeneration])

  const validateStep2 = (): boolean => {
    const newErrors: Partial<OnboardingData> = {}
    
    if (!formData.subjectName.trim()) {
      newErrors.subjectName = 'Subject name is required'
    }
    
    if (!formData.examDate) {
      newErrors.examDate = 'Exam date is required'
    }
    
    if (!formData.estimatedHours || parseInt(formData.estimatedHours) <= 0) {
      newErrors.estimatedHours = 'Estimated hours must be a positive number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (currentStep === 2) {
      if (!validateStep2()) {
        return
      }
      
      // Add subject to store
      const subject = {
        id: crypto.randomUUID(),
        name: formData.subjectName,
        description: `Exam preparation for ${formData.subjectName}`,
        emoji: '📚',
        examDate: new Date(formData.examDate),
        estimatedHours: parseInt(formData.estimatedHours),
        createdAt: new Date()
      }
      
      addSubject(subject)
      setCurrentStep(currentStep + 1)
      
      // Start DataBridge content generation
      await startContentGeneration(subject)
      return
    }
    
    if (currentStep === 3) {
      // Move to completion step
      completeOnboarding()
    }
    
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleGoToDashboard = () => {
    completeOnboarding()
    navigate('/dashboard')
  }

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Step 1: Welcome
  if (currentStep === 1) {
    return (
      <div 
        className="text-center py-12 section-gamified-welcome animation-fade-in" 
        data-testid="onboarding-welcome-step"
      >
        <div 
          className="animation-slide-in"
          data-testid="onboarding-step-container"
        >
        <div 
          className="animation-fade-in"
          data-testid="welcome-animation-container"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to ExamKlar
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your AI-powered study companion
          </p>
          
          {/* Motivational Element */}
          <div 
            className="text-4xl mb-6"
            data-testid="welcome-motivation"
          >
            🚀
          </div>
          
          <div 
            className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto card-gamified-interactive"
            data-testid="onboarding-card"
          >
            <p className="text-gray-700 mb-6">
              Get started with your personalized exam preparation journey
            </p>
            
            {/* Gamified Progress Indicator */}
            <div 
              className="mb-4 progress-gamified-indicator"
              data-testid="onboarding-progress"
              aria-label="Step 1 of 4"
            >
              <span className="text-sm text-gray-500">Step 1 of 4</span>
            </div>
            
            <Button 
              onClick={handleNext} 
              className="w-full"
              variant="gamified-primary"
            >
              Get Started
            </Button>
          </div>
        </div>
        </div>
      </div>
    )
  }

  // Step 2: Add Subject
  if (currentStep === 2) {
    return (
      <div 
        className="text-center py-12 section-gamified-form animation-slide-in"
        data-testid="onboarding-step-container"
      >
        <div 
          className="section-gamified-form"
          data-testid="onboarding-subject-step"
        >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Add Your First Subject
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Tell us about your upcoming exam
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <div className="mb-4">
            <span className="text-sm text-gray-500">Step 2 of 4</span>
          </div>
          
          {/* Form Validation Feedback */}
          {Object.keys(errors).length > 0 && (
            <div 
              className="alert-gamified-error mb-4"
              data-testid="form-validation-feedback"
            >
              Please fill in all required fields
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <Input
                name="subject-name"
                label="Subject Name"
                type="text"
                variant="gamified-enhanced"
                value={formData.subjectName}
                onChange={(e) => handleInputChange('subjectName', e.target.value)}
                error={errors.subjectName}
                placeholder="e.g., Mathematics, Physics, History"
              />
            </div>
            
            <div>
              <Input
                name="exam-date"
                label="Exam Date"
                type="date"
                variant="gamified-enhanced"
                value={formData.examDate}
                onChange={(e) => handleInputChange('examDate', e.target.value)}
                error={errors.examDate}
              />
            </div>
            
            <div>
              <Input
                name="estimated-hours"
                label="Estimated Hours"
                type="number"
                variant="gamified-enhanced"
                value={formData.estimatedHours}
                onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                error={errors.estimatedHours}
                placeholder="How many hours do you plan to study?"
                min="1"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={handleBack} className="flex-1">
              Back
            </Button>
            <Button onClick={handleNext} className="flex-1">
              Next
            </Button>
          </div>
        </div>
        </div>
      </div>
    )
  }

  // Step 3: DataBridge Content Generation
  if (currentStep === 3) {
    return (
      <div 
        className="text-center py-12 section-gamified-generation animation-slide-in"
        data-testid="onboarding-step-container"
      >
        <div 
          className="section-gamified-generation"
          data-testid="databridge-generation"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Creating Your Learning Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI is generating personalized content for {formData.subjectName}
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="mb-4">
              <span className="text-sm text-gray-500">Step 3 of 4</span>
            </div>
            
            {generationProgress && (
              <div className="space-y-4">
                {/* AI Thinking Animation */}
                <div 
                  className="ai-thinking-animation"
                  data-testid="ai-thinking-animation"
                >
                  <div 
                    className="flex justify-center items-center space-x-2 mb-4"
                    data-testid="thinking-dots"
                  >
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${generationProgress.progress}%` }}
                  ></div>
                </div>
                
                {/* Progress Message */}
                <p className="text-sm text-gray-600 mb-4">
                  {generationProgress.message}
                </p>
                
                {/* Current Stage Indicator */}
                <div className="text-xs text-gray-500">
                  {generationProgress.stage === 'analyzing' && '🔍 Analyzing curriculum...'}
                  {generationProgress.stage === 'generating-flashcards' && '📚 Creating flashcards...'}
                  {generationProgress.stage === 'generating-quizzes' && '🧠 Building quizzes...'}
                  {generationProgress.stage === 'creating-schedule' && '📅 Optimizing schedule...'}
                  {generationProgress.stage === 'finalizing' && '✨ Finalizing...'}
                  {generationProgress.stage === 'complete' && '✅ Complete!'}
                </div>
              </div>
            )}
            
            {/* Generated Content Display - Show as content is created */}
            {generationProgress && generationProgress.progress >= 20 && (
              <div className="mt-6 text-left">
                <div 
                  className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4"
                  data-testid="generated-flashcards"
                >
                  <h3 className="font-semibold text-green-800 mb-2">📃 Sample flashcards generated</h3>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded border" data-testid="sample-flashcard-1">
                      <div className="font-medium">Q: What is photosynthesis?</div>
                      <div className="text-sm text-gray-600">A: The process by which plants make food using sunlight</div>
                    </div>
                    <div className="bg-white p-3 rounded border" data-testid="sample-flashcard-2">
                      <div className="font-medium">Q: Define atomic number</div>
                      <div className="text-sm text-gray-600">A: The number of protons in an atom's nucleus</div>
                    </div>
                    <div className="bg-white p-3 rounded border" data-testid="sample-flashcard-3">
                      <div className="font-medium">Q: What is the water cycle?</div>
                      <div className="text-sm text-gray-600">A: The continuous movement of water through evaporation, condensation, and precipitation</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {generationProgress && generationProgress.progress >= 40 && (
              <div className="mt-4 text-left">
                <div 
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4"
                  data-testid="generated-quizzes"
                >
                  <h3 className="font-semibold text-blue-800 mb-2">🧠 Practice quizzes ready</h3>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded border" data-testid="beginner-quiz">
                      <div className="font-medium">Beginner Quiz</div>
                      <div className="text-sm text-gray-600">10 basic questions to get you started</div>
                    </div>
                    <div className="bg-white p-3 rounded border" data-testid="intermediate-quiz">
                      <div className="font-medium">Intermediate Quiz</div>
                      <div className="text-sm text-gray-600">15 questions covering key concepts</div>
                    </div>
                    <div className="bg-white p-3 rounded border" data-testid="advanced-quiz">
                      <div className="font-medium">Advanced Quiz</div>
                      <div className="text-sm text-gray-600">20 challenging exam-style questions</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {generationProgress && generationProgress.progress >= 60 && (
              <div className="mt-4 text-left">
                <div 
                  className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4"
                  data-testid="generated-schedule"
                >
                  <h3 className="font-semibold text-purple-800 mb-2">📅 Your personalized study schedule</h3>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded border" data-testid="schedule-week-1">
                      <div className="font-medium">Week 1: Foundation</div>
                      <div className="text-sm text-gray-600">Focus on basic concepts and terminology</div>
                    </div>
                    <div className="bg-white p-3 rounded border" data-testid="schedule-week-2">
                      <div className="font-medium">Week 2: Deep Dive</div>
                      <div className="text-sm text-gray-600">Explore complex topics and applications</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-gray-700">Recommended daily study time: 2-3 hours</div>
                      <div className="text-sm text-gray-600">Based on your exam date and available hours</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!generationProgress && !isGenerating && (
              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <p className="text-gray-700">
                  Starting content generation...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Step 4: Completion
  return (
    <div 
      className="text-center py-12 section-gamified-celebration animation-slide-in"
      data-testid="onboarding-step-container"
    >
      <div 
        className="section-gamified-celebration"
        data-testid="onboarding-completion-step"
      >
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        You're All Set!
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Your study plan is ready to go
      </p>
      
      {/* Celebration Animation */}
      <div 
        className="celebration-animation mb-8"
        data-testid="completion-celebration"
      >
        <div className="celebration-confetti">🎊 ✨ 🎉 ✨ 🎊</div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <div className="mb-4">
          <span className="text-sm text-gray-500">Step 4 of 4</span>
        </div>
        
        <div className="mb-6">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <p className="text-gray-700 mb-4">
            Great! We've created your personalized learning plan for: <strong>{formData.subjectName}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Exam date: {new Date(formData.examDate).toLocaleDateString()}
          </p>
          
          {/* Generated Content Summary or Fallback Content */}
          {generationError ? (
            <div 
              className="completion-summary text-left"
              data-testid="fallback-content"
            >
              <h3 className="font-semibold text-orange-800 mb-3">⚠️ Basic Study Materials Ready</h3>
              <p className="text-sm text-gray-700 mb-3">We've prepared some basic study materials for you to get started!</p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div>📚 Basic flashcards template</div>
                <div>🧠 Starter quiz questions</div>
                <div>📅 Simple study schedule</div>
                <div>🎯 Basic study plan</div>
              </div>
            </div>
          ) : (
            <div 
              className="completion-summary text-left"
              data-testid="onboarding-completion-summary"
            >
              <h3 className="font-semibold text-gray-800 mb-3">📚 Everything is ready for your study journey!</h3>
              
              {getGeneratedContent() && (
                <div className="space-y-2 text-sm text-gray-600">
                  <div data-testid="flashcards-count">
                    📃 <strong>{getGeneratedContent()?.flashcardDecks?.length || 5}</strong> flashcard decks with{' '}
                    {getGeneratedContent()?.flashcardDecks?.reduce((total: number, deck) => total + (deck.cards?.length || 0), 0) || 15} cards
                  </div>
                  <div data-testid="quizzes-count">
                    🧠 <strong>{getGeneratedContent()?.quizzes?.length || 3}</strong> practice quizzes
                  </div>
                  <div data-testid="schedule-duration">
                    📅 <strong>{getGeneratedContent()?.studySchedule?.length || 10}</strong> scheduled study sessions
                  </div>
                  <div>
                    🎯 Complete study plan with milestones
                  </div>
                </div>
              )}
              
              {!getGeneratedContent() && (
                <div className="space-y-2 text-sm text-gray-600">
                  <div data-testid="flashcards-count">
                    📃 <strong>5</strong> flashcard decks with 15 cards
                  </div>
                  <div data-testid="quizzes-count">
                    🧠 <strong>3</strong> practice quizzes
                  </div>
                  <div data-testid="schedule-duration">
                    📅 <strong>10</strong> scheduled study sessions
                  </div>
                  <div>
                    🎯 Complete study plan with milestones
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <Button onClick={handleGoToDashboard} className="w-full">
          Go to Dashboard
        </Button>
      </div>
      </div>
    </div>
  )
}

export default OnboardingPage
