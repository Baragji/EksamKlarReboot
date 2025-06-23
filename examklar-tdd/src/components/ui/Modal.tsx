import React, { useEffect } from 'react'
import { cn } from '../../lib/utils'

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClose: () => void
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'achievement'
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  animated?: boolean
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    className, 
    open, 
    onClose, 
    variant = 'default', 
    size = 'medium',
    animated = true,
    children, 
    ...props 
  }, ref) => {
    // Handle Escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && open) {
          onClose()
        }
      }

      if (open) {
        document.addEventListener('keydown', handleEscape)
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden'
      }

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }, [open, onClose])

    if (!open) return null

    const modalClasses = cn(
      'modal',
      `modal-${variant}`,
      `modal-${size}`,
      animated && 'modal-animated',
      className
    )

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    }

    return (
      <div 
        className="modal-overlay" 
        onClick={handleOverlayClick}
      >
        <div 
          ref={ref} 
          className={modalClasses}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          <button 
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    )
  }
)
Modal.displayName = 'Modal'

const ModalHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('modal-header', className)} {...props} />
  )
)
ModalHeader.displayName = 'ModalHeader'

const ModalTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('modal-title', className)} {...props} />
  )
)
ModalTitle.displayName = 'ModalTitle'

const ModalDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('modal-description', className)} {...props} />
  )
)
ModalDescription.displayName = 'ModalDescription'

const ModalContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('modal-content', className)} {...props} />
  )
)
ModalContent.displayName = 'ModalContent'

const ModalFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('modal-footer', className)} {...props} />
  )
)
ModalFooter.displayName = 'ModalFooter'

// Compound component pattern
const ModalCompound = Object.assign(Modal, {
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  Content: ModalContent,
  Footer: ModalFooter,
})

export { ModalCompound as Modal }