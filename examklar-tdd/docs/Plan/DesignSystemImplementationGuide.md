# Design System Implementeringsguide

Dette dokument indeholder en detaljeret plan for implementering af det eksisterende designsystem (gamified og kahoot CSS klasser) i ExamKlar TDD projektet, med fokus på konsistens, tilgængelighed og genbrugbarhed.

## 1. Oversigt

ExamKlar TDD projektet har to eksisterende designsystemer:
1. **Gamified Design System** (`src/styles/gamified-design-system.css`)
2. **Kahoot Design System** (`src/styles/kahoot-design-system.css`)

Problemet er at mange komponenter refererer til CSS klasser der ikke eksisterer (f.eks. `achievement-item`, `achievement-unlocked`), og der er inkonsistent brug af styling på tværs af applikationen.

## 2. Mapping af Manglende CSS Klasser

Følgende tabel viser en mapping mellem de manglende CSS klasser og de tilsvarende klasser i det eksisterende designsystem:

| Manglende CSS Klasse | Designsystem Ækvivalent | Komponent |
|----------------------|-------------------------|-----------|
| `achievement-item` | `card-gamified interactive-gamified` | AchievementsList |
| `achievement-unlocked` | `card-gamified card-success` | AchievementsList |
| `achievement-locked` | `card-gamified card-secondary` | AchievementsList |
| `achievement-icon` | `flex items-center justify-center w-12 h-12 rounded-full bg-gradient-gamified-cool` | AchievementsList |
| `achievement-content` | `flex-1 px-4` | AchievementsList |
| `achievement-name` | `text-gamified-heading text-lg` | AchievementsList |
| `achievement-description` | `text-gamified-body` | AchievementsList |
| `achievement-points` | `text-xs font-gamified-bold text-gamified-blue` | AchievementsList |
| `achievement-status` | `ml-2` | AchievementsList |
| `achievement-badge` | `px-2 py-1 rounded-gamified text-xs font-gamified-medium` | AchievementsList |
| `calendar-date` | `border p-2 min-h-[60px] hover:bg-gamified-gray-50` | StudyCalendar |
| `completed` | `bg-gamified-green-light text-gamified-white` | StudyCalendar |
| `scheduled` | `bg-gamified-blue-light text-gamified-white` | StudyCalendar |
| `progress-charts-container` | `grid gap-6 md:grid-cols-2 lg:grid-cols-3` | ProgressCharts |

## 3. Implementeringsstrategi

### 3.1 Generel Tilgang

1. **Komponent-for-Komponent Refaktorering**:
   - Refaktorer én komponent ad gangen
   - Følg TDD-principperne (Red-Green-Refactor)
   - Verificer at komponenten fungerer korrekt efter refaktorering

2. **Konsistent Navngivning**:
   - Brug enten `gamified-` eller `kahoot-` præfiks konsistent
   - Undgå blanding af de to designsystemer i samme komponent
   - Dokumenter valg af designsystem for hver komponent

3. **Styling Hierarki**:
   - Base styling: Tailwind CSS klasser
   - Designsystem styling: gamified/kahoot klasser
   - Komponent-specifik styling: kun hvis absolut nødvendigt

### 3.2 Implementeringsrækkefølge

Baseret på komponenternes kompleksitet og afhængigheder, anbefales følgende implementeringsrækkefølge:

1. **UI Komponenter** (Button, Card, Input, etc.)
2. **AchievementsList**
3. **StudyCalendar**
4. **ProgressCharts**
5. **Andre komponenter**

## 4. Detaljeret Implementeringsplan

### 4.1 UI Komponenter

#### Button Komponent

```tsx
// Før
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Click Me
</button>

// Efter
<button className="btn-gamified-primary">
  Click Me
</button>
```

**Implementeringsdetaljer**:
- Opdater `Button.tsx` til at bruge designsystem klasser
- Tilføj variant prop til at vælge mellem forskellige button styles
- Implementer size prop til at vælge mellem forskellige størrelser

#### Card Komponent

```tsx
// Før
<div className="bg-white p-6 rounded-lg shadow-sm border">
  {children}
</div>

// Efter
<div className="card-gamified">
  {children}
</div>
```

**Implementeringsdetaljer**:
- Opdater `Card.tsx` til at bruge designsystem klasser
- Tilføj variant prop til at vælge mellem forskellige card styles
- Implementer interactive prop til at tilføje hover effekter

### 4.2 AchievementsList Komponent

**Refaktorering**:

```tsx
// Før
<div className={`achievement-item ${isUnlocked ? 'achievement-unlocked' : 'achievement-locked'}`}>
  {/* ... */}
</div>

// Efter
<div className={`card-gamified interactive-gamified ${isUnlocked ? 'card-success' : 'card-secondary'}`}>
  {/* ... */}
</div>
```

**Implementeringsdetaljer**:
- Opdater `AchievementItem` komponenten til at bruge designsystem klasser
- Erstat alle achievement-relaterede klasser med tilsvarende designsystem klasser
- Sikre konsistent styling på tværs af forskellige states (unlocked, locked)

### 4.3 StudyCalendar Komponent

**Refaktorering**:

```tsx
// Før
<div className={`text-xs p-1 mb-1 rounded cursor-pointer ${
  session.completed ? 'bg-green-100 text-green-800 completed' : 'bg-blue-100 text-blue-800 scheduled'
}`}>
  {session.subjectName}
</div>

// Efter
<div className={`text-xs p-1 mb-1 rounded-gamified cursor-pointer ${
  session.completed ? 'bg-gamified-green-light text-gamified-white' : 'bg-gamified-blue-light text-gamified-white'
}`}>
  {session.subjectName}
</div>
```

**Implementeringsdetaljer**:
- Opdater kalender-relaterede klasser med tilsvarende designsystem klasser
- Sikre konsistent styling af datoer, sessioner og modals
- Implementer proper focus states for accessibility

### 4.4 ProgressCharts Komponent

**Refaktorering**:

```tsx
// Før
<div className="bg-white p-6 rounded-lg shadow-sm border">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Weekly Study Hours</h3>
  {/* ... */}
</div>

// Efter
<div className="card-gamified">
  <h3 className="text-gamified-heading mb-2">Weekly Study Hours</h3>
  {/* ... */}
</div>
```

**Implementeringsdetaljer**:
- Opdater chart container styling til at bruge designsystem klasser
- Tilpas chart farver til at matche designsystemet
- Sikre konsistent typografi og spacing

## 5. CSS Klasse Refaktoreringsguide

### 5.1 Typografi

| Nuværende Klasse | Designsystem Ækvivalent |
|------------------|-------------------------|
| `text-lg font-semibold` | `text-gamified-heading` |
| `text-sm text-gray-600` | `text-gamified-body` |
| `font-medium` | `font-gamified-medium` |
| `font-semibold` | `font-gamified-bold` |

### 5.2 Farver

| Nuværende Klasse | Designsystem Ækvivalent |
|------------------|-------------------------|
| `bg-blue-500` | `bg-gamified-blue` |
| `bg-green-100` | `bg-gamified-green-light` |
| `text-gray-900` | `text-gamified-gray-900` |
| `text-white` | `text-gamified-white` |

### 5.3 Komponenter

| Nuværende Klasse | Designsystem Ækvivalent |
|------------------|-------------------------|
| `bg-white p-6 rounded-lg shadow-sm border` | `card-gamified` |
| `px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600` | `btn-gamified-primary` |
| `px-4 py-2 border rounded hover:bg-gray-50` | `btn-gamified-secondary` |

## 6. Implementering af Konsistente Interaktioner

### 6.1 Hover States

Alle interaktive elementer bør have konsistente hover states:

```css
.interactive-gamified:hover {
  transform: scale(1.02);
}

.btn-gamified-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-gamified-xl);
}
```

### 6.2 Focus States

For at sikre god accessibility, bør alle interaktive elementer have tydelige focus states:

```css
.focus-gamified:focus {
  outline: none;
  ring: 2px;
  ring-color: var(--gamified-blue);
  ring-offset: 2px;
}
```

## 7. Accessibility Forbedringer

### 7.1 Farvekontrast

Sikre at alle farvepar (tekst/baggrund) overholder WCAG 2.1 AA standarder:

| Farvekombination | Kontrastforhold | WCAG AA Compliant |
|------------------|-----------------|-------------------|
| Text-gamified-white på bg-gamified-blue | 4.5:1 | ✅ |
| Text-gamified-body på bg-gamified-white | 4.5:1 | ✅ |
| Text-gamified-heading på bg-gamified-white | 7:1 | ✅ |

### 7.2 Keyboard Navigation

Alle interaktive elementer skal være tilgængelige via keyboard:

```tsx
<button 
  className="btn-gamified-primary"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Handle activation
    }
  }}
>
  Click Me
</button>
```

### 7.3 Screen Reader Support

Alle komponenter skal have korrekte ARIA attributter:

```tsx
<div 
  role="button"
  aria-pressed={isActive}
  aria-label="Toggle feature"
  className="interactive-gamified"
>
  {/* Content */}
</div>
```

## 8. Teststrategier

### 8.1 Visual Regression Tests

For at sikre at designsystem implementeringen ikke bryder eksisterende UI:

```tsx
// Snapshot test
it('should match snapshot', () => {
  const { container } = render(<Button variant="gamified">Click Me</Button>);
  expect(container).toMatchSnapshot();
});
```

### 8.2 Accessibility Tests

For at sikre at komponenter overholder accessibility standarder:

```tsx
// Accessibility test
it('should not have accessibility violations', async () => {
  const { container } = render(<Button variant="gamified">Click Me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 8.3 Responsive Tests

For at sikre at komponenter fungerer på forskellige skærmstørrelser:

```tsx
// Responsive test
it('should render correctly on mobile', () => {
  // Set viewport to mobile size
  window.innerWidth = 375;
  window.innerHeight = 667;
  
  const { container } = render(<Card variant="gamified">Content</Card>);
  expect(container).toMatchSnapshot();
});
```

## 9. Dokumentation

### 9.1 Komponent Dokumentation

Hver komponent bør have følgende dokumentation:

```tsx
/**
 * Button component that follows the gamified design system.
 * 
 * @param variant - The button style variant ('primary', 'secondary', 'success', 'danger')
 * @param size - The button size ('small', 'medium', 'large')
 * @param children - The button content
 * @param props - Additional button props
 * 
 * @example
 * <Button variant="primary" size="medium">Click Me</Button>
 */
export const Button = ({ variant = 'primary', size = 'medium', children, ...props }) => {
  // Implementation
};
```

### 9.2 Designsystem Dokumentation

Opret en central dokumentation for designsystemet:

```md
# Gamified Design System

This document describes the gamified design system used in ExamKlar TDD.

## Colors

- Primary: `var(--gamified-blue)`
- Secondary: `var(--gamified-gray-500)`
- Success: `var(--gamified-green)`
- Danger: `var(--gamified-red)`

## Typography

- Headings: `text-gamified-heading`
- Body: `text-gamified-body`
- Bold: `font-gamified-bold`
- Medium: `font-gamified-medium`

## Components

- Button: `btn-gamified-primary`, `btn-gamified-secondary`, etc.
- Card: `card-gamified`, `card-success`, etc.
- Input: `input-gamified`, `input-gamified-success`, etc.
```

## 10. Implementeringsplan

### 10.1 Fase 1: Forberedelse

1. Gennemgå alle komponenter og identificer manglende CSS klasser
2. Skab en komplet mapping mellem manglende klasser og designsystem ækvivalenter
3. Opret tests for at verificere korrekt styling

### 10.2 Fase 2: UI Komponenter

1. Refaktorer Button komponent
2. Refaktorer Card komponent
3. Refaktorer Input komponent
4. Refaktorer andre UI komponenter

### 10.3 Fase 3: Komplekse Komponenter

1. Refaktorer AchievementsList komponent
2. Refaktorer StudyCalendar komponent
3. Refaktorer ProgressCharts komponent

### 10.4 Fase 4: Integration og Test

1. Kør alle tests for at sikre at komponenter fungerer korrekt
2. Verificer visuelt at alle komponenter ser korrekte ud
3. Kør accessibility tests for at sikre WCAG compliance

## 11. Konklusion

Ved at følge denne implementeringsguide vil ExamKlar TDD projektet opnå:

1. **Konsistent Styling**: Alle komponenter vil bruge det samme designsystem
2. **Forbedret Accessibility**: Komponenter vil overholde WCAG 2.1 AA standarder
3. **Bedre Vedligeholdbarhed**: Centraliseret styling gør fremtidige ændringer nemmere
4. **Øget Genbrugbarhed**: Komponenter kan nemt genbruges på tværs af applikationen

Implementeringen bør følge TDD-principperne, med tests der verificerer korrekt styling og accessibility før implementering af ændringer.