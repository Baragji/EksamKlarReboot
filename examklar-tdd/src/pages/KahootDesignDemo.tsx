import React from 'react'

const KahootDesignDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-kahoot-primary p-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-kahoot-heading text-white mb-4">
          🎮 Kahoot-Style Design System
        </h1>
        <p className="text-xl text-white/90 font-kahoot-medium">
          Modern, energetic, gamified design for young learners
        </p>
      </header>

      {/* Color Palette Demo */}
      <section className="mb-12">
        <div className="card-kahoot mb-8">
          <h2 className="text-2xl font-kahoot-bold text-gray-800 mb-6">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-kahoot-red rounded-kahoot mx-auto mb-2"></div>
              <span className="text-sm font-kahoot-medium">Red</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-kahoot-blue rounded-kahoot mx-auto mb-2"></div>
              <span className="text-sm font-kahoot-medium">Blue</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-kahoot-yellow rounded-kahoot mx-auto mb-2"></div>
              <span className="text-sm font-kahoot-medium">Yellow</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-kahoot-green rounded-kahoot mx-auto mb-2"></div>
              <span className="text-sm font-kahoot-medium">Green</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-kahoot-purple rounded-kahoot mx-auto mb-2"></div>
              <span className="text-sm font-kahoot-medium">Purple</span>
            </div>
          </div>
        </div>
      </section>

      {/* Button Demo */}
      <section className="mb-12">
        <div className="card-kahoot">
          <h2 className="text-2xl font-kahoot-bold text-gray-800 mb-6">Interactive Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="btn-kahoot-primary">
              Start Quiz 🚀
            </button>
            <button className="btn-kahoot-secondary">
              View Progress 📊
            </button>
            <button className="btn-kahoot-success">
              Complete ✅
            </button>
            <button className="btn-kahoot-danger">
              Reset ❌
            </button>
          </div>
        </div>
      </section>

      {/* Card Demo */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card-kahoot hover-lift interactive-kahoot">
            <div className="w-12 h-12 bg-gradient-kahoot-cool rounded-kahoot mb-4 flex items-center justify-center">
              <span className="text-white text-xl">📚</span>
            </div>
            <h3 className="text-xl font-kahoot-bold text-gray-800 mb-2">Mathematics</h3>
            <p className="text-kahoot-body mb-4">Master algebra, calculus, and more with interactive lessons</p>
            <div className="progress-kahoot mb-3">
              <div className="progress-kahoot-fill" style={{width: '75%'}}></div>
            </div>
            <span className="text-sm font-kahoot-medium text-gray-600">75% Complete</span>
          </div>

          <div className="card-kahoot hover-lift interactive-kahoot">
            <div className="w-12 h-12 bg-gradient-kahoot-warm rounded-kahoot mb-4 flex items-center justify-center">
              <span className="text-white text-xl">🧪</span>
            </div>
            <h3 className="text-xl font-kahoot-bold text-gray-800 mb-2">Chemistry</h3>
            <p className="text-kahoot-body mb-4">Explore the periodic table and chemical reactions</p>
            <div className="progress-kahoot mb-3">
              <div className="progress-kahoot-fill" style={{width: '45%'}}></div>
            </div>
            <span className="text-sm font-kahoot-medium text-gray-600">45% Complete</span>
          </div>

          <div className="card-kahoot hover-lift interactive-kahoot">
            <div className="w-12 h-12 bg-gradient-kahoot-success rounded-kahoot mb-4 flex items-center justify-center">
              <span className="text-white text-xl">🌍</span>
            </div>
            <h3 className="text-xl font-kahoot-bold text-gray-800 mb-2">Geography</h3>
            <p className="text-kahoot-body mb-4">Discover countries, capitals, and cultures worldwide</p>
            <div className="progress-kahoot mb-3">
              <div className="progress-kahoot-fill" style={{width: '90%'}}></div>
            </div>
            <span className="text-sm font-kahoot-medium text-gray-600">90% Complete</span>
          </div>
        </div>
      </section>

      {/* Gradient Demo */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-kahoot-warm rounded-kahoot-lg p-8 text-white text-center">
            <h3 className="text-2xl font-kahoot-bold mb-4">Quick Fire Round</h3>
            <p className="text-lg mb-6">Test your knowledge with rapid-fire questions!</p>
            <button className="btn-kahoot-secondary">Start Now</button>
          </div>
          
          <div className="bg-gradient-kahoot-cool rounded-kahoot-lg p-8 text-white text-center">
            <h3 className="text-2xl font-kahoot-bold mb-4">Study Mode</h3>
            <p className="text-lg mb-6">Learn at your own pace with detailed explanations</p>
            <button className="btn-kahoot-secondary">Begin Learning</button>
          </div>
        </div>
      </section>

      {/* Typography Demo */}
      <section className="mb-12">
        <div className="card-kahoot">
          <h2 className="text-2xl font-kahoot-bold text-gray-800 mb-6">Typography Scale</h2>
          <div className="space-y-4">
            <h1 className="text-kahoot-heading">Heading - Ready to Learn?</h1>
            <h2 className="text-2xl font-kahoot-bold text-gray-800">Subheading - Choose Your Subject</h2>
            <p className="text-kahoot-body">
              Body text - This is how regular content will look in our Kahoot-style design system. 
              It's designed to be friendly, readable, and engaging for young learners.
            </p>
            <p className="text-lg font-kahoot-medium text-gray-700">
              Medium text - Perfect for important information and call-to-actions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center">
        <div className="card-kahoot">
          <p className="text-kahoot-body">
            🎯 Kahoot-Style Design System - Modern, Engaging, Educational
          </p>
        </div>
      </footer>
    </div>
  )
}

export default KahootDesignDemo