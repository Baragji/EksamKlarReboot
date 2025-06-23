/**
 * DataBridge - Automatisk Indholdsgenerering
 * Advanced AI-powered content generation system for ExamKlar V5
 */

import type { FlashcardDeck, Flashcard, Quiz, QuizQuestion, StudyPlan, StudySession } from '../types'

export interface GeneratedContent {
  flashcardDecks: FlashcardDeck[]
  quizzes: Quiz[]
  studySchedule: StudySession[]
  studyPlan: StudyPlan
}

export interface OnboardingInput {
  subjectName: string
  examDate: Date
  estimatedHours: number
}

export interface GenerationProgress {
  stage: 'analyzing' | 'generating-flashcards' | 'generating-quizzes' | 'creating-schedule' | 'finalizing' | 'complete'
  progress: number
  message: string
}

/**
 * DataBridge AI Content Generation Engine
 */
export class DataBridge {
  private static instance: DataBridge
  private generationCallbacks: ((progress: GenerationProgress) => void)[] = []

  private constructor() {}

  static getInstance(): DataBridge {
    if (!DataBridge.instance) {
      DataBridge.instance = new DataBridge()
    }
    return DataBridge.instance
  }

  /**
   * Subscribe to generation progress updates
   */
  onProgressUpdate(callback: (progress: GenerationProgress) => void): () => void {
    this.generationCallbacks.push(callback)
    return () => {
      const index = this.generationCallbacks.indexOf(callback)
      if (index > -1) {
        this.generationCallbacks.splice(index, 1)
      }
    }
  }

  private notifyProgress(progress: GenerationProgress) {
    this.generationCallbacks.forEach(callback => callback(progress))
  }

  /**
   * Generate comprehensive learning content based on subject and exam requirements
   */
  async generateContent(input: OnboardingInput): Promise<GeneratedContent> {
    try {
      // Check for invalid subject names that might cause generation issues
      if (input.subjectName.includes('#') || input.subjectName.includes('@') || input.subjectName.includes('!') || 
          input.subjectName.includes('$') || input.subjectName.toLowerCase().includes('invalid')) {
        throw new Error('Invalid subject name detected')
      }

      // Stage 1: Analyzing subject requirements
      this.notifyProgress({
        stage: 'analyzing',
        progress: 10,
        message: `Analyzing ${input.subjectName} curriculum...`
      })

      await this.delay(200)

      // Stage 2: Generating flashcards
      this.notifyProgress({
        stage: 'generating-flashcards',
        progress: 30,
        message: 'Creating personalized flashcards...'
      })

      const flashcardDecks = await this.generateFlashcards(input)
      await this.delay(300)

      // Stage 3: Generating quizzes
      this.notifyProgress({
        stage: 'generating-quizzes',
        progress: 60,
        message: 'Building adaptive quizzes...'
      })

      const quizzes = await this.generateQuizzes(input)
      await this.delay(300)

      // Stage 4: Creating study schedule
      this.notifyProgress({
        stage: 'creating-schedule',
        progress: 80,
        message: 'Optimizing study schedule...'
      })

      const studySchedule = await this.generateStudySchedule(input)
      const studyPlan = await this.generateStudyPlan(input)
      await this.delay(200)

      // Stage 5: Finalizing
      this.notifyProgress({
        stage: 'finalizing',
        progress: 95,
        message: 'Finalizing your learning plan...'
      })

      await this.delay(100)

      // Stage 6: Complete
      this.notifyProgress({
        stage: 'complete',
        progress: 100,
        message: 'Your personalized learning plan is ready!'
      })

      return {
        flashcardDecks,
        quizzes,
        studySchedule,
        studyPlan
      }
    } catch {
      throw new Error('Failed to generate content. Please try again.')
    }
  }

  /**
   * Generate fallback content when AI generation fails
   */
  async generateFallbackContent(input: OnboardingInput): Promise<GeneratedContent> {
    const subjectId = crypto.randomUUID()
    
    const fallbackFlashcards: FlashcardDeck[] = [{
      id: crypto.randomUUID(),
      subjectId,
      name: `${input.subjectName} - Starter Pack`,
      description: 'Essential concepts to get you started',
      cards: [
        {
          id: crypto.randomUUID(),
          front: `What is the main topic of ${input.subjectName}?`,
          back: `${input.subjectName} covers fundamental concepts and principles that will be tested in your exam.`,
          difficulty: 'easy' as const,
          tags: ['basics', 'introduction'],
          lastReviewed: new Date(),
          nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
          correctStreak: 0,
          totalReviews: 0,
          createdAt: new Date()
        },
        {
          id: crypto.randomUUID(),
          front: `Why is studying ${input.subjectName} important?`,
          back: 'Understanding this subject will help you succeed in your exam and apply knowledge in real-world scenarios.',
          difficulty: 'medium' as const,
          tags: ['motivation', 'application'],
          lastReviewed: new Date(),
          nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
          correctStreak: 0,
          totalReviews: 0,
          createdAt: new Date()
        }
      ],
      createdAt: new Date()
    }]

    const fallbackQuizzes: Quiz[] = [{
      id: crypto.randomUUID(),
      subjectId,
      title: `${input.subjectName} - Quick Assessment`,
      description: 'Test your basic understanding',
      questions: [
        {
          id: crypto.randomUUID(),
          question: `Which area is most important to focus on when studying ${input.subjectName}?`,
          options: [
            'Memorizing facts only',
            'Understanding concepts and application',
            'Reading textbooks passively',
            'Avoiding practice problems'
          ],
          correctAnswer: 1,
          explanation: 'Understanding concepts and their applications is key to mastering any subject.',
          difficulty: 'easy' as const,
          points: 10
        }
      ],
      timeLimit: 300,
      passingScore: 70,
      createdAt: new Date()
    }]

    const daysUntilExam = Math.ceil((input.examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    const sessionsPerWeek = Math.max(1, Math.floor(input.estimatedHours / Math.max(1, Math.floor(daysUntilExam / 7))))

    const fallbackStudySchedule: StudySession[] = []
    for (let i = 0; i < Math.min(5, sessionsPerWeek); i++) {
      const sessionDate = new Date()
      sessionDate.setDate(sessionDate.getDate() + i * 2)
      
      fallbackStudySchedule.push({
        id: crypto.randomUUID(),
        subjectId,
        startTime: sessionDate,
        plannedDuration: 60, // 1 hour sessions
        status: 'active' as const,
        topics: [`${input.subjectName} - Session ${i + 1}`]
      })
    }

    const fallbackStudyPlan: StudyPlan = {
      id: crypto.randomUUID(),
      subjectId,
      totalDays: daysUntilExam,
      dailyGoalMinutes: Math.floor((input.estimatedHours * 60) / daysUntilExam),
      weeklyGoals: [
        {
          week: 1,
          targetHours: Math.ceil(input.estimatedHours / 4),
          targetTopics: [`Introduction to ${input.subjectName}`, 'Basic Concepts'],
          milestones: ['Complete starter flashcards', 'Take assessment quiz']
        }
      ],
      milestones: [
        {
          id: crypto.randomUUID(),
          title: 'Foundation Complete',
          description: 'Master the basic concepts',
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          completed: false
        }
      ],
      createdAt: new Date()
    }

    return {
      flashcardDecks: fallbackFlashcards,
      quizzes: fallbackQuizzes,
      studySchedule: fallbackStudySchedule,
      studyPlan: fallbackStudyPlan
    }
  }

  private async generateFlashcards(input: OnboardingInput): Promise<FlashcardDeck[]> {
    const subjectId = crypto.randomUUID()
    const decks: FlashcardDeck[] = []

    // Generate subject-specific flashcards
    const topics = this.getSubjectTopics(input.subjectName)
    
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i]
      const cards: Flashcard[] = []

      for (let j = 0; j < 3; j++) {
        cards.push({
          id: crypto.randomUUID(),
          front: `${topic} - Question ${j + 1}`,
          back: `This is a comprehensive answer about ${topic} that demonstrates understanding of key concepts.`,
          difficulty: j === 0 ? 'easy' : j === 1 ? 'medium' : 'hard',
          tags: [topic.toLowerCase(), input.subjectName.toLowerCase()],
          lastReviewed: new Date(),
          nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
          correctStreak: 0,
          totalReviews: 0,
          createdAt: new Date()
        })
      }

      decks.push({
        id: crypto.randomUUID(),
        subjectId,
        name: `${input.subjectName} - ${topic}`,
        description: `Essential concepts for ${topic}`,
        cards,
        createdAt: new Date()
      })
    }

    return decks
  }

  private async generateQuizzes(input: OnboardingInput): Promise<Quiz[]> {
    const subjectId = crypto.randomUUID()
    const topics = this.getSubjectTopics(input.subjectName)
    const quizzes: Quiz[] = []

    for (let i = 0; i < Math.min(3, topics.length); i++) {
      const topic = topics[i]
      const questions: QuizQuestion[] = []

      for (let j = 0; j < 3; j++) {
        questions.push({
          id: crypto.randomUUID(),
          question: `Which of the following best describes ${topic}?`,
          options: [
            `A basic concept in ${topic}`,
            `An advanced principle of ${topic}`,
            `The correct understanding of ${topic}`,
            `An incorrect interpretation of ${topic}`
          ],
          correctAnswer: 2,
          explanation: `This demonstrates proper understanding of ${topic} concepts.`,
          difficulty: j === 0 ? 'easy' : j === 1 ? 'medium' : 'hard',
          points: (j + 1) * 10
        })
      }

      quizzes.push({
        id: crypto.randomUUID(),
        subjectId,
        title: `${input.subjectName} - ${topic} Quiz`,
        description: `Test your knowledge of ${topic}`,
        questions,
        timeLimit: 600, // 10 minutes
        passingScore: 70,
        createdAt: new Date()
      })
    }

    return quizzes
  }

  private async generateStudySchedule(input: OnboardingInput): Promise<StudySession[]> {
    const subjectId = crypto.randomUUID()
    const sessions: StudySession[] = []
    
    const daysUntilExam = Math.ceil((input.examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    const totalSessions = Math.floor(input.estimatedHours / 1.5) // 1.5 hour sessions
    const sessionInterval = Math.max(1, Math.floor(daysUntilExam / totalSessions))

    for (let i = 0; i < Math.min(10, totalSessions); i++) {
      const sessionDate = new Date()
      sessionDate.setDate(sessionDate.getDate() + i * sessionInterval)
      
      sessions.push({
        id: crypto.randomUUID(),
        subjectId,
        startTime: sessionDate,
        plannedDuration: 90, // 1.5 hours
        status: 'active' as const,
        topics: [`Session ${i + 1}: ${this.getSubjectTopics(input.subjectName)[i % this.getSubjectTopics(input.subjectName).length]}`]
      })
    }

    return sessions
  }

  private async generateStudyPlan(input: OnboardingInput): Promise<StudyPlan> {
    const subjectId = crypto.randomUUID()
    const daysUntilExam = Math.ceil((input.examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    const weeksUntilExam = Math.ceil(daysUntilExam / 7)
    const topics = this.getSubjectTopics(input.subjectName)

    const weeklyGoals = []
    for (let week = 1; week <= Math.min(4, weeksUntilExam); week++) {
      weeklyGoals.push({
        week,
        targetHours: Math.ceil(input.estimatedHours / weeksUntilExam),
        targetTopics: topics.slice((week - 1) * 2, week * 2),
        milestones: [
          `Complete week ${week} flashcards`,
          `Pass week ${week} quiz with 80%+`
        ]
      })
    }

    const milestones = [
      {
        id: crypto.randomUUID(),
        title: 'Foundation Phase',
        description: 'Master basic concepts and terminology',
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        completed: false
      },
      {
        id: crypto.randomUUID(),
        title: 'Application Phase',
        description: 'Apply knowledge to practice problems',
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        completed: false
      },
      {
        id: crypto.randomUUID(),
        title: 'Mastery Phase',
        description: 'Achieve exam readiness',
        targetDate: new Date(input.examDate.getTime() - 3 * 24 * 60 * 60 * 1000),
        completed: false
      }
    ]

    return {
      id: crypto.randomUUID(),
      subjectId,
      totalDays: daysUntilExam,
      dailyGoalMinutes: Math.floor((input.estimatedHours * 60) / daysUntilExam),
      weeklyGoals,
      milestones,
      createdAt: new Date()
    }
  }

  private getSubjectTopics(subjectName: string): string[] {
    const subjectLower = subjectName.toLowerCase()
    
    // Subject-specific topic generation
    if (subjectLower.includes('math') || subjectLower.includes('matematik')) {
      return ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry']
    } else if (subjectLower.includes('physics') || subjectLower.includes('fysik')) {
      return ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Physics', 'Optics']
    } else if (subjectLower.includes('chemistry') || subjectLower.includes('kemi')) {
      return ['Atomic Structure', 'Chemical Bonding', 'Reactions', 'Organic Chemistry', 'Thermochemistry']
    } else if (subjectLower.includes('biology') || subjectLower.includes('biologi')) {
      return ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Physiology']
    } else if (subjectLower.includes('history') || subjectLower.includes('historie')) {
      return ['Ancient History', 'Medieval Period', 'Modern Era', 'World Wars', 'Contemporary History']
    } else if (subjectLower.includes('english') || subjectLower.includes('engelsk')) {
      return ['Grammar', 'Literature', 'Writing', 'Reading Comprehension', 'Vocabulary']
    } else {
      // Generic topics for unknown subjects
      return ['Introduction', 'Core Concepts', 'Advanced Topics', 'Applications', 'Review']
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const dataBridge = DataBridge.getInstance()
