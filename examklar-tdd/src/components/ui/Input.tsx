import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Input component variants using class-variance-authority
 * Provides consistent styling and behavior across the application
 */
const inputVariants = cva(
  // Base styles applied to all inputs
  'w-full rounded-md border px-3 py-2 text-sm transition-all duration-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus:border-blue-500',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
        // Gamified variants
        'gamified': 'input-gamified focus-gamified',
        'gamified-enhanced': 'input-gamified-enhanced',
        'gamified-success': 'input-gamified-success focus-gamified',
        'gamified-error': 'input-gamified-error focus-gamified'
      },
      size: {
        sm: 'h-8 text-xs px-2',
        md: 'h-10 text-sm px-3',
        lg: 'h-12 text-base px-4',
        // Gamified sizes
        'gamified-small': 'input-gamified-small',
        'gamified-large': 'input-gamified-large'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

/**
 * Input component props extending HTML input attributes
 * with custom styling and validation options
 */
export interface InputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Label text for the input */
  label?: string
  /** Error message to display */
  error?: string
  /** Success state indicator */
  success?: boolean
  /** Help text to display below the input */
  helpText?: string
  /** Additional CSS classes to apply */
  className?: string
  /** Icon to display in input */
  icon?: string
  /** Position of icon relative to input */
  iconPosition?: 'left' | 'right'
}

/**
 * Input component with label, validation states, and help text
 * 
 * @example
 * <Input 
 *   label="Email"
 *   type="email"
 *   required
 *   error="Please enter a valid email"
 *   helpText="We'll never share your email"
 * />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    label, 
    error, 
    success, 
    helpText, 
    required,
    id,
    icon,
    iconPosition = 'left',
    type = 'text',
    ...props 
  }, ref) => {
    // Generate unique ID - call hook unconditionally
    const generatedId = React.useId()
    const inputId = id || generatedId
    
    // Determine variant based on error/success state
    const computedVariant = error ? 'error' : success ? 'success' : variant || 'default'
    
    // Generate describedBy ID for accessibility
    const describedBy = [
      error && `${inputId}-error`,
      helpText && `${inputId}-help`
    ].filter(Boolean).join(' ') || undefined

    const inputElement = (
      <input
        ref={ref}
        type={type}
        id={inputId}
        className={inputVariants({ variant: computedVariant, size, className })}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        {...props}
      />
    )

    return (
      <div className="space-y-1">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {/* Input with optional icon */}
        {icon ? (
          <div className="relative">
            {iconPosition === 'left' && (
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {icon}
              </span>
            )}
            {React.cloneElement(inputElement, {
              className: `${inputElement.props.className} ${iconPosition === 'left' ? 'pl-10' : iconPosition === 'right' ? 'pr-10' : ''}`
            })}
            {iconPosition === 'right' && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {icon}
              </span>
            )}
          </div>
        ) : (
          inputElement
        )}
        
        {/* Error Message */}
        {error && (
          <p 
            id={`${inputId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {/* Help Text */}
        {helpText && !error && (
          <p 
            id={`${inputId}-help`}
            className={`text-sm text-gray-500 ${variant?.includes('gamified') ? 'text-gamified-helper' : ''}`}
          >
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
