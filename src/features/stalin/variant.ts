import type { GraphVariant } from "../../graph-types";
import type { Faction, EdgeType, LaterRelevance } from "./types";
import {
  FACTION_COLORS,
  FACTION_LABELS,
  EDGE_COLORS,
  EDGE_LABELS,
  LATER_RELEVANCE_LABELS,
  LATER_RELEVANCE_COLORS,
  DASHED_EDGES,
  PARTICLE_EDGES,
  ARROW_EDGES,
} from "./types";
import chapters from "./data/chapters";

const stalinVariant: GraphVariant<Faction, EdgeType, LaterRelevance> = {
  id: "stalin",
  title: "Stalin's Court — Relationship Map",
  groupColors: FACTION_COLORS,
  groupLabels: FACTION_LABELS,
  edgeColors: EDGE_COLORS,
  edgeLabels: EDGE_LABELS,
  relevanceLabels: LATER_RELEVANCE_LABELS,
  relevanceColors: LATER_RELEVANCE_COLORS,
  dashedEdges: DASHED_EDGES,
  particleEdges: PARTICLE_EDGES,
  arrowEdges: ARROW_EDGES,
  chapters,
};

export default stalinVariant;
