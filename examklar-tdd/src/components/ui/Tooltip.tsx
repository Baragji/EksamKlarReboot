import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

interface TooltipProps {
  content: string
  children: React.ReactElement
  position?: 'top' | 'bottom' | 'left' | 'right'
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'achievement'
  size?: 'small' | 'medium' | 'large'
  arrow?: boolean
  delay?: number
  className?: string
  'data-testid'?: string
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  variant = 'default',
  size = 'medium',
  arrow = false,
  delay = 0,
  className,
  'data-testid': dataTestId,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const tooltipRef = useRef<HTMLDivElement>(null)

  const showTooltipWithDelay = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true)
        setShowTooltip(true)
      }, delay)
    } else {
      setIsVisible(true)
      setShowTooltip(true)
    }
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
    setShowTooltip(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const tooltipClasses = cn(
    'tooltip',
    `tooltip-${position}`,
    `tooltip-${variant}`,
    `tooltip-${size}`,
    arrow && 'tooltip-arrow',
    className
  )

  const triggerProps = {
    onMouseEnter: showTooltipWithDelay,
    onMouseLeave: hideTooltip,
    onFocus: showTooltipWithDelay,
    onBlur: hideTooltip,
  }

  const clonedChild = React.cloneElement(children, triggerProps)

  return (
    <div className="tooltip-container">
      {clonedChild}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className={tooltipClasses}
          role="tooltip"
          data-testid={dataTestId}
        >
          {content}
          {arrow && <div className="tooltip-arrow-element" />}
        </div>
      )}
    </div>
  )
}

export { Tooltip }