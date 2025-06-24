# 🔴 RED PHASE PLAN - Session 1.2 Enhanced Store Architecture

## 🧪 TDD Workflow Status
**Current Phase**: 🔴 RED - Write failing tests first
**Next Phase**: 🟢 GREEN - Implement minimal code to make tests pass
**Session**: 1.2 Enhanced Store Architecture

## 📊 Failed Tests Analysis (17 tests failing)

### 🎯 Priority 1: OnboardingStore Core Functionality
1. **Step Navigation** - `currentStepIndex` not incrementing (expected 1, got 0)
2. **Step Validation** - `validateCurrentStep()` returning false instead of true
3. **Content Management** - `addContent()` not adding to data.content array
4. **Toast Notifications** - `showToast()` not adding to toasts array
5. **Data Export** - `exportOnboardingData()` returning null instead of data

### 🎯 Priority 2: DataBridgeStore Processing
6. **Content Processing** - `processContent()` not adding to processedContent
7. **Processing Queue** - `addToProcessingQueue()` not updating queue/status
8. **Fallback Strategies** - Expected 4 strategies, got 3
9. **Training Data Generation** - `generateTrainingData()` not creating data

### 🎯 Priority 3: Store Integration & Communication
10. **ExamStore Initialization** - `lastSyncTimestamp` not being set
11. **Onboarding Completion** - Integration between stores not working
12. **OnboardingStore Sync** - ExamStore not receiving onboarding data
13. **DataBridge Sync** - ExamStore not receiving training data
14. **Cross-Store Flow** - Complete onboarding to training data flow broken
15. **Data Consistency** - Store updates not propagating correctly

### 🎯 Priority 4: Store Persistence
16. **Onboarding Persistence** - Stored data not being restored correctly
17. **DataBridge Config** - Configuration timeout value mismatch (30000 vs 60000)

## 🔴 RED PHASE ACTION PLAN

### Step 1: OnboardingStore Navigation & Validation
```typescript
// Missing: nextStep() function should increment currentStepIndex
// Missing: validateCurrentStep() should validate current step data
// Missing: progress calculation (currentStep / totalSteps * 100)
```

### Step 2: OnboardingStore Content & Toast Management  
```typescript
// Missing: addContent() should append to data.content array
// Missing: showToast() should append to toasts array
// Missing: exportOnboardingData() should return complete data object
```

### Step 3: DataBridgeStore Processing Pipeline
```typescript
// Missing: processContent() should add to processedContent array
// Missing: addToProcessingQueue() should update processingStatus
// Missing: Complete fallback strategy (4th strategy missing)
// Missing: generateTrainingData() should create training data
```

### Step 4: Cross-Store Integration
```typescript  
// Missing: ExamStore integration with OnboardingStore
// Missing: ExamStore integration with DataBridgeStore
// Missing: lastSyncTimestamp updates
// Missing: Data propagation between stores
```

### Step 5: Store Persistence
```typescript
// Missing: Proper persistence/restore for onboarding state
// Missing: Correct configuration values for DataBridge timeout
```

## 🚀 Implementation Strategy

1. **🔴 RED**: Focus on one failing test at a time
2. **🟢 GREEN**: Write minimal implementation to make test pass
3. **🔵 REFACTOR**: Improve code quality and structure
4. **REPEAT**: Move to next failing test

## 📝 Next Actions
1. Start with OnboardingStore navigation (Priority 1.1)
2. Write failing test for nextStep() function
3. Implement minimal nextStep() to make test pass
4. Refactor and move to next test

## 🧪 TDD Commands
- **Start**: `python3 TDD-ContextSysten/newtdd.py "1.2" "🔴 RED: Writing failing test for OnboardingStore.nextStep()"`
- **Implement**: `python3 TDD-ContextSysten/newtdd.py "1.2" "🟢 GREEN: Implemented nextStep() - test now passes"`
- **Refactor**: `python3 TDD-ContextSysten/newtdd.py "1.2" "🔵 REFACTOR: Improved nextStep() structure"`