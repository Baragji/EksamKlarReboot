import { useExamStore } from '../stores/examStore'
import { useFlashcardStore } from '../stores/flashcardStore'

/**
 * StudyProgressDashboard Component
 * Displays comprehensive study analytics and progress tracking
 * Following TDD-first development approach
 */
const StudyProgressDashboard = () => {
  const { 
    progress, 
    getUpcomingDeadlines
  } = useExamStore()
  
  const { getStats } = useFlashcardStore()
  
  const flashcardStats = getStats()
  const upcomingExams = getUpcomingDeadlines()

  // Handle empty state
  if (!progress) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Progress Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Total Study Time</h3>
            <p className="text-2xl font-bold text-blue-600">0 hours</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-900 mb-2">Sessions Completed</h3>
            <p className="text-2xl font-bold text-green-600">No sessions yet</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-900 mb-2">Current Streak</h3>
            <p className="text-2xl font-bold text-purple-600">0 days</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-orange-900 mb-2">Study Efficiency</h3>
            <p className="text-2xl font-bold text-orange-600">Start your study journey!</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Weekly Goal</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium">0 / 0 hours</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: '0%' }}
                role="progressbar"
                aria-valuenow={0}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Weekly progress: 0% complete"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Upcoming Exams</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600">No upcoming exams</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Flashcard Stats</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-600">0 decks</p>
              <p className="text-sm text-gray-600">0 cards total</p>
              <p className="text-sm text-gray-600">0 due for review</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Progress Trends</h3>
          <div 
            className="bg-gray-50 rounded-lg p-8 text-center"
            aria-label="Progress chart container"
          >
            <p className="text-gray-600">Start studying to see your progress trends!</p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate metrics
  const totalHours = Math.floor(progress.totalStudyTime / 60)
  const weeklyHoursCompleted = Math.floor(progress.weeklyProgress / 60)
  const weeklyHoursGoal = Math.floor(progress.weeklyGoal / 60)
  const weeklyProgressPercent = (progress.weeklyProgress / progress.weeklyGoal) * 100
  const studyEfficiency = progress.sessionsCompleted > 0 
    ? (progress.totalStudyTime / 60 / progress.sessionsCompleted).toFixed(1)
    : '0'

  // Motivational message based on streak
  const getStreakMessage = (streak: number) => {
    if (streak >= 7) return `Great streak! Keep it up! 🔥`
    if (streak >= 3) return `Building momentum! 💪`
    if (streak >= 1) return `Good start! 👍`
    return 'Ready to start your streak?'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Progress Dashboard</h2>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Total Study Time</h3>
          <p className="text-2xl font-bold text-blue-600">{totalHours} hours</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-900 mb-2">Sessions Completed</h3>
          <p className="text-2xl font-bold text-green-600">{progress.sessionsCompleted}</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-900 mb-2">Current Streak</h3>
          <p className="text-2xl font-bold text-purple-600">{progress.streakCount} days</p>
          <p className="text-xs text-purple-700 mt-1">{getStreakMessage(progress.streakCount)}</p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-orange-900 mb-2">Study Efficiency</h3>
          <p className="text-2xl font-bold text-orange-600">{studyEfficiency} hours/session</p>
        </div>
      </div>
      
      {/* Weekly Goal Progress */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Weekly Goal</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium">{weeklyHoursCompleted} / {weeklyHoursGoal} hours</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(Math.max(weeklyProgressPercent, 0), 100)}%` }}
              role="progressbar"
              aria-valuenow={Math.round(weeklyProgressPercent)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Weekly progress: ${Math.round(weeklyProgressPercent)}% complete`}
            />
          </div>
        </div>
      </div>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Exams */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Upcoming Exams</h3>
          <div className="space-y-3">
            {upcomingExams.length > 0 ? (
              upcomingExams.map((exam) => (
                <div key={exam.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900">{exam.name}</h4>
                  <p className="text-sm text-red-700">
                    {exam.examDate.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">No upcoming exams</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Flashcard Stats */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Flashcard Stats</h3>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-2">
            <p className="text-sm text-indigo-900">
              <span className="font-medium">{flashcardStats.totalDecks}</span> decks
            </p>
            <p className="text-sm text-indigo-900">
              <span className="font-medium">{flashcardStats.totalCards}</span> cards total
            </p>
            <p className="text-sm text-indigo-900">
              <span className="font-medium">{flashcardStats.cardsDueForReview}</span> due for review
            </p>
          </div>
        </div>
      </div>
      
      {/* Progress Trends */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Progress Trends</h3>
        <div 
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center border-2 border-dashed border-blue-200"
          aria-label="Progress chart container"
        >
          <p className="text-gray-600 mb-2">📊 Visual Charts Coming Soon</p>
          <p className="text-sm text-gray-500">
            Your study patterns and progress visualization will appear here
          </p>
        </div>
      </div>
    </div>
  )
}

export default StudyProgressDashboard
