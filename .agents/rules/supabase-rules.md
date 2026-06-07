# Supabase & PostgreSQL Expert Rules

Apply these rules when writing, debugging, or editing database schemas (`schema.sql` or migrations), PostgreSQL policies, or any JS/JSX files interacting with Supabase.

## Database & API Design

- **GDPR Compliance & Data Isolation**: All data queries and manipulations on `classes`, `students`, and `evaluations` must enforce strict isolation by `teacher_id`. Every table that belongs to a tenant must eventually relate to `teachers.id`.
- **Cascading Deletes**: Always use `ON DELETE CASCADE` constraints in foreign key relationships. Never attempt to perform manual cascading deletes in client application code; let PostgreSQL handle the relational cascade automatically.
- **Index Optimization**: Define indexes for columns frequently used in joins or filter queries, particularly `teacher_id` and foreign key fields.
- **Documentation**: Always write `COMMENT ON TABLE` and `COMMENT ON COLUMN` descriptions in SQL files for every table and column created or updated.

## Query & Mutation Patterns

- **Upsert Pattern**: When saving evaluations, always use `.upsert(records, { onConflict: 'student_id,session_name' })`. Never use simple insertion, as evaluation entries are unique per student and session.
- **Row Level Security (RLS)**: When writing RLS policies, ensure they chain securely through the relationship to `teacher_id`. Use subqueries if necessary to verify that the authenticating user (teacher) owns the class/student/evaluation being modified.
- **Error Handling**: Wrap all Supabase client calls in `try/catch` blocks. Log the error internally and trigger user-friendly notifications via `toast.error()`.
