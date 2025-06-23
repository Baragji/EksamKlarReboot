import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { FlashcardDeck, Flashcard } from '../types'

// 🟢 GREEN: Implementing the flashcard store to make tests pass

/**
 * Flashcard deck filter and sort options
 */
export interface DeckFilters {
  search?: string
  subjectId?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
  dueForReview?: boolean
}

export interface DeckSortOptions {
  sortBy: 'name' | 'created' | 'modified' | 'cards'
  sortOrder: 'asc' | 'desc'
}

/**
 * Statistics and analytics interfaces
 */
export interface DeckStats {
  totalDecks: number
  totalCards: number
  cardsDueForReview: number
  difficultyDistribution: {
    easy: number
    medium: number
    hard: number
  }
  studyStreak: number
}

export interface DeckPerformanceMetrics {
  deckId: string
  averageAccuracy: number
  totalReviews: number
  lastStudied?: Date
  masteryLevel: number // 0-100
}

/**
 * Enhanced flashcard store interface
 */
interface FlashcardStore {
  // State
  decks: FlashcardDeck[]
  loading: boolean
  error: string | null
  
  // Deck CRUD Operations
  createDeck: (deck: Omit<FlashcardDeck, 'id' | 'createdAt'>) => FlashcardDeck
  updateDeck: (deckId: string, updates: Partial<Pick<FlashcardDeck, 'name' | 'description'>>) => void
  deleteDeck: (deckId: string) => void
  getDeckById: (deckId: string) => FlashcardDeck | undefined
  getDecksBySubject: (subjectId: string) => FlashcardDeck[]
  getDecks: () => FlashcardDeck[]
  
  // Card Management within Decks
  addCardToDeck: (deckId: string, card: Omit<Flashcard, 'id' | 'createdAt'>) => void
  updateCardInDeck: (deckId: string, cardId: string, updates: Partial<Flashcard>) => void
  removeCardFromDeck: (deckId: string, cardId: string) => void
  moveCardBetweenDecks: (cardId: string, fromDeckId: string, toDeckId: string) => void
  
  // Advanced Filtering and Sorting
  filterDecks: (filters: DeckFilters) => FlashcardDeck[]
  sortDecks: (options: DeckSortOptions) => FlashcardDeck[]
  filterCards: (deckId: string, filters: DeckFilters) => Flashcard[]
  getCardsDueForReview: () => Flashcard[]
  
  // Statistics and Analytics
  getStats: () => DeckStats
  getDeckPerformanceMetrics: (deckId: string) => DeckPerformanceMetrics
  
  // Import/Export Operations
  exportDeck: (deckId: string) => string
  importDeck: (jsonData: string) => FlashcardDeck
  validateDeckData: (data: unknown) => boolean
  
  // Utility
  reset: () => void
}

const initialState = {
  decks: [],
  loading: false,
  error: null
}

/**
 * Generate unique ID for decks and cards
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Enhanced flashcard store with comprehensive deck management
 */
export const useFlashcardStore = create<FlashcardStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Deck CRUD Operations
        createDeck: (deck) => {
          const newDeck: FlashcardDeck = {
            ...deck,
            id: generateId(),
            createdAt: new Date()
          }
          
          set((state) => ({
            decks: [...state.decks, newDeck]
          }), false, 'createDeck')
          
          return newDeck
        },
        
        updateDeck: (deckId, updates) => {
          set((state) => ({
            decks: state.decks.map(deck =>
              deck.id === deckId ? { ...deck, ...updates } : deck
            )
          }), false, 'updateDeck')
        },
        
        deleteDeck: (deckId) => {
          set((state) => ({
            decks: state.decks.filter(deck => deck.id !== deckId)
          }), false, 'deleteDeck')
        },
        
        getDeckById: (deckId) => {
          const state = get()
          return state.decks.find(deck => deck.id === deckId)
        },
        
        getDecksBySubject: (subjectId) => {
          const state = get()
          return state.decks.filter(deck => deck.subjectId === subjectId)
        },
        
        getDecks: () => {
          const state = get()
          return state.decks
        },
        
        // Card Management within Decks
        addCardToDeck: (deckId, card) => {
          const newCard: Flashcard = {
            ...card,
            id: generateId(),
            createdAt: new Date()
          }
          
          set((state) => ({
            decks: state.decks.map(deck =>
              deck.id === deckId
                ? { ...deck, cards: [...deck.cards, newCard] }
                : deck
            )
          }), false, 'addCardToDeck')
        },
        
        updateCardInDeck: (deckId, cardId, updates) => {
          set((state) => ({
            decks: state.decks.map(deck =>
              deck.id === deckId
                ? {
                    ...deck,
                    cards: deck.cards.map(card =>
                      card.id === cardId ? { ...card, ...updates } : card
                    )
                  }
                : deck
            )
          }), false, 'updateCardInDeck')
        },
        
        removeCardFromDeck: (deckId, cardId) => {
          set((state) => ({
            decks: state.decks.map(deck =>
              deck.id === deckId
                ? { ...deck, cards: deck.cards.filter(card => card.id !== cardId) }
                : deck
            )
          }), false, 'removeCardFromDeck')
        },
        
        moveCardBetweenDecks: (cardId, fromDeckId, toDeckId) => {
          const state = get()
          const fromDeck = state.decks.find(deck => deck.id === fromDeckId)
          const cardToMove = fromDeck?.cards.find(card => card.id === cardId)
          
          if (!cardToMove) return
          
          // Remove from source deck and add to target deck
          set((state) => ({
            decks: state.decks.map(deck => {
              if (deck.id === fromDeckId) {
                return { ...deck, cards: deck.cards.filter(card => card.id !== cardId) }
              }
              if (deck.id === toDeckId) {
                return { ...deck, cards: [...deck.cards, cardToMove] }
              }
              return deck
            })
          }), false, 'moveCardBetweenDecks')
        },
        
        // Advanced Filtering and Sorting
        filterDecks: (filters) => {
          const state = get()
          let filteredDecks = [...state.decks]
          
          if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            filteredDecks = filteredDecks.filter(deck =>
              deck.name.toLowerCase().includes(searchLower) ||
              deck.description.toLowerCase().includes(searchLower)
            )
          }
          
          if (filters.subjectId) {
            filteredDecks = filteredDecks.filter(deck => deck.subjectId === filters.subjectId)
          }
          
          return filteredDecks
        },
        
        sortDecks: (options) => {
          const state = get()
          const sortedDecks = [...state.decks]
          
          sortedDecks.sort((a, b) => {
            let comparison = 0
            
            switch (options.sortBy) {
              case 'name':
                comparison = a.name.localeCompare(b.name)
                break
              case 'created':
                comparison = a.createdAt.getTime() - b.createdAt.getTime()
                break
              case 'cards':
                comparison = a.cards.length - b.cards.length
                break
              default:
                comparison = a.name.localeCompare(b.name)
            }
            
            return options.sortOrder === 'desc' ? -comparison : comparison
          })
          
          return sortedDecks
        },
        
        filterCards: (deckId, filters) => {
          const state = get()
          const deck = state.decks.find(d => d.id === deckId)
          if (!deck) return []
          
          let filteredCards = [...deck.cards]
          
          if (filters.difficulty) {
            filteredCards = filteredCards.filter(card => card.difficulty === filters.difficulty)
          }
          
          if (filters.tags && filters.tags.length > 0) {
            filteredCards = filteredCards.filter(card =>
              filters.tags!.some(tag => card.tags.includes(tag))
            )
          }
          
          if (filters.dueForReview) {
            const now = new Date()
            filteredCards = filteredCards.filter(card =>
              card.nextReview && card.nextReview <= now
            )
          }
          
          return filteredCards
        },
        
        getCardsDueForReview: () => {
          const state = get()
          const now = new Date()
          const dueCards: Flashcard[] = []
          
          state.decks.forEach(deck => {
            deck.cards.forEach(card => {
              if (card.nextReview && card.nextReview <= now) {
                dueCards.push(card)
              }
            })
          })
          
          return dueCards
        },
        
        // Statistics and Analytics
        getStats: () => {
          const state = get()
          const totalDecks = state.decks.length
          const totalCards = state.decks.reduce((sum, deck) => sum + deck.cards.length, 0)
          const cardsDueForReview = get().getCardsDueForReview().length
          
          const difficultyDistribution = state.decks.reduce(
            (acc, deck) => {
              deck.cards.forEach(card => {
                acc[card.difficulty] = (acc[card.difficulty] || 0) + 1
              })
              return acc
            },
            { easy: 0, medium: 0, hard: 0 }
          )
          
          // Simple study streak calculation (placeholder)
          const studyStreak = 7 // This would be calculated based on actual study sessions
          
          return {
            totalDecks,
            totalCards,
            cardsDueForReview,
            difficultyDistribution,
            studyStreak
          }
        },
        
        getDeckPerformanceMetrics: (deckId) => {
          const state = get()
          const deck = state.decks.find(d => d.id === deckId)
          
          if (!deck) {
            return {
              deckId,
              averageAccuracy: 0,
              totalReviews: 0,
              masteryLevel: 0
            }
          }
          
          const totalReviews = deck.cards.reduce((sum, card) => sum + card.totalReviews, 0)
          const totalCorrect = deck.cards.reduce((sum, card) => sum + card.correctStreak, 0)
          const averageAccuracy = totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0
          const masteryLevel = Math.min(averageAccuracy, 100)
          
          return {
            deckId,
            averageAccuracy,
            totalReviews,
            masteryLevel,
            lastStudied: deck.cards.reduce((latest, card) => {
              if (!latest || (card.lastReviewed && card.lastReviewed > latest)) {
                return card.lastReviewed
              }
              return latest
            }, undefined as Date | undefined)
          }
        },
        
        // Import/Export Operations
        exportDeck: (deckId) => {
          const state = get()
          const deck = state.decks.find(d => d.id === deckId)
          if (!deck) return ''
          
          return JSON.stringify(deck, null, 2)
        },
        
        importDeck: (jsonData) => {
          try {
            const deckData = JSON.parse(jsonData)
            if (!get().validateDeckData(deckData)) {
              throw new Error('Invalid deck data')
            }
            
            const newDeck: FlashcardDeck = {
              ...deckData,
              id: generateId(),
              createdAt: new Date(),
              cards: deckData.cards.map((card: unknown) => {
                const cardData = card as Record<string, unknown>
                return {
                  ...cardData,
                  id: generateId(),
                  createdAt: new Date(),
                  lastReviewed: cardData.lastReviewed ? new Date(cardData.lastReviewed as string) : new Date(),
                  nextReview: cardData.nextReview ? new Date(cardData.nextReview as string) : new Date()
                }
              })
            }
            
            set((state) => ({
              decks: [...state.decks, newDeck]
            }), false, 'importDeck')
            
            return newDeck
          } catch {
            throw new Error('Failed to import deck: Invalid JSON data')
          }
        },
        
        validateDeckData: (data) => {
          if (!data || typeof data !== 'object') return false
          const deckData = data as Record<string, unknown>
          if (!deckData.name || typeof deckData.name !== 'string') return false
          if (!deckData.subjectId || typeof deckData.subjectId !== 'string') return false
          if (!Array.isArray(deckData.cards)) return false
          
          // Validate each card
          return deckData.cards.every((card: unknown) => {
            if (!card || typeof card !== 'object') return false
            const cardData = card as Record<string, unknown>
            return (
              cardData &&
              typeof cardData.front === 'string' &&
              typeof cardData.back === 'string' &&
              ['easy', 'medium', 'hard'].includes(cardData.difficulty as string) &&
              Array.isArray(cardData.tags)
            )
          })
        },
        
        // Utility
        reset: () => set(initialState, false, 'reset')
      }),
      {
        name: 'examklar-flashcards',
        version: 1,
        partialize: (state) => ({
          decks: state.decks.map(deck => ({
            ...deck,
            createdAt: deck.createdAt.toISOString(),
            cards: deck.cards.map(card => ({
              ...card,
              lastReviewed: card.lastReviewed.toISOString(),
              nextReview: card.nextReview.toISOString(),
              createdAt: card.createdAt?.toISOString()
            }))
          }))
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.decks = state.decks.map(deck => ({
              ...deck,
              createdAt: new Date(deck.createdAt),
              cards: deck.cards.map(card => ({
                ...card,
                lastReviewed: new Date(card.lastReviewed),
                nextReview: new Date(card.nextReview),
                createdAt: card.createdAt ? new Date(card.createdAt) : new Date()
              }))
            }))
          }
        }
      }
    ),
    {
      name: 'flashcard-store'
    }
  )
)
