# Store Integration Strategi

Dette dokument indeholder en detaljeret plan for at løse problemerne med manglende integration mellem komponenter og stores i ExamKlar TDD projektet, herunder håndtering af mock-implementationer og hardcoded data.

## 1. Oversigt over Problemer

Baseret på vores audit har vi identificeret følgende problemer med store integration:

1. **Manglende Integration**: Komponenter bruger ikke stores konsistent, og nogle komponenter antager data strukturer uden at verificere dem
2. **Mock Implementationer**: Flere steder bruges mock data i stedet for rigtig funktionalitet
3. **Hardcoded Data**: Komponenter bruger hardcoded data i stedet for at hente data fra stores
4. **Type Safety**: Manglende type safety i store operationer, især ved brug af string keys uden type check
5. **Error Handling**: Inkonsistent eller manglende error handling for store operationer
6. **Loading States**: Manglende loading states for async operationer

## 2. Store Arkitektur

ExamKlar TDD projektet bruger Zustand som state management løsning med følgende stores:

1. **achievementStore**: Håndterer achievements, progress tracking og gamification
2. **examStore**: Håndterer brugerdata, subjects, study plans og study sessions
3. **flashcardStore**: Håndterer flashcards, spaced repetition og quiz data
4. **onboardingStore**: Håndterer onboarding flow og bruger preferences
5. **databridgeStore**: Håndterer integration med eksterne datakilder

## 3. Integration Strategi

### 3.1 Store Integration Pattern

Vi vil implementere et konsistent mønster for store integration i alle komponenter:

```tsx
// Før
const AchievementsList = () => {
  const { achievements, isAchievementUnlocked } = useAchievementStore();
  
  // Ingen håndtering af loading eller error states
  // Ingen null checks
  
  return (
    <div>
      {achievements.map(achievement => (
        <AchievementItem 
          key={achievement.id} 
          achievement={achievement}
          isUnlocked={isAchievementUnlocked(achievement.id)}
        />
      ))}
    </div>
  );
};

// Efter
const AchievementsList = () => {
  const { 
    achievements, 
    isAchievementUnlocked,
    isLoading,
    error
  } = useAchievementStore();
  
  // Håndter loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Håndter error state
  if (error) {
    return <ErrorMessage message={error.message} />;
  }
  
  // Håndter tom data
  if (!achievements || achievements.length === 0) {
    return <EmptyState message="No achievements available" />;
  }
  
  return (
    <div>
      {achievements.map(achievement => (
        <AchievementItem 
          key={achievement.id} 
          achievement={achievement}
          isUnlocked={isAchievementUnlocked(achievement.id)}
        />
      ))}
    </div>
  );
};
```

### 3.2 Store Enhancement

Vi vil forbedre alle stores med følgende features:

1. **Loading States**: Tilføj isLoading state til alle stores
2. **Error Handling**: Tilføj error state og error handling til alle stores
3. **Type Safety**: Forbedre type safety med proper type guards og null checks
4. **Selectors**: Brug Zustand selectors for bedre performance og type safety
5. **Middleware**: Brug Zustand middleware for logging, persistence og devtools

Eksempel på forbedret store:

```tsx
// Før
interface AchievementState {
  achievements: Achievement[]
  unlockedAchievements: string[]
  
  // Actions
  unlockAchievement: (achievementId: string) => void
  checkAchievements: (progressData: ProgressData) => string[]
}

// Efter
interface AchievementState {
  // Core state
  achievements: Achievement[]
  unlockedAchievements: string[]
  
  // UI states
  isLoading: boolean
  error: Error | null
  
  // Actions
  unlockAchievement: (achievementId: string) => void
  checkAchievements: (progressData: ProgressData) => string[]
  
  // Error handling
  clearError: () => void
  setError: (error: Error) => void
  
  // Loading state
  setLoading: (isLoading: boolean) => void
}
```

## 4. Komponent-Specifik Integration Plan

### 4.1 AchievementsList Komponent

**Problemer**:
- Manglende loading state
- Manglende error handling
- Ingen håndtering af tom data
- Antagelser om data struktur

**Løsning**:

```tsx
// achievementStore.ts - Tilføj loading og error states
interface AchievementState {
  // Eksisterende state
  achievements: Achievement[]
  unlockedAchievements: string[]
  
  // Nye states
  isLoading: boolean
  error: Error | null
  
  // Nye actions
  setLoading: (isLoading: boolean) => void
  setError: (error: Error | null) => void
  clearError: () => void
}

// AchievementsList.tsx - Implementer robust integration
const AchievementsList = () => {
  const { 
    achievements, 
    isAchievementUnlocked,
    isLoading,
    error
  } = useAchievementStore(state => ({
    achievements: state.achievements,
    isAchievementUnlocked: state.isAchievementUnlocked,
    isLoading: state.isLoading,
    error: state.error
  }));
  
  // Håndter loading state
  if (isLoading) {
    return <LoadingSpinner data-testid="achievements-loading" />;
  }
  
  // Håndter error state
  if (error) {
    return (
      <ErrorMessage 
        data-testid="achievements-error"
        message={error.message} 
        onRetry={() => {
          // Implementer retry logic
        }}
      />
    );
  }
  
  // Håndter tom data
  if (!achievements || achievements.length === 0) {
    return (
      <EmptyState 
        data-testid="achievements-empty"
        title="No achievements yet"
        description="Start studying to unlock achievements!"
        icon="🏆"
      />
    );
  }
  
  // Group achievements by category med null check
  const achievementsByCategory = achievements.reduce((acc: Record<string, Achievement[]>, achievement) => {
    const category = achievement.category || 'uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {});
  
  return (
    <div data-testid="achievements-list" role="list" className="achievements-list">
      {/* Render achievements by category */}
    </div>
  );
};
```

### 4.2 StudyCalendar Komponent

**Problemer**:
- Hardcoded subjects array
- Manglende error handling
- Antagelser om data struktur

**Løsning**:

```tsx
// examStore.ts - Tilføj loading og error states
interface ExamStore {
  // Eksisterende state
  subjects: Subject[]
  studySessions: StudySession[]
  scheduledSessions: ScheduledSession[]
  
  // Nye states
  isLoading: boolean
  error: Error | null
  
  // Nye actions
  setLoading: (isLoading: boolean) => void
  setError: (error: Error | null) => void
  clearError: () => void
}

// StudyCalendar.tsx - Implementer robust integration
const StudyCalendar = () => {
  const { 
    studySessions, 
    scheduledSessions, 
    subjects,
    addScheduledSession,
    updateSession,
    deleteSession,
    isLoading,
    error
  } = useExamStore(state => ({
    studySessions: state.studySessions || [],
    scheduledSessions: state.scheduledSessions || [],
    subjects: state.subjects || [],
    addScheduledSession: state.addScheduledSession,
    updateSession: state.updateSession,
    deleteSession: state.deleteSession,
    isLoading: state.isLoading,
    error: state.error
  }));
  
  // Håndter loading state
  if (isLoading) {
    return <LoadingSpinner data-testid="calendar-loading" />;
  }
  
  // Håndter error state
  if (error) {
    return (
      <ErrorMessage 
        data-testid="calendar-error"
        message={error.message} 
        onRetry={() => {
          // Implementer retry logic
        }}
      />
    );
  }
  
  // Combine all sessions for display med null checks
  const allSessions = [
    ...(studySessions || []),
    ...(scheduledSessions || []).map(session => ({ ...session, completed: false }))
  ];
  
  // Resten af komponenten...
};
```

### 4.3 ProgressCharts Komponent

**Problemer**:
- Hardcoded chart data
- Manglende integration med progress data fra store
- Ingen loading eller error states

**Løsning**:

```tsx
// ProgressCharts.tsx - Implementer robust integration
const ProgressCharts = () => {
  const { 
    studySessions,
    subjects,
    progress,
    isLoading,
    error
  } = useExamStore(state => ({
    studySessions: state.studySessions || [],
    subjects: state.subjects || [],
    progress: state.progress,
    isLoading: state.isLoading,
    error: state.error
  }));
  
  // Håndter loading state
  if (isLoading) {
    return <LoadingSpinner data-testid="charts-loading" />;
  }
  
  // Håndter error state
  if (error) {
    return (
      <ErrorMessage 
        data-testid="charts-error"
        message={error.message} 
        onRetry={() => {
          // Implementer retry logic
        }}
      />
    );
  }
  
  // Beregn chart data fra faktiske data i stedet for hardcoded værdier
  const weeklyStudyHours = calculateWeeklyStudyHours(studySessions);
  const subjectProgress = calculateSubjectProgress(subjects, studySessions);
  const monthlyTrend = calculateMonthlyTrend(studySessions);
  
  const data = {
    weeklyStudyHours,
    subjectProgress,
    monthlyTrend
  };
  
  return <ProgressChartsView data={data} />;
};

// Separate view component for easier testing
const ProgressChartsView = ({ data }: { data: ProgressChartsData }) => {
  // Render charts...
};

// Helper functions to calculate chart data
function calculateWeeklyStudyHours(sessions: StudySession[]): Array<{ day: string; hours: number }> {
  // Implementer beregning baseret på faktiske sessions
}

function calculateSubjectProgress(subjects: Subject[], sessions: StudySession[]): Array<{ subject: string; completed: number; total: number }> {
  // Implementer beregning baseret på faktiske subjects og sessions
}

function calculateMonthlyTrend(sessions: StudySession[]): Array<{ month: string; hours: number }> {
  // Implementer beregning baseret på faktiske sessions
}
```

## 5. Mock Implementation Replacement

### 5.1 Identificering af Mock Implementationer

Vi har identificeret følgende mock implementationer der skal erstattes:

1. **achievementStore.getAchievementProgress**: Returnerer hardcoded progress data
2. **examStore.getCurrentProgress**: Bruger en forenklet implementering
3. **examStore.getTodaysGoal**: Returnerer hardcoded værdi hvis studyPlan ikke findes
4. **examStore.getIntegratedProgress**: Bruger en mock implementering for enhanced progress

### 5.2 Erstatning af Mock Implementationer

For hver mock implementation vil vi implementere rigtig funktionalitet:

```tsx
// achievementStore.ts - Erstat mock implementation
getAchievementProgress: (achievementId: string) => {
  const { achievements, unlockedAchievements } = get()
  const achievement = achievements.find(a => a.id === achievementId)
  
  if (!achievement) {
    return { current: 0, required: 1, percentage: 0 }
  }

  // Hent faktisk progress data baseret på achievement type
  let current = 0
  const required = achievement.criteria.value
  
  switch (achievement.criteria.type) {
    case 'sessions':
      current = get().getProgressForAchievements().sessionsCompleted
      break
    case 'study_time':
      current = get().getProgressForAchievements().totalStudyTime
      break
    case 'streak':
      current = get().getProgressForAchievements().streakCount
      break
    case 'flashcards':
      current = get().getProgressForAchievements().flashcardsReviewed
      break
    case 'quiz_score':
      current = get().getProgressForAchievements().averageQuizScore || 0
      break
  }
  
  // Beregn percentage med bounds checking
  const percentage = Math.min(100, Math.max(0, Math.floor((current / required) * 100)))
  
  return {
    current,
    required,
    percentage
  }
},

// examStore.ts - Erstat mock implementation
getCurrentProgress: () => {
  const state = get()
  
  // Beregn faktisk progress baseret på study sessions
  const totalMinutesThisWeek = state.studySessions
    .filter(session => {
      const sessionDate = new Date(session.date)
      const now = new Date()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      weekStart.setHours(0, 0, 0, 0)
      return session.completed && sessionDate >= weekStart
    })
    .reduce((total, session) => total + session.duration, 0)
  
  // Beregn progress percentage
  const weeklyGoal = state.progress?.weeklyGoal || 600 // Default to 10 hours
  const progressPercentage = Math.min(100, Math.max(0, Math.floor((totalMinutesThisWeek / weeklyGoal) * 100)))
  
  return progressPercentage
},
```

## 6. Type Safety Forbedringer

### 6.1 Type Guards

Vi vil implementere proper type guards for alle store operationer:

```tsx
// Før
const achievement = achievements.find(a => a.id === achievementId)
return total + (achievement?.points || 0)

// Efter
const achievement = achievements.find(a => a.id === achievementId)
if (!achievement) return total
return total + achievement.points
```

### 6.2 Zustand Selectors

Vi vil bruge Zustand selectors for bedre type safety og performance:

```tsx
// Før
const { achievements, isAchievementUnlocked } = useAchievementStore();

// Efter
const achievements = useAchievementStore(state => state.achievements);
const isAchievementUnlocked = useAchievementStore(state => state.isAchievementUnlocked);

// Eller med multiple selectors
const { 
  achievements, 
  isAchievementUnlocked 
} = useAchievementStore(state => ({
  achievements: state.achievements,
  isAchievementUnlocked: state.isAchievementUnlocked
}));
```

### 6.3 Typed Keys

Vi vil erstatte string keys med typed keys:

```tsx
// Før
const achievementsByCategory = achievements.reduce((acc: Record<string, Achievement[]>, achievement) => {
  const category = achievement.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(achievement);
  return acc;
}, {});

// Efter
type AchievementCategory = 'learning' | 'consistency' | 'mastery' | 'exploration';

const achievementsByCategory = achievements.reduce((acc: Record<AchievementCategory, Achievement[]>, achievement) => {
  const category = achievement.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(achievement);
  return acc;
}, {} as Record<AchievementCategory, Achievement[]>);
```

## 7. Error Handling

### 7.1 Konsistent Error Handling i Stores

Vi vil implementere konsistent error handling i alle stores:

```tsx
// Store definition
interface StoreState {
  error: Error | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
}

// Implementation
setError: (error) => set({ error }, false, 'setError'),
clearError: () => set({ error: null }, false, 'clearError'),

// Async action med error handling
someAsyncAction: async () => {
  try {
    set({ isLoading: true, error: null }, false, 'someAsyncAction:loading');
    // Async operation
    const result = await someApiCall();
    set({ data: result, isLoading: false }, false, 'someAsyncAction:success');
  } catch (error) {
    set({ 
      isLoading: false, 
      error: error instanceof Error ? error : new Error(String(error))
    }, false, 'someAsyncAction:error');
  }
}
```

### 7.2 Error Boundary Komponenter

Vi vil implementere Error Boundary komponenter for at fange og håndtere fejl på komponent-niveau:

```tsx
// ErrorBoundary.tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Brug i komponenter
<ErrorBoundary fallback={<ErrorMessage message="Something went wrong" />}>
  <AchievementsList />
</ErrorBoundary>
```

## 8. Loading States

### 8.1 Loading State i Stores

Vi vil tilføje loading state til alle stores:

```tsx
// Store definition
interface StoreState {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

// Implementation
setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),

// Async action med loading state
someAsyncAction: async () => {
  set({ isLoading: true }, false, 'someAsyncAction:loading');
  try {
    // Async operation
    const result = await someApiCall();
    set({ data: result, isLoading: false }, false, 'someAsyncAction:success');
  } catch (error) {
    set({ isLoading: false, error }, false, 'someAsyncAction:error');
  }
}
```

### 8.2 Loading Komponenter

Vi vil implementere reusable loading komponenter:

```tsx
// LoadingSpinner.tsx
const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className={`spinner spinner-${size}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

// LoadingOverlay.tsx
const LoadingOverlay = ({ isLoading, children }) => {
  if (!isLoading) return children;
  
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    </div>
  );
};

// Brug i komponenter
<LoadingOverlay isLoading={isLoading}>
  <AchievementsList />
</LoadingOverlay>
```

## 9. Implementeringsplan

### 9.1 Fase 1: Store Enhancement

1. Tilføj isLoading og error states til alle stores
2. Implementer setLoading og setError actions
3. Opdater eksisterende actions til at bruge loading og error states
4. Tilføj type guards og forbedre type safety

### 9.2 Fase 2: Komponent Integration

1. Opdater AchievementsList med robust store integration
2. Opdater StudyCalendar med robust store integration
3. Opdater ProgressCharts med robust store integration
4. Opdater andre komponenter med samme mønster

### 9.3 Fase 3: Mock Replacement

1. Erstat mock implementationer i achievementStore
2. Erstat mock implementationer i examStore
3. Erstat hardcoded data i komponenter
4. Implementer rigtig funktionalitet for alle mock implementationer

### 9.4 Fase 4: Error Handling & Loading States

1. Implementer Error Boundary komponenter
2. Implementer Loading komponenter
3. Tilføj error handling til alle komponenter
4. Tilføj loading states til alle komponenter

## 10. Test Strategi

### 10.1 Unit Tests

For hver store og komponent, skriv unit tests der verificerer:

1. Korrekt integration mellem komponenter og stores
2. Korrekt håndtering af loading states
3. Korrekt håndtering af error states
4. Korrekt håndtering af edge cases (tom data, null values, etc.)

```tsx
// Test for AchievementsList
describe('AchievementsList', () => {
  it('should show loading spinner when isLoading is true', () => {
    // Mock store med isLoading = true
    jest.spyOn(useAchievementStore, 'getState').mockImplementation(() => ({
      achievements: [],
      isLoading: true,
      error: null,
      // ... andre required properties
    }));
    
    const { getByTestId } = render(<AchievementsList />);
    expect(getByTestId('achievements-loading')).toBeInTheDocument();
  });
  
  it('should show error message when error is present', () => {
    // Mock store med error
    jest.spyOn(useAchievementStore, 'getState').mockImplementation(() => ({
      achievements: [],
      isLoading: false,
      error: new Error('Test error'),
      // ... andre required properties
    }));
    
    const { getByTestId } = render(<AchievementsList />);
    expect(getByTestId('achievements-error')).toBeInTheDocument();
  });
  
  it('should show empty state when achievements array is empty', () => {
    // Mock store med tom achievements array
    jest.spyOn(useAchievementStore, 'getState').mockImplementation(() => ({
      achievements: [],
      isLoading: false,
      error: null,
      // ... andre required properties
    }));
    
    const { getByTestId } = render(<AchievementsList />);
    expect(getByTestId('achievements-empty')).toBeInTheDocument();
  });
  
  it('should render achievements when data is available', () => {
    // Mock store med achievements data
    jest.spyOn(useAchievementStore, 'getState').mockImplementation(() => ({
      achievements: [
        {
          id: '1',
          title: 'Test Achievement',
          description: 'Test Description',
          icon: '🏆',
          category: 'learning',
          points: 10,
          criteria: { type: 'sessions', value: 1, operator: 'gte' }
        }
      ],
      isLoading: false,
      error: null,
      isAchievementUnlocked: () => false,
      // ... andre required properties
    }));
    
    const { getByTestId } = render(<AchievementsList />);
    expect(getByTestId('achievements-list')).toBeInTheDocument();
  });
});
```

### 10.2 Integration Tests

Skriv integration tests der verificerer:

1. Korrekt data flow mellem stores og komponenter
2. Korrekt opdatering af UI når store data ændres
3. Korrekt håndtering af async operationer

```tsx
// Integration test for AchievementsList og achievementStore
describe('AchievementsList Integration', () => {
  it('should update UI when achievements are unlocked', async () => {
    // Setup initial store state
    const store = useAchievementStore.getState();
    store.resetAchievements();
    
    // Render component
    const { getByTestId, rerender } = render(<AchievementsList />);
    
    // Verify initial state
    expect(getByTestId('achievement-first-session')).toHaveClass('achievement-locked');
    
    // Update store
    act(() => {
      store.unlockAchievement('first-session');
    });
    
    // Re-render to reflect store changes
    rerender(<AchievementsList />);
    
    // Verify updated UI
    expect(getByTestId('achievement-first-session')).toHaveClass('achievement-unlocked');
  });
});
```

## 11. Konklusion

Ved at følge denne store integration strategi vil ExamKlar TDD projektet opnå:

1. **Robust Integration**: Alle komponenter vil have konsistent integration med stores
2. **Type Safety**: Forbedret type safety vil reducere runtime errors
3. **Error Handling**: Konsistent error handling vil forbedre brugeroplevelsen
4. **Loading States**: Proper loading states vil give bedre feedback til brugeren
5. **Rigtig Funktionalitet**: Erstatning af mock implementationer med rigtig funktionalitet

Implementeringen bør følge TDD-principperne, med tests der verificerer korrekt integration før implementering af ændringer.