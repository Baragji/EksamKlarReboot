import { type ReactNode } from 'react'
import Navigation from './Navigation'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      {/* Skip Link for Accessibility - MUST be first focusable element */}
      <a 
        href="#main-content" 
        className="btn-gamified-secondary sr-only focus:not-sr-only focus:absolute focus:top-6 focus:left-6 z-[9999] focus:outline-none focus:ring-2 focus:ring-blue-300"
        data-testid="skip-link"
        tabIndex={0}
      >
        Skip to main content
      </a>
      <div className="min-h-screen bg-gradient-gamified-primary p-4" data-testid="layout-container">
      
      <header className="card-gamified mb-6" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-gamified-heading text-white">ExamKlar</h1>
            </div>
            <div className="flex items-center">
              <Navigation />
            </div>
          </div>
        </div>
      </header>
      
      <main role="main" id="main-content" className="gamified-main-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="w-full card-gamified" data-testid="content-wrapper">
            {children}
          </div>
        </div>
      </main>
      </div>
    </>
  )
}

export default Layout
