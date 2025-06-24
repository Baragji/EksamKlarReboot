# Prioriteret Problemliste for ExamKlar TDD Projekt

Dette dokument indeholder en prioriteret liste over problemer identificeret i ExamKlar TDD projektet, kategoriseret efter kritikalitet, afhængigheder og implementeringskompleksitet. Problemerne er grupperet for at muliggøre atomiske løsninger.

## 1. Kritiske Problemer (Høj Prioritet)

### 1.1 Dependency Management
- **P1-001**: Package.json indeholder fremtidige versioner af React (v19.1.0), react-router-dom (v7.6.2) og andre pakker der ikke eksisterer endnu
- **P1-002**: Brug af NodeJS.Timeout typer i browser miljø (useRef<NodeJS.Timeout | null>)
- **P1-003**: Manglende eller forældede dependencies for nogle funktioner

### 1.2 Designsystem Integration
- **P1-004**: Mange komponenter refererer til CSS klasser der ikke eksisterer (f.eks. achievement-item, achievement-unlocked)
- **P1-005**: Manglende integration med det eksisterende gamified-design-system.css og kahoot-design-system.css
- **P1-006**: Inkonsistent brug af styling (både className og variant props på Button)

### 1.3 Store Integration
- **P1-007**: Manglende integration mellem komponenter og stores
- **P1-008**: Mock implementationer med hardcoded data i stedet for rigtig funktionalitet
- **P1-009**: Manglende type safety for store data (antager string keys uden type check)

## 2. Høj Prioritet (Funktionelle Problemer)

### 2.1 Fejlhåndtering og Loading States
- **P2-001**: Inkonsistent fejlhåndtering (nogle steder bruges `alert()`, andre steder custom UI)
- **P2-002**: Manglende loading states for async operationer
- **P2-003**: Manglende error handling for store operationer
- **P2-004**: Manglende error handling for API kald og data fetching

### 2.2 Validering og Type Safety
- **P2-005**: Manglende input validering og type checking
- **P2-006**: Manglende null checks for optionelle properties
- **P2-007**: Usikre type assertions og type casts
- **P2-008**: Manglende schema validation for imported data

### 2.3 Hardcoded Data
- **P2-009**: Hardcoded subjects array i stedet for at bruge data fra store
- **P2-010**: Hardcoded default values uden konfiguration
- **P2-011**: Hardcoded mock data for resource loading og analytics
- **P2-012**: Hardcoded engelske dage og måneder i stedet for lokaliserede værdier

## 3. Medium Prioritet (UX og Optimering)

### 3.1 Accessibility
- **P3-001**: Manglende focus traps for modals
- **P3-002**: Manglende escape key handlers for modals
- **P3-003**: Manglende screen reader accessible text for chart data
- **P3-004**: Brug af Unicode characters og emojis i stedet for proper icons

### 3.2 Animations og Interaktioner
- **P3-005**: Manglende eller basic animations (f.eks. card flip animation)
- **P3-006**: Manglende interaktivitet (f.eks. click på chart element for detaljer)
- **P3-007**: Manglende tooltips med mere detaljeret information
- **P3-008**: Manglende micro-interactions og feedback

### 3.3 Performance Optimering
- **P3-009**: Ineffektiv shuffle algoritme (Math.random() - 0.5)
- **P3-010**: Duplikeret filtering logik
- **P3-011**: Duplikeret score calculation
- **P3-012**: Duplikeret cleanup logik

## 4. Lav Prioritet (Forbedringer)

### 4.1 Lokalisering
- **P4-001**: Engelske labels og tekster i stedet for dansk
- **P4-002**: Hardcoded locale 'en-US' i stedet for dansk ('da-DK')
- **P4-003**: Engelske headers og beskrivelser i stedet for dansk
- **P4-004**: Engelske weekday headers på engelsk i stedet for dansk

### 4.2 Code Quality
- **P4-005**: Development comments i kodebasen
- **P4-006**: Console.log statements i production code
- **P4-007**: Inkonsistent brug af semicolons (;)
- **P4-008**: Import af React placeret midt i filen i stedet for i toppen

### 4.3 Mappestruktur og Organisation
- **P4-009**: Manglende konsistent mappestruktur for komponenter
- **P4-010**: Manglende separation af concerns i nogle komponenter
- **P4-011**: Manglende dokumentation for komponenter og funktioner
- **P4-012**: Manglende konsistent navngivning af filer og komponenter

## Afhængighedsmatrix

Følgende matrix viser afhængigheder mellem problemkategorier, hvor løsning af én kategori kan påvirke eller være afhængig af en anden:

| Kategori | Afhængig af |
|----------|-------------|
| 1.1 Dependency Management | Ingen |
| 1.2 Designsystem Integration | 1.1 |
| 1.3 Store Integration | 1.1 |
| 2.1 Fejlhåndtering og Loading States | 1.2, 1.3 |
| 2.2 Validering og Type Safety | 1.1, 1.3 |
| 2.3 Hardcoded Data | 1.3 |
| 3.1 Accessibility | 1.2 |
| 3.2 Animations og Interaktioner | 1.2 |
| 3.3 Performance Optimering | 1.3, 2.2 |
| 4.1 Lokalisering | 1.2, 1.3 |
| 4.2 Code Quality | Ingen |
| 4.3 Mappestruktur og Organisation | Ingen |

## Implementeringskompleksitet

Følgende tabel viser den estimerede implementeringskompleksitet for hver problemkategori:

| Kategori | Kompleksitet | Estimeret Tid |
|----------|--------------|---------------|
| 1.1 Dependency Management | Medium | 2-4 timer |
| 1.2 Designsystem Integration | Høj | 8-16 timer |
| 1.3 Store Integration | Høj | 8-16 timer |
| 2.1 Fejlhåndtering og Loading States | Medium | 4-8 timer |
| 2.2 Validering og Type Safety | Medium | 4-8 timer |
| 2.3 Hardcoded Data | Lav | 2-4 timer |
| 3.1 Accessibility | Medium | 4-8 timer |
| 3.2 Animations og Interaktioner | Medium | 4-8 timer |
| 3.3 Performance Optimering | Lav | 2-4 timer |
| 4.1 Lokalisering | Medium | 4-8 timer |
| 4.2 Code Quality | Lav | 1-2 timer |
| 4.3 Mappestruktur og Organisation | Medium | 4-8 timer |

## Foreslået Løsningsrækkefølge

Baseret på kritikalitet, afhængigheder og implementeringskompleksitet foreslås følgende løsningsrækkefølge:

1. Dependency Management (1.1)
2. Designsystem Integration (1.2)
3. Store Integration (1.3)
4. Validering og Type Safety (2.2)
5. Fejlhåndtering og Loading States (2.1)
6. Hardcoded Data (2.3)
7. Accessibility (3.1)
8. Performance Optimering (3.3)
9. Animations og Interaktioner (3.2)
10. Lokalisering (4.1)
11. Mappestruktur og Organisation (4.3)
12. Code Quality (4.2)

Denne rækkefølge sikrer at de mest kritiske problemer løses først, og at afhængigheder respekteres, samtidig med at implementeringskompleksiteten tages i betragtning.