---
name: schema-migration-pattern
description: Rules and patterns for writing and executing database migrations in Supabase. Use when modifying the database schema.
---

# Skill: Schema Migration Pattern

How to safely modify the Supabase database schema.

## When to use
Use this skill whenever adding tables, columns, indexes, or constraints to the database.

## Rules

1. **Never modify existing columns in-place** — always ADD new columns, migrate data, then drop old ones
2. **Always add COMMENT ON** for new tables/columns
3. **Always add indexes** on foreign keys and frequently queried columns
4. **Respect the naming convention**:
   - Tables: plural, snake_case (`evaluations`, `students`)
   - Columns: snake_case (`skill_listening`, `session_name`)
   - Indexes: `idx_tablename_column` (`idx_evaluations_student`)
   - Triggers: `trg_tablename_action` (`trg_evaluations_updated_at`)
5. **Always include `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`**
6. **Use UUIDs as primary keys**: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
7. **CASCADE on FK deletes**: `REFERENCES parent(id) ON DELETE CASCADE`

## Migration Template

```sql
-- ============================================================
-- Migration: [DESCRIPTION]
-- Date: [YYYY-MM-DD]
-- ============================================================

-- 1. Add new table/column
ALTER TABLE table_name ADD COLUMN new_column TYPE;

-- 2. Set default for existing rows (if needed)
UPDATE table_name SET new_column = default_value WHERE new_column IS NULL;

-- 3. Add constraints
ALTER TABLE table_name ALTER COLUMN new_column SET NOT NULL;

-- 4. Add indexes
CREATE INDEX idx_table_column ON table_name(new_column);

-- 5. Add comments
COMMENT ON COLUMN table_name.new_column IS 'Description of this column.';

-- 6. Prepare RLS policy (commented for MVP)
-- CREATE POLICY "policy_name" ON table_name
--   FOR ALL USING (condition);
```

## CHECK Constraints Already in Use

- `session_name IN ('S1','S2','S3','S4','S5','S6')`
- `skill_* IN ('A1','A2','B1','B2','C1','C2')` for all 5 skills
- `UNIQUE(student_id, session_name)` on evaluations

## RLS Pattern (For Future Auth)

```sql
-- Chain through to teacher_id for student-level data
CREATE POLICY "evaluations_own_data" ON evaluations
  FOR ALL USING (
    student_id IN (
      SELECT s.id FROM students s
      JOIN classes c ON s.class_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );
```
