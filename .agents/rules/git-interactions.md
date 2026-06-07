---
name: git-interactions
description: Safety guardrails for repository staging, commits, and pushing code.
activation:
  trigger_words: ["git", "commit", "push", "pr", "branch"]
---
# Git Safe Operations Rule

## Model Selection Constraint
- ALWAYS process Git inspections and commit formatting using **Gemini 3.5 Flash** (fast and low quota cost).

## Hard Constraints
- NEVER run `git commit` or `git push` invisibly.
- ALWAYS print the exact command and target branch to the chat interface.
- AWAIT explicit user confirmation before executing any write operations on the repository.
- Use Conventional Commits formatting (`feat:`, `fix:`, `docs:`).
