import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

// Types
interface SortOption {
  value: string
  label: string
}

interface StatisticCardProps {
  title: string
  value: string | number
  bgColor: string
  textColor: string
  valueColor: string
}

// Constants
const SUBJECTS = ['All Subjects', 'Mathematics', 'Science', 'History', 'Languages'] as const
const SORT_OPTIONS: SortOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'created', label: 'Date Created' },
  { value: 'modified', label: 'Last Modified' },
  { value: 'cards', label: 'Number of Cards' }
] as const

// Components
const StatisticCard = ({ title, value, bgColor, textColor, valueColor }: StatisticCardProps) => (
  <div className={`${bgColor} rounded-lg p-4 text-center`}>
    <h3 className={`text-lg font-medium ${textColor} mb-1`}>
      {title}
    </h3>
    <p className={`text-2xl font-bold ${valueColor}`}>
      {value}
    </p>
  </div>
)

const FlashcardsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [sortBy, setSortBy] = useState('name')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [deckName, setDeckName] = useState('')
  const [deckDescription, setDeckDescription] = useState('')
  const [showCardForm, setShowCardForm] = useState(false)
  const [cardFront, setCardFront] = useState('')
  const [cardBack, setCardBack] = useState('')
  const [currentDeck, setCurrentDeck] = useState<string | null>(null)
  const [isStudying, setIsStudying] = useState(false)
  const [currentCard, setCurrentCard] = useState<{front: string, back: string} | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyProgress, setStudyProgress] = useState({ current: 0, total: 0 })
  const [savedCards, setSavedCards] = useState<Array<{front: string, back: string}>>([])

  // Mock data for development
  const deckCount = 0
  const totalCards = 0
  const cardsReview = 0
  const studyStreak = 0

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Flashcards
      </h1>

      {/* Deck Management Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              My Flashcard Decks
            </h2>
            <p className="text-gray-600">
              Total Decks: {deckCount}
            </p>
          </div>
          <Button 
            variant="primary" 
            size="md"
            onClick={() => setShowCreateForm(true)}
          >
            Create New Deck
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search Input */}
          <div>
            <Input
              type="text"
              placeholder="Search flashcard decks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              role="searchbox"
              aria-label="Search flashcard decks"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <label htmlFor="subject-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by subject
            </label>
            <select
              id="subject-filter"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
              Sort by
            </label>
            <select
              id="sort-by"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Create Deck Form */}
        {showCreateForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Create New Deck
            </h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="deck-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Deck Name
                </label>
                <Input
                  type="text"
                  name="deck-name"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  placeholder="Enter deck name..."
                  required
                />
              </div>
              <div>
                <label htmlFor="deck-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="deck-description"
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                  placeholder="Enter deck description..."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  type="button"
                  variant="primary" 
                  size="sm"
                  onClick={() => {
                    // Create the deck and transition to card creation
                    setCurrentDeck(deckName)
                    setShowCreateForm(false)
                    // Don't automatically show card form - let user click "Add Card" first
                    setDeckName('')
                    setDeckDescription('')
                  }}
                >
                  Create Deck
                </Button>
                <Button 
                  type="button"
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    setShowCreateForm(false)
                    setDeckName('')
                    setDeckDescription('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Card Creation Interface */}
        {currentDeck && (
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Deck: {currentDeck}
            </h3>
            <p className="text-gray-600 mb-4">
              Add cards to your deck
            </p>
            
            {!showCardForm ? (
              <Button 
                variant="primary" 
                size="md"
                onClick={() => setShowCardForm(true)}
              >
                Add Card
              </Button>
            ) : (
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-800 mb-4">
                  Add New Card
                </h4>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="card-front" className="block text-sm font-medium text-gray-700 mb-1">
                      Front (Question)
                    </label>
                    <textarea
                      name="card-front"
                      value={cardFront}
                      onChange={(e) => setCardFront(e.target.value)}
                      placeholder="Enter the question or prompt..."
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="card-back" className="block text-sm font-medium text-gray-700 mb-1">
                      Back (Answer)
                    </label>
                    <textarea
                      name="card-back"
                      value={cardBack}
                      onChange={(e) => setCardBack(e.target.value)}
                      placeholder="Enter the answer..."
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      type="button"
                      variant="primary" 
                      size="sm"
                      onClick={() => {
                        // Save the card and reset form
                        setSavedCards(prev => [...prev, { front: cardFront, back: cardBack }])
                        setCardFront('')
                        setCardBack('')
                        setShowCardForm(false)
                      }}
                    >
                      Save Card
                    </Button>
                    <Button 
                      type="button"
                      variant="secondary" 
                      size="sm"
                      onClick={() => {
                        setShowCardForm(false)
                        setCardFront('')
                        setCardBack('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Study Deck Button */}
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="md"
                onClick={() => {
                  // Start study session with the first card
                  if (savedCards.length > 0) {
                    setIsStudying(true)
                    setCurrentCard(savedCards[0])
                    setShowAnswer(false)
                    setStudyProgress({ current: 1, total: savedCards.length })
                  }
                }}
              >
                Study Deck
              </Button>
            </div>
          </div>
        )}

        {/* Study Interface */}
        {isStudying && currentCard && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Studying: {currentDeck}
              </h3>
              <div data-testid="study-progress" className="text-sm text-gray-600">
                {studyProgress.current} / {studyProgress.total}
              </div>
            </div>

            {/* Flashcard */}
            <div className="max-w-md mx-auto">
              <div className="bg-gray-50 rounded-lg p-6 min-h-32 flex items-center justify-center mb-4">
                {!showAnswer ? (
                  <div data-testid="flashcard-front" className="text-center">
                    <p className="text-lg text-gray-800">{currentCard.front}</p>
                  </div>
                ) : (
                  <div data-testid="flashcard-back" className="text-center">
                    <p className="text-lg text-gray-800">{currentCard.back}</p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-3">
                {!showAnswer ? (
                  <Button 
                    variant="primary" 
                    size="md"
                    onClick={() => setShowAnswer(true)}
                  >
                    Show Answer
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => {
                        // Mark as Easy - keep study session active to show progress
                        setShowAnswer(false)
                        // Could advance to next card here, but for simplicity, just reset
                      }}
                    >
                      Easy
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Mark as Medium and finish study session
                        setIsStudying(false)
                        setCurrentCard(null)
                        setShowAnswer(false)
                      }}
                    >
                      Medium
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => {
                        // Mark as Hard and finish study session
                        setIsStudying(false)
                        setCurrentCard(null)
                        setShowAnswer(false)
                      }}
                    >
                      Hard
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!currentDeck && !isStudying && (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No flashcard decks yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first deck to start studying with flashcards
              </p>
              <Button 
                variant="primary" 
                size="md"
                onClick={() => setShowCreateForm(true)}
              >
                Create Your First Deck
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatisticCard
            title="Total Cards:"
            value={totalCards}
            bgColor="bg-blue-50"
            textColor="text-blue-800"
            valueColor="text-blue-600"
          />
          <StatisticCard
            title="Cards Due for Review:"
            value={cardsReview}
            bgColor="bg-orange-50"
            textColor="text-orange-800"
            valueColor="text-orange-600"
          />
          <StatisticCard
            title="Study Streak:"
            value={`${studyStreak} days`}
            bgColor="bg-green-50"
            textColor="text-green-800"
            valueColor="text-green-600"
          />
        </div>
      </div>
    </div>
  )
}

export default FlashcardsPage
