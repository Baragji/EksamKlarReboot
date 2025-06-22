import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SubjectCard } from '../../src/components/SubjectCard'

describe('SubjectCard - TDD', () => {
  const mockSubject = {
    id: '1',
    name: 'Mathematics',
    description: 'Advanced Calculus and Linear Algebra',
    emoji: '📊',
    examDate: new Date('2025-08-01'),
    estimatedHours: 40,
    createdAt: new Date('2025-01-01')
  }
  
  it('should display subject information', () => {
    render(<SubjectCard subject={mockSubject} />)
    
    expect(screen.getByText('Mathematics')).toBeInTheDocument()
    expect(screen.getByText('📊')).toBeInTheDocument()
    expect(screen.getByText('40 hours')).toBeInTheDocument()
    expect(screen.getByText('Advanced Calculus and Linear Algebra')).toBeInTheDocument()
  })
  
  it('should display formatted exam date', () => {
    render(<SubjectCard subject={mockSubject} />)
    
    expect(screen.getByText(/Aug 1, 2025/)).toBeInTheDocument()
  })
  
  it('should call onSelect when clicked', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()
    
    render(<SubjectCard subject={mockSubject} onSelect={handleSelect} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleSelect).toHaveBeenCalledWith(mockSubject)
  })
  
  it('should show progress bar when progress provided', () => {
    render(<SubjectCard subject={mockSubject} progress={65} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '65')
  })
  
  it('should not show progress bar when no progress provided', () => {
    render(<SubjectCard subject={mockSubject} />)
    
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
  
  it('should display days until exam', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    
    const subjectWithFutureExam = {
      ...mockSubject,
      examDate: futureDate
    }
    
    render(<SubjectCard subject={subjectWithFutureExam} />)
    
    expect(screen.getByText(/days left/)).toBeInTheDocument()
  })
  
  it('should show overdue status for past exam dates', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 5)
    
    const subjectWithPastExam = {
      ...mockSubject,
      examDate: pastDate
    }
    
    render(<SubjectCard subject={subjectWithPastExam} />)
    
    expect(screen.getByText(/overdue/i)).toBeInTheDocument()
  })
  
  it('should apply different styles based on priority', () => {
    const urgentSubject = {
      ...mockSubject,
      examDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
    
    render(<SubjectCard subject={urgentSubject} />)
    
    const card = screen.getByRole('button')
    expect(card).toHaveClass('border-red-200') // Urgent styling
  })
  
  it('should be keyboard accessible', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()
    
    render(<SubjectCard subject={mockSubject} onSelect={handleSelect} />)
    
    const card = screen.getByRole('button')
    card.focus()
    
    await user.keyboard('{Enter}')
    expect(handleSelect).toHaveBeenCalledWith(mockSubject)
  })
  
  it('should have proper ARIA attributes', () => {
    render(<SubjectCard subject={mockSubject} progress={75} />)
    
    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('aria-label')
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-label')
  })
  
  it('should display estimated study time correctly', () => {
    render(<SubjectCard subject={mockSubject} />)
    
    expect(screen.getByText('40 hours')).toBeInTheDocument()
  })
  
  it('should handle missing optional props gracefully', () => {
    const minimalSubject = {
      id: '2',
      name: 'Physics',
      description: '',
      emoji: '⚛️',
      examDate: new Date('2025-09-01'),
      estimatedHours: 30,
      createdAt: new Date('2025-01-01')
    }
    
    expect(() => {
      render(<SubjectCard subject={minimalSubject} />)
    }).not.toThrow()
    
    expect(screen.getByText('Physics')).toBeInTheDocument()
  })
})
