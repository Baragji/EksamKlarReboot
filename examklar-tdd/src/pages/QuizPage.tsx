import { useState } from 'react'

const QuizPage = () => {
  const [quizState, setQuizState] = useState<'setup' | 'active' | 'results' | 'review'>('setup')
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [questionCount, setQuestionCount] = useState(5)
  const [difficulty, setDifficulty] = useState('medium')
  
  const handleStartQuiz = () => {
    setQuizState('active')
    setCurrentQuestion(1)
  }
  
  const handleNextQuestion = () => {
    if (currentQuestion < questionCount) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setQuizState('results')
    }
  }
  
  const handleReviewAnswers = () => {
    setQuizState('review')
  }

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
        
        {/* Quiz Configuration */}
        {quizState === 'setup' && (
          <div className="mb-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Subject
              </label>
              <select 
                data-testid="subject-selector" 
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Choose a subject...</option>
                <option value="mathematics">Mathematics</option>
                <option value="science">Science</option>
                <option value="english">English</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <select 
                  name="question-count" 
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="15">15 Questions</option>
                  <option value="20">20 Questions</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select 
                  name="difficulty" 
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            
            <button 
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
              onClick={handleStartQuiz}
            >
              Start Quiz
            </button>
          </div>
        )}
        
        {/* Quiz Questions */}
        {quizState === 'active' && (
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Question {currentQuestion} of {questionCount}
            </h3>
            <p data-testid="quiz-question" className="text-gray-700 mb-6">
              Sample quiz question will appear here
            </p>
            <div className="space-y-3 mb-8">
              <button data-testid="quiz-option" className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-300 touch-manipulation">
                A) Option A
              </button>
              <button data-testid="quiz-option" className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-300 touch-manipulation">
                B) Option B
              </button>
              <button data-testid="quiz-option" className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-300 touch-manipulation">
                C) Option C
              </button>
              <button data-testid="quiz-option" className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-300 touch-manipulation">
                D) Option D
              </button>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button 
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-700 touch-manipulation"
                onClick={handleNextQuestion}
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {/* Quiz Results */}
        {quizState === 'results' && (
          <div data-testid="quiz-results" className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              Quiz Complete!
            </h3>
            <div data-testid="quiz-score" className="text-2xl font-bold text-green-600 mb-2">
              Score: 4/5 (80%)
            </div>
            <p className="text-green-700 mb-4">
              Great job! You've completed the quiz successfully.
            </p>
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
              onClick={handleReviewAnswers}
            >
              Review Answers
            </button>
          </div>
        )}
        
        {/* Answer Review */}
        {quizState === 'review' && (
          <div data-testid="answer-review" className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Answer Review
            </h3>
            <p className="text-gray-600">
              Review your answers and see the correct solutions.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizPage
