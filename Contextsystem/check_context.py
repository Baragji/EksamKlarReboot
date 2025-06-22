#!/usr/bin/env python3
"""
ExamKlar Context Checker
Displays current project status and TDD progress
"""

import json
import os
from datetime import datetime

def check_context():
    """Display current project context and status"""
    
    print("🧪 EXAMKLAR TDD PROJECT STATUS")
    print("=" * 50)
    
    # Check if project status exists
    if os.path.exists('project-status.json'):
        with open('project-status.json', 'r') as f:
            status = json.load(f)
        
        print(f"📋 Project: {status.get('project_name', 'Unknown')}")
        print(f"📅 Last Update: {status.get('last_update', 'Unknown')}")
        print(f"🎯 Status: {status.get('status', 'Unknown')}")
        print(f"⚡ Methodology: {status.get('methodology', 'Unknown')}")
        print(f"🔧 Last Action: {status.get('last_action', 'Unknown')}")
    else:
        print("❌ No project status found!")
    
    print("\n" + "=" * 50)
    print("🧪 TDD WORKFLOW CHECKLIST")
    print("=" * 50)
    
    # Check for package.json (project setup)
    if os.path.exists('../package.json'):
        print("✅ React project structure exists")
    else:
        print("❌ No package.json found - project not initialized")
    
    # Check for test directory
    if os.path.exists('../tests') or os.path.exists('../src/__tests__'):
        print("✅ Test directory structure exists")
    else:
        print("❌ No test directory found")
    
    # Check for vitest config
    if os.path.exists('../vitest.config.ts') or os.path.exists('../vite.config.ts'):
        print("✅ Test configuration found")
    else:
        print("❌ No test configuration found")
    
    print("\n" + "=" * 50)
    print("📋 CURRENT SESSION LOG")
    print("=" * 50)
    
    if os.path.exists('current-session.md'):
        with open('current-session.md', 'r') as f:
            content = f.read()
        if content.strip():
            print(content)
        else:
            print("📝 No session activity logged yet")
    else:
        print("📝 No session log found")
    
    print("\n" + "=" * 50)
    print("🚀 NEXT STEPS")
    print("=" * 50)
    
    if os.path.exists('NEXT_ACTIONS.md'):
        with open('NEXT_ACTIONS.md', 'r') as f:
            lines = f.readlines()
        
        # Find the immediate next steps section
        in_next_steps = False
        for line in lines:
            if "IMMEDIATE NEXT STEPS" in line:
                in_next_steps = True
                continue
            elif in_next_steps and line.startswith("##"):
                break
            elif in_next_steps and line.strip():
                print(line.strip())
    else:
        print("📝 No next actions file found")
    
    print("\n" + "=" * 50)
    print("🧪 TDD REMINDER")
    print("=" * 50)
    print("1. 🔴 RED: Write a failing test")
    print("2. 🟢 GREEN: Write minimal code to pass")
    print("3. 🔵 REFACTOR: Improve code quality")
    print("4. 🔄 REPEAT: Continue the cycle")
    print("\n💡 Remember: Update context after every action!")

if __name__ == "__main__":
    check_context()
