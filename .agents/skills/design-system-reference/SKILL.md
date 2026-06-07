---
name: design-system-reference
description: Quick reference for all CSS classes and design tokens available in index.css. Use when styling a component or creating new UI elements.
---

# Skill: Design System Reference

Quick reference for all CSS classes and design tokens available in `index.css`.

## When to use
Use this skill whenever styling a component or creating new UI elements. NEVER use inline styles when a design token or utility class exists.

## Design Tokens (CSS Variables)

### Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0a1a` | Body background |
| `--bg-secondary` | `#111127` | Modals, cards élevées |
| `--bg-card` | `rgba(255,255,255,0.04)` | Cards, conteneurs |
| `--bg-card-hover` | `rgba(255,255,255,0.07)` | Hover sur cards |
| `--bg-input` | `rgba(255,255,255,0.06)` | Inputs, selects |
| `--bg-input-focus` | `rgba(255,255,255,0.1)` | Focus state |

### Accents
| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#6366f1` | Primary actions |
| `--accent-hover` | `#818cf8` | Hover primary |
| `--accent-subtle` | `rgba(99,102,241,0.15)` | Active states background |
| `--accent-success` | `#22c55e` | Confirmations |
| `--accent-warning` | `#f59e0b` | Avertissements |
| `--accent-danger` | `#ef4444` | Suppressions, erreurs |

### Text
| Token | Usage |
|-------|-------|
| `--text-primary` | Texte principal (#f1f5f9) |
| `--text-secondary` | Texte secondaire (#cbd5e1) |
| `--text-muted` | Texte discret (#64748b) |

### Spacing
`--space-xs` (4px) → `--space-sm` (8px) → `--space-md` (16px) → `--space-lg` (24px) → `--space-xl` (32px) → `--space-2xl` (48px)

### Border Radius
`--radius-sm` (6px) → `--radius-md` (10px) → `--radius-lg` (16px) → `--radius-xl` (24px) → `--radius-full` (9999px)

## Component Classes

### Buttons
| Class | Effect |
|-------|--------|
| `.btn` | Base (flex, padding, border, transition) |
| `.btn-primary` | Indigo background + glow shadow |
| `.btn-secondary` | Transparent + border |
| `.btn-danger` | Red subtle background |
| `.btn-ghost` | No background, no border |
| `.btn-sm` | Smaller padding/font |
| `.btn-lg` | Larger padding/font |
| `.btn-icon` | Square 36x36 |

### Inputs
| Class | Effect |
|-------|--------|
| `.input` | Full-width text input |
| `.select` | Styled select with custom arrow |
| `.select-compact` | Smaller select (for grids) |

### Layout
| Class | Effect |
|-------|--------|
| `.page-container` | max-width 1400px, centered, padded |
| `.page-header` | Bottom margin, h1 + p structure |
| `.split-layout` | 300px sidebar + 1fr main (responsive) |
| `.card` | Glass card with blur + border |
| `.card-header` | Flex space-between header |
| `.card-title` | 1.1rem, weight 600 |

### CECRL Badges
| Class | Level |
|-------|-------|
| `.badge-a1` | Red subtle |
| `.badge-a2` | Yellow subtle |
| `.badge-b1` | Green subtle |
| `.badge-b2` | Blue subtle |
| `.badge-c1` | Purple subtle |
| `.badge-c2` | Pink subtle |

### Utilities
`.flex` `.flex-col` `.items-center` `.justify-between`
`.gap-xs` `.gap-sm` `.gap-md` `.gap-lg`
`.mt-sm` `.mt-md` `.mt-lg` `.mb-md` `.mb-lg`
`.text-center` `.text-muted` `.text-sm` `.font-medium` `.w-full`

### Animations
| Class | Effect |
|-------|--------|
| `.animate-fade-in` | Opacity 0→1 (250ms) |
| `.animate-slide-up` | Translate Y 16px→0 + fade (250ms) |
| `.animate-slide-in` | Translate X -8px→0 + fade (250ms) |
