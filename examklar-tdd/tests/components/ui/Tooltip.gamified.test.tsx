import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Tooltip } from '../../../src/components/ui/Tooltip'

describe('Tooltip - Gamified Features', () => {
  it('renders tooltip trigger element', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    )
    
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('shows tooltip on hover', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    )
    
    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument()
    })
  })

  it('hides tooltip on mouse leave', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    )
    
    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument()
    })
    
    fireEvent.mouseLeave(trigger)
    
    await waitFor(() => {
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()
    })
  })

  it('renders tooltip with different positions', async () => {
    const { rerender } = render(
      <Tooltip content="Top tooltip" position="top" data-testid="tooltip">
        <button>Hover me</button>
      </Tooltip>
    )
    
    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)
    
    await waitFor(() => {
      expect(screen.getByTestId('tooltip')).toHaveClass('tooltip-top')
    })
    
    fireEvent.mouseLeave(trigger)
    
    rerender(
      <Tooltip content="Bottom tooltip" position="bottom" data-testid="tooltip">
        <button>Hover me</button>
      </Tooltip>
    )
    
    fireEvent.mouseEnter(trigger)
    
    await waitFor(() => {
      expect(screen.getByTestId('tooltip')).toHaveClass('tooltip-bottom')
    })
  })

  it('renders tooltip with gamified variants', async () => {
    const { rerender } = render(
      <Tooltip content="Success tooltip" variant="success" data-testid="tooltip">
        <button>Hover me</button>
      </Tooltip>
    )
    
    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)
    
    await waitFor(() => {
      expect(screen.getByTestId('tooltip')).toHaveClass('tooltip-success')
    })
    
    fireEvent.mouseLeave(trigger)
    
    rerender(
      <Tooltip content="Achievement tooltip" variant="achievement" data-testid="tooltip">
        <button>Hover me</button>
      </Tooltip>
    )
    
    fireEvent.mouseEnter(trigger)
    
    await waitFor(() => {
      expect(screen.getByTestId('tooltip')).toHaveClass('tooltip-achievement')
    })
  })

  it('renders tooltip with different sizes', async () => {
    const { rerender } = render(
      <Tooltip content="Small tooltip" size="small" data-testid="tooltip">
        <button>Hover me</button>
      </Tooltip>
    )
    
    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)
    
    await waitFor(() => {
      expect(screen.getByTestId('tooltip')).toHaveClass('tooltip-small')
    })
    
    fireEvent.mouseLeave(trigger)
    
    rerender(
      <Tooltip content="Large tooltip" size="large" data-testid="tooltip">
        <button>Hover me</button>
      </Tooltip>
    )
    
    fireEvent.mouseEnter(trigger)
    
    await waitFor(() => {
      expect(screen.getByTestId('tooltip')).toHaveClass('tooltip-large')
    })
  })

  it('shows tooltip on focus for keyboard accessibility', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Focus me</button>
      </Tooltip>
    )
    
    const trigger = screen.getByText('Focus me')
    fireEvent.focus(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument()
    })
  })

  it('hides tooltip on blur', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Focus me</button>
      </Tooltip>
    )
    
    const trigger = screen.getByText('Focus me')
    fireEvent.focus(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument()
    })
    
    fireEvent.blur(trigger)
    
    await waitFor(() => {
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()
    })
  })

  it('renders tooltip with arrow indicator', async () => {
    render(
      <Tooltip content="Tooltip with arrow" arrow data-testid="tooltip">
        <button>Hover me</button>
      </Tooltip>
    )
    
    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)
    
    await waitFor(() => {
      expect(screen.getByTestId('tooltip')).toHaveClass('tooltip-arrow')
    })
  })

  it('renders tooltip with custom delay', async () => {
    render(
      <Tooltip content="Delayed tooltip" delay={100}>
        <button>Hover me</button>
      </Tooltip>
    )
    
    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)
    
    // Should not appear immediately
    expect(screen.queryByText('Delayed tooltip')).not.toBeInTheDocument()
    
    // Should appear after delay
    await waitFor(() => {
      expect(screen.getByText('Delayed tooltip')).toBeInTheDocument()
    }, { timeout: 200 })
  })
})