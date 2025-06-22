import { render, screen } from '@testing-library/react'
import { QuizMinimal } from '../../src/components/QuizMinimal'

describe('QuizMinimal', () => {
  it('should render', () => {
    render(<QuizMinimal />)
    expect(screen.getByText('Quiz Component')).toBeInTheDocument()
  })
})
