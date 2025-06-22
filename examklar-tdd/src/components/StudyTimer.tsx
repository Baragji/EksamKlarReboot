import React, { useState, useEffect, useRef } from 'react'
import type { Subject } from '../types'
import { Button } from './ui/Button'

export interface StudySession {
  duration: number // in seconds
  startTime: Date
  endTime: Date
}

export interface StudyTimerProps {
  subject?: Subject
  onSessionEnd?: (session: StudySession) => void
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ 
  subject, 
  onSessionEnd 
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Start timer
  const handleStart = () => {
    setIsRunning(true)
    if (!startTime) {
      setStartTime(new Date())
    }
  }

  // Pause timer
  const handlePause = () => {
    setIsRunning(false)
    
    // If we have a valid session, call onSessionEnd
    if (startTime && elapsedSeconds > 0 && onSessionEnd) {
      onSessionEnd({
        duration: elapsedSeconds,
        startTime,
        endTime: new Date()
      })
    }
  }

  // Reset timer
  const handleReset = () => {
    setIsRunning(false)
    setElapsedSeconds(0)
    setStartTime(null)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Format time as HH:MM:SS
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [hours, minutes, seconds]
      .map(unit => unit.toString().padStart(2, '0'))
      .join(':')
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-lg shadow-md">
      {/* Subject display */}
      {subject && (
        <div className="text-center">
          <div className="text-2xl mb-2">{subject.emoji}</div>
          <h2 className="text-lg font-semibold text-gray-800">{subject.name}</h2>
        </div>
      )}

      {/* Timer display */}
      <div
        role="timer"
        aria-label="Study timer"
        className="text-4xl font-mono font-bold text-gray-900 bg-gray-100 px-8 py-4 rounded-lg"
      >
        {formatTime(elapsedSeconds)}
      </div>

      {/* Control buttons */}
      <div className="flex space-x-4">
        {!isRunning ? (
          <Button
            onClick={handleStart}
            aria-label="Start timer"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
          >
            Start
          </Button>
        ) : (
          <Button
            onClick={handlePause}
            aria-label="Pause timer"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2"
          >
            Pause
          </Button>
        )}
        
        <Button
          onClick={handleReset}
          aria-label="Reset timer"
          variant="outline"
          className="px-6 py-2"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
