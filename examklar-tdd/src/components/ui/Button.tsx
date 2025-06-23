import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Button component variants using class-variance-authority
 * Provides consistent styling across the application
 */
const buttonVariants = cva(
  // Base styles applied to all buttons
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 active:bg-gray-100',
        // Gamified variants
        'gamified-primary': 'btn-gamified-primary hover-lift interactive-gamified',
        'gamified-secondary': 'btn-gamified-secondary hover-lift interactive-gamified',
        'gamified-success': 'btn-gamified-success hover-lift interactive-gamified',
        'gamified-danger': 'btn-gamified-danger hover-lift interactive-gamified'
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        // Gamified sizes
        'gamified-small': 'h-8 px-4 text-sm btn-gamified-small',
        'gamified-large': 'h-14 px-8 text-lg btn-gamified-large'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

/**
 * Button component props extending HTML button attributes
 * with custom variant and size options
 */
export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Additional CSS classes to apply */
  className?: string
  /** Loading state - disables button and shows loading indicator */
  loading?: boolean
  /** Icon to display in button */
  icon?: string
  /** Position of icon relative to text */
  iconPosition?: 'left' | 'right'
}

/**
 * Button component with multiple variants and sizes
 * 
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * @example
 * <Button variant="gamified-primary" size="gamified-large" icon="🚀" iconPosition="left">
 *   Start Learning
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, icon, iconPosition = 'left', children, ...props }, ref) => {
    const isDisabled = props.disabled || loading
    const buttonClasses = buttonVariants({ 
      variant, 
      size, 
      className: `${className || ''} ${loading ? 'btn-gamified-loading' : ''}`.trim()
    })

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if ((event.key === 'Enter' || event.key === ' ') && props.onClick && !isDisabled) {
        event.preventDefault()
        // For keyboard activation, we simulate a click instead of passing the keyboard event
        if (event.currentTarget) {
          event.currentTarget.click()
        }
      }
      props.onKeyDown?.(event)
    }

    return (
      <button
        type="button"
        className={buttonClasses}
        ref={ref}
        disabled={isDisabled}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {loading && <span className="animate-spin mr-2">⏳</span>}
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
