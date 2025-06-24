import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import SettingsPage from '@/pages/SettingsPage'

describe('SettingsPage - Minimal Test', () => {
  it('should render without crashing', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})