import React, { useState } from 'react'
import type { Flashcard as FlashcardType } from '../types'

export interface FlashcardProps {
  card: FlashcardType
  onFlip?: (cardId: string, showingBack: boolean) => void
  isFlipping?: boolean
}

export const Flashcard: React.FC<FlashcardProps> = ({ 
  card, 
  onFlip,
  isFlipping = false 
}) => {
  const [showingBack, setShowingBack] = useState(false)

  const handleFlip = () => {
    if (isFlipping) return
    
    const newShowingBack = !showingBack
    setShowingBack(newShowingBack)
    
    if (onFlip) {
      onFlip(card.id, newShowingBack)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleFlip()
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDifficulty = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  }

  if (isFlipping) {
    return (
      <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8 min-h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Flipping...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Card */}
      <button
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        aria-label="Flip card"
        tabIndex={0}
        className="w-full bg-white rounded-lg shadow-lg p-8 min-h-64 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {/* Card Content */}
        <div className="text-center">
          {showingBack ? (
            <div>
              {/* Back of card */}
              <div className="text-2xl font-semibold text-gray-900 mb-6">
                {card.back}
              </div>
              
              {/* Review stats */}
              <div className="text-sm text-gray-600 space-y-2">
                <p>Streak: {card.correctStreak}</p>
                <p>Reviews: {card.totalReviews}</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Front of card */}
              <div className="text-xl font-medium text-gray-900 mb-8">
                {card.front}
              </div>
              
              {/* Flip indicator */}
              <div className="text-sm text-gray-500">
                Click to flip
              </div>
            </div>
          )}
        </div>
      </button>

      {/* Card metadata */}
      <div className="mt-4 flex items-center justify-between">
        {/* Difficulty badge */}
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(card.difficulty)}`}>
          {formatDifficulty(card.difficulty)}
        </span>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {card.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
