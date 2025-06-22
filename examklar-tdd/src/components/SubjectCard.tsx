import React from 'react'
import type { Subject } from '../types'

/**
 * SubjectCard component props
 */
export interface SubjectCardProps {
  /** Subject data to display */
  subject: Subject
  /** Progress percentage (0-100) */
  progress?: number
  /** Callback when card is selected */
  onSelect?: (subject: Subject) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Format date to readable string
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Calculate days until exam
 */
const getDaysUntilExam = (examDate: Date): number => {
  const today = new Date()
  const timeDiff = examDate.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Get urgency styling based on days until exam
 */
const getUrgencyStyle = (daysLeft: number): string => {
  if (daysLeft < 0) return 'border-red-500 bg-red-50' // Overdue
  if (daysLeft <= 7) return 'border-red-200 bg-red-25' // Urgent
  if (daysLeft <= 30) return 'border-yellow-200 bg-yellow-25' // Soon
  return 'border-gray-200 bg-white' // Normal
}

/**
 * SubjectCard component displays subject information with progress and status
 * 
 * @example
 * <SubjectCard 
 *   subject={mathSubject}
 *   progress={75}
 *   onSelect={handleSubjectSelect}
 * />
 */
export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  progress,
  onSelect,
  className = ''
}) => {
  const daysLeft = getDaysUntilExam(subject.examDate)
  const urgencyStyle = getUrgencyStyle(daysLeft)
  
  const handleClick = () => {
    onSelect?.(subject)
  }
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect?.(subject)
    }
  }
  
  const cardAriaLabel = `${subject.name} subject card. Exam on ${formatDate(subject.examDate)}. ${subject.estimatedHours} hours estimated study time.${progress ? ` ${progress}% complete.` : ''}`

  return (
    <button
      className={`w-full p-6 rounded-lg border-2 text-left transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${urgencyStyle} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={cardAriaLabel}
      role="button"
      tabIndex={0}
    >
      {/* Header with emoji and title */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl" role="img" aria-label={`${subject.name} emoji`}>
            {subject.emoji}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {subject.name}
            </h3>
            {subject.description && (
              <p className="text-sm text-gray-600 mt-1">
                {subject.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Status badge */}
        <div className="flex flex-col items-end">
          {daysLeft < 0 ? (
            <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
              Overdue
            </span>
          ) : (
            <span className="text-xs text-gray-500">
              {daysLeft} days left
            </span>
          )}
        </div>
      </div>
      
      {/* Exam date and study time */}
      <div className="flex justify-between items-center mb-3 text-sm text-gray-600">
        <span>Exam: {formatDate(subject.examDate)}</span>
        <span>{subject.estimatedHours} hours</span>
      </div>
      
      {/* Progress bar */}
      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Progress</span>
            <span className="text-xs font-medium text-gray-900">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Study progress: ${progress}% complete`}
            />
          </div>
        </div>
      )}
    </button>
  )
}
