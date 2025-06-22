import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { Flashcard as FlashcardType, FlashcardSession } from '../types'
import { Flashcard } from './Flashcard'
import { Button } from './ui/Button'

export interface FlashcardDeckProps {
  cards: FlashcardType[]
  onCardComplete?: (cardId: string, result: 'correct' | 'incorrect') => void
  onDeckComplete?: (session: Omit<FlashcardSession, 'id' | 'flashcardIds' | 'startedAt'>) => void
  autoAdvance?: boolean
  autoAdvanceDelay?: number
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards,
  onCardComplete,
  onDeckComplete,
  autoAdvance = false,
  autoAdvanceDelay = 3000
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [completedCards, setCompletedCards] = useState<string[]>([])
  const [correctCards, setCorrectCards] = useState<string[]>([])
  const [shuffledCards, setShuffledCards] = useState<FlashcardType[]>(cards)
  const [sessionStartTime] = useState(new Date())
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleNext = useCallback(() => {
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1)
    }
  }, [currentCardIndex, shuffledCards.length])

  const handlePrevious = useCallback(() => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1)
    }
  }, [currentCardIndex])

  // Update shuffled cards when cards prop changes
  useEffect(() => {
    setShuffledCards([...cards])
    setCurrentCardIndex(0)
    setCompletedCards([])
    setCorrectCards([])
  }, [cards])

  // Auto-advance functionality
  useEffect(() => {
    if (autoAdvance && shuffledCards.length > 0 && currentCardIndex < shuffledCards.length - 1) {
      autoAdvanceTimerRef.current = setTimeout(() => {
        setCurrentCardIndex(prev => Math.min(prev + 1, shuffledCards.length - 1))
      }, autoAdvanceDelay)
    }

    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current)
      }
    }
  }, [autoAdvance, autoAdvanceDelay, currentCardIndex, shuffledCards.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleNext()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handlePrevious()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrevious])

  // Check if deck is complete
  useEffect(() => {
    if (completedCards.length === shuffledCards.length && shuffledCards.length > 0 && onDeckComplete) {
      const timeSpent = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000)
      onDeckComplete({
        totalCards: shuffledCards.length,
        correctCards: correctCards.length,
        incorrectCards: completedCards.length - correctCards.length,
        timeSpent
      })
    }
  }, [completedCards.length, shuffledCards.length, correctCards.length, onDeckComplete, sessionStartTime])

  if (shuffledCards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No flashcards available</div>
        <p className="text-gray-400 mt-2">Add some flashcards to get started with studying!</p>
      </div>
    )
  }

  const currentCard = shuffledCards[currentCardIndex]

  const handleCardComplete = (result: 'correct' | 'incorrect') => {
    const cardId = currentCard.id
    
    if (!completedCards.includes(cardId)) {
      setCompletedCards(prev => [...prev, cardId])
    }
    
    if (result === 'correct' && !correctCards.includes(cardId)) {
      setCorrectCards(prev => [...prev, cardId])
    }
    
    if (onCardComplete) {
      onCardComplete(cardId, result)
    }
  }

  const handleShuffle = () => {
    const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5)
    setShuffledCards(shuffled)
    setCurrentCardIndex(0)
  }

  // Calculate difficulty distribution
  const difficultyCount = shuffledCards.reduce((acc, card) => {
    acc[card.difficulty] = (acc[card.difficulty] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress and stats */}
      <div className="mb-6">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{currentCardIndex + 1} of {shuffledCards.length}</span>
            <span>Progress: {Math.round(((currentCardIndex + 1) / shuffledCards.length) * 100)}%</span>
          </div>
          <div 
            className="w-full bg-gray-200 rounded-full h-2"
            role="progressbar"
            aria-valuenow={currentCardIndex + 1}
            aria-valuemax={shuffledCards.length}
          >
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / shuffledCards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Difficulty distribution */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <span>Easy: {difficultyCount.easy || 0}</span>
          <span>Medium: {difficultyCount.medium || 0}</span>
          <span>Hard: {difficultyCount.hard || 0}</span>
        </div>
      </div>

      {/* Main flashcard */}
      <div className="mb-6">
        <Flashcard card={currentCard} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            aria-label="Previous card"
            variant="outline"
          >
            ← Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={currentCardIndex === shuffledCards.length - 1}
            aria-label="Next card"
            variant="outline"
          >
            Next →
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleCardComplete('incorrect')}
            aria-label="Mark as incorrect"
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            ✗ Incorrect
          </Button>
          
          <Button
            onClick={() => handleCardComplete('correct')}
            aria-label="Mark as correct"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            ✓ Correct
          </Button>
        </div>

        {/* Utility */}
        <Button
          onClick={handleShuffle}
          aria-label="Shuffle cards"
          variant="outline"
        >
          🔀 Shuffle
        </Button>
      </div>
    </div>
  )
}
