import React from 'react'

export const Quiz: React.FC<{ quiz: unknown }> = ({ quiz }) => {
  console.log('Quiz data:', quiz) // Use the quiz parameter
  return <div>Quiz Component Test</div>
}
