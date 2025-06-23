# EXAMKLAR TDD MASTER PLAN V2 - E2E IMPLEMENTATION PHASE
## 🎯 SINGLE SOURCE OF TRUTH - Updated 2025-06-23

> **CRITICAL**: This Master Plan v2 supersedes all previous plans. It incorporates all learned principles and reflects current project state.

---

## 📊 CURRENT PROJECT STATUS

### ✅ COMPLETED PHASES (1-4 Foundation)
- **Phase 1**: TDD Foundation Setup ✅ (100% complete)
- **Phase 2**: Core Features Implementation ✅ (100% complete)  
- **Phase 3**: Advanced Features ✅ (100% complete)
- **Phase 4**: Quality Assurance & Deployment ✅ (95% complete)
  - Unit/Integration Tests: 253/253 passing ✅
  - Performance Utils: Enhanced ✅
  - Build Utils: Production-ready ✅
  - E2E Test Setup: 30 tests created ✅
  - **CURRENT POSITION**: E2E RED phase complete, ready for GREEN phase

---

## 🧪 PROVEN TDD PRINCIPLES (NEVER CHANGE THESE)

### 1. **ONE SMALL CHANGE AT A TIME**
```bash
# ✅ PROVEN WORKFLOW:
1. Pick ONE failing test
2. Make MINIMAL change to pass it
3. Update context: python3 update_context.py "what you did"
4. Run tests to verify
5. Repeat for NEXT test
```

### 2. **MANDATORY CONTEXT UPDATES**
```bash
# 🚨 AFTER EVERY ACTION:
python3 update_context.py "brief description of change"
```

### 3. **RED-GREEN-REFACTOR CYCLE**
- 🔴 **RED**: Write failing test (DONE for E2E)
- 🟢 **GREEN**: Make test pass with minimal code
- 🔵 **REFACTOR**: Improve code quality while keeping tests green

---

## 🎯 PHASE 5: E2E IMPLEMENTATION (CURRENT PHASE)

### OBJECTIVE: Make E2E tests pass ONE AT A TIME

**Current Status**: 30 E2E tests failing (RED phase complete)
**Goal**: Implement features to make tests pass incrementally

---

## 📋 PHASE 5 DAILY IMPLEMENTATION PLAN

### Day 1: Foundation E2E Fixes (Tests 1-5)

#### 🔴 Test 1: Fix H1 Selector Conflict
**Current Error**: `locator('h1') resolved to 2 elements`
**TDD Task**: 
```bash
# 1. Make test selector more specific
# 2. Update context
# 3. Run ONLY this test: npx playwright test --grep "onboarding flow"
```

#### 🔴 Test 2: Add Welcome Screen Data-TestId
**Current Error**: Missing "Get Started" button
**TDD Task**:
```bash
# 1. Add data-testid="get-started-btn" to OnboardingPage
# 2. Update context
# 3. Run test
```

#### 🔴 Test 3: Add Subject Form Fields
**Current Error**: Missing form field names
**TDD Task**:
```bash
# 1. Add name="subject-name" to input
# 2. Update context  
# 3. Run test
```

#### 🔴 Test 4: Add Subject Selection
**Current Error**: Missing subject selector
**TDD Task**:
```bash
# 1. Add data-testid="subject-selector" 
# 2. Update context
# 3. Run test
```

#### 🔴 Test 5: Add Study Preferences
**Current Error**: Missing study time buttons
**TDD Task**:
```bash
# 1. Add data-testid="study-time-morning"
# 2. Update context
# 3. Run test
```

### Day 2: Flashcard E2E Fixes (Tests 6-10)

#### 🔴 Test 6: Add Deck Creation Button
#### 🔴 Test 7: Add Deck Form Fields  
#### 🔴 Test 8: Add Card Creation Flow
#### 🔴 Test 9: Add Study Session UI
#### 🔴 Test 10: Add Study Progress Display

### Day 3: Quiz E2E Fixes (Tests 11-15)

#### 🔴 Test 11: Add Quiz Subject Selector
#### 🔴 Test 12: Add Quiz Configuration
#### 🔴 Test 13: Add Quiz Question UI
#### 🔴 Test 14: Add Quiz Results
#### 🔴 Test 15: Add Answer Review

### Day 4: Analytics E2E Fixes (Tests 16-20)

#### 🔴 Test 16: Add Dashboard Statistics
#### 🔴 Test 17: Add Progress Charts
#### 🔴 Test 18: Add Study Calendar
#### 🔴 Test 19: Add Study Timer
#### 🔴 Test 20: Add Session Tracking

### Day 5: Mobile & Accessibility (Tests 21-30)

#### 🔴 Test 21-25: Mobile Navigation
#### 🔴 Test 26-30: Accessibility Features

---

## 🧪 DAILY TDD WORKFLOW (NEVER CHANGE)

### Morning Routine
```bash
# 1. Check current status
cd /Users/Yousef_1/Dokumenter/HjemmesideIT/EksamKlarReboot/Contextsystem
python3 check_context.py

# 2. Navigate to project
cd ../examklar-tdd

# 3. Check unit tests still pass
npm test -- --run

# 4. Check which E2E test to fix next
npm run test:e2e -- --reporter=list
```

### Single Test Fix Cycle
```bash
# 🔴 RED: Identify ONE failing test
npm run test:e2e -- --grep "specific test name"

# 🟢 GREEN: Make MINIMAL change to pass it
# Edit ONE file, add ONE feature

# 🔵 REFACTOR: Clean up if needed (optional)

# ✅ VERIFY: Run that specific test
npm run test:e2e -- --grep "specific test name"

# 📝 UPDATE CONTEXT
python3 ../Contextsystem/update_context.py "Fixed: [specific change]"
```

### End of Day
```bash
# Run all tests to ensure nothing broke
npm test -- --run
npm run test:e2e

# Update context with daily summary
python3 ../Contextsystem/update_context.py "Day summary: X E2E tests fixed"
```

---

## 🎯 TEST EXECUTION STRATEGY

### Single Test Execution
```bash
# Run specific test pattern
npx playwright test --grep "onboarding flow"
npx playwright test --grep "flashcards"
npx playwright test --grep "quiz"

# Run single browser only (faster)
npx playwright test --project=chromium

# Debug mode for investigation
npx playwright test --debug --grep "specific test"
```

### Progressive Testing
```bash
# After each fix, run:
1. The specific test you just fixed
2. All unit tests (ensure no regression)
3. Previously fixed E2E tests (smoke test)
```

---

## 📁 FILE ORGANIZATION PRIORITIES

### Files Most Likely to Need Changes
```
src/pages/OnboardingPage.tsx     # Tests 1-5
src/pages/FlashcardsPage.tsx     # Tests 6-10  
src/pages/QuizPage.tsx           # Tests 11-15
src/pages/DashboardPage.tsx      # Tests 16-20
src/components/layout/Navigation.tsx  # Tests 21-25
src/components/ui/              # Tests 26-30
```

### Test-Driven Additions Needed
```
data-testid attributes          # Most tests
name attributes on forms        # Form tests
ARIA labels                     # Accessibility tests
Skip links                      # Navigation tests
Mobile menu toggle             # Responsive tests
```

---

## 🚨 CRITICAL SUCCESS RULES

### 1. **NEVER BREAK EXISTING TESTS**
```bash
# Before ANY commit:
npm test -- --run  # Must show 253/253 passing
```

### 2. **ONE CHANGE PER CONTEXT UPDATE**
```bash
# Good: "Added data-testid to Get Started button"
# Bad: "Fixed multiple E2E tests and refactored components"
```

### 3. **TEST IMMEDIATELY AFTER CHANGE**
```bash
# Don't accumulate multiple changes
# Test each change individually
```

### 4. **MINIMAL IMPLEMENTATION**
```bash
# Add ONLY what's needed to pass the test
# Don't over-engineer or add extra features
```

---

## 📊 SUCCESS METRICS

### Phase 5 Completion Criteria
- [ ] E2E Test 1: Onboarding flow ✅
- [ ] E2E Test 2: Subject creation ✅  
- [ ] E2E Test 3: Form validation ✅
- [ ] E2E Test 4: Navigation flow ✅
- [ ] E2E Test 5: Study preferences ✅
- [ ] ... (continue for all 30 tests)
- [ ] All 253 unit tests still passing ✅
- [ ] All 30 E2E tests passing ✅
- [ ] Production build successful ✅

### Quality Gates
- **Unit Test Coverage**: >95% (current: ✅)
- **E2E Test Coverage**: 100% critical paths
- **Build Time**: <30 seconds
- **E2E Test Time**: <5 minutes total

---

## 🎯 IMMEDIATE NEXT ACTIONS

### START HERE (Test 1):
```bash
1. cd /Users/Yousef_1/Dokumenter/HjemmesideIT/EksamKlarReboot/examklar-tdd
2. npx playwright test --grep "onboarding flow" --project=chromium
3. Identify the EXACT h1 selector issue
4. Make MINIMAL fix to OnboardingPage.tsx  
5. Test the fix
6. python3 ../Contextsystem/update_context.py "Fixed h1 selector for onboarding E2E test"
7. Move to Test 2
```

---

## 📝 CONTEXT INTEGRATION

This Master Plan v2 integrates with:
- `/Contextsystem/update_context.py` - For progress tracking
- `/Contextsystem/check_context.py` - For status verification  
- `/Contextsystem/NEXT_ACTIONS.md` - For immediate tasks
- `/Contextsystem/project-status.json` - For automated status

---

## 🔄 PLAN EVOLUTION

This Master Plan v2 will be updated as we progress:
- After every 5 E2E tests fixed
- When new patterns emerge
- When workflow optimizations are discovered

**Last Updated**: 2025-06-23T11:15:00
**Version**: 2.0.0
**Status**: Active - Phase 5 E2E Implementation

---

> **Remember**: The success of this project comes from discipline, not speed. One small, verified change at a time. Update context after every action. Trust the process.
