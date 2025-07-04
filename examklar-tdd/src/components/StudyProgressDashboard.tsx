import { useExamStore } from '@/stores/examStore'
import { useFlashcardStore } from '@/stores/flashcardStore'
import { ProgressMetricCard, ProgressBar } from '@/components/ui/ProgressComponents'
import { ProgressCharts, type ProgressChartsData } from '@/components/ProgressCharts'
import { StudyCalendar } from '@/components/StudyCalendar'

/**
 * Utility functions for the dashboard
 */
const formatTime = (minutes: number): string => {
  return `${Math.floor(minutes / 60)} hours`
}

const calculateEfficiency = (totalMinutes: number, sessions: number): string => {
  if (sessions === 0) return '0'
  return (totalMinutes / 60 / sessions).toFixed(1)
}

/**
 * StudyProgressDashboard Component
 * Displays comprehensive study analytics and progress tracking
 * Following TDD-first development approach with refactored reusable components
 */
const StudyProgressDashboard = () => {
  const { 
    progress, 
    getUpcomingDeadlines,
    // V5 Gamification: Streak Counter Integration
    streakCount,
    getStreakMessage
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
          <div data-testid="total-study-time">
            <ProgressMetricCard
              title="Total Study Time"
              value="0 hours"
              bgColor="bg-blue-50"
              textColor="text-blue-600"
            />
          </div>
          <ProgressMetricCard
            title="Sessions Completed"
            value="No sessions yet"
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <ProgressMetricCard
            title="Current Streak"
            value={`${streakCount} days`}
            bgColor="bg-purple-50"
            textColor="text-purple-600"
            subtitle={getStreakMessage()}
          />
          <ProgressMetricCard
            title="Study Efficiency"
            value="Start your study journey!"
            bgColor="bg-orange-50"
            textColor="text-orange-600"
          />
        </div>
        
        <div className="mb-8" data-testid="weekly-progress">
          <h3 className="text-lg font-semibold mb-4">Weekly Goal</h3>
          <ProgressBar
            percentage={0}
            label="Progress"
            current={0}
            target={0}
            unit="hours"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div data-testid="upcoming-exams">
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
        
        <div className="mt-8" data-testid="progress-charts">
          <h3 className="text-lg font-semibold mb-4">Progress Trends</h3>
          <ProgressCharts data={{
            weeklyStudyHours: [],
            subjectProgress: [],
            monthlyTrend: []
          }} />
        </div>
        
        {/* Study Calendar */}
        <div className="mt-8" data-testid="study-calendar-section">
          <h3 className="text-lg font-semibold mb-4">Study Calendar</h3>
          <StudyCalendar />
        </div>
      </div>
    )
  }

  // Calculate metrics
  const totalHours = formatTime(progress.totalStudyTime)
  const weeklyHoursCompleted = Math.floor(progress.weeklyProgress / 60)
  const weeklyHoursGoal = Math.floor(progress.weeklyGoal / 60)
  const weeklyProgressPercent = (progress.weeklyProgress / progress.weeklyGoal) * 100
  const studyEfficiency = calculateEfficiency(progress.totalStudyTime, progress.sessionsCompleted)

  // Prepare chart data
  const chartData: ProgressChartsData = {
    weeklyStudyHours: [
      { day: 'Mon', hours: 2.5 },
      { day: 'Tue', hours: 1.8 },
      { day: 'Wed', hours: 3.2 },
      { day: 'Thu', hours: 2.1 },
      { day: 'Fri', hours: 1.5 },
      { day: 'Sat', hours: 4.0 },
      { day: 'Sun', hours: 2.7 }
    ],
    subjectProgress: [
      { subject: 'Mathematics', completed: progress.totalStudyTime * 0.4, total: progress.weeklyGoal },
      { subject: 'Physics', completed: progress.totalStudyTime * 0.35, total: progress.weeklyGoal },
      { subject: 'Chemistry', completed: progress.totalStudyTime * 0.25, total: progress.weeklyGoal }
    ],
    monthlyTrend: [
      { month: 'Jan', hours: 45 },
      { month: 'Feb', hours: 52 },
      { month: 'Mar', hours: 48 },
      { month: 'Apr', hours: Math.floor(progress.totalStudyTime / 60) },
      { month: 'May', hours: Math.floor(progress.totalStudyTime / 60) + 5 },
      { month: 'Jun', hours: Math.floor(progress.totalStudyTime / 60) + 8 }
    ]
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Progress Dashboard</h2>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div data-testid="total-study-time">
          <ProgressMetricCard
            title="Total Study Time"
            value={totalHours}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
        </div>
        <ProgressMetricCard
          title="Sessions Completed"
          value={progress.sessionsCompleted}
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
        <ProgressMetricCard
          title="Current Streak"
          value={`${streakCount} days`}
          bgColor="bg-purple-50"
          textColor="text-purple-600"
          subtitle={getStreakMessage()}
        />
        <ProgressMetricCard
          title="Study Efficiency"
          value={`${studyEfficiency} hours/session`}
          bgColor="bg-orange-50"
          textColor="text-orange-600"
        />
      </div>
      
      {/* Weekly Goal Progress */}
      <div className="mb-8" data-testid="weekly-progress">
        <h3 className="text-lg font-semibold mb-4">Weekly Goal</h3>
        <ProgressBar
          percentage={weeklyProgressPercent}
          label="Progress"
          current={weeklyHoursCompleted}
          target={weeklyHoursGoal}
          unit="hours"
        />
      </div>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Exams */}
        <div data-testid="upcoming-exams">
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
      
      {/* Progress Charts */}
      <div data-testid="progress-charts">
        <h3 className="text-lg font-semibold mb-4">Progress Trends</h3>
        <ProgressCharts data={chartData} />
      </div>
      
      {/* Study Calendar */}
      <div className="mt-8" data-testid="study-calendar-section">
        <h3 className="text-lg font-semibold mb-4">Study Calendar</h3>
        <StudyCalendar />
      </div>
    </div>
  )
}

export default StudyProgressDashboard
