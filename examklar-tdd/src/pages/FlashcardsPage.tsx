import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

const FlashcardsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [sortBy, setSortBy] = useState('name')

  // Mock data for development
  const subjects = ['All Subjects', 'Mathematics', 'Science', 'History', 'Languages']
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'created', label: 'Date Created' },
    { value: 'modified', label: 'Last Modified' },
    { value: 'cards', label: 'Number of Cards' }
  ]

  const deckCount = 0
  const totalCards = 0
  const cardsReview = 0

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
              {subjects.map((subject) => (
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
              {sortOptions.map((option) => (
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
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <h3 className="text-lg font-medium text-blue-800 mb-1">
              Total Cards:
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {totalCards}
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <h3 className="text-lg font-medium text-orange-800 mb-1">
              Cards Due for Review:
            </h3>
            <p className="text-2xl font-bold text-orange-600">
              {cardsReview}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <h3 className="text-lg font-medium text-green-800 mb-1">
              Study Streak:
            </h3>
            <p className="text-2xl font-bold text-green-600">
              0 days
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlashcardsPage
