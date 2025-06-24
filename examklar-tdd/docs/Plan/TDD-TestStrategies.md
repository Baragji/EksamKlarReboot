# TDD-Teststrategier for ExamKlar Refaktorering

Dette dokument definerer specifikke teststrategier for hver fase i vores refaktoreringsplan, med fokus på at følge TDD-principperne (Red-Green-Refactor). Strategierne inkluderer unit tests, integration tests og UI tests hvor relevant.

## 🧪 Overordnede TDD-Principper

For alle faser og sessioner følger vi disse grundlæggende TDD-principper:

1. **🔴 RED**: Skriv en fejlende test først
   - Definer forventet adfærd før implementering
   - Verificer at testen fejler af den forventede årsag
   - Dokumenter testens formål og forventninger

2. **🟢 GREEN**: Implementer minimal kode for at få testen til at bestå
   - Fokuser kun på at få testen til at bestå
   - Undgå over-engineering og præmatur optimering
   - Verificer at testen nu består

3. **🔵 REFACTOR**: Forbedre koden uden at ændre dens adfærd
   - Fjern duplikeret kode
   - Forbedre navngivning og struktur
   - Sikre at alle tests stadig består efter refaktorering

4. **DOKUMENTATION**: Opdater kontekst efter hver cyklus
   - Kør `python3 TDD-ContextSysten/newtdd.py "session_id" "description of what you just did"`
   - Dokumenter beslutninger og ændringer
   - Opdater relevante dokumenter

## 🏗️ FASE 1: FOUNDATION REFACTORING - Teststrategier

### Session 1.1: Dependency Management Cleanup

**TDD Tilgang**:
1. **🔴 RED**: 
   - Skriv tests der verificerer at applikationen kan bygges og køres med opdaterede dependencies
   - Skriv tests der verificerer at alle komponenter renderes korrekt med nye versioner
   - Eksempel: `expect(render(<App />)).not.toThrow()`

2. **🟢 GREEN**:
   - Opdater package.json med korrekte versioner
   - Løs eventuelle kompatibilitetsproblemer
   - Kør `npm install` for at opdatere dependencies

3. **🔵 REFACTOR**:
   - Fjern unødvendige dependencies
   - Konsolider overlappende dependencies
   - Sikre konsistent versionering

**Testtyper**:
- **Unit Tests**: Verificer at individuelle komponenter fungerer med nye versioner
- **Integration Tests**: Verificer at komponenter interagerer korrekt med hinanden
- **Smoke Tests**: Verificer at applikationen starter og kører uden fejl

### Session 1.2: Browser Compatibility Fixes

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests der verificerer browser-kompatible typer
   - Eksempel: `test('useDebounce should use window.setTimeout', () => {...})`
   - Skriv tests der verificerer at timers fungerer korrekt i browser miljø

2. **🟢 GREEN**:
   - Erstat NodeJS.Timeout med window.setTimeout return type
   - Opdater performanceUtils.ts til at bruge browser-kompatible typer
   - Fjern Node-specifikke imports

3. **🔵 REFACTOR**:
   - Konsolider timer-relateret kode
   - Skab reusable utilities for browser-specifik funktionalitet
   - Sikre konsistent brug af browser APIs

**Testtyper**:
- **Unit Tests**: Verificer at timer-relaterede funktioner fungerer korrekt
- **Mock Tests**: Mock browser APIs for at teste edge cases
- **Type Tests**: Verificer at TypeScript typer er korrekte og browser-kompatible

### Session 1.3-1.6: CSS Class Audit & Component Styling

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests der verificerer at komponenter bruger korrekte CSS klasser
   - Eksempel: `expect(screen.getByTestId('achievement-item')).toHaveClass('card-gamified')`
   - Skriv tests der verificerer styling og layout

2. **🟢 GREEN**:
   - Opdater komponenter til at bruge eksisterende design system klasser
   - Erstat manglende klasser med tilsvarende fra design systemet
   - Implementer konsistent styling

3. **🔵 REFACTOR**:
   - Konsolider styling logik
   - Skab reusable styling utilities
   - Sikre konsistent brug af design system

**Testtyper**:
- **Unit Tests**: Verificer at komponenter bruger korrekte klasser
- **Snapshot Tests**: Verificer at komponenter renderes konsistent
- **Visual Regression Tests**: Verificer at styling er konsistent på tværs af komponenter

## 🔄 FASE 2: STORE INTEGRATION - Teststrategier

### Session 2.1: Store Type Safety Enhancement

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests der verificerer type safety i stores
   - Eksempel: `test('achievementStore should handle null data safely', () => {...})`
   - Skriv tests der verificerer edge cases med null/undefined værdier

2. **🟢 GREEN**:
   - Implementer proper type guards
   - Tilføj null checks
   - Forbedre type definitions

3. **🔵 REFACTOR**:
   - Konsolider type definitions
   - Skab reusable type utilities
   - Sikre konsistent brug af typer

**Testtyper**:
- **Unit Tests**: Verificer at stores håndterer forskellige data typer korrekt
- **Type Tests**: Verificer at TypeScript typer er korrekte og robuste
- **Edge Case Tests**: Verificer håndtering af null, undefined, og uventet data

### Session 2.2-2.4: Component Store Integration

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests der verificerer integration mellem komponenter og stores
   - Eksempel: `test('AchievementsList should display loading state when data is loading', () => {...})`
   - Skriv tests der verificerer error handling og edge cases

2. **🟢 GREEN**:
   - Implementer loading states
   - Tilføj error handling
   - Forbedre data flow mellem komponenter og stores

3. **🔵 REFACTOR**:
   - Konsolider data fetching logik
   - Skab reusable hooks for store integration
   - Sikre konsistent error handling

**Testtyper**:
- **Unit Tests**: Verificer at komponenter renderes korrekt med forskellige store states
- **Integration Tests**: Verificer at komponenter og stores interagerer korrekt
- **Mock Tests**: Mock store data for at teste forskellige scenarier

### Session 2.5: Mock Implementation Replacement

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests der verificerer rigtig funktionalitet i stedet for mocks
   - Eksempel: `test('examStore should calculate streak correctly', () => {...})`
   - Skriv tests der verificerer data flow gennem applikationen

2. **🟢 GREEN**:
   - Erstat mock implementationer med rigtig funktionalitet
   - Implementer korrekt data flow
   - Sikre konsistent data håndtering

3. **🔵 REFACTOR**:
   - Konsolider business logic
   - Skab reusable utilities
   - Sikre separation of concerns

**Testtyper**:
- **Unit Tests**: Verificer at individuelle funktioner fungerer korrekt
- **Integration Tests**: Verificer at data flow fungerer gennem applikationen
- **End-to-End Tests**: Verificer at hele brugerflows fungerer korrekt

### Session 2.6: Store Error Handling

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests der verificerer error handling i stores
   - Eksempel: `test('examStore should handle API errors gracefully', () => {...})`
   - Skriv tests der verificerer recovery fra errors

2. **🟢 GREEN**:
   - Implementer error states i stores
   - Tilføj error handling for async operationer
   - Implementer error recovery mekanismer

3. **🔵 REFACTOR**:
   - Konsolider error handling logik
   - Skab reusable error utilities
   - Sikre konsistent error reporting

**Testtyper**:
- **Unit Tests**: Verificer at stores håndterer errors korrekt
- **Mock Tests**: Mock API errors for at teste error handling
- **Integration Tests**: Verificer at error states propageres korrekt til UI

## 🛡️ FASE 3: VALIDATION & ERROR HANDLING - Teststrategier

### Session 3.1: Input Validation Framework

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests for validation utilities
   - Eksempel: `test('validateEmail should reject invalid email formats', () => {...})`
   - Skriv tests for validation hooks

2. **🟢 GREEN**:
   - Implementer validation utilities
   - Skab reusable validation hooks
   - Definer standard validation patterns

3. **🔵 REFACTOR**:
   - Konsolider validation logik
   - Optimér validation performance
   - Sikre konsistent validation API

**Testtyper**:
- **Unit Tests**: Verificer at validation functions fungerer korrekt
- **Property Tests**: Test validation med mange forskellige inputs
- **Hook Tests**: Verificer at validation hooks fungerer korrekt

### Session 3.2: Form Validation Implementation

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests for form validation
   - Eksempel: `test('StudyCalendar form should validate date inputs', () => {...})`
   - Skriv tests for error messages

2. **🟢 GREEN**:
   - Implementer form validation
   - Tilføj error messaging
   - Sikre konsistent validation UX

3. **🔵 REFACTOR**:
   - Konsolider form validation logik
   - Skab reusable form components
   - Sikre konsistent form UX

**Testtyper**:
- **Unit Tests**: Verificer at form validation fungerer korrekt
- **Integration Tests**: Verificer at forms interagerer korrekt med validation
- **UI Tests**: Verificer at error messages vises korrekt

### Session 3.3-3.6: Data Validation & Error UI

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests for data validation og error UI
   - Eksempel: `test('ErrorBoundary should catch and display component errors', () => {...})`
   - Skriv tests for recovery flows

2. **🟢 GREEN**:
   - Implementer data validation
   - Skab error UI komponenter
   - Implementer recovery mekanismer

3. **🔵 REFACTOR**:
   - Konsolider error handling
   - Skab reusable error patterns
   - Sikre konsistent error UX

**Testtyper**:
- **Unit Tests**: Verificer at error komponenter fungerer korrekt
- **Integration Tests**: Verificer at error states propageres korrekt
- **UI Tests**: Verificer at error UI er brugervenlig og informativ
- **Accessibility Tests**: Verificer at error messages er tilgængelige

## 🎨 FASE 4: UX & ACCESSIBILITY - Teststrategier

### Session 4.1: Accessibility Audit

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests der verificerer accessibility compliance
   - Eksempel: `test('Button should have proper ARIA attributes', () => {...})`
   - Skriv tests for keyboard navigation

2. **🟢 GREEN**:
   - Implementer accessibility fixes
   - Tilføj ARIA attributes
   - Forbedre keyboard support

3. **🔵 REFACTOR**:
   - Konsolider accessibility patterns
   - Skab reusable accessible komponenter
   - Sikre konsistent accessibility

**Testtyper**:
- **Accessibility Tests**: Verificer WCAG compliance
- **Keyboard Tests**: Verificer keyboard navigation
- **Screen Reader Tests**: Verificer screen reader compatibility

### Session 4.2-4.6: UX Enhancements

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests for UX forbedringer
   - Eksempel: `test('Card should have flip animation', () => {...})`
   - Skriv tests for interaktioner og feedback

2. **🟢 GREEN**:
   - Implementer animations og interaktioner
   - Tilføj tooltips og feedback
   - Forbedre icon system

3. **🔵 REFACTOR**:
   - Konsolider animation logik
   - Skab reusable interaction patterns
   - Sikre konsistent UX

**Testtyper**:
- **Unit Tests**: Verificer at komponenter har korrekte props og states
- **Animation Tests**: Verificer at animations fungerer korrekt
- **Interaction Tests**: Verificer at user interactions fungerer som forventet
- **Accessibility Tests**: Verificer at animations og interaktioner er tilgængelige

## 🚀 FASE 5: PERFORMANCE & LOCALIZATION - Teststrategier

### Session 5.1-5.3: Performance Optimization

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests der verificerer performance forbedringer
   - Eksempel: `test('shuffle algorithm should be efficient with large arrays', () => {...})`
   - Skriv tests for optimerede algoritmer

2. **🟢 GREEN**:
   - Optimér algoritmer
   - Fjern duplikeret kode
   - Forbedre performance

3. **🔵 REFACTOR**:
   - Konsolider optimeret kode
   - Skab reusable performance patterns
   - Sikre konsistent performance

**Testtyper**:
- **Performance Tests**: Mål og verificer performance forbedringer
- **Benchmark Tests**: Sammenlign performance før og efter optimering
- **Load Tests**: Verificer performance under load

### Session 5.4-5.6: Localization

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests for lokalisering
   - Eksempel: `test('Calendar should display Danish weekdays', () => {...})`
   - Skriv tests for lokaliserede formater

2. **🟢 GREEN**:
   - Implementer i18n framework
   - Tilføj danske oversættelser
   - Implementer lokaliserede formater

3. **🔵 REFACTOR**:
   - Konsolider lokaliserings logik
   - Skab reusable i18n patterns
   - Sikre konsistent lokalisering

**Testtyper**:
- **Unit Tests**: Verificer at tekster er korrekt lokaliseret
- **Integration Tests**: Verificer at lokalisering fungerer på tværs af applikationen
- **Format Tests**: Verificer at datoer, tal, etc. formateres korrekt

## 🧹 FASE 6: CODE QUALITY & ORGANIZATION - Teststrategier

### Session 6.1-6.3: Code Cleanup & Documentation

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv tests der verificerer at applikationen fungerer efter cleanup
   - Eksempel: `test('App should function correctly after code cleanup', () => {...})`
   - Verificer at dokumentation er korrekt

2. **🟢 GREEN**:
   - Fjern development comments og console logs
   - Reorganiser komponenter
   - Tilføj dokumentation

3. **🔵 REFACTOR**:
   - Sikre konsistent kode stil
   - Forbedre navngivning
   - Optimér imports

**Testtyper**:
- **Lint Tests**: Verificer at koden følger style guidelines
- **Documentation Tests**: Verificer at JSDoc er korrekt
- **Import Tests**: Verificer at imports er optimale

### Session 6.4: Final Integration Testing

**TDD Tilgang**:
1. **🔴 RED**:
   - Skriv end-to-end tests for hele applikationen
   - Eksempel: `test('User can complete full study session flow', () => {...})`
   - Skriv tests for key user journeys

2. **🟢 GREEN**:
   - Løs eventuelle integration issues
   - Sikre at alle flows fungerer end-to-end
   - Verificer at applikationen er produktionsklar

3. **🔵 REFACTOR**:
   - Optimér end-to-end flows
   - Forbedre user journeys
   - Sikre konsistent brugeroplevelse

**Testtyper**:
- **End-to-End Tests**: Verificer at hele applikationen fungerer korrekt
- **User Journey Tests**: Verificer at key user flows fungerer som forventet
- **Cross-Browser Tests**: Verificer kompatibilitet på tværs af browsere

## 📊 Test Coverage Mål

For hver fase har vi følgende test coverage mål:

| Fase | Unit Tests | Integration Tests | UI/E2E Tests | Accessibility Tests |
|------|------------|-------------------|--------------|---------------------|
| 1    | 90%+       | 70%+              | 50%+         | 70%+                |
| 2    | 90%+       | 80%+              | 60%+         | 70%+                |
| 3    | 90%+       | 80%+              | 70%+         | 80%+                |
| 4    | 90%+       | 80%+              | 80%+         | 90%+                |
| 5    | 90%+       | 80%+              | 80%+         | 90%+                |
| 6    | 95%+       | 85%+              | 85%+         | 95%+                |

## 🧪 Test Implementeringsguide

For at sikre konsistent test implementering på tværs af projektet, følg disse guidelines:

### Unit Tests
```typescript
// Eksempel på unit test for en komponent
import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/Button';

describe('Button Component', () => {
  // 🔴 RED: Test at knappen renderes med korrekt styling
  it('should render with gamified styling when variant is "gamified"', () => {
    render(<Button variant="gamified" data-testid="test-button">Test</Button>);
    const button = screen.getByTestId('test-button');
    
    // Verificer at knappen har den korrekte klasse
    expect(button).toHaveClass('btn-gamified-primary');
  });
  
  // 🔴 RED: Test at knappen håndterer click events
  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    // Simuler klik på knappen
    screen.getByText('Click Me').click();
    
    // Verificer at click handler blev kaldt
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests
```typescript
// Eksempel på integration test for en komponent med store
import { render, screen, act } from '@testing-library/react';
import { AchievementsList } from '../components/AchievementsList';
import { useAchievementStore } from '../stores/achievementStore';

// Mock store
vi.mock('../stores/achievementStore', () => ({
  useAchievementStore: vi.fn()
}));

describe('AchievementsList Integration', () => {
  // 🔴 RED: Test at komponenten viser loading state
  it('should show loading state when achievements are loading', () => {
    // Mock store state
    (useAchievementStore as jest.Mock).mockReturnValue({
      achievements: [],
      isLoading: true,
      error: null
    });
    
    render(<AchievementsList />);
    
    // Verificer at loading state vises
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
  
  // 🔴 RED: Test at komponenten viser achievements
  it('should display achievements when loaded', () => {
    // Mock store state
    (useAchievementStore as jest.Mock).mockReturnValue({
      achievements: [
        { id: '1', title: 'Test Achievement', unlocked: true },
        { id: '2', title: 'Locked Achievement', unlocked: false }
      ],
      isLoading: false,
      error: null
    });
    
    render(<AchievementsList />);
    
    // Verificer at achievements vises
    expect(screen.getByText('Test Achievement')).toBeInTheDocument();
    expect(screen.getByText('Locked Achievement')).toBeInTheDocument();
  });
});
```

### UI/E2E Tests
```typescript
// Eksempel på E2E test med Playwright
import { test, expect } from '@playwright/test';

test.describe('Study Flow', () => {
  // 🔴 RED: Test at brugeren kan gennemføre et study flow
  test('user can complete a study session', async ({ page }) => {
    // Naviger til study page
    await page.goto('/study');
    
    // Vælg et emne
    await page.click('[data-testid="subject-card-math"]');
    
    // Start en study session
    await page.click('[data-testid="start-session-button"]');
    
    // Gennemfør sessionen
    await page.click('[data-testid="next-button"]');
    await page.click('[data-testid="next-button"]');
    await page.click('[data-testid="complete-button"]');
    
    // Verificer at sessionen er gennemført
    await expect(page.locator('[data-testid="session-completed"]')).toBeVisible();
  });
});
```

### Accessibility Tests
```typescript
// Eksempel på accessibility test
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../components/ui/Button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  // 🔴 RED: Test at knappen er accessible
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <Button aria-label="Accessible Button">Click Me</Button>
    );
    
    // Kør axe på komponenten
    const results = await axe(container);
    
    // Verificer at der ikke er accessibility violations
    expect(results).toHaveNoViolations();
  });
});
```

## 🔄 Kontinuerlig Integration

For at sikre at tests køres konsistent gennem hele udviklingen, skal følgende kommandoer køres regelmæssigt:

```bash
# Kør alle unit og integration tests
npm test -- --run

# Kør E2E tests
npm run test:e2e

# Kør tests med coverage
npm run test:coverage

# Opdater TDD kontekst
python3 TDD-ContextSysten/newtdd.py "session_id" "description of what you just did"
```

## 📝 Konklusion

Ved at følge disse TDD-teststrategier for hver fase i vores refaktoreringsplan, sikrer vi:

1. **Høj Kvalitet**: Alle ændringer er dækket af tests
2. **Robusthed**: Edge cases og fejlscenarier er håndteret
3. **Vedligeholdbarhed**: Koden er velstruktureret og veldokumenteret
4. **Kontinuitet**: TDD-kontekst er opdateret gennem hele processen

Denne tilgang vil hjælpe os med at systematisk adressere alle de identificerede problemer, samtidig med at vi opretholder og forbedrer kodekvaliteten gennem hele projektet.