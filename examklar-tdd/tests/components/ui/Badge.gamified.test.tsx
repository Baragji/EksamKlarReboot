import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../../../src/components/ui/Badge'

describe('Badge - Gamified Features', () => {
  it('renders basic badge with default styling', () => {
    render(<Badge>Default Badge</Badge>)
    
    expect(screen.getByText('Default Badge')).toBeInTheDocument()
    expect(screen.getByText('Default Badge')).toHaveClass('badge-default')
  })

  it('renders badge with gamified variants', () => {
    const { rerender } = render(
      <Badge variant="primary" data-testid="badge">
        Primary Badge
      </Badge>
    )
    
    expect(screen.getByTestId('badge')).toHaveClass('badge-primary')
    
    rerender(
      <Badge variant="success" data-testid="badge">
        Success Badge
      </Badge>
    )
    
    expect(screen.getByTestId('badge')).toHaveClass('badge-success')
    
    rerender(
      <Badge variant="warning" data-testid="badge">
        Warning Badge
      </Badge>
    )
    
    expect(screen.getByTestId('badge')).toHaveClass('badge-warning')
    
    rerender(
      <Badge variant="danger" data-testid="badge">
        Danger Badge
      </Badge>
    )
    
    expect(screen.getByTestId('badge')).toHaveClass('badge-danger')
  })

  it('renders badge with different sizes', () => {
    const { rerender } = render(
      <Badge size="small" data-testid="badge">
        Small Badge
      </Badge>
    )
    
    expect(screen.getByTestId('badge')).toHaveClass('badge-small')
    
    rerender(
      <Badge size="large" data-testid="badge">
        Large Badge
      </Badge>
    )
    
    expect(screen.getByTestId('badge')).toHaveClass('badge-large')
  })

  it('renders badge with achievement styles', () => {
    const { rerender } = render(
      <Badge achievement="gold" data-testid="badge">
        Gold Achievement
      </Badge>
    )
    
    expect(screen.getByTestId('badge')).toHaveClass('badge-achievement-gold')
    
    rerender(
      <Badge achievement="silver" data-testid="badge">
        Silver Achievement
      </Badge>
    )
    
    expect(screen.getByTestId('badge')).toHaveClass('badge-achievement-silver')
    
    rerender(
      <Badge achievement="bronze" data-testid="badge">
        Bronze Achievement
      </Badge>
    )
    
    expect(screen.getByTestId('badge')).toHaveClass('badge-achievement-bronze')
  })

  it('renders badge with pulse animation', () => {
    render(
      <Badge pulse data-testid="badge">
        Pulsing Badge
      </Badge>
    )
    
    expect(screen.getByTestId('badge')).toHaveClass('badge-pulse')
  })

  it('renders badge with icon', () => {
    render(
      <Badge icon="⭐" data-testid="badge">
        Star Badge
      </Badge>
    )
    
    expect(screen.getByTestId('badge')).toContainHTML('⭐')
    expect(screen.getByText('Star Badge')).toBeInTheDocument()
  })

  it('renders badge with count/number', () => {
    render(
      <Badge count={42} data-testid="badge">
        Count Badge
      </Badge>
    )
    
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('Count Badge')).toBeInTheDocument()
  })

  it('renders badge with dot indicator', () => {
    render(
      <Badge dot data-testid="badge">
        Dot Badge
      </Badge>
    )
    
    expect(screen.getByTestId('badge')).toHaveClass('badge-dot')
  })

  it('renders badge with outline style', () => {
    render(
      <Badge outline data-testid="badge">
        Outline Badge
      </Badge>
    )
    
    expect(screen.getByTestId('badge')).toHaveClass('badge-outline')
  })
})