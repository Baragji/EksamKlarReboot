import React, { useState, useEffect, useCallback } from 'react'
import type { Quiz as QuizType, QuizResult, QuizAnswer } from '../types'
import { Button } from './ui/Button'

interface QuizProps {
  quiz: QuizType
  onComplete?: (result: QuizResult) => void
}

type QuizMode = 'quiz' | 'complete' | 'review'

export function Quiz({ quiz, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1))
  const [mode, setMode] = useState<QuizMode>('quiz')
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit || 0)
  const [startTime] = useState(Date.now())
  const [showConfirmation, setShowConfirmation] = useState(false)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const hasSelectedAnswer = selectedAnswers[currentQuestionIndex] !== -1
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1

  const completeQuiz = useCallback(() => {
    const answers: QuizAnswer[] = quiz.questions.map((question, index) => ({
      questionId: question.id,
      selectedAnswer: selectedAnswers[index],
      isCorrect: selectedAnswers[index] === question.correctAnswer,
      timeSpent: 0 // Simplified for now
    }))

    const correctAnswers = answers.filter(a => a.isCorrect).length
    const score = Math.round((correctAnswers / quiz.questions.length) * 100)
    const timeSpent = Math.round((Date.now() - startTime) / 1000)

    const result: QuizResult = {
      quizId: quiz.id,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      incorrectAnswers: quiz.questions.length - correctAnswers,
      timeSpent,
      passed: score >= quiz.passingScore,
      answers
    }

    setMode('complete')
    onComplete?.(result)
  }, [quiz, selectedAnswers, startTime, onComplete])

  // Timer logic
  useEffect(() => {
    if (!quiz.timeLimit || mode !== 'quiz') return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quiz.timeLimit, mode, completeQuiz])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      setShowConfirmation(true)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handleFinishConfirm = () => {
    setShowConfirmation(false)
    completeQuiz()
  }

  const handleKeyDown = (event: React.KeyboardEvent, optionIndex: number) => {
    if (event.key === 'ArrowDown') {
      const nextOption = (optionIndex + 1) % currentQuestion.options.length
      const nextElement = document.querySelector(`[data-option="${nextOption}"]`) as HTMLElement
      nextElement?.focus()
    } else if (event.key === 'ArrowUp') {
      const prevOption = (optionIndex - 1 + currentQuestion.options.length) % currentQuestion.options.length
      const prevElement = document.querySelector(`[data-option="${prevOption}"]`) as HTMLElement
      prevElement?.focus()
    }
  }

  if (mode === 'complete') {
    const score = Math.round((selectedAnswers.filter((ans, idx) => ans === quiz.questions[idx].correctAnswer).length / quiz.questions.length) * 100)
    
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-lg mb-4">Score: {score}%</p>
          <Button onClick={() => setMode('review')} variant="primary">
            Review Answers
          </Button>
        </div>
      </div>
    )
  }

  if (mode === 'review') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Review Answers</h1>
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="mb-6 p-4 border rounded">
            <h3 className="font-semibold mb-2">{question.question}</h3>
            <p className="text-sm text-gray-600 mb-2">
              Your answer: {question.options[selectedAnswers[index]] || 'Not answered'}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Correct answer: {question.options[question.correctAnswer]}
            </p>
            {question.explanation && (
              <p className="text-sm text-gray-700 italic">{question.explanation}</p>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-gray-600 mb-4">{quiz.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          {quiz.timeLimit && (
            <span className="text-sm font-mono" aria-label="Quiz timer">
              {formatTime(timeRemaining)}
            </span>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">{currentQuestion.question}</h2>
        
        {/* Answer Options */}
        <div role="radiogroup" aria-labelledby="question-title" className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <label key={index} className="flex items-center">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={index}
                checked={selectedAnswers[currentQuestionIndex] === index}
                onChange={() => handleAnswerSelect(index)}
                className="sr-only"
                aria-labelledby={`option-${index}-label`}
              />
              <button
                data-option={index}
                onClick={() => handleAnswerSelect(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-full text-left p-3 rounded border transition-colors ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
                aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
              >
                <span className="font-medium">
                  {String.fromCharCode(65 + index)}: {option}
                </span>
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!hasSelectedAnswer}
          variant="primary"
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to finish the quiz?
            </h3>
            <div className="flex gap-3">
              <Button onClick={handleFinishConfirm} variant="primary">
                Yes, Finish Quiz
              </Button>
              <Button onClick={() => setShowConfirmation(false)} variant="secondary">
                Continue Quiz
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Time's up message */}
      {timeRemaining === 0 && quiz.timeLimit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md text-center">
            <h3 className="text-lg font-semibold mb-4">Time's up!</h3>
            <p>The quiz has been automatically submitted.</p>
          </div>
        </div>
      )}
    </div>
  )
}
