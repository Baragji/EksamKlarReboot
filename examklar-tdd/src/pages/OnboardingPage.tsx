import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExamStore } from '../stores/examStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

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
  
  const { addSubject, completeOnboarding } = useExamStore()
  const navigate = useNavigate()

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

  const handleNext = () => {
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
      // Complete onboarding when reaching step 3
      completeOnboarding()
    }
    
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleGoToDashboard = () => {
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
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to ExamKlar
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your AI-powered study companion
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <p className="text-gray-700 mb-6">
            Get started with your personalized exam preparation journey
          </p>
          <div className="mb-4">
            <span className="text-sm text-gray-500">Step 1 of 3</span>
          </div>
          <Button onClick={handleNext} className="w-full">
            Get Started
          </Button>
        </div>
      </div>
    )
  }

  // Step 2: Add Subject
  if (currentStep === 2) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Add Your First Subject
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Tell us about your upcoming exam
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <div className="mb-4">
            <span className="text-sm text-gray-500">Step 2 of 3</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <Input
                name="subject-name"
                label="Subject Name"
                type="text"
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
    )
  }

  // Step 3: Completion
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        You're All Set!
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Your study plan is ready to go
      </p>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <div className="mb-4">
          <span className="text-sm text-gray-500">Step 3 of 3</span>
        </div>
        
        <div className="mb-6">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <p className="text-gray-700">
            Great! We've created your first subject: <strong>{formData.subjectName}</strong>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Exam date: {new Date(formData.examDate).toLocaleDateString()}
          </p>
        </div>
        
        <Button onClick={handleGoToDashboard} className="w-full">
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default OnboardingPage
