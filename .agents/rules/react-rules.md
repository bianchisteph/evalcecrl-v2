# React 19 & Architecture Rules

Apply these rules when writing React components, hooks, or styles.

## Component & Framework Standards

- **React 19 & Vite**: This project runs on React 19.x and Vite. Follow functional component standards with standard modern hooks (`useState`, `useEffect`, `useContext`, `useParams`, `useNavigate`).
- **No Class Components or HOCs**: Never suggest or write class components or higher-order components.
- **Flat Layout**: Keep the component hierarchy flat:
  - `src/pages/` for page-level, route components.
  - `src/components/` for reusable, shared UI components.
- **State Management**: Use React's Context API via `TeacherContext` and the hook `useTeacher` (local storage-backed). Do not introduce Redux, Zustand, Recoil, or other external state management libraries.
- **Explicit Imports**: Always use destructured imports for React features (`import { useState } from 'react'`).

## Styling & Design System

- **Vanilla CSS Only**: Never use inline styles or TailwindCSS. All components must leverage custom classes defined in `src/index.css`.
- **CSS Variables & Tokens**: Ensure all styles refer to the design tokens/CSS variables (e.g. `--accent`, `--bg-card`, `--space-md`, `--radius-lg`) to maintain visual consistency.
- **Glassmorphism**: Retain the dark theme design language using subtle borders, background alpha overlays (`rgba(...)`), and `backdrop-filter: blur(...)`.
- **Micro-animations**: Integrate subtle animations (such as `.animate-fade-in`, `.animate-slide-up`, `.animate-slide-in`) for interactive feedback.
- **Feedback & Toasts**: Use `react-hot-toast` (`toast.success()`, `toast.error()`) for operation feedback. Do not use standard window `alert()`.
