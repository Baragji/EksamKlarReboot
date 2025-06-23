import React from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'small' | 'medium' | 'large'
  achievement?: 'none' | 'gold' | 'silver' | 'bronze'
  pulse?: boolean
  icon?: string
  count?: number
  dot?: boolean
  outline?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'medium',
    achievement = 'none',
    pulse = false,
    icon,
    count,
    dot = false,
    outline = false,
    children, 
    ...props 
  }, ref) => {
    const badgeClasses = cn(
      'badge',
      `badge-${variant}`,
      `badge-${size}`,
      achievement !== 'none' && `badge-achievement-${achievement}`,
      pulse && 'badge-pulse',
      dot && 'badge-dot',
      outline && 'badge-outline',
      className
    )

    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {icon && <span className="badge-icon">{icon}</span>}
        {count !== undefined && <span className="badge-count">{count}</span>}
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'

export { Badge }