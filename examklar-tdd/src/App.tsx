import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import StudyPage from './pages/StudyPage'
import FlashcardsPage from './pages/FlashcardsPage'
import QuizPage from './pages/QuizPage'
import NotFoundPage from './pages/NotFoundPage'
import KahootDesignDemo from './pages/KahootDesignDemo'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><OnboardingPage /></Layout>} />
      <Route path="/onboarding" element={<Layout><OnboardingPage /></Layout>} />
      <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
      <Route path="/study" element={<Layout><StudyPage /></Layout>} />
      <Route path="/flashcards" element={<Layout><FlashcardsPage /></Layout>} />
      <Route path="/quiz" element={<Layout><QuizPage /></Layout>} />
      <Route path="/demo" element={<KahootDesignDemo />} />
      <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
    </Routes>
  )
}

export default App
