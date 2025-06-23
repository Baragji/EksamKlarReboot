import StudyProgressDashboard from '../components/StudyProgressDashboard'

const DashboardPage = () => {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Dashboard
      </h1>
      
      {/* Study Progress Analytics Dashboard */}
      <StudyProgressDashboard />
      
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
