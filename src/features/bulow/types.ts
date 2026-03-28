/**
 * Bülow-variant types — hierarchy/family-tree graph.
 *
 * A Bülow graph displays lineage, descent, or chain-of-command relationships
 * as a top-to-bottom tree. Unlike the Stalin (force-directed network) layout,
 * it assumes one primary hierarchy axis.
 */

import type {
  GraphNode as GenericNode,
  GraphLink as GenericLink,
  GraphData as GenericData,
} from "../../graph-types";

export type GraphData = GenericData;

// ---------------------------------------------------------------------------
// Bülow-specific union types — these will vary per book
// ---------------------------------------------------------------------------

/** Lineage role — the "group" for hierarchy graphs. */
export type LineageRole =
  | "patriarch"
  | "matriarch"
  | "heir"
  | "spouse"
  | "sibling"
  | "child"
  | "extended";

/** Kinship edge type — the "type" for hierarchy links. */
export type KinshipType =
  | "parent_of"
  | "married_to"
  | "sibling_of"
  | "half_sibling"
  | "adopted"
  | "guardian_of";

// ---------------------------------------------------------------------------
// Bülow-specific GraphNode / GraphLink
// ---------------------------------------------------------------------------

export interface GraphNode extends GenericNode {
  lineageRole: LineageRole;
}

export interface GraphLink extends GenericLink {
  type: KinshipType;
}

// ---------------------------------------------------------------------------
// Colour maps
// ---------------------------------------------------------------------------

export const LINEAGE_COLORS: Record<LineageRole, string> = {
  patriarch: "#CFB53B",   // old gold
  matriarch: "#C08081",   // dusty rose
  heir: "#4682B4",        // steel blue
  spouse: "#DA70D6",      // orchid
  sibling: "#5F9EA0",     // cadet blue
  child: "#87CEEB",       // sky blue
  extended: "#A9A9A9",    // dark grey
};

export const LINEAGE_LABELS: Record<LineageRole, string> = {
  patriarch: "Patriarch",
  matriarch: "Matriarch",
  heir: "Heir",
  spouse: "Spouse",
  sibling: "Sibling",
  child: "Child",
  extended: "Extended Family",
};

export const KINSHIP_COLORS: Record<KinshipType, string> = {
  parent_of: "#FF8F00",   // amber
  married_to: "#E91E63",  // pink
  sibling_of: "#4CAF50",  // green
  half_sibling: "#8BC34A", // light green
  adopted: "#26C6DA",     // cyan
  guardian_of: "#BA68C8",  // lavender
};

export const KINSHIP_LABELS: Record<KinshipType, string> = {
  parent_of: "Parent of",
  married_to: "Married to",
  sibling_of: "Sibling of",
  half_sibling: "Half-sibling",
  adopted: "Adopted",
  guardian_of: "Guardian of",
};

// ---------------------------------------------------------------------------
// Edge style sets
// ---------------------------------------------------------------------------

export const DASHED_EDGES = new Set<KinshipType>(["half_sibling", "adopted"]);
export const PARTICLE_EDGES = new Set<KinshipType>([]);
export const ARROW_EDGES = new Set<KinshipType>(["parent_of", "guardian_of"]);
