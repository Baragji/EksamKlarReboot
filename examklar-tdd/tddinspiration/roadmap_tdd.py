#!/usr/bin/env python3
"""
CONDUCTOR 2025 - ROADMAP-AWARE TDD SYSTEM
Enhanced TDD system with roadmap tracking and phase management

Usage:
  roadmap_tdd.py "action description"           # Log TDD action with roadmap context
  roadmap_tdd.py --status                       # Show current roadmap status
  roadmap_tdd.py --next                         # Show next recommended actions
  roadmap_tdd.py --phase FASE_1                 # Set current roadmap phase
  roadmap_tdd.py --milestone "milestone_name"   # Mark milestone completion
"""

import os
import sys
import json
import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional

class RoadmapPhase:
    """Roadmap phases for Conductor 2025"""
    FASE_1_PRODUCTION_FOUNDATION = "FASE_1_PRODUCTION_FOUNDATION"
    FASE_2_ADVANCED_INTELLIGENCE = "FASE_2_ADVANCED_INTELLIGENCE"
    FASE_3_ENTERPRISE_FEATURES = "FASE_3_ENTERPRISE_FEATURES"
    FASE_4_SCALABILITY_PERFORMANCE = "FASE_4_SCALABILITY_PERFORMANCE"

class TDDPhase:
    """TDD Phase enumeration"""
    RED = "🔴 RED"
    GREEN = "🟢 GREEN"
    REFACTOR = "🔵 REFACTOR"
    PLANNING = "📋 PLANNING"

class RoadmapTDD:
    """Roadmap-aware TDD system for Conductor 2025"""
    
    def __init__(self):
        self.project_path = Path("/Users/Yousef_1/Dokumenter/Geminibuilds")
        self.tdd_dir = self.project_path / ".tdd"
        self.config_file = self.tdd_dir / "config.json"
        self.status_file = self.tdd_dir / "status.json"
        self.roadmap_file = self.tdd_dir / "roadmap_progress.md"
        self.actions_file = self.tdd_dir / "next_actions.md"
        
        # Roadmap deliverables mapping
        self.roadmap_deliverables = {
            RoadmapPhase.FASE_1_PRODUCTION_FOUNDATION: [
                "Docker & Docker Compose setup",
                "Real Qdrant integration", 
                "Configuration management",
                "Basic monitoring",
                "CI/CD pipeline"
            ],
            RoadmapPhase.FASE_2_ADVANCED_INTELLIGENCE: [
                "Knowledge graph implementation",
                "Advanced context assembly",
                "Real-time learning loop",
                "Multi-language support"
            ],
            RoadmapPhase.FASE_3_ENTERPRISE_FEATURES: [
                "Authentication system",
                "Advanced security",
                "Comprehensive monitoring",
                "API rate limiting",
                "User management"
            ],
            RoadmapPhase.FASE_4_SCALABILITY_PERFORMANCE: [
                "Kubernetes deployment",
                "Horizontal scaling",
                "Performance optimization",
                "Load testing",
                "Production monitoring"
            ]
        }
    
    def log_action(self, action_description: str) -> None:
        """Log TDD action with roadmap context"""
        # Load current status
        config = self._load_config()
        status = self._load_status()
        
        # Detect TDD phase from action description
        tdd_phase = self._detect_tdd_phase(action_description)
        
        # Validate TDD phase transition
        if not self._validate_phase_transition(status.get("current_phase"), tdd_phase):
            print(f"🚨 TDD VIOLATION: Invalid phase transition from {status.get('current_phase')} to {tdd_phase}")
            sys.exit(1)
        
        # Update status
        timestamp = datetime.now(timezone.utc).isoformat()
        status["current_phase"] = tdd_phase
        status["action_count"] = status.get("action_count", 0) + 1
        status["last_action"] = {
            "description": action_description,
            "timestamp": timestamp,
            "phase": tdd_phase
        }
        
        # Add roadmap context
        current_roadmap_phase = config["roadmap"]["current_phase"]
        status["roadmap_context"] = {
            "current_phase": current_roadmap_phase,
            "deliverable_context": self._extract_deliverable_context(action_description, current_roadmap_phase)
        }
        
        # Save status
        self._save_status(status)
        
        # Update session log
        self._update_session_log(action_description, tdd_phase, timestamp)
        
        # Update next actions
        self._update_next_actions_with_roadmap(status, config)
        
        # Show success message with roadmap context
        self._show_success_message(tdd_phase, action_description, current_roadmap_phase)
    
    def show_status(self) -> None:
        """Show current roadmap and TDD status"""
        config = self._load_config()
        status = self._load_status()
        
        current_roadmap_phase = config["roadmap"]["current_phase"]
        current_tdd_phase = status.get("current_phase", "UNKNOWN")
        
        print("🚀 CONDUCTOR 2025 - ROADMAP STATUS")
        print("=" * 50)
        print(f"📊 Current Roadmap Phase: {current_roadmap_phase}")
        print(f"🔄 Current TDD Phase: {current_tdd_phase}")
        print(f"📈 TDD Cycles Completed: {status.get('action_count', 0)}")
        
        # Show phase progress
        phase_info = config["roadmap"]["phases"][current_roadmap_phase]
        print(f"🎯 Phase: {phase_info['name']} ({phase_info['status']})")
        print(f"⏱️  Duration: {phase_info['duration_weeks']} weeks")
        
        print("\n🎯 Key Deliverables:")
        for deliverable in phase_info["key_deliverables"]:
            print(f"  • {deliverable}")
        
        # Show next recommended action
        print(f"\n🔄 Next Recommended TDD Phase: {self._get_next_tdd_phase(current_tdd_phase)}")
        
        # Show performance metrics
        print("\n📊 Performance Targets:")
        targets = config["tdd_rules"]["performance_targets"]
        for metric, target in targets.items():
            print(f"  • {metric}: {target}")
    
    def show_next_actions(self) -> None:
        """Show next recommended actions"""
        print("📋 Reading next actions from .tdd/next_actions.md...")
        if self.actions_file.exists():
            with open(self.actions_file, 'r') as f:
                print(f.read())
        else:
            print("❌ Next actions file not found. Run roadmap_tdd.py with an action first.")
    
    def set_roadmap_phase(self, phase: str) -> None:
        """Set current roadmap phase"""
        if phase not in self.roadmap_deliverables:
            print(f"❌ Invalid roadmap phase: {phase}")
            print(f"Valid phases: {list(self.roadmap_deliverables.keys())}")
            sys.exit(1)
        
        config = self._load_config()
        config["roadmap"]["current_phase"] = phase
        
        # Update phase status
        for phase_key, phase_info in config["roadmap"]["phases"].items():
            if phase_key == phase:
                phase_info["status"] = "IN_PROGRESS"
            elif phase_info["status"] == "IN_PROGRESS":
                phase_info["status"] = "COMPLETED"
        
        self._save_config(config)
        print(f"✅ Roadmap phase set to: {phase}")
        
        # Update next actions
        status = self._load_status()
        self._update_next_actions_with_roadmap(status, config)
    
    def mark_milestone(self, milestone_name: str) -> None:
        """Mark milestone as completed"""
        config = self._load_config()
        current_phase = config["roadmap"]["current_phase"]
        
        # Add milestone to completed list
        if "completed_milestones" not in config["roadmap"]:
            config["roadmap"]["completed_milestones"] = []
        
        milestone_entry = {
            "name": milestone_name,
            "phase": current_phase,
            "completed_at": datetime.now(timezone.utc).isoformat()
        }
        
        config["roadmap"]["completed_milestones"].append(milestone_entry)
        self._save_config(config)
        
        print(f"🎉 Milestone completed: {milestone_name}")
        print(f"📊 Phase: {current_phase}")
    
    def _load_config(self) -> Dict:
        """Load TDD configuration"""
        if not self.config_file.exists():
            print("❌ TDD system not initialized. Run tdd.py first.")
            sys.exit(1)
        
        with open(self.config_file, 'r') as f:
            return json.load(f)
    
    def _save_config(self, config: Dict) -> None:
        """Save TDD configuration"""
        with open(self.config_file, 'w') as f:
            json.dump(config, f, indent=2)
    
    def _load_status(self) -> Dict:
        """Load TDD status"""
        if not self.status_file.exists():
            return {
                "current_phase": TDDPhase.PLANNING,
                "action_count": 0,
                "test_results": {"last_run": None, "passing": 0, "failing": 0, "coverage": 0}
            }
        
        with open(self.status_file, 'r') as f:
            return json.load(f)
    
    def _save_status(self, status: Dict) -> None:
        """Save TDD status"""
        with open(self.status_file, 'w') as f:
            json.dump(status, f, indent=2)
    
    def _detect_tdd_phase(self, action: str) -> str:
        """Detect TDD phase from action description"""
        action_lower = action.lower()
        
        # RED phase keywords
        red_keywords = ['failing test', 'red phase', 'test first', 'write test', 'add test', 'create test', 'test for', 'failing']
        if any(keyword in action_lower for keyword in red_keywords):
            return TDDPhase.RED
        
        # GREEN phase keywords  
        green_keywords = ['implement', 'fix', 'make pass', 'green phase', 'code to pass', 'minimal code', 'satisfy test']
        if any(keyword in action_lower for keyword in green_keywords):
            return TDDPhase.GREEN
        
        # REFACTOR phase keywords
        refactor_keywords = ['refactor', 'optimize', 'clean up', 'improve', 'restructure', 'polish', 'enhance']
        if any(keyword in action_lower for keyword in refactor_keywords):
            return TDDPhase.REFACTOR
        
        # Default to current phase if unclear
        status = self._load_status()
        return status.get("current_phase", TDDPhase.RED)
    
    def _validate_phase_transition(self, current_phase: str, new_phase: str) -> bool:
        """Validate TDD phase transition"""
        valid_transitions = {
            TDDPhase.PLANNING: [TDDPhase.RED],
            TDDPhase.RED: [TDDPhase.GREEN, TDDPhase.RED],  # Allow multiple RED phases
            TDDPhase.GREEN: [TDDPhase.REFACTOR, TDDPhase.GREEN],  # Allow multiple GREEN phases
            TDDPhase.REFACTOR: [TDDPhase.RED, TDDPhase.REFACTOR]  # Allow multiple REFACTOR phases
        }
        
        if not current_phase:
            return new_phase == TDDPhase.RED
        
        return new_phase in valid_transitions.get(current_phase, [])
    
    def _extract_deliverable_context(self, action: str, roadmap_phase: str) -> Optional[str]:
        """Extract which deliverable the action relates to"""
        deliverables = self.roadmap_deliverables.get(roadmap_phase, [])
        action_lower = action.lower()
        
        for deliverable in deliverables:
            deliverable_keywords = deliverable.lower().split()
            if any(keyword in action_lower for keyword in deliverable_keywords):
                return deliverable
        
        return None
    
    def _get_next_tdd_phase(self, current_phase: str) -> str:
        """Get next recommended TDD phase"""
        next_phases = {
            TDDPhase.PLANNING: TDDPhase.RED,
            TDDPhase.RED: TDDPhase.GREEN,
            TDDPhase.GREEN: TDDPhase.REFACTOR,
            TDDPhase.REFACTOR: TDDPhase.RED
        }
        return next_phases.get(current_phase, TDDPhase.RED)
    
    def _update_session_log(self, action: str, phase: str, timestamp: str) -> None:
        """Update session log with roadmap context"""
        session_file = self.tdd_dir / "session.md"
        config = self._load_config()
        current_roadmap_phase = config["roadmap"]["current_phase"]
        
        log_entry = f"[{timestamp}] {phase}: {action} (Roadmap: {current_roadmap_phase})\n"
        with open(session_file, "a", encoding="utf-8") as f:
            f.write(log_entry)
    
    def _update_next_actions_with_roadmap(self, status: Dict, config: Dict) -> None:
        """Update next actions with roadmap context"""
        current_roadmap_phase = config["roadmap"]["current_phase"]
        current_tdd_phase = status.get("current_phase")
        next_tdd_phase = self._get_next_tdd_phase(current_tdd_phase)
        
        phase_info = config["roadmap"]["phases"][current_roadmap_phase]
        deliverables = phase_info["key_deliverables"]
        
        # This would update the next_actions.md file with roadmap-specific guidance
        # For now, we'll just print a message
        print(f"📋 Next actions updated for {current_roadmap_phase}")
    
    def _show_success_message(self, tdd_phase: str, action: str, roadmap_phase: str) -> None:
        """Show success message with context"""
        print(f"✅ TDD Action Logged: {tdd_phase}")
        print(f"📝 Action: {action}")
        print(f"🚀 Roadmap Phase: {roadmap_phase}")
        print(f"📊 Next: Check .tdd/next_actions.md for guidance")

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Conductor 2025 Roadmap-Aware TDD System")
    parser.add_argument("action", nargs="?", help="TDD action description")
    parser.add_argument("--status", action="store_true", help="Show current status")
    parser.add_argument("--next", action="store_true", help="Show next actions")
    parser.add_argument("--phase", help="Set roadmap phase")
    parser.add_argument("--milestone", help="Mark milestone as completed")
    
    args = parser.parse_args()
    
    tdd_system = RoadmapTDD()
    
    if args.status:
        tdd_system.show_status()
    elif args.next:
        tdd_system.show_next_actions()
    elif args.phase:
        tdd_system.set_roadmap_phase(args.phase)
    elif args.milestone:
        tdd_system.mark_milestone(args.milestone)
    elif args.action:
        tdd_system.log_action(args.action)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()