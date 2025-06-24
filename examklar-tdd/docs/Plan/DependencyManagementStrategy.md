# Dependency Management Strategi

Dette dokument indeholder en detaljeret plan for at håndtere package.json problemer med fremtidige versioner, og definerer en strategi for at sikre kompatible og stabile dependencies i ExamKlar TDD projektet.

## 1. Nuværende Status

ExamKlar TDD projektet bruger en række moderne JavaScript/TypeScript biblioteker, herunder:

- **React 19.1.0** - Frontend framework
- **Zustand 5.0.5** - State management
- **Chart.js 4.5.0** - Data visualisering
- **Framer Motion 12.18.1** - Animationer
- **React Router 7.6.2** - Routing
- **Vite 6.3.5** - Build tool
- **TypeScript 5.8.3** - Type system
- **Vitest 3.2.4** - Testing framework
- **Playwright 1.53.1** - E2E testing
- **Tailwind CSS 3.4.17** - Styling

Projektet bruger caret versioner (`^`) for alle dependencies, hvilket betyder at det automatisk vil acceptere minor og patch opdateringer, men ikke major opdateringer.

## 2. Identificerede Problemer

Baseret på vores audit har vi identificeret følgende problemer med dependency management:

1. **Fremtidige Versioner**: Projektet bruger meget nye versioner af biblioteker (f.eks. React 19, Vite 6), hvilket kan føre til kompatibilitetsproblemer og manglende dokumentation
2. **Inkonsistent Versionering**: Nogle dependencies bruger caret versioner (`^`), hvilket kan føre til uventede opdateringer
3. **Manglende Peer Dependencies**: Nogle biblioteker har peer dependencies der ikke er eksplicit defineret
4. **Browser Kompatibilitet**: Nogle dependencies kan have problemer med browser kompatibilitet
5. **Manglende Dependency Locking**: Projektet mangler en lock-fil til at sikre konsistente installationer

## 3. Dependency Management Strategi

### 3.1 Versioneringsstrategi

Vi vil implementere følgende versioneringsstrategi:

1. **Stabile Versioner**: Brug stabile versioner af kritiske dependencies i stedet for bleeding edge versioner
2. **Eksakte Versioner**: Brug eksakte versioner (`18.2.0` i stedet for `^18.2.0`) for kritiske dependencies
3. **Caret Versioner**: Brug caret versioner (`^`) for ikke-kritiske dependencies for at få sikkerhedsopdateringer
4. **Dependency Locking**: Brug en lock-fil (package-lock.json eller yarn.lock) til at sikre konsistente installationer

### 3.2 Dependency Kategorisering

Vi vil kategorisere dependencies baseret på deres kritikalitet:

#### Kritiske Dependencies (Eksakte Versioner)

- **React & React DOM**: Core rendering engine
- **Zustand**: State management
- **React Router**: Routing
- **TypeScript**: Type system

#### Vigtige Dependencies (Caret Versioner med Upper Bound)

- **Chart.js & React-Chartjs-2**: Data visualisering
- **Framer Motion**: Animationer
- **Headless UI**: Accessible UI komponenter
- **Heroicons**: Ikoner

#### Støttende Dependencies (Caret Versioner)

- **Tailwind CSS**: Styling
- **Vite**: Build tool
- **ESLint**: Linting
- **Vitest**: Testing
- **Playwright**: E2E testing

### 3.3 Opdateret package.json

Baseret på vores strategi, vil vi opdatere package.json til følgende:

```json
{
  "name": "examklar-tdd",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "deps:check": "npm-check-updates",
    "deps:update": "npm-check-updates -u && npm install",
    "deps:audit": "npm audit"
  },
  "dependencies": {
    "@headlessui/react": "2.0.0",
    "@heroicons/react": "^2.0.18",
    "chart.js": "^4.4.0",
    "framer-motion": "^10.16.4",
    "react": "18.2.0",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "18.2.0",
    "react-router-dom": "6.18.0",
    "zustand": "4.4.6"
  },
  "devDependencies": {
    "@eslint/js": "^8.53.0",
    "@playwright/test": "^1.40.0",
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^14.1.0",
    "@testing-library/user-event": "^14.5.1",
    "@types/node": "^20.9.0",
    "@types/react": "18.2.37",
    "@types/react-dom": "18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.1",
    "@vitest/coverage-v8": "^0.34.6",
    "autoprefixer": "^10.4.16",
    "canvas": "^2.11.2",
    "class-variance-authority": "^0.7.0",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "globals": "^13.23.0",
    "jsdom": "^22.1.0",
    "npm-check-updates": "^16.14.6",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "5.2.2",
    "typescript-eslint": "^0.0.1-alpha.0",
    "vite": "^5.0.0",
    "vite-plugin-pwa": "^0.16.7",
    "vitest": "^0.34.6"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not op_mini all",
    "not IE 11"
  ]
}
```

### 3.4 Dependency Locking

Vi vil implementere dependency locking ved at:

1. Generere en lock-fil (package-lock.json) ved at køre `npm install`
2. Committe lock-filen til version control
3. Sikre at CI/CD bruger lock-filen ved at køre `npm ci` i stedet for `npm install`

## 4. Browser Kompatibilitet

For at sikre browser kompatibilitet vil vi:

1. Tilføje en `browserslist` konfiguration til package.json
2. Bruge Babel og autoprefixer til at sikre kompatibilitet med ældre browsere
3. Teste applikationen i forskellige browsere (Chrome, Firefox, Safari, Edge)

## 5. Dependency Audit og Opdatering

Vi vil implementere følgende processer for dependency audit og opdatering:

### 5.1 Regelmæssig Audit

1. Kør `npm audit` regelmæssigt (f.eks. ugentligt) for at identificere sikkerhedsproblemer
2. Kør `npm outdated` regelmæssigt for at identificere forældede dependencies
3. Brug GitHub Dependabot eller lignende værktøjer til automatisk at identificere sikkerhedsproblemer

### 5.2 Opdateringsproces

1. **Kritiske Dependencies**: Opdater kun efter grundig test og verifikation
2. **Vigtige Dependencies**: Opdater regelmæssigt (f.eks. månedligt) efter test
3. **Støttende Dependencies**: Opdater automatisk for sikkerhedsopdateringer

### 5.3 Opdateringsworkflow

For hver dependency opdatering:

1. Opret en separat branch for opdateringen
2. Opdater dependencies og kør tests
3. Hvis tests fejler, fix problemer eller revert opdateringen
4. Hvis tests består, merge opdateringen til main branch

## 6. Dependency Dokumentation

Vi vil forbedre dependency dokumentation ved at:

1. Tilføje en `DEPENDENCIES.md` fil der beskriver hver dependency og dens formål
2. Dokumentere kendte problemer og workarounds for hver dependency
3. Dokumentere beslutninger om dependency versioner og opdateringer

Eksempel på `DEPENDENCIES.md`:

```markdown
# Dependencies

## Core Dependencies

### React (18.2.0)
- **Formål**: Frontend framework
- **Beslutning**: Bruger stabil version 18.2.0 i stedet for nyere React 19 for at sikre kompatibilitet
- **Kendte Problemer**: Ingen

### Zustand (4.4.6)
- **Formål**: State management
- **Beslutning**: Bruger stabil version 4.4.6 i stedet for nyere Zustand 5 for at sikre kompatibilitet
- **Kendte Problemer**: Ingen

## UI Dependencies

### Framer Motion (^10.16.4)
- **Formål**: Animationer
- **Beslutning**: Bruger caret version for at få minor opdateringer
- **Kendte Problemer**: Kan påvirke performance på ældre enheder

...
```

## 7. Dependency Isolation

For at reducere risikoen for dependency problemer vil vi:

1. Isolere dependencies ved at bruge abstraktion layers
2. Skabe wrapper komponenter for tredjepartsbiblioteker
3. Centralisere import af tredjepartsbiblioteker

Eksempel på dependency isolation:

```tsx
// src/lib/chart.ts - Centraliseret import og konfiguration
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, /* ... */ } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, /* ... */);

// Re-export med vores konfiguration
export { Bar, Pie, Line };
export type { ChartData, ChartOptions } from 'chart.js';

// Wrapper komponenter
export const BarChart = (props) => {
  // Vores konfiguration og fejlhåndtering
  return <Bar {...props} />;
};

// src/components/ProgressCharts.tsx - Brug vores wrapper
import { BarChart } from '@/lib/chart';

const ProgressCharts = () => {
  // ...
  return <BarChart data={data} options={options} />;
};
```

## 8. Peer Dependencies

Vi vil håndtere peer dependencies ved at:

1. Eksplicit definere peer dependencies i package.json
2. Sikre at peer dependencies er installeret med korrekte versioner
3. Teste applikationen med forskellige versioner af peer dependencies

## 9. Implementeringsplan

### 9.1 Fase 1: Stabilisering

1. Opdater package.json med stabile versioner af kritiske dependencies
2. Generer lock-fil og commit til version control
3. Kør tests for at sikre at applikationen fungerer med de nye versioner
4. Dokumenter beslutninger i DEPENDENCIES.md

### 9.2 Fase 2: Isolation

1. Skab abstraktion layers for tredjepartsbiblioteker
2. Refaktorer komponenter til at bruge abstraktion layers
3. Centraliser import af tredjepartsbiblioteker
4. Kør tests for at sikre at applikationen fungerer med de nye abstraktioner

### 9.3 Fase 3: Automatisering

1. Tilføj scripts til package.json for dependency audit og opdatering
2. Konfigurer GitHub Dependabot eller lignende værktøjer
3. Implementer CI/CD pipeline for dependency opdateringer
4. Dokumenter opdateringsprocessen

### 9.4 Fase 4: Dokumentation

1. Opret DEPENDENCIES.md med dokumentation for hver dependency
2. Dokumenter kendte problemer og workarounds
3. Dokumenter beslutninger om dependency versioner og opdateringer
4. Opdater README.md med information om dependency management

## 10. Specifikke Dependency Problemer

### 10.1 React 19 til React 18

React 19 er en meget ny version med potentielle kompatibilitetsproblemer. Vi vil:

1. Nedgradere til React 18.2.0 (seneste stabile version)
2. Opdatere relaterede dependencies (react-dom, @types/react, etc.)
3. Teste applikationen grundigt efter nedgradering
4. Dokumentere eventuelle API ændringer og workarounds

### 10.2 Zustand 5 til Zustand 4

Zustand 5 er en nyere version med potentielle kompatibilitetsproblemer. Vi vil:

1. Nedgradere til Zustand 4.4.6 (seneste stabile version)
2. Opdatere store implementationer til at bruge Zustand 4 API
3. Teste stores grundigt efter nedgradering
4. Dokumentere eventuelle API ændringer og workarounds

### 10.3 Vite 6 til Vite 5

Vite 6 er en meget ny version med potentielle kompatibilitetsproblemer. Vi vil:

1. Nedgradere til Vite 5.0.0 (seneste stabile version)
2. Opdatere vite.config.ts til at bruge Vite 5 API
3. Teste build processen grundigt efter nedgradering
4. Dokumentere eventuelle API ændringer og workarounds

## 11. Test Strategi

### 11.1 Dependency Kompatibilitetstest

For hver dependency opdatering, vil vi teste:

1. **Funktionalitet**: Sikre at alle features fungerer som forventet
2. **Performance**: Sikre at performance ikke er påvirket negativt
3. **Browser Kompatibilitet**: Teste i forskellige browsere
4. **Accessibility**: Sikre at accessibility ikke er påvirket negativt

### 11.2 Automatiserede Tests

Vi vil implementere automatiserede tests for dependency kompatibilitet:

```tsx
// Test for React version kompatibilitet
import React from 'react';
import { render } from '@testing-library/react';

describe('React Version Compatibility', () => {
  it('should render components with current React version', () => {
    // Verificer at React version er kompatibel
    expect(React.version).toMatch(/^18\./);
    
    // Test basic rendering
    const { getByText } = render(<div>Test</div>);
    expect(getByText('Test')).toBeInTheDocument();
  });
});

// Test for Zustand version kompatibilitet
import { create } from 'zustand';

describe('Zustand Version Compatibility', () => {
  it('should create and update store with current Zustand version', () => {
    // Opret test store
    const useTestStore = create((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }));
    
    // Test store functionality
    expect(useTestStore.getState().count).toBe(0);
    useTestStore.getState().increment();
    expect(useTestStore.getState().count).toBe(1);
  });
});
```

## 12. Konklusion

Ved at følge denne dependency management strategi vil ExamKlar TDD projektet opnå:

1. **Stabilitet**: Brug af stabile versioner af kritiske dependencies
2. **Kompatibilitet**: Sikring af kompatibilitet mellem dependencies
3. **Sikkerhed**: Regelmæssig audit og opdatering af dependencies
4. **Vedligeholdbarhed**: Bedre dokumentation og isolation af dependencies
5. **Robusthed**: Reduceret risiko for dependency problemer

Implementeringen bør følge TDD-principperne, med tests der verificerer korrekt funktionalitet før og efter dependency ændringer.