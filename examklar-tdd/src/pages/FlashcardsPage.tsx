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
          <Button variant="primary" size="md">
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

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No flashcard decks yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first deck to start studying with flashcards
            </p>
            <Button variant="primary" size="md">
              Create Your First Deck
            </Button>
          </div>
        </div>
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
