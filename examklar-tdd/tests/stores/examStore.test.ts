import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useExamStore } from '../../src/stores/examStore'

describe('ExamStore - TDD', () => {
  beforeEach(() => {
    // Reset store state before each test
    useExamStore.getState().reset()
  })
  
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useExamStore())
    
    expect(result.current.user).toBeNull()
    expect(result.current.subjects).toEqual([])
    expect(result.current.currentSubject).toBeNull()
    expect(result.current.studyPlan).toBeNull()
  })
  
  it('should set user correctly', () => {
    const { result } = renderHook(() => useExamStore())
    const testUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date('2025-01-01')
    }
    
    act(() => {
      result.current.setUser(testUser)
    })
    
    expect(result.current.user).toEqual(testUser)
  })
  
  it('should add subject correctly', () => {
    const { result } = renderHook(() => useExamStore())
    const testSubject = {
      id: 'subject-1',
      name: 'Mathematics',
      description: 'Advanced Calculus and Linear Algebra',
      emoji: '📊',
      examDate: new Date('2025-08-01'),
      estimatedHours: 40,
      createdAt: new Date('2025-01-01')
    }
    
    act(() => {
      result.current.addSubject(testSubject)
    })
    
    expect(result.current.subjects).toHaveLength(1)
    expect(result.current.subjects[0]).toEqual(testSubject)
  })
  
  it('should add multiple subjects correctly', () => {
    const { result } = renderHook(() => useExamStore())
    const subject1 = {
      id: 'subject-1',
      name: 'Mathematics',
      description: 'Advanced Calculus',
      emoji: '📊',
      examDate: new Date('2025-08-01'),
      estimatedHours: 40,
      createdAt: new Date('2025-01-01')
    }
    const subject2 = {
      id: 'subject-2',
      name: 'Physics',
      description: 'Quantum Mechanics',
      emoji: '⚛️',
      examDate: new Date('2025-09-01'),
      estimatedHours: 35,
      createdAt: new Date('2025-01-02')
    }
    
    act(() => {
      result.current.addSubject(subject1)
      result.current.addSubject(subject2)
    })
    
    expect(result.current.subjects).toHaveLength(2)
    expect(result.current.subjects[0]).toEqual(subject1)
    expect(result.current.subjects[1]).toEqual(subject2)
  })
  
  it('should set current subject correctly', () => {
    const { result } = renderHook(() => useExamStore())
    const testSubject = {
      id: 'subject-1',
      name: 'Mathematics',
      description: 'Advanced Calculus',
      emoji: '📊',
      examDate: new Date('2025-08-01'),
      estimatedHours: 40,
      createdAt: new Date('2025-01-01')
    }
    
    act(() => {
      result.current.addSubject(testSubject)
      result.current.setCurrentSubject(testSubject)
    })
    
    expect(result.current.currentSubject).toEqual(testSubject)
  })
  
  it('should update study plan correctly', () => {
    const { result } = renderHook(() => useExamStore())
    const testStudyPlan = {
      id: 'plan-1',
      subjectId: 'subject-1',
      totalDays: 30,
      dailyGoalMinutes: 60,
      weeklyGoals: [],
      milestones: [],
      createdAt: new Date('2025-01-01')
    }
    
    act(() => {
      result.current.updateStudyPlan(testStudyPlan)
    })
    
    expect(result.current.studyPlan).toEqual(testStudyPlan)
  })
  
  it('should remove subject correctly', () => {
    const { result } = renderHook(() => useExamStore())
    const subject1 = {
      id: 'subject-1',
      name: 'Mathematics',
      description: 'Advanced Calculus',
      emoji: '📊',
      examDate: new Date('2025-08-01'),
      estimatedHours: 40,
      createdAt: new Date('2025-01-01')
    }
    const subject2 = {
      id: 'subject-2',
      name: 'Physics',
      description: 'Quantum Mechanics',
      emoji: '⚛️',
      examDate: new Date('2025-09-01'),
      estimatedHours: 35,
      createdAt: new Date('2025-01-02')
    }
    
    act(() => {
      result.current.addSubject(subject1)
      result.current.addSubject(subject2)
      result.current.removeSubject('subject-1')
    })
    
    expect(result.current.subjects).toHaveLength(1)
    expect(result.current.subjects[0]).toEqual(subject2)
  })
  
  it('should clear current subject when removed', () => {
    const { result } = renderHook(() => useExamStore())
    const testSubject = {
      id: 'subject-1',
      name: 'Mathematics',
      description: 'Advanced Calculus',
      emoji: '📊',
      examDate: new Date('2025-08-01'),
      estimatedHours: 40,
      createdAt: new Date('2025-01-01')
    }
    
    act(() => {
      result.current.addSubject(testSubject)
      result.current.setCurrentSubject(testSubject)
      result.current.removeSubject('subject-1')
    })
    
    expect(result.current.subjects).toHaveLength(0)
    expect(result.current.currentSubject).toBeNull()
  })
  
  it('should get upcoming deadlines sorted by date', () => {
    const { result } = renderHook(() => useExamStore())
    const subject1 = {
      id: 'subject-1',
      name: 'Mathematics',
      description: 'Advanced Calculus',
      emoji: '📊',
      examDate: new Date('2025-09-01'), // Later date
      estimatedHours: 40,
      createdAt: new Date('2025-01-01')
    }
    const subject2 = {
      id: 'subject-2',
      name: 'Physics',
      description: 'Quantum Mechanics',
      emoji: '⚛️',
      examDate: new Date('2025-08-01'), // Earlier date
      estimatedHours: 35,
      createdAt: new Date('2025-01-02')
    }
    
    act(() => {
      result.current.addSubject(subject1)
      result.current.addSubject(subject2)
    })
    
    const upcomingDeadlines = result.current.getUpcomingDeadlines()
    expect(upcomingDeadlines).toHaveLength(2)
    expect(upcomingDeadlines[0]).toEqual(subject2) // Earlier date first
    expect(upcomingDeadlines[1]).toEqual(subject1) // Later date second
  })
  
  it('should reset store to initial state', () => {
    const { result } = renderHook(() => useExamStore())
    const testUser = { id: 'user-1', name: 'John', email: 'john@example.com', createdAt: new Date() }
    const testSubject = {
      id: 'subject-1',
      name: 'Mathematics',
      description: 'Advanced Calculus',
      emoji: '📊',
      examDate: new Date('2025-08-01'),
      estimatedHours: 40,
      createdAt: new Date('2025-01-01')
    }
    
    act(() => {
      result.current.setUser(testUser)
      result.current.addSubject(testSubject)
      result.current.setCurrentSubject(testSubject)
    })
    
    // Verify state is populated
    expect(result.current.user).not.toBeNull()
    expect(result.current.subjects).toHaveLength(1)
    expect(result.current.currentSubject).not.toBeNull()
    
    act(() => {
      result.current.reset()
    })
    
    // Verify state is reset
    expect(result.current.user).toBeNull()
    expect(result.current.subjects).toEqual([])
    expect(result.current.currentSubject).toBeNull()
    expect(result.current.studyPlan).toBeNull()
  })
})
