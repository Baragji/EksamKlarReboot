import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '../../../src/components/ui/Modal'

describe('Modal - Gamified Features', () => {
  it('renders modal when open is true', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <Modal.Header>
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Content>Modal content</Modal.Content>
      </Modal>
    )
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render modal when open is false', () => {
    render(
      <Modal open={false} onClose={() => {}}>
        <Modal.Content>Modal content</Modal.Content>
      </Modal>
    )
    
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders modal with gamified variants', () => {
    const { rerender } = render(
      <Modal open={true} onClose={() => {}} variant="success" data-testid="modal">
        <Modal.Content>Success modal</Modal.Content>
      </Modal>
    )
    
    expect(screen.getByTestId('modal')).toHaveClass('modal-success')
    
    rerender(
      <Modal open={true} onClose={() => {}} variant="warning" data-testid="modal">
        <Modal.Content>Warning modal</Modal.Content>
      </Modal>
    )
    
    expect(screen.getByTestId('modal')).toHaveClass('modal-warning')
    
    rerender(
      <Modal open={true} onClose={() => {}} variant="achievement" data-testid="modal">
        <Modal.Content>Achievement modal</Modal.Content>
      </Modal>
    )
    
    expect(screen.getByTestId('modal')).toHaveClass('modal-achievement')
  })

  it('renders modal with different sizes', () => {
    const { rerender } = render(
      <Modal open={true} onClose={() => {}} size="small" data-testid="modal">
        <Modal.Content>Small modal</Modal.Content>
      </Modal>
    )
    
    expect(screen.getByTestId('modal')).toHaveClass('modal-small')
    
    rerender(
      <Modal open={true} onClose={() => {}} size="large" data-testid="modal">
        <Modal.Content>Large modal</Modal.Content>
      </Modal>
    )
    
    expect(screen.getByTestId('modal')).toHaveClass('modal-large')
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose}>
        <Modal.Header>
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Content>Modal content</Modal.Content>
      </Modal>
    )
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose}>
        <Modal.Content>Modal content</Modal.Content>
      </Modal>
    )
    
    const overlay = document.querySelector('.modal-overlay')
    fireEvent.click(overlay!)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when clicking inside modal content', () => {
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose}>
        <Modal.Content data-testid="modal-content">Modal content</Modal.Content>
      </Modal>
    )
    
    const content = screen.getByTestId('modal-content')
    fireEvent.click(content)
    
    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders modal with animation classes', () => {
    render(
      <Modal open={true} onClose={() => {}} animated data-testid="modal">
        <Modal.Content>Animated modal</Modal.Content>
      </Modal>
    )
    
    expect(screen.getByTestId('modal')).toHaveClass('modal-animated')
  })

  it('renders modal with all subcomponents', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
          <Modal.Description>Modal description</Modal.Description>
        </Modal.Header>
        <Modal.Content>Main content</Modal.Content>
        <Modal.Footer>
          <button>Action</button>
        </Modal.Footer>
      </Modal>
    )
    
    expect(screen.getByText('Modal Title')).toBeInTheDocument()
    expect(screen.getByText('Modal description')).toBeInTheDocument()
    expect(screen.getByText('Main content')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('handles keyboard navigation with Escape key', () => {
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose}>
        <Modal.Content>Modal content</Modal.Content>
      </Modal>
    )
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})