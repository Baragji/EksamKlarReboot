import React, { useState, useMemo } from 'react'
import { useFlashcardStore } from '../stores/flashcardStore'
import type { FlashcardDeck } from '../types'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

// 🟢 GREEN: Creating DeckManager component to make tests pass

interface CreateDeckFormData {
  name: string
  description: string
  subjectId: string
}

interface EditDeckData {
  name: string
  description: string
}

const SUBJECTS = [
  { id: 'math-101', name: 'Mathematics' },
  { id: 'science-101', name: 'Science' },
  { id: 'history-101', name: 'History' },
  { id: 'english-101', name: 'English' }
]

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'created', label: 'Date Created' },
  { value: 'cards', label: 'Card Count' }
]

export const DeckManager: React.FC = () => {
  const {
    getDecks,
    createDeck,
    updateDeck,
    deleteDeck,
    filterDecks,
    sortDecks,
    getStats,
    exportDeck,
    importDeck,
    validateDeckData
  } = useFlashcardStore()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showImportForm, setShowImportForm] = useState(false)
  const [editingDeck, setEditingDeck] = useState<FlashcardDeck | null>(null)
  const [exportData, setExportData] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [createFormData, setCreateFormData] = useState<CreateDeckFormData>({
    name: '',
    description: '',
    subjectId: 'math-101'
  })
  const [editFormData, setEditFormData] = useState<EditDeckData>({
    name: '',
    description: ''
  })
  const [importData, setImportData] = useState('')

  const stats = getStats()

  // Filter and sort decks
  const filteredDecks = useMemo(() => {
    let decks = getDecks()

    // Apply search filter
    if (searchTerm) {
      decks = filterDecks({ search: searchTerm })
    }

    // Apply subject filter
    if (selectedSubject !== 'all') {
      decks = decks.filter(deck => deck.subjectId === selectedSubject)
    }

    // Apply sorting
    const sortedDecks = sortDecks({ 
      sortBy: sortBy as 'name' | 'created' | 'cards', 
      sortOrder: 'asc' 
    })

    // Apply same filters to sorted results
    let finalDecks = sortedDecks
    if (searchTerm) {
      finalDecks = finalDecks.filter(deck => 
        deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedSubject !== 'all') {
      finalDecks = finalDecks.filter(deck => deck.subjectId === selectedSubject)
    }

    return finalDecks
  }, [searchTerm, selectedSubject, sortBy, getDecks, filterDecks, sortDecks])

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault()
    createDeck({
      ...createFormData,
      cards: []
    })
    setCreateFormData({ name: '', description: '', subjectId: 'math-101' })
    setShowCreateForm(false)
  }

  const handleEditDeck = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingDeck) {
      updateDeck(editingDeck.id, editFormData)
      setEditingDeck(null)
      setEditFormData({ name: '', description: '' })
    }
  }

  const handleDeleteDeck = (deckId: string) => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      deleteDeck(deckId)
    }
  }

  const handleExportDeck = (deckId: string) => {
    const jsonData = exportDeck(deckId)
    setExportData(jsonData)
  }

  const handleImportDeck = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = JSON.parse(importData)
      if (validateDeckData(data)) {
        importDeck(importData)
        setImportData('')
        setShowImportForm(false)
      } else {
        alert('Invalid deck data format')
      }
    } catch {
      alert('Invalid JSON format')
    }
  }

  const startEditing = (deck: FlashcardDeck) => {
    setEditingDeck(deck)
    setEditFormData({
      name: deck.name,
      description: deck.description
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Deck Management</h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">Total Decks:</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalDecks}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Total Cards:</h3>
          <p className="text-2xl font-bold text-green-600">{stats.totalCards}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-orange-800">Cards Due:</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.cardsDueForReview}</p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <div className="flex gap-4">
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="primary"
            >
              Create New Deck
            </Button>
            <Button
              onClick={() => setShowImportForm(true)}
              variant="outline"
            >
              Import Deck
            </Button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              type="text"
              placeholder="Search decks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Subject
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">All Subjects</option>
              {SUBJECTS.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort by
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Decks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecks.map(deck => (
          <div key={deck.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-900">{deck.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(deck)}
                  aria-label="Edit deck"
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleExportDeck(deck.id)}
                  aria-label="Export deck"
                  className="text-green-600 hover:text-green-800"
                >
                  📤
                </button>
                <button
                  onClick={() => handleDeleteDeck(deck.id)}
                  aria-label="Delete deck"
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-3">{deck.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{deck.cards.length} cards</span>
              <span>{SUBJECTS.find(s => s.id === deck.subjectId)?.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Deck Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Create New Deck</h2>
            <form onSubmit={handleCreateDeck}>
              <div className="mb-4">
                <label htmlFor="deck-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Deck Name
                </label>
                <Input
                  id="deck-name"
                  type="text"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="deck-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="deck-description"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="deck-subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  id="deck-subject"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={createFormData.subjectId}
                  onChange={(e) => setCreateFormData({ ...createFormData, subjectId: e.target.value })}
                  required
                >
                  {SUBJECTS.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary">
                  Create Deck
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Deck Modal */}
      {editingDeck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Edit Deck</h2>
            <form onSubmit={handleEditDeck}>
              <div className="mb-4">
                <label htmlFor="edit-deck-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Deck Name
                </label>
                <Input
                  id="edit-deck-name"
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="edit-deck-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="edit-deck-description"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingDeck(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Deck Modal */}
      {showImportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Import Deck from JSON</h2>
            <form onSubmit={handleImportDeck}>
              <div className="mb-6">
                <label htmlFor="import-data" className="block text-sm font-medium text-gray-700 mb-1">
                  JSON Data
                </label>
                <textarea
                  id="import-data"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={8}
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste deck JSON data here..."
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary">
                  Import
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowImportForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Data Modal */}
      {exportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4">Export Deck JSON</h2>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={12}
              value={exportData}
              readOnly
            />
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => navigator.clipboard.writeText(exportData)}
                variant="primary"
              >
                Copy to Clipboard
              </Button>
              <Button
                onClick={() => setExportData('')}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {/* Note: Using window.confirm for simplicity, but a custom modal would be better */}
    </div>
  )
}
