# ⚠️ CRITICAL INSTRUCTIONS FOR ALL AIs ⚠️

## 🧪 EXAMKLAR TDD PROJECT - MANDATORY RULES

**THIS IS A TEST-DRIVEN DEVELOPMENT PROJECT**

**AFTER EVERY ACTION YOU TAKE, YOU MUST RUN:**

```bash
python3 update_context.py "description of what you just did"
```

## 🧪 TDD Examples:
- Wrote test: `python3 update_context.py "Created failing test for Button component click handler"`
- Made test pass: `python3 update_context.py "Implemented Button onClick functionality - test now passes"`
- Refactored: `python3 update_context.py "Refactored Button component for better maintainability"`
- Added feature: `python3 update_context.py "Added new flashcard component with tests"`

## 🔴🟢🔵 TDD Workflow:
1. **RED**: Write a failing test first
2. **GREEN**: Write minimal code to make it pass  
3. **REFACTOR**: Improve code quality
4. **REPEAT**: Continue the cycle

## Why TDD + Context Updates Are Critical:
- **Prevents context loss** - the #1 problem with AI coding assistants
- **Ensures quality** - tests catch regressions and validate implementations
- **Enables seamless handoffs** between AI sessions
- **Maintains project continuity** across interruptions
- **Provides recovery instructions** for new AIs

## Check Context Status:
```bash
python3 check_context.py
```

## If You're a New AI Taking Over:
1. **FIRST**: Read `current-session.md` to understand what was last done
2. **THEN**: Read `NEXT_ACTIONS.md` for immediate next steps
3. **ALWAYS**: Follow TDD workflow - write tests first!
4. **ALWAYS**: Update context after every action you take

## This File Exists Because:
We cannot hardcode rules into AI coding assistants, so we rely on:
- Prominent visual reminders (this file)
- Simple, easy-to-use update scripts
- Self-checking context systems
- **TDD methodology** for quality assurance

**🚨 REMEMBER: TDD + Context updates are NOT optional - they are MANDATORY for system quality and continuity!**