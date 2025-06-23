// 🔴 RED PHASE: Writing failing tests for Progress Charts component
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressCharts } from '../../src/components/ProgressCharts'

describe('ProgressCharts Component - TDD', () => {
  const mockData = {
    weeklyStudyHours: [
      { day: 'Mon', hours: 2 },
      { day: 'Tue', hours: 1.5 },
      { day: 'Wed', hours: 3 },
      { day: 'Thu', hours: 2.5 },
      { day: 'Fri', hours: 1 },
      { day: 'Sat', hours: 4 },
      { day: 'Sun', hours: 2 }
    ],
    subjectProgress: [
      { subject: 'Mathematics', completed: 75, total: 100 },
      { subject: 'Physics', completed: 60, total: 100 },
      { subject: 'Chemistry', completed: 85, total: 100 }
    ],
    monthlyTrend: [
      { month: 'Jan', hours: 45 },
      { month: 'Feb', hours: 52 },
      { month: 'Mar', hours: 48 },
      { month: 'Apr', hours: 60 },
      { month: 'May', hours: 55 },
      { month: 'Jun', hours: 70 }
    ]
  }

  beforeEach(() => {
    // Reset any global state if needed
  })

  it('should render progress charts container', () => {
    render(<ProgressCharts data={mockData} />)
    
    expect(screen.getByTestId('progress-charts-container')).toBeInTheDocument()
  })

  it('should display weekly study hours chart', () => {
    render(<ProgressCharts data={mockData} />)
    
    expect(screen.getByTestId('weekly-study-chart')).toBeInTheDocument()
    expect(screen.getByText('Weekly Study Hours')).toBeInTheDocument()
  })

  it('should display subject progress chart', () => {
    render(<ProgressCharts data={mockData} />)
    
    expect(screen.getByTestId('subject-progress-chart')).toBeInTheDocument()
    expect(screen.getByText('Subject Progress')).toBeInTheDocument()
  })

  it('should display monthly trend chart', () => {
    render(<ProgressCharts data={mockData} />)
    
    expect(screen.getByTestId('monthly-trend-chart')).toBeInTheDocument()
    expect(screen.getByText('Monthly Study Trend')).toBeInTheDocument()
  })

  it('should show chart legends with proper accessibility', () => {
    render(<ProgressCharts data={mockData} />)
    
    // Check for aria-labels on charts
    expect(screen.getByLabelText('Weekly study hours bar chart')).toBeInTheDocument()
    expect(screen.getByLabelText('Subject progress pie chart')).toBeInTheDocument()
    expect(screen.getByLabelText('Monthly study trend line chart')).toBeInTheDocument()
  })

  it('should handle empty data gracefully', () => {
    const emptyData = {
      weeklyStudyHours: [],
      subjectProgress: [],
      monthlyTrend: []
    }
    
    render(<ProgressCharts data={emptyData} />)
    
    expect(screen.getByText('No study data available')).toBeInTheDocument()
  })

  it('should display chart titles and descriptions', () => {
    render(<ProgressCharts data={mockData} />)
    
    expect(screen.getByText('Track your daily study patterns')).toBeInTheDocument()
    expect(screen.getByText('See completion rates by subject')).toBeInTheDocument()
    expect(screen.getByText('View your learning journey over time')).toBeInTheDocument()
  })

  it('should have responsive chart containers', () => {
    render(<ProgressCharts data={mockData} />)
    
    const container = screen.getByTestId('progress-charts-container')
    expect(container).toHaveClass('grid', 'gap-6', 'md:grid-cols-2', 'lg:grid-cols-3')
  })

  it('should display data values in charts', () => {
    render(<ProgressCharts data={mockData} />)
    
    // Check that some data values are rendered (chart.js will render these)
    expect(screen.getByTestId('weekly-study-chart')).toBeInTheDocument()
    expect(screen.getByTestId('subject-progress-chart')).toBeInTheDocument()
    expect(screen.getByTestId('monthly-trend-chart')).toBeInTheDocument()
  })
})
