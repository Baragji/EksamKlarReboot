import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from '../../../src/components/ui/Card'

describe('Card - Gamified Features', () => {
  it('renders basic card with default styling', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Test Title</Card.Title>
        </Card.Header>
        <Card.Content>Test content</Card.Content>
      </Card>
    )
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders card with gamified variants', () => {
    const { rerender } = render(
      <Card variant="primary" data-testid="card">
        <Card.Content>Primary card</Card.Content>
      </Card>
    )
    
    expect(screen.getByTestId('card')).toHaveClass('card-primary')
    
    rerender(
      <Card variant="success" data-testid="card">
        <Card.Content>Success card</Card.Content>
      </Card>
    )
    
    expect(screen.getByTestId('card')).toHaveClass('card-success')
    
    rerender(
      <Card variant="warning" data-testid="card">
        <Card.Content>Warning card</Card.Content>
      </Card>
    )
    
    expect(screen.getByTestId('card')).toHaveClass('card-warning')
  })

  it('renders card with interactive states', () => {
    render(
      <Card interactive data-testid="card">
        <Card.Content>Interactive card</Card.Content>
      </Card>
    )
    
    expect(screen.getByTestId('card')).toHaveClass('card-interactive')
  })

  it('renders card with elevation levels', () => {
    const { rerender } = render(
      <Card elevation="low" data-testid="card">
        <Card.Content>Low elevation</Card.Content>
      </Card>
    )
    
    expect(screen.getByTestId('card')).toHaveClass('card-elevation-low')
    
    rerender(
      <Card elevation="high" data-testid="card">
        <Card.Content>High elevation</Card.Content>
      </Card>
    )
    
    expect(screen.getByTestId('card')).toHaveClass('card-elevation-high')
  })

  it('renders card with progress indicator', () => {
    render(
      <Card progress={75} data-testid="card">
        <Card.Content>Card with progress</Card.Content>
      </Card>
    )
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '75')
  })

  it('renders card with achievement badge', () => {
    render(
      <Card achievement="completed" data-testid="card">
        <Card.Content>Achievement card</Card.Content>
      </Card>
    )
    
    expect(screen.getByTestId('card')).toHaveClass('card-achievement-completed')
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('renders card with all subcomponents', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
          <Card.Description>Card description</Card.Description>
        </Card.Header>
        <Card.Content>Main content</Card.Content>
        <Card.Footer>
          <button>Action</button>
        </Card.Footer>
      </Card>
    )
    
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card description')).toBeInTheDocument()
    expect(screen.getByText('Main content')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })
})