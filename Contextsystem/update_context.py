#!/usr/bin/env python3
"""
ExamKlar Context Management System
Ensures continuity between AI coding sessions with TDD focus
"""

import json
import os
from datetime import datetime
import sys

def update_context(action_description):
    """Update project context with latest action"""
    timestamp = datetime.now().isoformat()
    
    # Update project status
    status_data = {
        "project_name": "ExamKlar - React TDD Project",
        "last_update": timestamp,
        "last_action": action_description,
        "status": "active",
        "context_system": "tdd-focused",
        "methodology": "test-driven-development",
        "instructions": "Always run 'python3 update_context.py \"action\"' after any action"
    }
    
    with open('project-status.json', 'w') as f:
        json.dump(status_data, f, indent=2)
    
    # Update NEXT_ACTIONS.md
    next_actions_content = f"""# NEXT ACTIONS - ExamKlar TDD Project

## LAST ACTION COMPLETED
✅ {action_description} (at {timestamp})

## IMMEDIATE NEXT STEPS
1. Continue with TDD development workflow
2. **CRITICAL**: After your next action, run:
   ```bash
   python3 update_context.py "description of what you did"
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
4. Run: `python3 update_context.py "what you just did"`

## Test Status Tracking
- **Unit Tests**: Run `npm test` to check current status
- **Coverage**: Aim for >90% coverage
- **TDD Cycle**: Always write tests before implementation

## Recovery Instructions
If you're a new AI taking over:
1. Read this file to see what was last done
2. Check current-session.md for full context
3. Continue with TDD workflow
4. **REMEMBER**: Update context after every action!

## Context Last Updated
{timestamp} - {action_description}

"""
    
    with open('NEXT_ACTIONS.md', 'w') as f:
        f.write(next_actions_content)
    
    # Update current session log
    session_log_entry = f"[{timestamp}] {action_description}\n"
    
    with open('current-session.md', 'a') as f:
        f.write(session_log_entry)
    
    print(f"✅ Context updated: {action_description}")
    print(f"📝 Timestamp: {timestamp}")
    print(f"🧪 Remember: Follow TDD - write tests first!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Error: Please provide an action description")
        print("Usage: python3 update_context.py \"description of what you did\"")
        sys.exit(1)
    
    action = " ".join(sys.argv[1:])
    update_context(action)
