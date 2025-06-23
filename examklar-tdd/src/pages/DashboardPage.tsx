import StudyProgressDashboard from '../components/StudyProgressDashboard'
import { SubjectCard } from '../components/SubjectCard'
import { useExamStore } from '../stores/examStore'

const DashboardPage = () => {
  const { subjects } = useExamStore()
  
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6" data-testid="dashboard-title">
        Dashboard
      </h1>
      
      {/* Study Progress Analytics Dashboard */}
      <StudyProgressDashboard />
      
      {/* Recent Sessions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Study Sessions</h2>
        <div className="bg-white rounded-lg shadow p-6" data-testid="recent-session">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Study Session</h3>
              <p className="text-sm text-gray-600">Completed just now</p>
            </div>
            <div className="text-sm text-gray-500">
              Timer: 00:00+
            </div>
          </div>
        </div>
      </div>
      
      {/* Subject Cards */}
      {subjects.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                progress={0}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Study Progress</h2>
          <p className="text-gray-600">Track your learning journey</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Exams</h2>
          <p className="text-gray-600">Stay on top of your schedule</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <p className="text-gray-600">Start studying or reviewing</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Study Overview</h2>
        <p className="text-gray-600">Overview of your current study status</p>
      </div>
    </div>
  )
}

export default DashboardPage
