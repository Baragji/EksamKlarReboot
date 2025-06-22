import { render, screen, act, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { QuizEngine } from '../../src/components/QuizEngine'

describe('QuizEngine Component - TDD', () => {
  const mockQuizzes = [
    {
      id: '1',
      title: 'Math Basics',
      description: 'Basic mathematics',
      questions: [
        {
          id: '1',
          question: 'What is 1 + 1?',
          options: ['1', '2', '3', '4'],
          correctAnswer: 1,
          explanation: '1 + 1 = 2',
          difficulty: 'easy' as const,
          points: 10
        }
      ],
      timeLimit: 60,
      passingScore: 50
    },
    {
      id: '2',
      title: 'Advanced Math',
      description: 'Advanced mathematics',
      questions: [
        {
          id: '2',
          question: 'What is the derivative of x²?',
          options: ['x', '2x', 'x²', '2x²'],
          correctAnswer: 1,
          explanation: 'd/dx(x²) = 2x',
          difficulty: 'hard' as const,
          points: 30
        }
      ],
      timeLimit: 120,
      passingScore: 70
    }
  ]

  it('should display list of available quizzes', () => {
    render(<QuizEngine quizzes={mockQuizzes} />)
    expect(screen.getByText('Math Basics')).toBeInTheDocument()
    expect(screen.getByText('Advanced Math')).toBeInTheDocument()
  })

  it('should show quiz details for each quiz', () => {
    render(<QuizEngine quizzes={mockQuizzes} />)
    expect(screen.getByText('Basic mathematics')).toBeInTheDocument()
    expect(screen.getByText('1 question')).toBeInTheDocument()
    expect(screen.getByText('1 min')).toBeInTheDocument()
  })

  it('should allow starting a quiz', () => {
    render(<QuizEngine quizzes={mockQuizzes} />)
    
    act(() => {
      fireEvent.click(screen.getByText('Start Quiz'))
    })
    
    expect(screen.getByText('What is 1 + 1?')).toBeInTheDocument()
  })

  it('should track quiz completion history', () => {
    const handleQuizComplete = vi.fn()
    render(<QuizEngine quizzes={mockQuizzes} onQuizComplete={handleQuizComplete} />)
    
    // Start and complete quiz
    act(() => {
      fireEvent.click(screen.getByText('Start Quiz'))
    })
    act(() => {
      fireEvent.click(screen.getByText('2'))
    })
    act(() => {
      fireEvent.click(screen.getByText('Finish Quiz'))
    })
    act(() => {
      fireEvent.click(screen.getByText('Yes, Finish Quiz'))
    })
    
    expect(handleQuizComplete).toHaveBeenCalledWith({
      quizId: '1',
      score: 100,
      passed: true,
      completedAt: expect.any(Date)
    })
  })

  it('should show quiz history and statistics', () => {
    const history = [
      {
        quizId: '1',
        score: 85,
        passed: true,
        completedAt: new Date('2025-06-20'),
        timeSpent: 45
      }
    ]
    
    render(<QuizEngine quizzes={mockQuizzes} history={history} />)
    expect(screen.getByText(/recent attempts/i)).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()
  })

  it('should filter quizzes by difficulty', () => {
    render(<QuizEngine quizzes={mockQuizzes} />)
    
    act(() => {
      fireEvent.click(screen.getByText('Easy'))
    })
    
    expect(screen.getByText('Math Basics')).toBeInTheDocument()
    expect(screen.queryByText('Advanced Math')).not.toBeInTheDocument()
  })

  it('should search quizzes by title', () => {
    render(<QuizEngine quizzes={mockQuizzes} />)
    
    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Search quizzes...'), {
        target: { value: 'Advanced' }
      })
    })
    
    expect(screen.queryByText('Math Basics')).not.toBeInTheDocument()
    expect(screen.getByText('Advanced Math')).toBeInTheDocument()
  })

  it('should show empty state when no quizzes available', () => {
    render(<QuizEngine quizzes={[]} />)
    expect(screen.getByText(/no quizzes available/i)).toBeInTheDocument()
  })

  it('should display overall statistics', () => {
    const history = [
      { quizId: '1', score: 85, passed: true, completedAt: new Date() },
      { quizId: '2', score: 65, passed: false, completedAt: new Date() }
    ]
    
    render(<QuizEngine quizzes={mockQuizzes} history={history} />)
    expect(screen.getByText(/average score: 75%/i)).toBeInTheDocument()
    expect(screen.getByText(/completion rate: 50%/i)).toBeInTheDocument()
  })

  it('should allow retaking failed quizzes', () => {
    const history = [
      { quizId: '1', score: 30, passed: false, completedAt: new Date() }
    ]
    
    render(<QuizEngine quizzes={mockQuizzes} history={history} />)
    expect(screen.getByText('Retake Quiz')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<QuizEngine quizzes={mockQuizzes} />)
    
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByLabelText('Search quizzes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start quiz/i })).toBeInTheDocument()
  })
})
