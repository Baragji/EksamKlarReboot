# EXAMKLAR TDD MASTERPLAN V5 - Fuld Feature Realisering

## 🎯 Vision: Den Ultimative Fusion
Mål: At fusionere den tekniske stabilitet og kvalitetssikring fra vores nuværende TDD-kodebase med den fulde vision og alle de avancerede "wow"-funktioner fra det oprindelige Vanilla JS-projekt. Resultatet bliver en robust, engagerende og komplet læringsplatform.

📊 Nuværende Status (Startpunkt for V5)
Fundament: ✅ Solidt. Vi har en React TDD-kodebase med 100% testdækning for de implementerede UI-komponenter og et centraliseret, "gamified" design-system.

Mangler: ❌ Kritisk. Næsten alle de avancerede funktioner, der skabte "wow"-faktoren (AI, PWA, gamification-mekanik, avancerede værktøjer), er endnu ikke implementeret.

Reference: Wow-Faktor Analysen giver en komplet liste over, hvad der mangler.

🧪 TDD Context System (Vores Lov)
Denne plan følger vores etablerede TDD-metodologi. Hver ny funktion skal implementeres via Red-Green-Refactor cyklussen, og konteksten skal opdateres efter hver handling.

# Efter HVER handling (teste, skrive kode, refaktorere):
python3 tdd.py "Kort, præcis beskrivelse af handlingen"

🚀 Implementeringsplan: Fra Fundament til Fuldendt App
Her er faserne, der vil tage os fra vores nuværende tilstand til den færdige vision.

Fase 1: Gamification & Engagement Engine (Uge 1)

Mål: At implementere de kerne-gamification elementer, der motiverer brugeren til daglig læring.

Dag 1-2: Streak Counter

🔴 RED: Skriv tests til examStore.ts, der fejler, fordi der mangler state og logik for at spore en "learning streak". Test for at kunne starte, forlænge og nulstille en streak.

🟢 GREEN: Implementer streakCount, longestStreak og lastActivityDate i examStore. Tilføj logik, der opdaterer streaken baseret på daglig aktivitet.

🔴 RED: Skriv en test til StudyProgressDashboard.tsx, der fejler, fordi den ikke kan vise streak-data.

🟢 GREEN: Implementer UI i StudyProgressDashboard til at vise den nuværende streak med en motiverende besked (f.eks. "🔥 5 dage i træk!").

📝 UPDATE CONTEXT: python3 tdd.py "Implemented Streak Counter logic and UI"

Dag 3-5: Achievement System

🔴 RED: Skriv tests til en ny achievementStore.ts. Test for at kunne definere achievements (f.eks. "Læst 10 sider") og for at kunne låse dem op.

🟢 GREEN: Implementer achievementStore.ts med en liste af achievements og en unlockedAchievements state.

🔴 RED: Skriv tests, der integrerer med andre stores. F.eks., når progress.sessionsCompleted i examStore når et bestemt tal, skal et achievement låses op i achievementStore.

🟢 GREEN: Implementer "listeners" eller afledt logik, der tildeler achievements baseret på brugerens fremskridt.

📝 UPDATE CONTEXT: python3 tdd.py "Implemented Achievement System backend logic"

Dag 6-7: UI for Achievements

🔴 RED: Skriv en test for en ny <AchievementsList /> komponent, der skal vise både oplåste og låste achievements.

🟢 GREEN: Implementer komponenten, der viser achievements med ikoner og beskrivelser.

📝 UPDATE CONTEXT: python3 tdd.py "Created UI for Achievement System"

Fase 2: Intelligent Onboarding & PWA (Uge 2)

Mål: At skabe en intelligent, app-lignende startoplevelse.

Dag 1-3: DataBridge - Automatisk Indholdsgenerering

🔴 RED: Skriv en test til OnboardingPage.tsx, der fejler, fordi den ikke automatisk genererer en fuld læringsplan ved afslutning.

🟢 GREEN: Udvid examStore eller lav en ny dataBridge.ts utility, der implementerer logikken fra det gamle Vanilla JS-projekt: Generer en struktureret læringsplan, sample flashcards og quizzer baseret på brugerens emne og tidsramme.

🔴 RED: Skriv en test til den animerede "AI tænker"-sekvens.

🟢 GREEN: Implementer UI for "AI tænker"-sekvensen i OnboardingPage.tsx for at give en mere engagerende oplevelse.

📝 UPDATE CONTEXT: python3 tdd.py "Implemented DataBridge for intelligent onboarding"

Dag 4-7: PWA & Mobiloplevelse

🔴 RED: Skriv en test i deployment.test.ts, der fejler, fordi der ikke findes en service-worker.js fil, og PWA-manifestet ikke er fuldt konfigureret.

🟢 GREEN: Opsæt vite-plugin-pwa (eller lignende) i vite.config.ts til automatisk at generere en Service Worker og opdatere manifestet. Konfigurer offline caching-strategier.

🔴 RED: Skriv tests (f.eks. med Playwright) for swipe-navigation og haptisk feedback.

🟢 GREEN: Implementer swipe-navigation mellem hovedsiderne ved hjælp af f.eks. Framer Motion. Implementer kald til navigator.vibrate() på vigtige handlinger (som at gennemføre en quiz).

📝 UPDATE CONTEXT: python3 tdd.py "PWA and mobile gesture features implemented"

Fase 3: Avancerede Værktøjer (Uge 3)

Mål: At give brugeren fuld kontrol over deres data og indhold.

Dag 1-3: Data Eksport/Import

🔴 RED: Skriv en test til en <SettingsPage />, der fejler, fordi knapper til eksport/import mangler.

🟢 GREEN: Implementer UI-knapperne.

🔴 RED: Skriv unit-tests til utility-funktioner i examStore, der kan serialisere hele app-tilstanden til JSON (eksport) og deserialisere den igen (import).

🟢 GREEN: Implementer exportState() og importState() i examStore. Forbind dem til UI-knapperne.

📝 UPDATE CONTEXT: python3 tdd.py "Implemented Data Export/Import functionality"

Dag 4-7: Global Søgning & Dark Mode

🔴 RED: Skriv en test til en global søgekomponent, der skal kunne finde resultater på tværs af flashcards og quizzer.

🟢 GREEN: Implementer en søgefunktion i flashcardStore.ts og en (endnu ikke-eksisterende) quizStore.ts. Opret en <GlobalSearch /> komponent, der bruger disse funktioner.

🔴 RED: Skriv en test, der tjekker, om appen kan skifte tema.

🟢 GREEN: Implementer en themeStore.ts (eller lignende) og opdater Layout.tsx og CSS'en til at understøtte dynamisk skift mellem lys og mørk tilstand.

📝 UPDATE CONTEXT: python3 tdd.py "Global Search and Dark Mode implemented"

Fase 4: AI Assistent (Uge 4)

Mål: At genimplementere den fulde AI-assistent.

🔴 RED: Skriv tests for en aiStore.ts, der skal håndtere chat-historik og API-kald.

🟢 GREEN: Implementer aiStore.ts.

🔴 RED: Skriv tests for en <ChatInterface /> komponent.

🟢 GREEN: Implementer chat-komponenten.

🔴 RED: Skriv tests for fallback-systemet.

🟢 GREEN: Implementer fallback-logikken, der giver foruddefinerede svar, hvis API-kald fejler.

📝 UPDATE CONTEXT: python3 tdd.py "AI Assistant feature fully implemented"