import React, { useState } from 'react'
import { useExamStore } from '@/stores/examStore'
import { useFlashcardStore } from '@/stores/flashcardStore'
import { useAchievementStore } from '@/stores/achievementStore'
import type { FlashcardDeck } from '@/types'

interface DataSummary {
  flashcardDecks: number
  studySessions: number
  achievements: number
  totalStudyTime: number
}

const SettingsPage: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  
  // Access to all stores for data export/import
  const examStore = useExamStore()
  const flashcardStore = useFlashcardStore()
  const achievementStore = useAchievementStore()

  // Calculate current data summary
  const dataSummary: DataSummary = {
    flashcardDecks: flashcardStore.decks.length,
    studySessions: examStore.progress?.sessionsCompleted || 0,
    achievements: achievementStore.unlockedAchievements.length,
    totalStudyTime: examStore.progress?.totalStudyTime || 0
  }

  const handleExportData = async () => {
    setIsExporting(true)
    
    try {
      // Collect all app state for export
      const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        examStore: {
          progress: examStore.progress,
          currentSubject: examStore.currentSubject,
          onboardingCompleted: examStore.onboardingCompleted
        },
        flashcardStore: {
          decks: flashcardStore.decks
        },
        achievementStore: {
          unlockedAchievements: achievementStore.unlockedAchievements
        }
      }

      // Create downloadable JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `examklar-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportData = () => {
    setIsImporting(true)
    
    // Create file input element
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) {
        setIsImporting(false)
        return
      }

      try {
        const text = await file.text()
        const importData = JSON.parse(text)
        
        // Validate data structure
        if (!importData.version || !importData.examStore || !importData.flashcardStore) {
          throw new Error('Invalid backup file format')
        }

        // Import data to stores
        if (importData.examStore) {
          examStore.setProgress(importData.examStore.progress)
          if (importData.examStore.currentSubject) {
            examStore.setCurrentSubject(importData.examStore.currentSubject)
          }
          if (importData.examStore.onboardingCompleted) {
            examStore.setOnboardingCompleted(true)
          }
        }

        if (importData.flashcardStore?.decks) {
          // Clear existing decks and import new ones
          flashcardStore.clearAllDecks()
          importData.flashcardStore.decks.forEach((deck: FlashcardDeck) => {
            flashcardStore.addDeck(deck)
          })
        }

        if (importData.achievementStore?.unlockedAchievements) {
          // Clear and restore achievements
          achievementStore.resetAchievements()
          importData.achievementStore.unlockedAchievements.forEach((achievementId: string) => {
            achievementStore.unlockAchievement(achievementId)
          })
        }

        alert('Data imported successfully!')
        
      } catch (error) {
        console.error('Import failed:', error)
        alert('Failed to import data. Please check the file format.')
      } finally {
        setIsImporting(false)
      }
    }
    
    input.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your ExamKlar data and preferences
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Data Summary Section */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Current Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{dataSummary.flashcardDecks}</div>
                  <div className="text-sm text-blue-800">Flashcard Decks</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{dataSummary.studySessions}</div>
                  <div className="text-sm text-green-800">Study Sessions</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{dataSummary.achievements}</div>
                  <div className="text-sm text-purple-800">Achievements</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{Math.round(dataSummary.totalStudyTime / 60)}h</div>
                  <div className="text-sm text-orange-800">Total Study Time</div>
                </div>
              </div>
            </section>

            {/* Data Export/Import Section */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Data Management</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Export Data</h3>
                    <p className="text-sm text-gray-600">
                      Download all your study data as a backup file
                    </p>
                  </div>
                  <button
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExporting ? 'Exporting Data...' : 'Export Data'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Import Data</h3>
                    <p className="text-sm text-gray-600">
                      Restore your study data from a backup file
                    </p>
                  </div>
                  <button
                    onClick={handleImportData}
                    disabled={isImporting}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isImporting ? 'Import Data...' : 'Import Data'}
                  </button>
                </div>
              </div>
            </section>

            {/* Additional Settings Section */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Study Reminders</h3>
                    <p className="text-sm text-gray-600">
                      Get notifications for your study schedule
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
