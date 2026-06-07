---
name: feature-development
description: Standards for writing code and implementing system features.
activation:
  glob: "src/**/*"
---
# Feature Development Code Style

## Model Selection Constraint
- ROUTE code generation to **Claude Sonnet 4.6** with **Thinking: Medium** or **Low** to save quota.

## Coding Standards
- Follow clean code, DRY, and KISS principles.
- Add robust error handling (try/catch blocks) and semantic logging for every asynchronous or IO operation.
