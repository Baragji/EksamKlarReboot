import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  HomeIcon,
  BookOpenIcon,
  RectangleStackIcon,
  QuestionMarkCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const Navigation = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Study',
      href: '/study',
      icon: BookOpenIcon,
    },
    {
      name: 'Flashcards',
      href: '/flashcards',
      icon: RectangleStackIcon,
    },
    {
      name: 'Quiz',
      href: '/quiz',
      icon: QuestionMarkCircleIcon,
    },
  ]

  const getLinkClasses = (href: string, isMobile: boolean = false) => {
    const isActive = location.pathname === href
    const baseClasses = isMobile 
      ? 'flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100'
      : 'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100'
    
    if (isActive) {
      return `${baseClasses} bg-blue-100 text-blue-700`
    }
    
    return `${baseClasses} text-gray-600 hover:text-gray-900`
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav role="navigation" aria-label="Main navigation" className="hidden md:flex space-x-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className={getLinkClasses(item.href)}
              tabIndex={0}
            >
              <Icon className="w-5 h-5 mr-2" aria-hidden="true" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Mobile Menu Toggle */}
      <button
        data-testid="mobile-menu-toggle"
        className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={toggleMobileMenu}
        aria-expanded={isMobileMenuOpen}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="w-6 h-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="w-6 h-6" aria-hidden="true" />
        )}
      </button>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav 
          data-testid="mobile-navigation"
          role="navigation" 
          aria-label="Mobile navigation" 
          className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50"
        >
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={getLinkClasses(item.href, true)}
                  tabIndex={0}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" aria-hidden="true" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}

export default Navigation
