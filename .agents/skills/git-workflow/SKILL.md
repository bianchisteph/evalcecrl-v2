---
name: git-workflow
description: Standard git workflow for this project. Use for all version control operations.
---

# Skill: Git Workflow

Standard git workflow for this project.

## When to use
Use this skill for all version control operations.

## Branch Strategy

```
main          ← Production (deployed to Vercel automatically)
  └── feat/*  ← Feature branches
  └── fix/*   ← Bug fix branches
  └── chore/* ← Maintenance (deps, config, docs)
```

## Commit Message Convention

Format: `type(scope): description`

### Types
| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `style` | CSS/UI changes only |
| `refactor` | Code restructuring (no behavior change) |
| `docs` | Documentation |
| `chore` | Dependencies, config, tooling |
| `data` | Schema changes, migrations |

### Scopes
| Scope | Files |
|-------|-------|
| `teacher` | TeacherSelect, TeacherContext |
| `class` | ClassManage, StudentTable |
| `eval` | EvalGrid, EvalSpreadsheet, SessionSelector |
| `chart` | RadarChart, Chart.js config |
| `db` | schema.sql, supabase.js |
| `ui` | index.css, Layout |
| `config` | vite.config, package.json, .env |

### Examples
```
feat(eval): add CSV export for evaluation grid
fix(class): prevent duplicate class names per teacher
style(ui): improve mobile responsiveness for session tabs
refactor(db): extract Supabase queries to shared hooks
data(db): add notes column to evaluations table
chore(config): update vite to v8.1
```

## Pre-Commit Checklist

1. `npm run build` passes without errors
2. No `.env` or secrets in staged files
3. No `console.log()` left in production code (warn OK)
4. Commit message follows convention
5. Changes are atomic (one feature per commit)

## Files to NEVER Commit
- `.env` (contains Supabase keys)
- `node_modules/`
- `dist/`
