---
name: new-component-scaffold
description: Pattern and templates for scaffolding new React components in this project. Use whenever creating a new component or page.
---

# Skill: New Component Scaffold

Standard templates and steps for creating new React components and pages in this project.

## When to use
Use this skill whenever creating a new component in `src/components/` or a new page in `src/pages/`.

## Component Template (src/components/)

```jsx
import { useState } from 'react';
// Import only what you need from the project
// import toast from 'react-hot-toast';
// import { supabase } from '../lib/supabase';
// import { useTeacher } from '../context/TeacherContext';
// import { CECRL_LEVELS, SKILLS, SESSIONS } from '../utils/constants';

/**
 * ComponentName — Brief description of what this component does.
 *
 * @param {Object} props
 * @param {Array} props.items - Description of the prop
 * @param {Function} props.onAction - Callback when action occurs
 */
export default function ComponentName({ items, onAction }) {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="text-center text-muted" style={{ padding: '40px 0' }}>
        Chargement...
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <div className="empty-state-title">Aucun élément</div>
        <div className="empty-state-text">
          Description de l'état vide et action possible.
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Component content */}
    </div>
  );
}
```

## Page Template (src/pages/)

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useTeacher } from '../context/TeacherContext';

export default function PageName() {
  const { teacherId } = useTeacher();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teacherId) loadData();
  }, [teacherId]);

  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from('table_name')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(data || []);
    } catch (err) {
      toast.error('Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container text-center" style={{ paddingTop: '20vh' }}>
        <div className="text-muted">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📌 Titre de la page</h1>
        <p>Description courte</p>
      </div>

      <div className="card">
        {/* Page content */}
      </div>
    </div>
  );
}
```

## After Creating a Component

1. **Register route** in `App.jsx` if it's a page (wrap with `<ProtectedRoute>` and `<Layout>`)
2. **Add CSS classes** to `index.css` if new design patterns are needed
3. **Use design tokens** — never hardcode colors or spacing values
4. **French UI text** — all user-visible strings in French
