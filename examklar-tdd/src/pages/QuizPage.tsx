const QuizPage = () => {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Quiz
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Test Your Knowledge
          </h2>
          <p className="text-gray-600">
            Challenge yourself with personalized quizzes
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Question 1 of 10
          </h3>
          <p className="text-gray-700 mb-6">
            Sample quiz question will appear here
          </p>
          <div className="space-y-3">
            <button className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-300">
              A) Option A
            </button>
            <button className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-300">
              B) Option B
            </button>
            <button className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-300">
              C) Option C
            </button>
            <button className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-300">
              D) Option D
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizPage
