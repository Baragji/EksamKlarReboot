import { type ReactNode } from 'react'
import Navigation from './Navigation'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
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
      
      <main role="main" className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Layout
