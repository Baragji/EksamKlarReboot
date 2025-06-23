import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useExamStore } from '../../src/stores/examStore'

describe('ExamStore Streak Counter - TDD V5', () => {
  beforeEach(() => {
    // Reset store state before each test
    useExamStore.getState().reset()
    // Mock Date.now() for consistent testing
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with zero streak', () => {
    const { result } = renderHook(() => useExamStore())
    
    expect(result.current.streakCount).toBe(0)
    expect(result.current.longestStreak).toBe(0)
    expect(result.current.lastActivityDate).toBeNull()
  })

  it('should start a streak when completing first activity', () => {
    const { result } = renderHook(() => useExamStore())
    const mockDate = new Date('2025-06-23')
    vi.setSystemTime(mockDate)

    act(() => {
      result.current.recordActivity()
    })

    expect(result.current.streakCount).toBe(1)
    expect(result.current.longestStreak).toBe(1)
    expect(result.current.lastActivityDate).toEqual(mockDate)
  })

  it('should extend streak when activity recorded on consecutive days', () => {
    const { result } = renderHook(() => useExamStore())
    
    // Day 1
    const day1 = new Date('2025-06-23')
    vi.setSystemTime(day1)
    act(() => {
      result.current.recordActivity()
    })

    // Day 2 (consecutive)
    const day2 = new Date('2025-06-24')
    vi.setSystemTime(day2)
    act(() => {
      result.current.recordActivity()
    })

    expect(result.current.streakCount).toBe(2)
    expect(result.current.longestStreak).toBe(2)
    expect(result.current.lastActivityDate).toEqual(day2)
  })

  it('should maintain streak when multiple activities recorded on same day', () => {
    const { result } = renderHook(() => useExamStore())
    const sameDay = new Date('2025-06-23')
    vi.setSystemTime(sameDay)

    act(() => {
      result.current.recordActivity()
    })
    
    act(() => {
      result.current.recordActivity()
    })

    expect(result.current.streakCount).toBe(1)
    expect(result.current.longestStreak).toBe(1)
    expect(result.current.lastActivityDate).toEqual(sameDay)
  })

  it('should reset streak when activity skipped for more than one day', () => {
    const { result } = renderHook(() => useExamStore())
    
    // Day 1
    const day1 = new Date('2025-06-23')
    vi.setSystemTime(day1)
    act(() => {
      result.current.recordActivity()
    })

    // Skip day 2, activity on day 3 (breaks streak)
    const day3 = new Date('2025-06-25')
    vi.setSystemTime(day3)
    act(() => {
      result.current.recordActivity()
    })

    expect(result.current.streakCount).toBe(1) // Reset and start new streak
    expect(result.current.longestStreak).toBe(1) // Previous longest remains
    expect(result.current.lastActivityDate).toEqual(day3)
  })

  it('should update longest streak when current exceeds previous record', () => {
    const { result } = renderHook(() => useExamStore())
    
    // Create a 3-day streak
    for (let i = 0; i < 3; i++) {
      const day = new Date('2025-06-23')
      day.setDate(day.getDate() + i)
      vi.setSystemTime(day)
      act(() => {
        result.current.recordActivity()
      })
    }

    expect(result.current.streakCount).toBe(3)
    expect(result.current.longestStreak).toBe(3)

    // Break streak and start new one
    const dayAfterBreak = new Date('2025-06-27') // Skip a day
    vi.setSystemTime(dayAfterBreak)
    act(() => {
      result.current.recordActivity()
    })

    expect(result.current.streakCount).toBe(1)
    expect(result.current.longestStreak).toBe(3) // Longest remains 3

    // Create new streak that exceeds previous
    for (let i = 1; i < 5; i++) {
      const day = new Date('2025-06-27')
      day.setDate(day.getDate() + i)
      vi.setSystemTime(day)
      act(() => {
        result.current.recordActivity()
      })
    }

    expect(result.current.streakCount).toBe(5)
    expect(result.current.longestStreak).toBe(5) // New longest streak
  })

  it('should automatically record activity when completing study session', () => {
    const { result } = renderHook(() => useExamStore())
    const mockDate = new Date('2025-06-23')
    vi.setSystemTime(mockDate)

    // Add a subject first
    const testSubject = {
      id: 'subject-1',
      name: 'Mathematics',
      description: 'Test subject',
      emoji: '📊',
      examDate: new Date('2025-08-01'),
      estimatedHours: 40,
      createdAt: new Date('2025-01-01')
    }

    act(() => {
      result.current.addSubject(testSubject)
    })

    // Add a scheduled session
    act(() => {
      result.current.addScheduledSession({
        subjectId: 'subject-1',
        subjectName: 'Mathematics',
        date: '2025-06-23',
        duration: 60,
        topicsPlanned: ['Topic 1'],
        type: 'scheduled'
      })
    })

    const sessionId = result.current.scheduledSessions[0].id

    // Complete the session - this should automatically record activity
    act(() => {
      result.current.completeSession(sessionId, ['Topic 1'])
    })

    expect(result.current.streakCount).toBe(1)
    expect(result.current.longestStreak).toBe(1)
    expect(result.current.lastActivityDate).toEqual(mockDate)
  })

  it('should get motivational message based on streak count', () => {
    const { result } = renderHook(() => useExamStore())
    
    // Test different streak levels
    expect(result.current.getStreakMessage()).toBe("Start your learning journey today! 🌟")

    // 1 day streak
    vi.setSystemTime(new Date('2025-06-23'))
    act(() => {
      result.current.recordActivity()
    })
    expect(result.current.getStreakMessage()).toBe("Great start! Keep it going! 🔥 Day 1")

    // 7 day streak
    for (let i = 1; i < 7; i++) {
      const day = new Date('2025-06-23')
      day.setDate(day.getDate() + i)
      vi.setSystemTime(day)
      act(() => {
        result.current.recordActivity()
      })
    }
    expect(result.current.getStreakMessage()).toBe("One week strong! 💪 7 days in a row!")

    // 30 day streak
    for (let i = 7; i < 30; i++) {
      const day = new Date('2025-06-23')
      day.setDate(day.getDate() + i)
      vi.setSystemTime(day)
      act(() => {
        result.current.recordActivity()
      })
    }
    expect(result.current.getStreakMessage()).toBe("Unstoppable! 🚀 30 days of dedication!")
  })
})
