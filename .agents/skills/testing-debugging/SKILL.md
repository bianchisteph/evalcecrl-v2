---
name: testing-debugging
description: Instructions and strategies for debugging and testing code in this project. Use when fixing bugs, investigating errors, or validating features.
---

# Skill: Testing & Debugging

How to test and debug this Vite+React+Supabase application.

## When to use
Use this skill when fixing bugs, investigating errors, or validating features.

## Running the App

```bash
# Development server (HMR)
npm run dev
# → http://localhost:5173

# Production build (validation)
npm run build

# Preview production build
npm run preview
```

## Common Debug Scenarios

### 1. "Supabase non configuré" in console
**Cause**: `.env` file missing or variables not set
**Fix**: Check that `.env` exists with:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```
**Note**: The mock client in `lib/supabase.js` will activate — this is intentional fallback behavior.

### 2. Data not showing after insert
**Cause**: Missing `.select()` after `.insert()` / `.upsert()`
**Fix**: Always chain `.select()` (and `.single()` for single records)

### 3. Evaluation not saving (409 Conflict)
**Cause**: Unique constraint `(student_id, session_name)` violated with INSERT instead of UPSERT
**Fix**: Use `.upsert(records, { onConflict: 'student_id,session_name' })`

### 4. Blank page / routing error
**Cause**: Route not wrapped in `ProtectedRoute` in `App.jsx`
**Fix**: Wrap with `<ProtectedRoute><Layout>...</Layout></ProtectedRoute>`

### 5. CSS variables not applying
**Cause**: Forgetting that this is a dark theme — colors should work on `#0a0a1a` background
**Fix**: Use `--text-primary` (#f1f5f9) for visible text, never black

### 6. Chart.js "category scale not registered" error
**Cause**: Missing Chart.js component registration
**Fix**: Import and register needed components:
```jsx
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
```

## Build Validation Checklist

```bash
# 1. Clean build
npm run build

# 2. Check for console errors in browser DevTools
# 3. Test all 3 routes: /, /classes, /eval/:classId
# 4. Test on mobile viewport (375px)
# 5. Verify Supabase calls in Network tab
```

## Browser DevTools Tips

- **Application > Local Storage**: Check `evalcecrl_teacher` key for persisted teacher profile
- **Network > Fetch/XHR**: Filter by `supabase` to see all API calls
- **Console**: Look for `⚠️ Variables Supabase manquantes` warning (expected without .env)
