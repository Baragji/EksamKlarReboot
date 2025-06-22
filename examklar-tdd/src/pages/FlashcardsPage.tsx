const FlashcardsPage = () => {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Flashcards
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Interactive Flashcards
          </h2>
          <p className="text-gray-600">
            Review key concepts with our smart flashcard system
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Sample Flashcard
            </h3>
            <p className="text-gray-600">
              Click to reveal the answer
            </p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Flip Card
          </button>
        </div>
      </div>
    </div>
  )
}

export default FlashcardsPage
