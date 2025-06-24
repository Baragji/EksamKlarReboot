# ⚠️ CRITICAL TDD RULES FOR ALL AIs ⚠️

## 🧪 EXAMKLAR TDD PROJECT - MANDATORY WORKFLOW

**THIS IS A TEST-DRIVEN DEVELOPMENT PROJECT**

**🚨 AFTER EVERY ACTION YOU TAKE, YOU MUST RUN:**

```bash
python3 TDD-ContextSysten/newtdd.py "session_id" "description of what you just did"
```

## 🧪 TDD Examples:
- **🔴 RED**: `python3 TDD-ContextSysten/newtdd.py "1.2" "🔴 RED: Created failing test for OnboardingStore navigation"`
- **🟢 GREEN**: `python3 TDD-ContextSysten/newtdd.py "1.2" "🟢 GREEN: Implemented nextStep() - tests now pass"`
- **🔵 REFACTOR**: `python3 TDD-ContextSysten/newtdd.py "1.2" "🔵 REFACTOR: Improved store structure and readability"`

## 🔴🟢🔵 MANDATORY TDD Workflow:
1. **🔴 RED**: Write a failing test first
2. **🟢 GREEN**: Write minimal code to make it pass  
3. **🔵 REFACTOR**: Improve code quality
4. **REPEAT**: Continue the cycle

## 🚨 MANDATORY RULE FOR ALL AIs
**YOU MUST ALWAYS**:
1. After creating/modifying ANY file
2. After running ANY test
3. After ANY significant action
4. Run: `python3 TDD-ContextSysten/newtdd.py "session_id" "what you just did"`

## Why TDD + Context Updates Are Critical:
- **Prevents context loss** - the #1 problem with AI coding assistants
- **Ensures quality** - tests catch regressions and validate implementations
- **Enables seamless handoffs** between AI sessions
- **Maintains project continuity** across interruptions
- **Provides recovery instructions** for new AIs

## Current Session Context:
- **Session 1.2**: Enhanced Store Architecture
- **Focus**: OnboardingStore + DataBridgeStore + ExamStore integration
- **TDD Phase**: We need to fix failing tests and follow RED-GREEN-REFACTOR

## If You're a New AI Taking Over:
1. **FIRST**: Read `TDD-ContextSysten/.tdd/progress_summary.md` to understand current status
2. **THEN**: Check failing tests with `npm test`
3. **ALWAYS**: Follow TDD workflow - write tests first!
4. **ALWAYS**: Update context after every action you take

## Next Immediate Actions:
1. **🔴 RED**: Fix failing store tests by writing proper test setup
2. **🟢 GREEN**: Make tests pass with minimal implementation
3. **🔵 REFACTOR**: Clean up and optimize code structure

**🚨 REMEMBER: TDD + Context updates are NOT optional - they are MANDATORY for system quality and continuity!**

**CURRENT COMMAND**: `python3 TDD-ContextSysten/newtdd.py "1.2" "what you just did"`