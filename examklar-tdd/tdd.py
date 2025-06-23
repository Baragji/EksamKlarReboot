#!/usr/bin/env python3
"""
EXAMKLAR TDD CONTEXT SYSTEM V5 - CENTRALIZED COMMAND
One command to rule them all: python3 tdd.py "action description"
"""

import os
import sys
import json
from datetime import datetime, timezone
from pathlib import Path

# Configuration
WORKSPACE_ROOT = Path(__file__).parent
CONTEXT_DIR = WORKSPACE_ROOT / "Contextsystem"
CURRENT_SESSION_FILE = CONTEXT_DIR / "current-session.md"
NEXT_ACTIONS_FILE = CONTEXT_DIR / "NEXT_ACTIONS.md" 
PROJECT_STATUS_FILE = CONTEXT_DIR / "project-status.json"

def get_timestamp():
    """Generate ISO timestamp for logging"""
    return datetime.now(timezone.utc).isoformat()

def update_session_log(action_description):
    """Add new action to session log"""
    timestamp = get_timestamp()
    log_entry = f"[{timestamp}] {action_description}\n"
    
    # Create context directory if it doesn't exist
    CONTEXT_DIR.mkdir(exist_ok=True)
    
    # Append to current session file
    with open(CURRENT_SESSION_FILE, "a", encoding="utf-8") as f:
        f.write(log_entry)
    
    print(f"✅ TDD Context Updated: {action_description}")
    print(f"📝 Timestamp: {timestamp}")

def update_project_status():
    """Update project status with current metrics"""
    status = {
        "last_updated": get_timestamp(),
        "phase": "V5 Implementation - Advanced Features",
        "focus": "TDD-driven feature development",
        "next_milestone": "Gamification & Engagement Engine",
        "test_status": "Run 'npm test' to check current status",
        "coverage_target": ">90%"
    }
    
    with open(PROJECT_STATUS_FILE, "w", encoding="utf-8") as f:
        json.dump(status, f, indent=2)

def update_next_actions(action_description):
    """Update next actions file with current context"""
    timestamp = get_timestamp()
    
    next_actions_content = f"""# NEXT ACTIONS - ExamKlar TDD V5

## LAST ACTION COMPLETED
✅ {action_description} (at {timestamp})

## IMMEDIATE NEXT STEPS - V5 MASTERPLAN
**Following V5-MasterPlan.md for advanced feature implementation**

### Current Focus: Gamification & Engagement Engine (Fase 1)
**Objective**: Implement core gamification elements for daily learning motivation

### Next TDD Actions:
1. **🔴 RED**: Write failing tests for streak counter logic
   - Test examStore for streak tracking functionality
   - Test StudyProgressDashboard UI integration

2. **🟢 GREEN**: Implement streak counter feature
   - Add streakCount, longestStreak, lastActivityDate to examStore
   - Update UI to display streak with motivational messaging

3. **🔵 REFACTOR**: Polish and optimize
   - Ensure clean code structure
   - Maintain 100% test coverage

4. **CRITICAL**: After your next action, run:
   ```bash
   python3 tdd.py "description of what you did"
   ```

## TDD WORKFLOW REMINDER
🧪 **RED-GREEN-REFACTOR**:
1. Write a failing test first
2. Write minimal code to make it pass  
3. Refactor to improve code quality
4. Repeat

## MANDATORY RULE FOR ALL AIs
🚨 **YOU MUST ALWAYS**:
1. After creating/modifying ANY file
2. After running ANY test
3. After ANY significant action
4. Run: `python3 tdd.py "what you just did"`

## V5 Reference Documents
- **V5-MasterPlan.md**: Complete implementation roadmap
- **WOWFACTOR.MD**: Feature checklist and current status
- **⚠️_READ_FIRST_⚠️.md**: Critical TDD rules

## Test Status Tracking
- **Unit Tests**: Run `npm test` to check current status
- **Coverage**: Aim for >90% coverage
- **E2E Tests**: Run `npm run test:e2e` for integration testing

## Context Last Updated
{timestamp} - {action_description}
"""
    
    with open(NEXT_ACTIONS_FILE, "w", encoding="utf-8") as f:
        f.write(next_actions_content)

def main():
    """Main TDD context update function"""
    if len(sys.argv) < 2:
        print("❌ Error: Please provide an action description")
        print("Usage: python3 tdd.py \"description of what you did\"")
        print("Example: python3 tdd.py \"Implemented streak counter tests\"")
        sys.exit(1)
    
    action_description = " ".join(sys.argv[1:])
    
    # Update all context files
    update_session_log(action_description)
    update_project_status()
    update_next_actions(action_description)
    
    print(f"\n🧪 TDD Context System V5 - Ready for next action!")
    print(f"📋 Check: cat Contextsystem/NEXT_ACTIONS.md")
    print(f"📊 Status: cat Contextsystem/project-status.json")

if __name__ == "__main__":
    main()
