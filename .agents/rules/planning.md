---
name: planning
description: Constraints for architectural changes and step-by-step implementation plans.
activation:
  model_decision: "When the user asks to plan a feature, map an architecture, or sketch a solution."
---
# Architectural Planning Rule

## Model Selection Constraint
- FORCE the execution of this phase through **Claude Opus 4.6 (Thinking: High)** or **Claude Sonnet 4.6 (Thinking: High)**.
- Maximize extended thinking to avoid regressions.

## Instructions
1. Break down the task into atomic, numbered execution steps.
2. Present the plan to the user and halt execution until the user explicitly says "Go" or "Approved".
