-- ============================================================
-- EvalCECRL V2 — Schéma de Base de Données (DDL)
-- PostgreSQL / Supabase
-- Architecture GDPR-Ready (Privacy by Design)
-- ============================================================

-- Extension pour la génération d'UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. TABLE : teachers (Enseignants)
-- ============================================================
CREATE TABLE teachers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE teachers IS 'Profils enseignants. Clé pivot pour l''isolation des données (GDPR).';

-- ============================================================
-- 2. TABLE : classes (Classes)
-- ============================================================
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,               -- ex: "2BPM1"
  academic_year TEXT NOT NULL,       -- ex: "2025-2026"
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_classes_teacher ON classes(teacher_id);

COMMENT ON TABLE classes IS 'Classes rattachées à un enseignant. Filtrées par teacher_id.';

-- ============================================================
-- 3. TABLE : students (Élèves)
-- ============================================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  -- Colonnes GDPR-ready pour chiffrement futur (v2)
  encrypted_first_name BYTEA,
  encrypted_last_name BYTEA,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_students_class ON students(class_id);

COMMENT ON TABLE students IS 'Élèves rattachés à une classe. Colonnes encrypted_* prêtes pour chiffrement futur.';

-- ============================================================
-- 4. TABLE : evaluations (Évaluations CECRL)
-- ============================================================
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL CHECK (session_name IN ('S1','S2','S3','S4','S5','S6')),
  skill_listening TEXT CHECK (skill_listening IN ('A1','A2','B1','B2','C1','C2')),
  skill_reading TEXT CHECK (skill_reading IN ('A1','A2','B1','B2','C1','C2')),
  skill_speaking_continuous TEXT CHECK (skill_speaking_continuous IN ('A1','A2','B1','B2','C1','C2')),
  skill_speaking_interaction TEXT CHECK (skill_speaking_interaction IN ('A1','A2','B1','B2','C1','C2')),
  skill_writing TEXT CHECK (skill_writing IN ('A1','A2','B1','B2','C1','C2')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Contrainte d'unicité : un seul enregistrement par élève par session
  UNIQUE(student_id, session_name)
);

CREATE INDEX idx_evaluations_student ON evaluations(student_id);

COMMENT ON TABLE evaluations IS 'Évaluations CECRL par session. 5 compétences, niveaux A1-C2. Upsert sur (student_id, session_name).';

-- ============================================================
-- 5. TRIGGER : Mise à jour automatique de updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_evaluations_updated_at
  BEFORE UPDATE ON evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 6. TRIGGER : Synchronisation automatique auth.users -> public.teachers
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.teachers (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Enseignant'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 7. RLS POLICIES (Sécurité des données par enseignant)
-- ============================================================

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teachers_own_data" ON teachers
  FOR ALL USING (id = auth.uid());

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "classes_own_data" ON classes
  FOR ALL USING (teacher_id = auth.uid());

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students_own_data" ON students
  FOR ALL USING (
    class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid())
  );

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "evaluations_own_data" ON evaluations
  FOR ALL USING (
    student_id IN (
      SELECT s.id FROM students s
      JOIN classes c ON s.class_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );
