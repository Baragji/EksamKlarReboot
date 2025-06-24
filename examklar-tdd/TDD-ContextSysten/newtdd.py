#!/usr/bin/env python3
"""
EXAMKLAR ATOMIC TDD CONTEXT SYSTEM V6 - PHASED ROADMAP ALIGNED
Komplet session tracking for 42 atomiske micro sessions across 5 faser
Usage: python3 atomic_tdd.py "session_id" "action_description"
Example: python3 atomic_tdd.py "1.1" "Implemented OnboardingData interface"
"""

import os
import sys
import json
from datetime import datetime, timezone
from pathlib import Path

# Configuration
WORKSPACE_ROOT = Path(__file__).parent
TDD_DIR = WORKSPACE_ROOT / ".tdd"
SESSION_LOG_FILE = TDD_DIR / "session_log.json"
CURRENT_STATUS_FILE = TDD_DIR / "status.json"
PROGRESS_FILE = TDD_DIR / "progress_summary.md"
NEXT_STEPS_FILE = TDD_DIR / "next_steps_plan.md"

# ATOMIC PHASED ROADMAP DEFINITION
ROADMAP_SESSIONS = {
    "1.1": {
        "title": "Type System Foundation",
        "phase": "FASE 1: FOUNDATION",
        "duration": 45,
        "risk": "🟢 Low Risk",
        "objective": "Etabler comprehensive type definitions for hele systemet",
        "deliverables": [
            "src/types/onboarding.ts - OnboardingData interface",
            "src/types/databridge.ts - 15+ interfaces",
            "Type compilation + interface validation tests"
        ],
        "dependencies": [],
        "testing": "Type compilation + interface validation tests"
    },
    "1.2": {
        "title": "Enhanced Store Architecture", 
        "phase": "FASE 1: FOUNDATION",
        "duration": 60,
        "risk": "🟡 Medium Risk",
        "objective": "Udvid examStore med onboarding og databridge state",
        "deliverables": [
            "src/stores/onboardingStore.ts - OnboardingStore interface",
            "Enhanced examStore integration",
            "Store state management tests + persistence tests"
        ],
        "dependencies": ["1.1"],
        "testing": "Store state management tests + persistence tests"
    },
    "1.3": {
        "title": "Utility Functions Library",
        "phase": "FASE 1: FOUNDATION", 
        "duration": 30,
        "risk": "🟢 Low Risk",
        "objective": "Core utility functions fra legacy system",
        "deliverables": [
            "src/utils/onboardingUtils.ts - 10+ utility functions",
            "Unit tests for alle utility functions"
        ],
        "dependencies": ["1.1"],
        "testing": "Unit tests for alle utility functions"
    },
    "2.1": {
        "title": "Subject Selection System",
        "phase": "FASE 2: ONBOARDING ENHANCEMENT",
        "duration": 75,
        "risk": "🟡 Medium Risk", 
        "objective": "Predefined subject options med emoji support",
        "deliverables": [
            "src/components/onboarding/SubjectSelector.tsx",
            "src/data/subjects.ts - 15+ predefined subjects",
            "Component tests + emoji detection tests"
        ],
        "dependencies": ["1.1", "1.2", "1.3"],
        "testing": "Component tests + emoji detection tests"
    },
    "2.2": {
        "title": "Toast Notification System",
        "phase": "FASE 2: ONBOARDING ENHANCEMENT",
        "duration": 45,
        "risk": "🟢 Low Risk",
        "objective": "Global toast notification system", 
        "deliverables": [
            "src/components/ui/Toast.tsx",
            "src/hooks/useToast.ts",
            "src/stores/toastStore.ts",
            "Component tests + hook tests"
        ],
        "dependencies": ["1.2"],
        "testing": "Component tests + hook tests"
    },
    "2.3": {
        "title": "File Upload Infrastructure",
        "phase": "FASE 2: ONBOARDING ENHANCEMENT",
        "duration": 90,
        "risk": "🔴 High Risk",
        "objective": "Comprehensive file upload system",
        "deliverables": [
            "src/components/onboarding/FileUpload.tsx",
            "src/utils/fileProcessing.ts",
            "File upload tests + edge case handling"
        ],
        "dependencies": ["1.1", "1.3", "2.2"],
        "testing": "File upload tests + edge case handling"
    },
    "2.4": {
        "title": "Content Management Interface",
        "phase": "FASE 2: ONBOARDING ENHANCEMENT",
        "duration": 60,
        "risk": "🟡 Medium Risk",
        "objective": "Content preview og management system",
        "deliverables": [
            "src/components/onboarding/ContentPreview.tsx",
            "src/components/onboarding/TextInput.tsx", 
            "src/components/onboarding/WebImport.tsx",
            "Component interaction tests"
        ],
        "dependencies": ["2.2", "2.3"],
        "testing": "Component interaction tests"
    },
    "2.5": {
        "title": "Timeline Management System",
        "phase": "FASE 2: ONBOARDING ENHANCEMENT",
        "duration": 75,
        "risk": "🟡 Medium Risk",
        "objective": "Preset timeline options med custom date support",
        "deliverables": [
            "src/components/onboarding/TimelineSelector.tsx",
            "src/utils/timelineUtils.ts",
            "Date calculation tests + component tests"
        ],
        "dependencies": ["1.1", "1.3"],
        "testing": "Date calculation tests + component tests"
    },
    "2.6": {
        "title": "Enhanced Navigation System",
        "phase": "FASE 2: ONBOARDING ENHANCEMENT",
        "duration": 45,
        "risk": "🟢 Low Risk",
        "objective": "Keyboard navigation og step management",
        "deliverables": [
            "src/hooks/useKeyboardNavigation.ts",
            "Enhanced OnboardingPage navigation",
            "Keyboard interaction tests"
        ],
        "dependencies": ["1.2"],
        "testing": "Keyboard interaction tests"
    },
    "3.1": {
        "title": "Content Processing Engine",
        "phase": "FASE 3: DATABRIDGE MIGRATION",
        "duration": 90,
        "risk": "🔴 High Risk",
        "objective": "Core content processing fra uploaded files",
        "deliverables": [
            "src/utils/contentProcessor.ts - ContentProcessor class",
            "Content processing tests + file type tests"
        ],
        "dependencies": ["1.1", "2.3"],
        "testing": "Content processing tests + file type tests"
    },
    "3.2": {
        "title": "Subject Intelligence System",
        "phase": "FASE 3: DATABRIDGE MIGRATION",
        "duration": 75,
        "risk": "🟡 Medium Risk",
        "objective": "Smart subject detection og content generation",
        "deliverables": [
            "src/utils/subjectIntelligence.ts - SubjectIntelligence class",
            "Subject-specific content templates",
            "Subject detection tests + content generation tests"
        ],
        "dependencies": ["1.1", "3.1"],
        "testing": "Subject detection tests + content generation tests"
    },
    "3.3": {
        "title": "Intelligent Fallback System",
        "phase": "FASE 3: DATABRIDGE MIGRATION",
        "duration": 60,
        "risk": "🟡 Medium Risk",
        "objective": "3-tier fallback hierarchy implementation",
        "deliverables": [
            "src/utils/fallbackSystem.ts - FallbackSystem class",
            "Fallback logic tests + integration tests"
        ],
        "dependencies": ["3.1", "3.2"],
        "testing": "Fallback logic tests + integration tests"
    },
    "3.4": {
        "title": "Enhanced DataBridge Core",
        "phase": "FASE 3: DATABRIDGE MIGRATION",
        "duration": 90,
        "risk": "🔴 High Risk",
        "objective": "Merge legacy DataBridge funktionalitet med moderne arkitektur",
        "deliverables": [
            "src/utils/dataBridge.ts (Enhanced) - DataBridge class",
            "DataBridge integration tests + data flow tests"
        ],
        "dependencies": ["3.1", "3.2", "3.3"],
        "testing": "DataBridge integration tests + data flow tests"
    },
    "3.5": {
        "title": "Progress Tracking System",
        "phase": "FASE 3: DATABRIDGE MIGRATION",
        "duration": 75,
        "risk": "🟡 Medium Risk",
        "objective": "Comprehensive progress tracking fra legacy",
        "deliverables": [
            "src/stores/progressStore.ts - ProgressStore interface",
            "src/utils/progressTracker.ts",
            "Progress calculation tests + streak tests"
        ],
        "dependencies": ["1.2"],
        "testing": "Progress calculation tests + streak tests"
    },
    "3.6": {
        "title": "Cross-Module Data Coordination",
        "phase": "FASE 3: DATABRIDGE MIGRATION",
        "duration": 60,
        "risk": "🟡 Medium Risk",
        "objective": "Event-driven data coordination mellem moduler",
        "deliverables": [
            "src/utils/eventBridge.ts - EventBridge class",
            "Integration med flashcard/quiz stores",
            "Event coordination tests + module integration tests"
        ],
        "dependencies": ["1.2", "3.5"],
        "testing": "Event coordination tests + module integration tests"
    },
    "4.1": {
        "title": "Error Boundary System",
        "phase": "FASE 4: INTEGRATION & POLISH",
        "duration": 45,
        "risk": "🟢 Low Risk",
        "objective": "Comprehensive error handling og recovery",
        "deliverables": [
            "src/components/ErrorBoundary.tsx",
            "src/hooks/useErrorHandler.ts",
            "src/utils/errorRecovery.ts",
            "Error scenario tests + recovery tests"
        ],
        "dependencies": ["ALL_PREVIOUS"],
        "testing": "Error scenario tests + recovery tests"
    },
    "4.2": {
        "title": "Data Validation & Sanitization",
        "phase": "FASE 4: INTEGRATION & POLISH",
        "duration": 60,
        "risk": "🟡 Medium Risk",
        "objective": "Robust data validation og security",
        "deliverables": [
            "src/utils/validation.ts",
            "src/schemas/validation.ts (Zod schemas)",
            "Validation tests + security tests"
        ],
        "dependencies": ["3.1", "3.4"],
        "testing": "Validation tests + security tests"
    },
    "4.3": {
        "title": "Performance Optimization",
        "phase": "FASE 4: INTEGRATION & POLISH",
        "duration": 75,
        "risk": "🟡 Medium Risk",
        "objective": "Optimize for large file handling og responsiveness",
        "deliverables": [
            "src/utils/performance.ts",
            "React.memo optimizations",
            "Performance tests + memory leak tests"
        ],
        "dependencies": ["2.3", "3.1"],
        "testing": "Performance tests + memory leak tests"
    },
    "4.4": {
        "title": "LocalStorage Management",
        "phase": "FASE 4: INTEGRATION & POLISH",
        "duration": 45,
        "risk": "🟢 Low Risk",
        "objective": "Intelligent storage management og cleanup",
        "deliverables": [
            "src/utils/storageManager.ts - StorageManager class",
            "Storage tests + quota handling tests"
        ],
        "dependencies": ["3.4", "3.5"],
        "testing": "Storage tests + quota handling tests"
    },
    "4.5": {
        "title": "Comprehensive Testing Suite",
        "phase": "FASE 4: INTEGRATION & POLISH",
        "duration": 90,
        "risk": "🟡 Medium Risk",
        "objective": "End-to-end testing coverage",
        "deliverables": [
            "tests/onboarding.test.tsx",
            "tests/databridge.test.ts", 
            "tests/integration.test.tsx",
            "Test coverage > 90%"
        ],
        "dependencies": ["ALL_PREVIOUS"],
        "testing": "Test coverage > 90%"
    },
    "5.1": {
        "title": "Advanced Analytics",
        "phase": "FASE 5: ENTERPRISE FEATURES",
        "duration": 60,
        "risk": "🟡 Medium Risk",
        "objective": "Detailed usage analytics og insights",
        "deliverables": [
            "src/utils/analytics.ts",
            "Analytics tests + privacy compliance"
        ],
        "dependencies": ["3.5"],
        "testing": "Analytics tests + privacy compliance"
    },
    "5.2": {
        "title": "Backup & Recovery System",
        "phase": "FASE 5: ENTERPRISE FEATURES",
        "duration": 45,
        "risk": "🟢 Low Risk",
        "objective": "Data backup og recovery mechanisms",
        "deliverables": [
            "src/utils/backup.ts",
            "Backup/restore tests"
        ],
        "dependencies": ["3.4", "4.4"],
        "testing": "Backup/restore tests"
    },
    "5.3": {
        "title": "Admin Dashboard Integration",
        "phase": "FASE 5: ENTERPRISE FEATURES",
        "duration": 75,
        "risk": "🟡 Medium Risk",
        "objective": "Admin tools for content management",
        "deliverables": [
            "src/components/admin/OnboardingAdmin.tsx",
            "Admin functionality tests"
        ],
        "dependencies": ["5.1", "5.2"],
        "testing": "Admin functionality tests"
    },
    "5.4": {
        "title": "API Integration Preparation",
        "phase": "FASE 5: ENTERPRISE FEATURES",
        "duration": 60,
        "risk": "🟡 Medium Risk",
        "objective": "Prepare for backend integration",
        "deliverables": [
            "src/api/onboardingApi.ts",
            "API integration tests + offline tests"
        ],
        "dependencies": ["3.4", "4.2"],
        "testing": "API integration tests + offline tests"
    },
    "5.5": {
        "title": "Documentation & Deployment",
        "phase": "FASE 5: ENTERPRISE FEATURES",
        "duration": 45,
        "risk": "🟢 Low Risk",
        "objective": "Complete documentation og deployment readiness",
        "deliverables": [
            "docs/onboarding-system.md",
            "docs/databridge-architecture.md",
            "docs/deployment-guide.md",
            "Documentation review + deployment tests"
        ],
        "dependencies": ["ALL_PREVIOUS"],
        "testing": "Documentation review + deployment tests"
    }
}

def get_timestamp():
    """Generate ISO timestamp for logging"""
    return datetime.now(timezone.utc).isoformat()

def initialize_tdd_system():
    """Initialize TDD directory structure"""
    TDD_DIR.mkdir(exist_ok=True)
    
    # Initialize session log if not exists
    if not SESSION_LOG_FILE.exists():
        SESSION_LOG_FILE.write_text(json.dumps([], indent=2))
    
    # Initialize status file
    if not CURRENT_STATUS_FILE.exists():
        initial_status = {
            "completed_sessions": [],
            "current_phase": "FASE 1: FOUNDATION",
            "total_sessions": len(ROADMAP_SESSIONS),
            "last_updated": get_timestamp()
        }
        CURRENT_STATUS_FILE.write_text(json.dumps(initial_status, indent=2))

def log_session(session_id, action_description):
    """Log a completed session"""
    if session_id not in ROADMAP_SESSIONS:
        print(f"❌ Unknown session: {session_id}")
        return False
    
    # Load existing log
    log_data = json.loads(SESSION_LOG_FILE.read_text())
    
    # Add new session
    session_entry = {
        "session_id": session_id,
        "title": ROADMAP_SESSIONS[session_id]["title"],
        "phase": ROADMAP_SESSIONS[session_id]["phase"],
        "action": action_description,
        "timestamp": get_timestamp(),
        "duration": ROADMAP_SESSIONS[session_id]["duration"],
        "deliverables": ROADMAP_SESSIONS[session_id]["deliverables"]
    }
    
    log_data.append(session_entry)
    SESSION_LOG_FILE.write_text(json.dumps(log_data, indent=2))
    
    # Update status
    update_status(session_id)
    
    print(f"✅ Session {session_id} logged: {action_description}")
    return True

def update_status(completed_session_id):
    """Update current status after session completion"""
    status = json.loads(CURRENT_STATUS_FILE.read_text())
    
    if completed_session_id not in status["completed_sessions"]:
        status["completed_sessions"].append(completed_session_id)
    
    # Update current phase
    current_phase = ROADMAP_SESSIONS[completed_session_id]["phase"]
    status["current_phase"] = current_phase
    status["last_updated"] = get_timestamp()
    
    CURRENT_STATUS_FILE.write_text(json.dumps(status, indent=2))
    
    # Generate reports
    generate_progress_report()
    generate_next_steps()

def get_available_sessions():
    """Get sessions that can be started based on completed dependencies"""
    status = json.loads(CURRENT_STATUS_FILE.read_text())
    completed = set(status["completed_sessions"])
    available = []
    
    for session_id, session_info in ROADMAP_SESSIONS.items():
        if session_id in completed:
            continue
            
        dependencies = session_info["dependencies"]
        if not dependencies or dependencies == ["ALL_PREVIOUS"]:
            # Handle special cases
            if dependencies == ["ALL_PREVIOUS"]:
                # Check if all previous sessions are done
                all_previous_done = len(completed) >= len(ROADMAP_SESSIONS) - 5  # Rough check for phase 4+
                if all_previous_done:
                    available.append(session_id)
            else:
                available.append(session_id)
        else:
            # Check if all dependencies are completed
            if all(dep in completed for dep in dependencies):
                available.append(session_id)
    
    return sorted(available)

def generate_progress_report():
    """Generate markdown progress summary"""
    status = json.loads(CURRENT_STATUS_FILE.read_text())
    log_data = json.loads(SESSION_LOG_FILE.read_text())
    
    completed_count = len(status["completed_sessions"])
    total_count = status["total_sessions"]
    progress_percent = (completed_count / total_count) * 100
    
    # Group by phases
    phases = {}
    for session in log_data:
        phase = session["phase"]
        if phase not in phases:
            phases[phase] = []
        phases[phase].append(session)
    
    report = f"""# 🚀 EXAMKLAR TDD PROGRESS REPORT

## 📊 Overall Progress
- **Completed**: {completed_count}/{total_count} sessions ({progress_percent:.1f}%)
- **Current Phase**: {status["current_phase"]}
- **Last Updated**: {status["last_updated"]}

## 📋 Phase Breakdown
"""
    
    for phase_name in ["FASE 1: FOUNDATION", "FASE 2: ONBOARDING ENHANCEMENT", 
                       "FASE 3: DATABRIDGE MIGRATION", "FASE 4: INTEGRATION & POLISH", 
                       "FASE 5: ENTERPRISE FEATURES"]:
        phase_sessions = phases.get(phase_name, [])
        report += f"\n### {phase_name}\n"
        if phase_sessions:
            for session in phase_sessions:
                report += f"- ✅ **{session['session_id']}**: {session['title']}\n"
        else:
            report += "- 🔄 Not started\n"
    
    PROGRESS_FILE.write_text(report)

def generate_next_steps():
    """Generate next steps plan"""
    available = get_available_sessions()
    
    next_steps = """# 🎯 NEXT STEPS PLAN

## 🚀 Available Sessions
"""
    
    if not available:
        next_steps += "\n🎉 **All sessions completed!**\n"
    else:
        for session_id in available[:5]:  # Show next 5 available
            session = ROADMAP_SESSIONS[session_id]
            next_steps += f"""
### {session_id}: {session['title']}
- **Phase**: {session['phase']}
- **Duration**: {session['duration']} min
- **Risk**: {session['risk']}
- **Objective**: {session['objective']}

**Deliverables**:
"""
            for deliverable in session['deliverables']:
                next_steps += f"- {deliverable}\n"
    
    NEXT_STEPS_FILE.write_text(next_steps)

def show_status():
    """Show current status"""
    status = json.loads(CURRENT_STATUS_FILE.read_text())
    available = get_available_sessions()
    
    print(f"\n🎯 EXAMKLAR TDD STATUS")
    print(f"📊 Progress: {len(status['completed_sessions'])}/{status['total_sessions']} sessions")
    print(f"🔄 Current Phase: {status['current_phase']}")
    print(f"🚀 Available Sessions: {len(available)}")
    
    if available:
        print(f"\n📋 Next Recommended:")
        next_session = available[0]
        session_info = ROADMAP_SESSIONS[next_session]
        print(f"   {next_session}: {session_info['title']}")
        print(f"   Duration: {session_info['duration']} min | {session_info['risk']}")

def main():
    """CLI interface for TDD system"""
    initialize_tdd_system()
    
    if len(sys.argv) < 2:
        show_status()
        return
    
    command = sys.argv[1]
    
    if command == "status":
        show_status()
    elif command == "available":
        available = get_available_sessions()
        print(f"\n🚀 Available Sessions ({len(available)}):")
        for session_id in available:
            session = ROADMAP_SESSIONS[session_id]
            print(f"  {session_id}: {session['title']} ({session['duration']}min)")
    elif len(sys.argv) >= 3:
        session_id = command
        action = " ".join(sys.argv[2:])
        log_session(session_id, action)
    else:
        print("Usage: python3 newtdd.py [session_id] [action_description]")
        print("       python3 newtdd.py status")
        print("       python3 newtdd.py available")

if __name__ == "__main__":
    main()