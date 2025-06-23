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
        className="sr-only focus:not-sr-only focus:absolute focus:top-6 focus:left-6 bg-blue-600 text-white px-4 py-2 rounded-md z-[9999] focus:outline-none focus:ring-2 focus:ring-blue-300"
        data-testid="skip-link"
        tabIndex={0}
      >
        Skip to main content
      </a>
      <div className="min-h-screen bg-gray-50">
      
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">ExamKlar</h1>
            </div>
            <div className="flex items-center">
              <Navigation />
            </div>
          </div>
        </div>
      </header>
      
      <main role="main" id="main-content" className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>
      </div>
    </>
  )
}

export default Layout
