# Prompts And Instructions

## Repository rules

- All project research, plans, and prompt artifacts live under `.github/`.
- All runtime application code lives under `src/`.
- Do not spin up a second standalone React app for a new graph type unless it is intentionally a separate product.

## Graph classification rule

- Use a network renderer when the subject is a web of overlapping relationship types.
- Use a hierarchy renderer when the subject is fundamentally lineage, descent, or tree-shaped dependency.
- Do not force hierarchical data into a network view unless cross-branch ties are the main story.
- Do not force multi-typed political/social webs into a tree; it loses meaning.

## Abstraction rule

- Prefer typed adapters and composition over React class inheritance.
- Standardize the app shell, not the renderer internals.
- Keep domain data independent from any one graph library.
- Add one mapper per library rather than leaking library-native node shapes into the source data.

## Extraction prompt for network graphs

Turn the source material into a typed relationship graph.

- Identify people as nodes.
- Identify relationship types as explicit edge categories.
- Preserve direction where power or dependency is directional.
- Add short bios for detail panels.
- Assign relative centrality scores for visual prominence.

## Stalin scope prompt

When expanding Stalin:

- Stop at the end of chapter 2.
- Treat the prologue as in scope.
- Do not add later careers, later purges, later deaths, or retrospective interpretations from later chapters.
- Prefer chapter-bounded wording such as:
  - household role
  - family tie
  - current office
  - observed behavior in the Kremlin circle
- Use the book's front character list as the default whitelist.
- Add an off-list person only if they clearly recur later and are structurally useful to the graph.
- Do not keep one-off witnesses, anecdotal children, or atmospheric household names just because they appear once in a vivid scene.

## Reusable chapter-advance prompt

Use this when moving the Stalin graph forward by one chapter:

```text
Advance the Stalin graph from its current chapter boundary to the end of the next chapter.

Rules:
- Do not use information from later chapters.
- Use a hybrid inclusion rule:
  - keep or add characters on the book's front character list if they are now in scope
  - add off-list characters only if they recur later in the book and are structurally useful
  - remove low-value one-off observers if they no longer meet the rule
- Preserve already-correct nodes, links, and bios unless the new chapter requires revision.
- Keep all bios time-bounded to what is true as of the new chapter end.
- Avoid later fates, later titles, retrospective spoilers, and foreshadowing language.

Tasks:
1. Identify newly in-scope characters, relationships, and institutions.
2. Classify each candidate as:
   - add
   - keep
   - revise
   - omit
3. For every omit decision, give a one-line reason.
4. Update the graph data with only the approved changes.
5. Update the chapter boundary note in `.github/research.md`.
6. Do not create temporary extraction artifacts in the repo.

Output expectations:
- concise summary of adds / revisions / omissions
- explicit spoiler boundary used
- mention any uncertain names that need manual verification
```

## Extraction prompt for family graphs

Turn the source material into a rooted kinship tree.

- Identify parents, children, spouses, and siblings.
- Mark half-sibling or adopted relationships explicitly.
- Keep dates and role notes on each person for the detail panel.
- Choose one primary root person or lineage anchor for first render.

## Local instruction carried forward

- Do not store repo-specific planning artifacts in global user folders.
- Prefer updating the consolidated `.github` files instead of creating new hidden orchestration folders.

## Adding a new graph variant

Use this when creating a new book graph (either network or hierarchy type):

```text
Create a new graph variant for the book "[BOOK TITLE]" by [AUTHOR].

Steps:
1. Determine the graph type:
   - Network (force-directed, "Stalin" type): Use when the subject is a web of
     overlapping, multi-typed relationships (political courts, social networks,
     alliances).
   - Hierarchy (top-to-bottom tree, "Bülow" type): Use when the subject is
     fundamentally lineage, descent, chain of command, or tree-shaped dependency.

2. Create the variant directory: `src/features/<variant-id>/`

3. Define types in `src/features/<variant-id>/types.ts`:
   - Extend `GraphNode` from `src/graph-types` with variant-specific group field
   - Extend `GraphLink` from `src/graph-types` with variant-specific edge types
   - Define colour maps for all groups and edge types
   - Define label maps for human-readable display
   - Define edge style sets (dashed, particle, arrow)

4. Create the variant config in `src/features/<variant-id>/variant.ts`:
   - Instantiate `GraphVariant` with all type parameters
   - Wire up all colour/label/style maps
   - Reference the chapters array

5. Create chapter data in `src/features/<variant-id>/data/chapters/`:
   - Each chapter JSON must be cumulative (includes all previous characters)
   - Strip `laterRelevance` and `laterNote` from per-chapter files
   - Dead/removed characters should be omitted from later chapters
   - Create an `index.ts` that exports the chapters array

6. Create the renderer component:
   - Network type: Copy pattern from `src/features/stalin/StalinGraph.tsx`
   - Hierarchy type: Create a new tree-based renderer (not yet implemented)

7. Create the page orchestrator:
   - Copy pattern from `src/features/stalin/BookExperience.tsx`
   - Update imports to use local variant types and data

8. Register in `src/App.tsx` (or a future router).

Validation:
- Run `npm run build` to verify TypeScript and Vite build pass
- Confirm each chapter JSON loads and renders
- Confirm chapter-to-chapter progression adds characters cumulatively
```

## Generic chapter-by-chapter validation rules

```text
When validating iterative chapter graphs for any book variant:

1. Cumulative integrity:
   - Chapter N must contain ALL nodes from chapter N-1 (unless a character
     dies/is removed — document removals explicitly).
   - Chapter N must contain ALL links from chapter N-1 that still involve
     living characters.

2. No spoilers:
    - `laterRelevance` and `laterNote` fields must NOT appear in per-chapter
      files. They belong only in the full/recap dataset.
    - Bios must be time-bounded: describe only what is known up to the current
      chapter boundary.
    - Avoid wording that hints at future events, eventual outcomes, or later fate.

3. Consistency:
   - Node IDs must be stable across chapters (same person = same ID).
   - Link types and weights may be revised chapter-to-chapter if the
     relationship changes, but the revision should be documented.
   - Every node must have: id, label, title, group/faction, centrality, bio.
   - Every link must have: source, target, type, weight, description.

4. Build check:
   - After adding or modifying chapter data, run `npm run build` to confirm
     the TypeScript compiler accepts the data shape.
```
