const StudyPage = () => {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Study Session
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ready to start your study session?
          </h2>
          <p className="text-gray-600">
            Choose your subject and dive into focused learning
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Timer</h3>
            <p className="text-blue-700">25:00</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-green-900 mb-2">Progress</h3>
            <p className="text-green-700">0% Complete</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyPage
