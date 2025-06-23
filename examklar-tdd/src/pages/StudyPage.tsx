import { useState, useRef } from 'react'

const StudyPage = () => {
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isTimerStopped, setIsTimerStopped] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startSession = () => {
    setIsSessionActive(true)
  }

  const startTimer = () => {
    setIsTimerRunning(true)
    setIsTimerStopped(false)
    intervalRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    setIsTimerRunning(false)
    setIsTimerStopped(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const endSession = () => {
    setIsSessionActive(false)
    setIsTimerRunning(false)
    setIsTimerStopped(false)
    setTimeElapsed(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isSessionActive) {
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
            <button
              onClick={startSession}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Study Session
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Study Session Active
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div data-testid="study-timer" className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Study Timer
          </h2>
          <div data-testid="timer-display" className="text-4xl font-mono mb-6">
            {formatTime(timeElapsed)}
          </div>
          <div className="flex justify-center gap-4">
            {!isTimerRunning && !isTimerStopped ? (
              <button
                data-testid="timer-play"
                onClick={startTimer}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                ▶ Start
              </button>
            ) : isTimerRunning ? (
              <button
                data-testid="timer-stop"
                onClick={stopTimer}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                ⏹ Stop
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  data-testid="timer-play"
                  onClick={startTimer}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  ▶ Resume
                </button>
                <button
                  onClick={endSession}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  End Session
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Timer Status</h3>
            <p className="text-blue-700">{isTimerRunning ? 'Running' : 'Stopped'}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-green-900 mb-2">Time Studied</h3>
            <p className="text-green-700">{formatTime(timeElapsed)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyPage
