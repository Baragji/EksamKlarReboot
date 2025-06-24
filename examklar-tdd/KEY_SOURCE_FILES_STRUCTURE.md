# ExamKlar TDD - Key Source Files Structure

This document lists all essential source files that make the ExamKlar application function. Test files, documentation, and build artifacts are excluded.

## Root Configuration Files
```
/
├── index.html                    # Main HTML entry point
├── package.json                  # Project dependencies and scripts
├── vite.config.ts               # Vite build configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── tsconfig.json                # TypeScript main configuration
├── tsconfig.app.json            # TypeScript app-specific configuration
├── tsconfig.node.json           # TypeScript node configuration
└── eslint.config.js             # ESLint configuration
```

## Source Code Structure (/src)

### Core Application Files
```
src/
├── main.tsx                     # Application entry point
├── App.tsx                      # Main app component
├── App.css                      # App-specific styles
├── index.css                    # Global styles
└── vite-env.d.ts               # Vite environment types
```

### Pages (Application Routes)
```
src/pages/
├── DashboardPage.tsx            # Main dashboard/home page
├── FlashcardsPage.tsx          # Flashcards management page
├── StudyPage.tsx               # Study session page
├── QuizPage.tsx                # Quiz taking page
├── SettingsPage.tsx            # User settings page
├── OnboardingPage.tsx          # User onboarding flow
├── NotFoundPage.tsx            # 404 error page
└── KahootDesignDemo.tsx        # Kahoot-style design demo
```

### Components

#### Core Study Components
```
src/components/
├── Quiz.tsx                     # Main quiz component
├── QuizEngine.tsx              # Quiz logic engine
├── QuizMinimal.tsx             # Minimal quiz implementation
├── QuizTest.tsx                # Quiz test component
├── Flashcard.tsx               # Individual flashcard component
├── FlashcardDeck.tsx           # Flashcard deck manager
├── DeckManager.tsx             # Deck management interface
├── StudyTimer.tsx              # Study session timer
├── StudyCalendar.tsx           # Study calendar view
└── StudyProgressDashboard.tsx  # Progress tracking dashboard
```

#### UI & Visual Components
```
src/components/
├── AchievementsList.tsx        # User achievements display
├── ProgressCharts.tsx          # Progress visualization charts
├── SubjectCard.tsx             # Subject selection cards
```

#### Layout Components
```
src/components/layout/
├── Layout.tsx                  # Main layout wrapper
└── Navigation.tsx              # Navigation component
```

#### UI Components (Design System)
```
src/components/ui/
├── Badge.tsx                   # Badge/label component
├── Button.tsx                  # Button component
├── Card.tsx                    # Card container component
├── Input.tsx                   # Input field component
├── Modal.tsx                   # Modal dialog component
├── ProgressComponents.tsx      # Progress indicators
└── Tooltip.tsx                 # Tooltip component
```

### State Management (Zustand Stores)
```
src/stores/
├── examStore.ts                # Exam/quiz state management
├── flashcardStore.ts           # Flashcard data management
├── achievementStore.ts         # User achievements tracking
├── onboardingStore.ts          # Onboarding flow state
└── databridgeStore.ts          # Data bridge/sync state
```

### Services & Business Logic
```
src/services/
├── AIService.ts                # AI integration service
└── ContentAnalyzer.ts          # Content analysis service
```

### Utilities
```
src/utils/
├── buildUtils.ts               # Build-related utilities
├── dataBridge.ts               # Data bridging utilities
├── exportImport.ts             # Data export/import functions
└── performanceUtils.ts         # Performance optimization utilities
```

### Type Definitions
```
src/types/
├── index.ts                    # Main type definitions
├── onboarding.ts               # Onboarding-specific types
└── databridge.ts               # Data bridge types
```

### Styling
```
src/styles/
├── gamified-design-system.css  # Gamification design system
└── kahoot-design-system.css    # Kahoot-inspired design system
```

### Library & Shared Code
```
src/lib/
└── utils.ts                    # Shared utility functions
```

## Public Assets
```
public/
└── manifest.json               # PWA manifest file
```

## Summary

**Total Key Source Files:** 50+ files across the following categories:

- **Configuration Files:** 8 files (build, TypeScript, linting, styling)
- **Core App Files:** 5 files (entry points, main app, globals)
- **Pages:** 8 React page components
- **Components:** 20 React components (core, UI, layout)
- **State Management:** 5 Zustand stores
- **Services:** 2 service files
- **Utilities:** 4 utility modules
- **Types:** 3 TypeScript definition files
- **Styles:** 2 CSS design systems
- **Lib:** 1 shared utility file
- **Public:** 1 manifest file

This is a modern React + TypeScript application using:
- **Vite** for build tooling
- **Zustand** for state management
- **Tailwind CSS** for styling
- **React Router** for navigation
- **PWA** capabilities

All files listed are essential for the application to function properly and exclude test files, documentation, build outputs, and development tools.