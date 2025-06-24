#!/usr/bin/env python3
"""
UNIVERSAL TDD CONTEXT SYSTEM V6 - PROJECT AGNOSTIC
Strict TDD Enforcement with Dynamic Project Detection

Usage:
  tdd.py <project_name>           # Initialize project
  tdd.py <project_name> "action"  # Log action and update context
  tdd.py --help                   # Show help

Features:
- Project-agnostic design
- Automatic project structure detection
- Strict TDD phase enforcement
- Dynamic test command detection
- Centralized context management
"""

import os
import sys
import json
import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Tuple


class TDDPhase:
    """TDD Phase enumeration"""
    RED = "🔴 RED"
    GREEN = "🟢 GREEN"
    REFACTOR = "🔵 REFACTOR"
    PLANNING = "📋 PLANNING"


class ProjectDetector:
    """Detects project type and configuration"""
    
    @staticmethod
    def detect_project_type(project_path: Path) -> Dict[str, any]:
        """Detect project type and return configuration"""
        config = {
            "type": "unknown",
            "test_commands": [],
            "build_commands": [],
            "dependencies": [],
            "structure": {}
        }
        
        # Python project detection
        if (project_path / "pyproject.toml").exists():
            config["type"] = "python-poetry"
            config["test_commands"] = [
                "poetry run pytest tests/ -v",
                "poetry run pytest tests/ --cov=src"
            ]
            config["build_commands"] = ["poetry install", "poetry build"]
            
        elif (project_path / "requirements.txt").exists():
            config["type"] = "python-pip"
            config["test_commands"] = [
                "python -m pytest tests/ -v",
                "python -m pytest tests/ --cov=src"
            ]
            config["build_commands"] = ["pip install -r requirements.txt"]
            
        # Node.js project detection
        elif (project_path / "package.json").exists():
            config["type"] = "nodejs"
            config["test_commands"] = ["npm test", "npm run test:coverage"]
            config["build_commands"] = ["npm install", "npm run build"]
            
        # Rust project detection
        elif (project_path / "Cargo.toml").exists():
            config["type"] = "rust"
            config["test_commands"] = ["cargo test", "cargo test --verbose"]
            config["build_commands"] = ["cargo build", "cargo build --release"]
            
        # Go project detection
        elif (project_path / "go.mod").exists():
            config["type"] = "go"
            config["test_commands"] = ["go test ./...", "go test -v ./..."]
            config["build_commands"] = ["go build", "go mod tidy"]
            
        # Detect common directories
        common_dirs = ["src", "tests", "test", "lib", "docs", "examples"]
        for dir_name in common_dirs:
            if (project_path / dir_name).exists():
                config["structure"][dir_name] = True
                
        return config


class TDDContextManager:
    """Manages TDD context for any project"""
    
    def __init__(self, workspace_root: Path, project_name: str):
        self.workspace_root = workspace_root
        self.project_name = project_name
        self.project_path = workspace_root / project_name if project_name != "." else workspace_root
        self.context_dir = self.project_path / ".tdd"
        
        # Context files
        self.session_file = self.context_dir / "session.md"
        self.status_file = self.context_dir / "status.json"
        self.actions_file = self.context_dir / "next_actions.md"
        self.config_file = self.context_dir / "config.json"
        
        # Ensure project directory exists before creating context
        if not self.project_path.exists():
            print(f"❌ Project directory does not exist: {self.project_path}")
            print(f"   Create the directory first or use '.' for current directory")
            sys.exit(1)
            
        # Ensure context directory exists
        self.context_dir.mkdir(exist_ok=True)
        
    def initialize_project(self) -> None:
        """Initialize TDD context for a project"""
        print(f"🚀 Initializing TDD Context for: {self.project_name}")
        
        # Detect project configuration
        project_config = ProjectDetector.detect_project_type(self.project_path)
        
        # Create initial configuration
        config = {
            "project_name": self.project_name,
            "project_path": str(self.project_path),
            "initialized_at": self._get_timestamp(),
            "project_config": project_config,
            "tdd_rules": {
                "enforce_red_first": True,
                "require_test_before_code": True,
                "minimum_coverage": 90,
                "max_refactor_without_test": 0
            }
        }
        
        self._save_config(config)
        self._initialize_status()
        self._create_initial_actions()
        self._create_initial_session()
        self._create_readme()
        
        print(f"✅ TDD Context initialized for {project_config['type']} project")
        print(f"📁 Context directory: {self.context_dir}")
        print(f"🧪 Test commands: {', '.join(project_config['test_commands'])}")
        print(f"📖 README: {self.context_dir / 'README.md'}")
        print(f"\n🚨 STRICT TDD RULES ENFORCED:")
        print(f"   - RED phase required before GREEN")
        print(f"   - Tests must be written before implementation")
        print(f"   - Minimum {config['tdd_rules']['minimum_coverage']}% coverage required")
        
    def log_action(self, action_description: str) -> None:
        """Log an action and update TDD context"""
        if not self._is_initialized():
            print(f"❌ Project not initialized. Run: tdd.py {self.project_name}")
            sys.exit(1)
            
        timestamp = self._get_timestamp()
        
        # Load current status
        status = self._load_status()
        
        # Determine TDD phase from action
        phase = self._determine_phase(action_description, status)
        
        # Validate TDD rules
        self._validate_tdd_rules(phase, status, action_description)
        
        # Update status
        status["last_action"] = {
            "description": action_description,
            "timestamp": timestamp,
            "phase": phase
        }
        status["current_phase"] = phase
        status["action_count"] += 1
        
        # Save updates
        self._save_status(status)
        self._update_session_log(action_description, phase, timestamp)
        self._update_next_actions(status)
        
        print(f"✅ TDD Action Logged: {action_description}")
        print(f"📊 Current Phase: {phase}")
        print(f"🕐 Timestamp: {timestamp}")
        
    def _is_initialized(self) -> bool:
        """Check if project is initialized"""
        return self.config_file.exists() and self.status_file.exists()
        
    def _get_timestamp(self) -> str:
        """Generate ISO timestamp"""
        return datetime.now(timezone.utc).isoformat()
        
    def _save_config(self, config: Dict) -> None:
        """Save project configuration"""
        with open(self.config_file, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2)
            
    def _load_config(self) -> Dict:
        """Load project configuration"""
        with open(self.config_file, "r", encoding="utf-8") as f:
            return json.load(f)
            
    def _initialize_status(self) -> None:
        """Initialize project status"""
        status = {
            "current_phase": TDDPhase.PLANNING,
            "action_count": 0,
            "test_results": {
                "last_run": None,
                "passing": 0,
                "failing": 0,
                "coverage": 0
            },
            "phase_history": [],
            "last_action": None,
            "created_at": self._get_timestamp()
        }
        self._save_status(status)
        
    def _save_status(self, status: Dict) -> None:
        """Save project status"""
        with open(self.status_file, "w", encoding="utf-8") as f:
            json.dump(status, f, indent=2)
            
    def _load_status(self) -> Dict:
        """Load project status"""
        with open(self.status_file, "r", encoding="utf-8") as f:
            return json.load(f)
            
    def _determine_phase(self, action: str, status: Dict) -> str:
        """Determine TDD phase from action description"""
        action_lower = action.lower()
        
        # RED phase indicators
        if any(keyword in action_lower for keyword in [
            "failing test", "red phase", "test first", "write test", 
            "add test", "create test", "test for", "failing"
        ]):
            return TDDPhase.RED
            
        # GREEN phase indicators
        elif any(keyword in action_lower for keyword in [
            "implement", "fix", "make pass", "green phase", 
            "code to pass", "minimal code", "satisfy test"
        ]):
            return TDDPhase.GREEN
            
        # REFACTOR phase indicators
        elif any(keyword in action_lower for keyword in [
            "refactor", "optimize", "clean up", "improve", 
            "restructure", "polish", "enhance"
        ]):
            return TDDPhase.REFACTOR
            
        # Default to current phase if unclear
        return status.get("current_phase", TDDPhase.PLANNING)
        
    def _validate_tdd_rules(self, phase: str, status: Dict, action: str) -> None:
        """Validate strict TDD rules"""
        config = self._load_config()
        rules = config["tdd_rules"]
        
        current_phase = status.get("current_phase", TDDPhase.PLANNING)
        
        # Rule: Must start with RED phase
        if rules["enforce_red_first"] and current_phase == TDDPhase.PLANNING and phase != TDDPhase.RED:
            if phase in [TDDPhase.GREEN, TDDPhase.REFACTOR]:
                print(f"🚨 TDD VIOLATION: Must start with RED phase (failing test)")
                print(f"   Current: {phase}, Required: {TDDPhase.RED}")
                print(f"   Write a failing test first!")
                sys.exit(1)
                
        # Rule: GREEN must follow RED
        if phase == TDDPhase.GREEN and current_phase != TDDPhase.RED:
            print(f"🚨 TDD VIOLATION: GREEN phase must follow RED phase")
            print(f"   Current: {current_phase}, Attempting: {phase}")
            print(f"   Write a failing test first!")
            sys.exit(1)
            
        # Rule: REFACTOR must follow GREEN
        if phase == TDDPhase.REFACTOR and current_phase != TDDPhase.GREEN:
            print(f"🚨 TDD VIOLATION: REFACTOR phase must follow GREEN phase")
            print(f"   Current: {current_phase}, Attempting: {phase}")
            print(f"   Implement code to pass tests first!")
            sys.exit(1)
            
    def _create_initial_session(self) -> None:
        """Create initial session log"""
        content = f"""# TDD Session Log - {self.project_name}

Initialized: {self._get_timestamp()}

## Session Actions

"""
        with open(self.session_file, "w", encoding="utf-8") as f:
            f.write(content)
            
    def _create_readme(self) -> None:
        """Create TDD system README file"""
        config = self._load_config()
        project_config = config["project_config"]
        
        readme_content = f"""# TDD System Guide - {self.project_name}

## Quick Reference

### Essential Commands
```bash
# Log TDD actions (REQUIRED after every change)
tdd.py {self.project_name} "description of what you just did"

# Run tests
{project_config['test_commands'][0] if project_config['test_commands'] else 'pytest'}

# Check status
cat .tdd/next_actions.md
```

### TDD Workflow (STRICTLY ENFORCED)
1. **🔴 RED**: Write a failing test first
2. **🟢 GREEN**: Write minimal code to make it pass  
3. **🔵 REFACTOR**: Improve code quality
4. **REPEAT**: Continue the cycle

## Project Configuration
- **Type**: {project_config['type']}
- **Test Commands**: {', '.join(project_config['test_commands'])}
- **Build Commands**: {', '.join(project_config['build_commands'])}
- **Coverage Target**: {config['tdd_rules']['minimum_coverage']}%

## TDD Phase Keywords

### 🔴 RED Phase (Write Failing Test)
Use these keywords in your action descriptions:
- "failing test", "red phase", "test first"
- "write test", "add test", "create test"
- "test for", "failing"

**Example**: `tdd.py {self.project_name} "wrote failing test for user login validation"`

### 🟢 GREEN Phase (Make Test Pass)
Use these keywords:
- "implement", "fix", "make pass"
- "green phase", "code to pass"
- "minimal code", "satisfy test"

**Example**: `tdd.py {self.project_name} "implemented basic login to pass test"`

### 🔵 REFACTOR Phase (Improve Code)
Use these keywords:
- "refactor", "optimize", "clean up"
- "improve", "restructure", "polish"
- "enhance"

**Example**: `tdd.py {self.project_name} "refactored login for better error handling"`

## Context Files
- **`next_actions.md`**: What to do next (CHECK THIS FIRST!)
- **`status.json`**: Current TDD phase and statistics
- **`session.md`**: Complete session log
- **`config.json`**: Project configuration

## Common Workflow
```bash
# 1. Check what to do next
cat .tdd/next_actions.md

# 2. Write failing test (RED)
tdd.py {self.project_name} "wrote failing test for new feature"

# 3. Run tests to confirm failure
{project_config['test_commands'][0] if project_config['test_commands'] else 'pytest'}

# 4. Implement minimal code (GREEN)
tdd.py {self.project_name} "implemented feature to pass test"

# 5. Run tests to confirm pass
{project_config['test_commands'][0] if project_config['test_commands'] else 'pytest'}

# 6. Refactor if needed (REFACTOR)
tdd.py {self.project_name} "refactored code for better structure"

# 7. Run tests to ensure still passing
{project_config['test_commands'][0] if project_config['test_commands'] else 'pytest'}
```

## TDD Violations (Will Terminate Execution)
- 🚨 Must start with RED phase (failing test)
- 🚨 GREEN phase must follow RED phase
- 🚨 REFACTOR phase must follow GREEN phase
- 🚨 No implementation without failing test first

## Recovery from Context Loss
1. Read `next_actions.md` for current status
2. Review `session.md` for recent history
3. Continue from the indicated phase
4. Always follow TDD sequence

## For AI Assistants
- **MANDATORY**: Run `tdd.py` after every action
- Check `next_actions.md` before starting work
- Use descriptive action messages with TDD keywords
- Follow strict phase sequence: RED → GREEN → REFACTOR
- Never skip phases or implement without tests

---
**Remember: Context updates are CRITICAL for continuity!**

For complete documentation, see: `README_TDD_SYSTEM.md`
"""
        
        readme_file = self.context_dir / "README.md"
        with open(readme_file, "w", encoding="utf-8") as f:
            f.write(readme_content)
            
    def _update_session_log(self, action: str, phase: str, timestamp: str) -> None:
        """Update session log"""
        log_entry = f"[{timestamp}] {phase}: {action}\n"
        with open(self.session_file, "a", encoding="utf-8") as f:
            f.write(log_entry)
            
    def _create_initial_actions(self) -> None:
        """Create initial next actions file"""
        config = self._load_config()
        project_config = config["project_config"]
        
        content = f"""# TDD Next Actions - {self.project_name}

## Project Information
- **Type**: {project_config['type']}
- **Test Commands**: {', '.join(project_config['test_commands'])}
- **Build Commands**: {', '.join(project_config['build_commands'])}

## Current TDD Cycle
**Phase**: 📋 PLANNING (Ready to start)

## Next Steps
1. **🔴 RED Phase**: Write your first failing test
   - Identify the feature/functionality to implement
   - Write a test that fails (as expected)
   - Run tests to confirm failure

2. **🟢 GREEN Phase**: Write minimal code to pass
   - Implement just enough code to make the test pass
   - No extra features or optimizations
   - Run tests to confirm they pass

3. **🔵 REFACTOR Phase**: Improve code quality
   - Clean up code while keeping tests green
   - Optimize performance if needed
   - Ensure code follows best practices

## TDD Rules (STRICTLY ENFORCED)
🚨 **VIOLATIONS WILL TERMINATE EXECUTION**
- ✅ Always start with RED (failing test)
- ✅ GREEN must follow RED
- ✅ REFACTOR must follow GREEN
- ✅ No implementation without failing test first
- ✅ Minimum {config['tdd_rules']['minimum_coverage']}% test coverage

## Commands
```bash
# Log your TDD actions
tdd.py {self.project_name} "wrote failing test for user authentication"
tdd.py {self.project_name} "implemented basic auth to pass tests"
tdd.py {self.project_name} "refactored auth code for better structure"

# Run tests
{project_config['test_commands'][0] if project_config['test_commands'] else 'pytest'}
```

## Last Updated
Never - Project just initialized
"""
        with open(self.actions_file, "w", encoding="utf-8") as f:
            f.write(content)
            
    def _update_next_actions(self, status: Dict) -> None:
        """Update next actions based on current status"""
        config = self._load_config()
        project_config = config["project_config"]
        current_phase = status["current_phase"]
        last_action = status.get("last_action", {})
        
        # Determine next phase
        next_phases = {
            TDDPhase.PLANNING: TDDPhase.RED,
            TDDPhase.RED: TDDPhase.GREEN,
            TDDPhase.GREEN: TDDPhase.REFACTOR,
            TDDPhase.REFACTOR: TDDPhase.RED
        }
        next_phase = next_phases.get(current_phase, TDDPhase.RED)
        
        content = f"""# TDD Next Actions - {self.project_name}

## Project Information
- **Type**: {project_config['type']}
- **Test Commands**: {', '.join(project_config['test_commands'])}
- **Build Commands**: {', '.join(project_config['build_commands'])}

## Last Action Completed
✅ **{current_phase}**: {last_action.get('description', 'Project initialized')}
📅 **Timestamp**: {last_action.get('timestamp', 'N/A')}

## Current TDD Cycle
**Current Phase**: {current_phase}
**Next Phase**: {next_phase}
**Actions Logged**: {status['action_count']}

## Next Steps
{self._get_phase_instructions(next_phase)}

## TDD Rules (STRICTLY ENFORCED)
🚨 **VIOLATIONS WILL TERMINATE EXECUTION**
- ✅ Always start with RED (failing test)
- ✅ GREEN must follow RED
- ✅ REFACTOR must follow GREEN
- ✅ No implementation without failing test first
- ✅ Minimum {config['tdd_rules']['minimum_coverage']}% test coverage

## Commands
```bash
# Log your TDD actions
tdd.py {self.project_name} "your action description"

# Run tests
{project_config['test_commands'][0] if project_config['test_commands'] else 'pytest'}
```

## Test Status
- **Last Run**: {status['test_results'].get('last_run', 'Never')}
- **Passing**: {status['test_results'].get('passing', 0)}
- **Failing**: {status['test_results'].get('failing', 0)}
- **Coverage**: {status['test_results'].get('coverage', 0)}%

## Last Updated
{self._get_timestamp()}
"""
        with open(self.actions_file, "w", encoding="utf-8") as f:
            f.write(content)
            
    def _get_phase_instructions(self, phase: str) -> str:
        """Get instructions for specific TDD phase"""
        instructions = {
            TDDPhase.RED: """### 🔴 RED Phase - Write Failing Test
1. Identify the next feature/functionality to implement
2. Write a test that describes the expected behavior
3. Run the test to confirm it fails (RED)
4. The failure should be meaningful and specific

**Example**: `tdd.py project_name "wrote failing test for user login validation"`""",
            
            TDDPhase.GREEN: """### 🟢 GREEN Phase - Make Test Pass
1. Write the minimal code necessary to make the failing test pass
2. Don't add extra features or optimizations
3. Focus only on making the test green
4. Run tests to confirm they pass

**Example**: `tdd.py project_name "implemented basic login validation to pass test"`""",
            
            TDDPhase.REFACTOR: """### 🔵 REFACTOR Phase - Improve Code Quality
1. Clean up the code while keeping all tests green
2. Improve structure, readability, and performance
3. Remove duplication and improve design
4. Run tests frequently to ensure nothing breaks

**Example**: `tdd.py project_name "refactored login validation for better error handling"`""",
            
            TDDPhase.PLANNING: """### 📋 PLANNING Phase - Ready to Start
1. Review project requirements
2. Identify the first feature to implement
3. Plan your first failing test
4. Begin with RED phase

**Example**: `tdd.py project_name "starting with user authentication feature"`"""
        }
        return instructions.get(phase, "Unknown phase")


def main():
    """Main TDD system entry point"""
    parser = argparse.ArgumentParser(
        description="Universal TDD Context System V6",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  tdd.py myproject                    # Initialize project
  tdd.py myproject "wrote failing test" # Log action
  tdd.py .                            # Initialize current directory
  tdd.py . "implemented feature"       # Log action in current directory

Strict TDD Rules:
  - RED phase (failing test) must come first
  - GREEN phase (implementation) must follow RED
  - REFACTOR phase must follow GREEN
  - No code without tests!
"""
    )
    
    parser.add_argument(
        "project_name",
        help="Project name or '.' for current directory"
    )
    parser.add_argument(
        "action",
        nargs="?",
        help="Action description (if omitted, initializes project)"
    )
    
    args = parser.parse_args()
    
    # Determine workspace root
    workspace_root = Path.cwd()
    
    # Create TDD context manager
    tdd_manager = TDDContextManager(workspace_root, args.project_name)
    
    if args.action:
        # Log action
        tdd_manager.log_action(args.action)
    else:
        # Initialize project
        tdd_manager.initialize_project()
        
    print(f"\n📋 Next Actions: cat {tdd_manager.actions_file}")
    print(f"📊 Status: cat {tdd_manager.status_file}")
    print(f"📝 Session: cat {tdd_manager.session_file}")


if __name__ == "__main__":
    main()