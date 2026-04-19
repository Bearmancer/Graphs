---
name: chapter-update
description: Optimised workflow for advancing book-character graphs chapter-by-chapter while avoiding spoilers
model: stepfun/step-3.5-flash:free
---

# Skill: Per-Chapter Character Graph Update

## Purpose

Use this skill when advancing a book's relationship graph forward by one or more chapter boundaries. It enforces spoiler-free incremental updates, validates cumulative integrity, and produces a clear changelog.

## Core Rules (Spoiler Discipline)

- **Time-bounded bios**: Every `bio` field must describe only what is known *up to the current chapter end*. No later-fate outcomes, no retrospective foreshadowing, no post-chapter titles/events.
- **Strip `laterRelevance`**: The per-chapter JSON files MUST NOT contain `laterRelevance` or `laterNote`. Those live only in the full/recap (`graph.json`) dataset.
- **Cumulative integrity**: The new chapter graph must include every node/edge from the previous chapter *unless* a character has died, been purged, or otherwise left the narrative. Document removals explicitly.
- **Stable node IDs**: Same character → same ID across all chapters.

## Inclusion Criteria (who to add/keep)

1. **Front character list** (from the book's front list) → always add if in-scope.
2. **Off-list recurring characters** → add if they recur later and are structurally useful to the graph.
3. **One-off witnesses / atmospheric names** → omit unless they become meaningful later.

## Classification Decision Matrix

For each candidate character or relationship in the new chapter:

| Decision | Meaning |
|----------|---------|
| **add**   | Character is newly in-scope and wasn't present in previous chapter(s). |
| **keep**  | Character stays with no material change (bio/title/centrality unchanged). |
| **revise**| Character's property changes (bio expands, centrality shifts, title updates, new/revised links). |
| **omit**  | Character is being removed from the active graph (death, purge, exile). Give one-line reason. |

## Step-by-Step Procedure

1. **Prepare workspace**
   - Identify the current chapter boundary `N` and the target chapter `M`.
   - Load the previous cumulative snapshot (`chN.json` or nearest earlier snapshot).
   - Load the book's source text for chapters `N+1` through `M`.

2. **Extract new entities & changes**
   - Scan chapter text for person names, institutions, and relationship verbs.
   - Build a candidate set: new characters, changed relationships, deaths/removals.
   - For each candidate, classify as add/keep/revise/omit using the inclusion criteria.

3. **Diff the graphs**
   - Compute exact node delta (added/removed/changed IDs).
   - Compute exact link delta (new/removed/changed edges).
   - Validate that all kept nodes retain stable IDs and all retained links remain between existing nodes.
   - Flag any node that appears in the previous chapter but is absent now; confirm it's an intentional removal.

4. **Draft the new JSON**
   - Start from the previous cumulative node list.
   - Apply adds/removals/revisions in that order.
   - For revisions: only update the fields that actually changed; keep unchanged fields as-is.
   - Zero out or filter any `laterRelevance` / `laterNote` fields from the snapshot.
   - Edge weights and descriptions should reflect the state *as of the new chapter end*.

5. **Validate against checklist**
   - [ ] No node or link that existed in `N` is missing without an `omit` reason.
   - [ ] All bios are time-bounded to ≤ chapter `M`.
   - [ ] No `laterRelevance` / `laterNote` in this file.
   - [ ] IDs are stable across revisions.
   - [ ] Chapter boundary note in `.github/research.md` updated to `M`.

6. **Write the changelog summary**
   - List `adds` (character IDs), `revisions` (brief reason), `omissions` (one-liner each).
   - Explicitly state the **spoiler boundary** used (e.g. "End of Chapter 7 only").
   - Note any uncertain names that need manual verification.

## Tools & Patterns

- **Diff algorithm**: Use identical-key set arithmetic on node IDs (or full node equality if you need to detect subtle field edits).
- **Entity extraction**: If a named-entity recogniser (NER) is available, prefer that. Else use a capitalized-phrase regex anchored to word boundaries.
- **Script template** (Python sketch provided in repo instructions): see `.github/prompts.md` for the canonical "Reusable chapter-advance prompt".
- **Fail-fast**: If you detect a possible spoiler phrase ("later", "eventually", "in the future", "would become"), halt and ask for confirmation.

## When to Use vs. Manual Edit

- Use this skill for **multi-chapter leaps** (≥2 chapters) or when many characters change at once.
- For **single-chapter forward steps** (e.g., ch2→ch3), a focused manual edit is often simpler, but you may still run the validation checks from §5 above.

## File Locations

- Chapter data: `src/features/stalin/data/chapters/<chN>.json`
- Chapter index: `src/features/stalin/data/chapters/index.ts`
- Full/recap dataset (contains `laterRelevance`/`laterNote`): `src/features/stalin/data/graph.json`
- Research log (boundary tracking): `.github/research.md` (if present)
