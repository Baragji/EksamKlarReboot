import React, { useState, useMemo } from 'react'
import type { Quiz, QuizHistory, QuizResult } from '../types'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Quiz as QuizComponent } from './Quiz'

interface QuizEngineProps {
  quizzes: Quiz[]
  history?: QuizHistory[]
  onQuizComplete?: (result: QuizResult & { completedAt: Date }) => void
}

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard'
type ViewMode = 'list' | 'quiz'

export const QuizEngine: React.FC<QuizEngineProps> = ({ 
  quizzes, 
  history = [], 
  onQuizComplete 
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all')

  // Calculate overall statistics
  const statistics = useMemo(() => {
    if (history.length === 0) {
      return { averageScore: 0, completionRate: 0 }
    }

    const totalScore = history.reduce((sum, h) => sum + h.score, 0)
    const averageScore = Math.round(totalScore / history.length)
    const passedQuizzes = history.filter(h => h.passed).length
    const completionRate = Math.round((passedQuizzes / history.length) * 100)

    return { averageScore, completionRate }
  }, [history])

  // Filter and search quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      // Search filter
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           quiz.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Difficulty filter
      const quizDifficulty = quiz.questions.length > 0 ? quiz.questions[0].difficulty : 'easy'
      const matchesDifficulty = difficultyFilter === 'all' || quizDifficulty === difficultyFilter

      return matchesSearch && matchesDifficulty
    })
  }, [quizzes, searchQuery, difficultyFilter])

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz)
    setViewMode('quiz')
  }

  const handleQuizComplete = (result: QuizResult) => {
    const completedResult = {
      ...result,
      completedAt: new Date()
    }
    onQuizComplete?.(completedResult)
    setViewMode('list')
    setActiveQuiz(null)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    return mins === 1 ? '1 min' : `${mins} min`
  }

  const getQuizHistory = (quizId: string) => {
    return history.filter(h => h.quizId === quizId)
  }

  const hasFailedAttempts = (quizId: string) => {
    const quizHistory = getQuizHistory(quizId)
    return quizHistory.some(h => !h.passed)
  }

  if (viewMode === 'quiz' && activeQuiz) {
    return (
      <QuizComponent 
        quiz={activeQuiz}
        onComplete={handleQuizComplete}
      />
    )
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quiz Center</h1>
        <p className="text-gray-600">Test your knowledge and track your progress</p>
      </div>

      {/* Statistics */}
      {history.length > 0 && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Your Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-blue-600">{statistics.averageScore}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-green-600">{statistics.completionRate}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <Input
          type="text"
          placeholder="Search quizzes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search quizzes"
        />
        
        <div className="flex gap-2">
          {(['all', 'easy', 'medium', 'hard'] as DifficultyFilter[]).map(difficulty => (
            <Button
              key={difficulty}
              variant={difficultyFilter === difficulty ? 'primary' : 'secondary'}
              onClick={() => setDifficultyFilter(difficulty)}
              className="capitalize"
            >
              {difficulty === 'all' ? 'All' : difficulty}
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Attempts */}
      {history.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Recent Attempts</h2>
          <div className="bg-white rounded-lg border divide-y">
            {history.slice(-3).reverse().map((attempt, index) => {
              const quiz = quizzes.find(q => q.id === attempt.quizId)
              return (
                <div key={index} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{quiz?.title || 'Unknown Quiz'}</p>
                    <p className="text-sm text-gray-500">
                      {attempt.completedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {attempt.score}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {attempt.passed ? 'Passed' : 'Failed'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quiz List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Available Quizzes</h2>
        
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No quizzes available
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredQuizzes.map(quiz => {
              const quizHistory = getQuizHistory(quiz.id)
              const lastAttempt = quizHistory[quizHistory.length - 1]
              const failed = hasFailedAttempts(quiz.id)
              
              return (
                <div key={quiz.id} className="bg-white rounded-lg border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                      <p className="text-gray-600 mb-3">{quiz.description}</p>
                      
                      <div className="flex gap-4 text-sm text-gray-500 mb-4">
                        <span>{quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}</span>
                        {quiz.timeLimit && <span>{formatTime(quiz.timeLimit)}</span>}
                        <span>Pass: {quiz.passingScore}%</span>
                      </div>

                      {lastAttempt && (
                        <div className="text-sm">
                          <span className="text-gray-500">Last attempt: </span>
                          <span className={lastAttempt.passed ? 'text-green-600' : 'text-red-600'}>
                            {lastAttempt.score}% ({lastAttempt.passed ? 'Passed' : 'Failed'})
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <Button
                        onClick={() => handleStartQuiz(quiz)}
                        variant="primary"
                        aria-label={`Start ${quiz.title} quiz`}
                      >
                        {failed && !lastAttempt?.passed ? 'Retake Quiz' : 'Start Quiz'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
