import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, beforeEach, afterEach } from 'vitest'
import { StudyTimer } from '../../src/components/StudyTimer'

describe('StudyTimer Component - TDD', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-06-22T10:00:00.000Z'))
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should display initial time as 00:00:00', () => {
    render(<StudyTimer />)
    expect(screen.getByText('00:00:00')).toBeInTheDocument()
  })

  it('should display play button initially', () => {
    render(<StudyTimer />)
    expect(screen.getByLabelText('Start timer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('should start timer when play button is clicked', async () => {
    render(<StudyTimer />)
    
    const startButton = screen.getByLabelText('Start timer')
    
    act(() => {
      fireEvent.click(startButton)
    })
    
    // Timer should start and show pause button
    expect(screen.getByLabelText('Pause timer')).toBeInTheDocument()
    expect(screen.queryByLabelText('Start timer')).not.toBeInTheDocument()
  })

  it('should update timer display every second when running', async () => {
    render(<StudyTimer />)
    
    // Start timer
    act(() => {
      fireEvent.click(screen.getByLabelText('Start timer'))
    })
    
    // Advance time by 1 second
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('00:00:01')).toBeInTheDocument()
    
    // Advance time by 1 minute
    act(() => {
      vi.advanceTimersByTime(59000)
    })
    expect(screen.getByText('00:01:00')).toBeInTheDocument()
  })

  it('should pause timer when pause button is clicked', async () => {
    render(<StudyTimer />)
    
    // Start timer
    act(() => {
      fireEvent.click(screen.getByLabelText('Start timer'))
    })
    
    // Advance time
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByText('00:00:05')).toBeInTheDocument()
    
    // Pause timer
    act(() => {
      fireEvent.click(screen.getByLabelText('Pause timer'))
    })
    
    // Should show start button and time should stop progressing
    expect(screen.getByLabelText('Start timer')).toBeInTheDocument()
    
    // Advance more time - timer should not update
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.getByText('00:00:05')).toBeInTheDocument()
  })

  it('should reset timer when reset button is clicked', async () => {
    render(<StudyTimer />)
    
    // Start timer and let it run
    act(() => {
      fireEvent.click(screen.getByLabelText('Start timer'))
    })
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    expect(screen.getByText('00:00:30')).toBeInTheDocument()
    
    // Reset timer
    act(() => {
      fireEvent.click(screen.getByLabelText('Reset timer'))
    })
    
    expect(screen.getByText('00:00:00')).toBeInTheDocument()
    expect(screen.getByLabelText('Start timer')).toBeInTheDocument()
  })

  it('should call onSessionEnd when timer stops after running', async () => {
    const handleSessionEnd = vi.fn()
    
    render(<StudyTimer onSessionEnd={handleSessionEnd} />)
    
    // Start timer, let it run, then pause
    act(() => {
      fireEvent.click(screen.getByLabelText('Start timer'))
    })
    act(() => {
      vi.advanceTimersByTime(120000) // 2 minutes
    })
    act(() => {
      fireEvent.click(screen.getByLabelText('Pause timer'))
    })
    
    expect(handleSessionEnd).toHaveBeenCalledWith({
      duration: 120, // seconds
      startTime: expect.any(Date),
      endTime: expect.any(Date)
    })
  })

  it('should display current subject when provided', () => {
    const subject = {
      id: '1',
      name: 'Mathematics',
      description: 'Calculus and Algebra',
      emoji: '📊',
      examDate: new Date('2025-08-01'),
      estimatedHours: 40,
      createdAt: new Date()
    }
    
    render(<StudyTimer subject={subject} />)
    expect(screen.getByText('Mathematics')).toBeInTheDocument()
    expect(screen.getByText('📊')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<StudyTimer />)
    
    // Timer display should have proper role and label
    expect(screen.getByRole('timer')).toBeInTheDocument()
    expect(screen.getByLabelText('Study timer')).toBeInTheDocument()
    
    // Buttons should have proper labels
    expect(screen.getByLabelText('Start timer')).toBeInTheDocument()
    expect(screen.getByLabelText('Reset timer')).toBeInTheDocument()
  })

  it('should format time correctly for hours', async () => {
    render(<StudyTimer />)
    
    act(() => {
      fireEvent.click(screen.getByLabelText('Start timer'))
    })
    
    // Test 1 hour 30 minutes 45 seconds
    act(() => {
      vi.advanceTimersByTime(5445000) // 1:30:45
    })
    
    expect(screen.getByText('01:30:45')).toBeInTheDocument()
  })
})
