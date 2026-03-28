import type { GraphVariant } from "../../graph-types";
import type { LineageRole, KinshipType } from "./types";
import {
  LINEAGE_COLORS,
  LINEAGE_LABELS,
  KINSHIP_COLORS,
  KINSHIP_LABELS,
  DASHED_EDGES,
  PARTICLE_EDGES,
  ARROW_EDGES,
} from "./types";

/**
 * Placeholder variant — no chapter data yet.
 *
 * When a Bülow book is added, populate the `chapters` array with
 * cumulative ChapterMeta entries just like the Stalin variant.
 */
const bulowVariant: GraphVariant<LineageRole, KinshipType> = {
  id: "bulow",
  title: "Family Tree — Hierarchy Graph",
  groupColors: LINEAGE_COLORS,
  groupLabels: LINEAGE_LABELS,
  edgeColors: KINSHIP_COLORS,
  edgeLabels: KINSHIP_LABELS,
  dashedEdges: DASHED_EDGES,
  particleEdges: PARTICLE_EDGES,
  arrowEdges: ARROW_EDGES,
  chapters: [], // no data yet
};

export default bulowVariant;
