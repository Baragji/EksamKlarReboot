import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import StudyPage from '../../src/pages/StudyPage'

describe('StudyPage - TDD', () => {
  it('should render Study Session heading', () => {
    render(<StudyPage />)
    expect(screen.getByText('Study Session')).toBeInTheDocument()
  })
  
  it('should have a main heading with correct accessibility', () => {
    render(<StudyPage />)
    expect(screen.getByRole('heading', { level: 1, name: /Study Session/i })).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    render(<StudyPage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
