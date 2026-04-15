# Copilot Instructions — Book-Graph Visualiser Library

## Project Overview

This is an interactive book-relationship-graph visualiser library.
Each book is a **variant** that defines its own node types, edge types,
colour palettes, and chapter data. The library provides shared
components, generic types, and utilities that all variants build on.

Currently implemented variants:
- **Stalin** (*Stalin: The Court of the Red Tsar* by Montefiore) —
  force-directed network graph.
- **Bülow** (scaffold only) — hierarchy / family-tree graph.
  Named after Hans von Bülow as a metaphor for linear top-to-bottom
  lineage, as opposed to the scattershot force-directed network.

Built with **React 18 + TypeScript 5 + Vite 8**.
Uses [react-force-graph-2d](https://github.com/vasturiano/react-force-graph-2d)
for the canvas-rendered force-directed graph (Stalin layout).
Uses `@typescript/native-preview` (`tsgo`) as an optional fast type-checker.

## Repository Structure

```
src/
├── App.tsx                          # Root component (currently mounts Stalin)
├── main.tsx                         # React entry point
├── index.css                        # Centralised CSS variables (fonts, sizes, colours)
├── types.ts                         # Deprecated barrel re-export (backwards compat)
├── fonts.ts                         # Font option lists for the settings UI
├── graph-types/
│   └── index.ts                     # Generic types: GraphNode, GraphLink, GraphData,
│                                    #   ChapterMeta, GraphVariant<TGroup, TEdge, TRelevance>
├── utils/
│   └── linkHelpers.ts               # Shared helpers: linkSourceId(), linkTargetId(), etc.
├── components/                      # Shared UI components (use generic types)
│   ├── CharacterTable.tsx           # Searchable table view of characters
│   ├── FilterBar.tsx                # Top toolbar: chapter selector, view tabs, filters, search
│   ├── NodeDetail.tsx               # Side panel: character detail
│   ├── SettingsWheel.tsx            # Font / size settings popover
│   └── *.module.css                 # CSS Modules for each component
└── features/
    ├── stalin/                      # Network variant — "Stalin" layout
    │   ├── BookExperience.tsx       # Page-level orchestrator (state, layout, data wiring)
    │   ├── StalinGraph.tsx          # Force-directed graph renderer
    │   ├── types.ts                 # Stalin-specific types, colour maps, label maps
    │   ├── variant.ts               # GraphVariant instance wiring Stalin's config
    │   └── data/
    │       ├── graph.json           # Full chapter-3-recap graph (47 nodes, 66 links)
    │       └── chapters/
    │           ├── index.ts         # Chapter metadata + data exports
    │           ├── prologue.json    # Prologue-only subset (no spoilers)
    │           ├── ch1.json         # Cumulative through Chapter 1
    │           └── ch2.json         # Cumulative through Chapter 2
    └── bulow/                       # Hierarchy variant — "Bülow" layout (scaffold)
        ├── types.ts                 # Lineage roles, kinship edge types, colour/label maps
        └── variant.ts               # GraphVariant instance (empty chapters for now)
```

## Two Graph Layout Types

| Layout     | Metaphor               | Renderer               | Use When                                        |
| ---------- | ---------------------- | ---------------------- | ----------------------------------------------- |
| **Stalin** | Force-directed network | `react-force-graph-2d` | Web of overlapping, multi-typed relationships   |
| **Bülow**  | Top-to-bottom tree     | Not yet implemented    | Lineage, descent, chain of command, tree-shaped |

## Key Conventions

### Generic Type System
- **`src/graph-types/index.ts`** defines the base interfaces: `GraphNode`,
  `GraphLink`, `GraphData`, `ChapterMeta`, and `GraphVariant<TGroup, TEdge, TRelevance>`.
- Each variant extends these generics with book-specific union types
  (e.g. `Faction`, `EdgeType` for Stalin; `LineageRole`, `KinshipType` for Bülow).
- **`src/types.ts`** is a **deprecated barrel** that re-exports Stalin types
  for backwards compatibility. New code should import from `src/graph-types`
  or the specific variant's `types.ts`.

### Variant Structure
Each variant lives in `src/features/<variant-id>/` and contains:
- `types.ts` — union types, colour maps (`Record<Group, string>`),
  label maps, and edge style sets (`Set<EdgeType>`).
- `variant.ts` — a `GraphVariant` instance wiring all maps together.
- `data/chapters/` — cumulative chapter JSON files + `index.ts` manifest.
- A renderer component (e.g. `StalinGraph.tsx`).
- A page orchestrator (e.g. `BookExperience.tsx`).

### Incremental Chapter Data (No Spoilers)
- Each chapter JSON is **cumulative**: ch1 includes all prologue characters
  plus chapter 1 additions.
- `laterRelevance` and `laterNote` fields are **stripped** from per-chapter
  files to avoid spoilers. They only appear in the full/recap dataset.
- When a character **dies** or is **removed**, they should be omitted from
  subsequent chapter files and tracked in a removal list.

### Colour System
- Each variant defines its own colour constants (e.g. `FACTION_COLORS`,
  `LINEAGE_COLORS`). Always use the canonical constant from the variant's
  `types.ts`; never hard-code hex colours elsewhere.

### Centralised CSS Variables
- All font sizes are **CSS custom properties** in `:root` (`index.css`).
- Component CSS modules reference these variables
  (e.g. `var(--font-filter-pill)`).
- `SettingsWheel` adjusts sizes at runtime via
  `document.documentElement.style.setProperty(…)` and persists to
  `localStorage`.
- Font options are defined in `src/fonts.ts`.

### Code De-duplication
- **Link endpoint extraction** — use `linkSourceId()` / `linkTargetId()` /
  `linkEndpointIds()` from `src/utils/linkHelpers.ts` instead of inline
  `typeof link.source === "object" ? … : …` patterns.

### View Modes
- **Graph view** (default): Canvas renderer. Clicking a node opens a
  side panel with a **brief summary**.
- **Table view**: Searchable data table. Clicking a character opens a
  side panel with the **full relationship list**.

## Adding a New Chapter (any variant)

1. Create `src/features/<variant>/data/chapters/ch<N>.json` — cumulative
   node + link data with `laterRelevance` / `laterNote` stripped.
2. Add an entry in `src/features/<variant>/data/chapters/index.ts`.
3. Characters who died or were removed in earlier chapters should be
   omitted from the new file and tracked in a removal list.

## Adding a New Variant

See `.github/prompts.md` → "Adding a new graph variant" for the full
step-by-step checklist.

## Build & Dev

```bash
npm install
npm run dev          # Vite dev server
npm run build        # TypeScript check (tsc -b) + Vite production build
npm run preview      # Preview the production build locally
npm run typecheck    # TypeScript only (no Vite)
npm run tsgo         # Fast type-check via @typescript/native-preview
```
