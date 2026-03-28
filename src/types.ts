/**
 * Barrel re-export for backwards compatibility.
 *
 * @deprecated — Shared components should import generic shapes from
 * "src/graph-types" and receive book-specific constants via props/context.
 * This file exists only so that existing imports keep working during the
 * transition to per-variant type modules.
 */

// Generic graph shapes
export type { GraphData, ChapterMeta, GraphVariant } from "./graph-types";

// Stalin-specific types & constants (preserves every existing named export)
export type {
  GraphNode,
  GraphLink,
  Faction,
  LaterRelevance,
  EdgeType,
  EdgeColor,
} from "./features/stalin/types";

export {
  FACTION_COLORS,
  FACTION_LABELS,
  LATER_RELEVANCE_LABELS,
  LATER_RELEVANCE_COLORS,
  EDGE_COLORS,
  EDGE_LABELS,
  DASHED_EDGES,
  PARTICLE_EDGES,
  ARROW_EDGES,
} from "./features/stalin/types";
