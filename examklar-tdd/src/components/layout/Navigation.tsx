import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  BookOpenIcon,
  RectangleStackIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'

const Navigation = () => {
  const location = useLocation()

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

  const getLinkClasses = (href: string) => {
    const isActive = location.pathname === href
    const baseClasses = 'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100'
    
    if (isActive) {
      return `${baseClasses} bg-blue-100 text-blue-700`
    }
    
    return `${baseClasses} text-gray-600 hover:text-gray-900`
  }

  return (
    <nav role="navigation" aria-label="Main navigation" className="flex space-x-4">
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
  )
}

export default Navigation
