# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**マドリエ (Madorie)** — A browser-based floor plan creation tool for custom home builders. Users drag-and-drop room parts onto a canvas to design house layouts, then can request construction estimates via a CTA flow. The tool targets general consumers (non-architects) on PC, tablet, and smartphone.

## Tech Stack

- **Framework**: React 18 + TypeScript, built with Vite
- **Canvas/Drawing**: Konva.js via `react-konva` — all floor plan rendering uses Canvas, not DOM
- **State Management**: Zustand (`useFloorPlanStore` for floor plan data + undo/redo, `useUIStore` for UI state)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Package Manager**: npm
- **Linting/Formatting**: ESLint + Prettier

## Common Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

## Architecture

### Grid System
- Base unit: half-tatami (半畳) = 910mm × 910mm real-world
- Canvas representation: 1 grid = 40px at default zoom
- All room positions and sizes are in grid units; convert to mm by multiplying by 910

### Key Data Flow
1. Room parts are dragged from `Sidebar` → dropped onto `FloorPlanCanvas` (HTML5 DnD → Konva Stage)
2. `useFloorPlanStore` holds the `FloorPlan` object (floors → rooms/doors/windows) and mutation actions
3. `RoomShape` renders each room as a Konva `Rect` + labels, handles drag/resize with grid snapping
4. Area calculation excludes `balcony`, `deck`, `garage` from total floor area
5. PNG export uses `Konva.Stage.toDataURL()` with grid layer hidden

### Directory Layout (under `src/`)
- `types/` — TypeScript interfaces (`FloorPlan`, `Room`, `Door`, `FloorWindow`, `RoomType`)
- `constants/` — Grid config, room part definitions (colors, default/min sizes), template definitions
- `stores/` — Zustand stores
- `hooks/` — Canvas interaction, drag-and-drop, keyboard shortcuts, area calculation
- `components/canvas/` — Konva-based rendering (Stage, grid, room shapes, doors, windows, dimension labels)
- `components/sidebar/` — Room palette, property panel
- `components/cta/` — Floating consult button, inquiry form modal
- `utils/` — Geometry/snap calculations, area conversion (㎡↔坪↔畳), PNG export, template loading

### Area Conversion Constants
- 1坪 (tsubo) = 3.30579 ㎡
- 1畳 (jou) = 1.62 ㎡ (中京間 basis)

### Design Tokens
- Primary: `#2D5F2D` (forest green), CTA: `#C75C2A` (orange)
- Font: `'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif`
- Room colors are pastel tones defined per `RoomType` in the room definitions constant
- Walls: `#555555` 2px solid

## Development Phases

The project follows a 4-phase plan. **Phase 1 (MVP)** covers: template selection (3 types), room placement/move/resize/delete, area calculation, PNG export, consult CTA link, PC-only. See `01_requirements.md` and `02_design.md` for full phase breakdown and detailed specifications.
