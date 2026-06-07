---
name: supabase-crud-pattern
description: Guidelines and examples for performing Supabase CRUD operations correctly. Use when writing database query integrations in UI components.
---

# Skill: Supabase CRUD Pattern

Standardized pattern for all Supabase data operations in this project.

## When to use
Use this skill whenever creating or modifying a component that performs Supabase CRUD operations (insert, select, update, delete, upsert).

## Pattern

```jsx
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useTeacher } from '../context/TeacherContext';

// 1. LOAD DATA — Always filter by teacher_id chain
const loadData = async () => {
  setLoading(true);
  try {
    const { data, error } = await supabase
      .from('TABLE_NAME')
      .select('*')
      .eq('teacher_id', teacherId) // GDPR: mandatory filter
      .order('COLUMN', { ascending: true });

    if (error) throw error;
    setData(data || []);
  } catch (err) {
    toast.error('Erreur chargement : ' + err.message);
  } finally {
    setLoading(false);
  }
};

// 2. CREATE — Always .select().single() to get the created record back
const handleCreate = async (payload) => {
  setCreating(true);
  try {
    const { data, error } = await supabase
      .from('TABLE_NAME')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    setItems([data, ...items]); // Optimistic UI: prepend
    toast.success('Créé avec succès');
  } catch (err) {
    toast.error('Erreur : ' + err.message);
  } finally {
    setCreating(false);
  }
};

// 3. UPDATE (Evaluations) — Always upsert with conflict key
const handleUpsert = async (records) => {
  setSaving(true);
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .upsert(records, { onConflict: 'student_id,session_name' })
      .select();

    if (error) throw error;
    onDataChange(data);
    toast.success(`${records.length} enregistrement(s) sauvegardé(s)`);
  } catch (err) {
    toast.error('Erreur de sauvegarde : ' + err.message);
  } finally {
    setSaving(false);
  }
};

// 4. DELETE — Always confirm + filter by teacher_id when possible
const handleDelete = async (item) => {
  if (!window.confirm(`Supprimer "${item.name}" ?`)) return;

  try {
    const { error } = await supabase
      .from('TABLE_NAME')
      .delete()
      .eq('id', item.id)
      .eq('teacher_id', teacherId); // Double sécurité GDPR

    if (error) throw error;
    setItems(items.filter((i) => i.id !== item.id));
    toast.success('Supprimé');
  } catch (err) {
    toast.error('Erreur : ' + err.message);
  }
};
```

## Checklist
- [ ] Chaque appel dans un try/catch
- [ ] toast.error() dans le catch
- [ ] Loading state géré (setLoading/setCreating/setSaving)
- [ ] Filtre teacher_id pour l'isolation GDPR
- [ ] `window.confirm()` avant les DELETE
- [ ] `.select()` après insert/upsert pour récupérer les données
- [ ] État UI mis à jour de façon optimiste après succès
