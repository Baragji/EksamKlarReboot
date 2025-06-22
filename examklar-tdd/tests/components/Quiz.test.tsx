import { render, screen, act, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { Quiz } from '../../src/components/Quiz'

describe('Quiz Component - TDD', () => {
  const mockQuiz = {
    id: '1',
    title: 'Mathematics Quiz',
    description: 'Test your math skills',
    questions: [
      {
        id: '1',
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
        explanation: 'Basic addition: 2 + 2 = 4',
        difficulty: 'easy' as const,
        points: 10
      },
      {
        id: '2',
        question: 'What is 5 × 7?',
        options: ['30', '32', '35', '40'],
        correctAnswer: 2,
        explanation: 'Multiplication: 5 × 7 = 35',
        difficulty: 'medium' as const,
        points: 20
      }
    ],
    timeLimit: 300, // 5 minutes in seconds
    passingScore: 60
  }

  it('should display quiz title and description', () => {
    render(<Quiz quiz={mockQuiz} />)
    expect(screen.getByText('Mathematics Quiz')).toBeInTheDocument()
    expect(screen.getByText('Test your math skills')).toBeInTheDocument()
  })

  it('should display first question initially', () => {
    render(<Quiz quiz={mockQuiz} />)
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
    expect(screen.getByText('A: 3')).toBeInTheDocument()
    expect(screen.getByText('B: 4')).toBeInTheDocument()
    expect(screen.getByText('C: 5')).toBeInTheDocument()
    expect(screen.getByText('D: 6')).toBeInTheDocument()
  })

  it('should show question progress', () => {
    render(<Quiz quiz={mockQuiz} />)
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
  })

  it('should display timer when quiz has time limit', () => {
    render(<Quiz quiz={mockQuiz} />)
    expect(screen.getByText(/05:00/)).toBeInTheDocument()
    expect(screen.getByLabelText('Quiz timer')).toBeInTheDocument()
  })

  it('should allow selecting an answer', () => {
    render(<Quiz quiz={mockQuiz} />)
    
    const optionButton = screen.getByRole('button', { name: 'Option B: 4' })
    fireEvent.click(optionButton)
    
    // Check if the associated radio input is checked
    const radioInput = screen.getByDisplayValue('1') // Option B corresponds to value 1
    expect(radioInput).toBeChecked()
  })

  it('should highlight selected answer', () => {
    render(<Quiz quiz={mockQuiz} />)
    
    const optionButton = screen.getByRole('button', { name: 'Option B: 4' })
    act(() => {
      fireEvent.click(optionButton)
    })
    
    expect(optionButton).toHaveClass('bg-blue-100')
  })

  it('should advance to next question when next button clicked', () => {
    render(<Quiz quiz={mockQuiz} />)
    
    // Select an answer
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Option B: 4' }))
    })
    
    // Click next
    act(() => {
      fireEvent.click(screen.getByText('Next Question'))
    })
    
    expect(screen.getByText('What is 5 × 7?')).toBeInTheDocument()
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
  })

  it('should disable next button when no answer selected', () => {
    render(<Quiz quiz={mockQuiz} />)
    expect(screen.getByText('Next Question')).toBeDisabled()
  })

  it('should show finish button on last question', () => {
    render(<Quiz quiz={mockQuiz} />)
    
    // Go to last question
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Option B: 4' }))
    })
    act(() => {
      fireEvent.click(screen.getByText('Next Question'))
    })
    
    // Select answer on last question
    act(() => {
      fireEvent.click(screen.getByText('C: 35'))
    })
    
    expect(screen.getByText('Finish Quiz')).toBeInTheDocument()
  })

  it('should show confirmation dialog before finishing', () => {
    render(<Quiz quiz={mockQuiz} />)
    
    // Complete quiz
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Option B: 4' }))
    })
    act(() => {
      fireEvent.click(screen.getByText('Next Question'))
    })
    act(() => {
      fireEvent.click(screen.getByText('C: 35'))
    })
    act(() => {
      fireEvent.click(screen.getByText('Finish Quiz'))
    })
    
    expect(screen.getByText(/are you sure you want to finish/i)).toBeInTheDocument()
    expect(screen.getByText('Yes, Finish Quiz')).toBeInTheDocument()
    expect(screen.getByText('Continue Quiz')).toBeInTheDocument()
  })

  it('should call onComplete with quiz results', () => {
    const handleComplete = vi.fn()
    render(<Quiz quiz={mockQuiz} onComplete={handleComplete} />)
    
    // Complete quiz
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Option B: 4' }))
    })
    act(() => {
      fireEvent.click(screen.getByText('Next Question'))
    })
    act(() => {
      fireEvent.click(screen.getByText('C: 35'))
    })
    act(() => {
      fireEvent.click(screen.getByText('Finish Quiz'))
    })
    act(() => {
      fireEvent.click(screen.getByText('Yes, Finish Quiz'))
    })
    
    expect(handleComplete).toHaveBeenCalledWith({
      quizId: mockQuiz.id,
      score: 100, // Both answers correct
      totalQuestions: 2,
      correctAnswers: 2,
      incorrectAnswers: 0,
      timeSpent: expect.any(Number),
      passed: true,
      answers: expect.any(Array)
    })
  })

  it('should show review mode after completion', () => {
    render(<Quiz quiz={mockQuiz} />)
    
    // Complete quiz
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Option B: 4' }))
    })
    act(() => {
      fireEvent.click(screen.getByText('Next Question'))
    })
    act(() => {
      fireEvent.click(screen.getByText('C: 35'))
    })
    act(() => {
      fireEvent.click(screen.getByText('Finish Quiz'))
    })
    act(() => {
      fireEvent.click(screen.getByText('Yes, Finish Quiz'))
    })
    
    expect(screen.getByText('Quiz Complete!')).toBeInTheDocument()
    expect(screen.getByText(/score: 100%/i)).toBeInTheDocument()
    expect(screen.getByText('Review Answers')).toBeInTheDocument()
  })

  it('should show explanations in review mode', () => {
    render(<Quiz quiz={mockQuiz} />)
    
    // Complete quiz and enter review
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Option B: 4' }))
    })
    act(() => {
      fireEvent.click(screen.getByText('Next Question'))
    })
    act(() => {
      fireEvent.click(screen.getByText('C: 35'))
    })
    act(() => {
      fireEvent.click(screen.getByText('Finish Quiz'))
    })
    act(() => {
      fireEvent.click(screen.getByText('Yes, Finish Quiz'))
    })
    act(() => {
      fireEvent.click(screen.getByText('Review Answers'))
    })
    
    expect(screen.getByText('Basic addition: 2 + 2 = 4')).toBeInTheDocument()
  })

  it('should handle timer expiration', () => {
    vi.useFakeTimers()
    const handleComplete = vi.fn()
    
    render(<Quiz quiz={mockQuiz} onComplete={handleComplete} />)
    
    // Fast forward time past limit
    act(() => {
      vi.advanceTimersByTime(300000) // 5 minutes
    })
    
    expect(handleComplete).toHaveBeenCalled()
    expect(screen.getByText(/quiz complete/i)).toBeInTheDocument()
    
    vi.useRealTimers()
  })

  it('should have proper accessibility attributes', () => {
    render(<Quiz quiz={mockQuiz} />)
    
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    expect(screen.getByLabelText('Option A: 3')).toBeInTheDocument()
    expect(screen.getByLabelText('Option B: 4')).toBeInTheDocument()
    expect(screen.getByLabelText('Quiz timer')).toBeInTheDocument()
  })

  it('should support keyboard navigation', () => {
    render(<Quiz quiz={mockQuiz} />)
    
    const firstOption = screen.getByLabelText('Option A: 3')
    
    // Test keyboard selection
    act(() => {
      fireEvent.keyDown(firstOption, { key: 'ArrowDown' })
    })
    
    expect(screen.getByLabelText('Option B: 4')).toHaveFocus()
  })
})
