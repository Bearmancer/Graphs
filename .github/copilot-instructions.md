# Copilot Instructions — Stalin's Court Relationship Graph

## Project Overview

This is an interactive relationship-graph visualiser for the book
*Stalin: The Court of the Red Tsar* by Simon Sebag Montefiore.
It is built with **React 18 + TypeScript + Vite** and uses
[react-force-graph-2d](https://github.com/vasturiano/react-force-graph-2d)
for the canvas-rendered force-directed graph.

## Repository Structure

```
src/
├── App.tsx                          # Root component
├── main.tsx                         # React entry point
├── index.css                        # Global CSS variables (fonts, sizes, colours)
├── types.ts                         # Shared TypeScript types + colour / label constants
├── fonts.ts                         # Font option lists for the settings UI
├── utils/
│   └── linkHelpers.ts               # Shared helpers for extracting link source/target IDs
├── data/
│   ├── graph.json                   # Full chapter-3-recap graph (47 nodes, 66 links)
│   └── chapters/
│       ├── index.ts                 # Chapter metadata + data exports
│       ├── prologue.json            # Prologue-only subset (no spoilers)
│       ├── ch1.json                 # Cumulative through Chapter 1
│       └── ch2.json                 # Cumulative through Chapter 2
├── components/
│   ├── ForceGraph.tsx               # Force-directed graph renderer ("Stalin" layout)
│   ├── CharacterTable.tsx           # Searchable table view of characters
│   ├── FilterBar.tsx                # Top toolbar: chapter selector, view tabs, filters, search
│   ├── NodeDetail.tsx               # Side panel: character detail (brief in graph, full in table)
│   ├── SettingsWheel.tsx            # Font / size settings popover
│   └── *.module.css                 # CSS Modules for each component
└── features/
    └── stalin/
        └── BookExperience.tsx       # Page-level orchestrator (state, layout, data wiring)
```

## Key Conventions

### Graph Layout Naming
- **"Stalin" layout** = force-directed / spreading-outward graph (diverse figures,
  independent positions). Implemented in `ForceGraph.tsx`.
- **"Bülow" layout** = hierarchical / top-to-bottom tree (linear chain of command).
  Not yet implemented; reserve this name for a future tree-based renderer.

### Incremental Chapter Data (No Spoilers)
- Each chapter JSON is **cumulative**: ch1 includes all prologue characters plus
  chapter 1 additions.
- `laterRelevance` and `laterNote` fields are **stripped** from per-chapter files
  to avoid giving away future events. They only appear in the full
  `graph.json` (ch3-recap).
- When a character **dies** or is **executed**, they should be removed from
  subsequent chapter data files (presuming they are never mentioned again).
  A separate "Dead Characters" / "Executed" tab can list removed figures.
- Executions by Stalin begin in later chapters (not applicable through ch3).

### Colour System
- **Faction colours** → `FACTION_COLORS` in `types.ts` (node fill colour).
- **Edge/relation colours** → `EDGE_COLORS` in `types.ts`, grouped by category:
  positive bonds (greens), family/romantic (pinks/ambers), power/hierarchy
  (orange/purple), neutral (cyan), antagonistic (yellow-amber).
- Always use the canonical constant; never hard-code a hex colour for a
  relation or faction elsewhere.

### Font Sizes
- All font sizes are defined as **CSS custom properties** in `:root`
  (`index.css`). Component CSS modules reference these variables
  (e.g. `var(--font-filter-pill)`).
- The settings UI in `SettingsWheel` adjusts the base sizes at runtime via
  `document.documentElement.style.setProperty(…)` and persists to
  `localStorage`.

### Code De-duplication
- **Link endpoint extraction** — use `linkSourceId()` / `linkTargetId()` /
  `linkEndpointIds()` from `src/utils/linkHelpers.ts` instead of the inline
  `typeof link.source === "object" ? … : …` pattern.

### View Modes
- **Graph view** (default): Force-directed canvas. Clicking a node opens a
  side panel with a **brief summary** (overview, strongest ties, metrics).
- **Table view**: Searchable data table. Clicking a character opens a side
  panel with the **full chronological relationship list** — every link,
  every description, every direction arrow.

## Adding a New Chapter
1. Create `src/data/chapters/ch<N>.json` — cumulative node + link data
   with `laterRelevance` and `laterNote` stripped.
2. Add an entry in `src/data/chapters/index.ts`.
3. Characters who died or were executed in earlier chapters should be
   omitted from the new file and tracked in a "dead / executed" list.

## Build & Dev

```bash
npm install
npm run dev      # Vite dev server
npm run build    # TypeScript check + Vite production build
npm run preview  # Preview the production build locally
```
