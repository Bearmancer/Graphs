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
- Avoid later fates, later titles, and retrospective spoilers.

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
