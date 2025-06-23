import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from '../../../src/components/layout/Layout'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Layout - Gamified Design System Integration', () => {
  it('should apply gamified-style background gradient', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    const layoutContainer = screen.getByTestId('layout-container')
    expect(layoutContainer).toHaveClass('bg-gradient-gamified-primary')
  })

  it('should use gamified-style header with proper styling', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('card-gamified')
    
    const title = screen.getByText('ExamKlar')
    expect(title).toHaveClass('text-gamified-heading')
  })

  it('should apply gamified-style main content area', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('gamified-main-content')
  })

  it('should maintain accessibility features with gamified styling', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    const skipLink = screen.getByTestId('skip-link')
    expect(skipLink).toHaveClass('btn-gamified-secondary')
    expect(skipLink).toBeInTheDocument()
  })

  it('should render children within gamified-styled content wrapper', () => {
    renderWithRouter(
      <Layout>
        <div data-testid="child-content">Test Child Content</div>
      </Layout>
    )
    
    const childContent = screen.getByTestId('child-content')
    expect(childContent).toBeInTheDocument()
    
    const contentWrapper = screen.getByTestId('content-wrapper')
    expect(contentWrapper).toHaveClass('card-gamified')
  })
})