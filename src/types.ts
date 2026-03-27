export interface GraphNode {
  id: string;
  label: string;
  title: string;
  faction: Faction;
  centrality: number; // 1–10; maps to node radius 6–26px
  bio: string;
  laterRelevance?: LaterRelevance;
  laterNote?: string;
  dates?: string;
  nicknames?: string[];
  // injected by force-graph at runtime
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
  index?: number;
}

export type Faction =
  | "supreme_authority"
  | "politburo_core"
  | "nkvd"
  | "military"
  | "politburo_family"
  | "georgian_network"
  | "leningrad_group"
  | "cultural"
  | "enemy_purged"
  | "family";

export type LaterRelevance = "central" | "recurring" | "limited";

export type EdgeType =
  | "ally"
  | "married_to"
  | "father_of"
  | "subordinate"
  | "rival"
  | "friend_of"
  | "bodyguard_of"
  | "patron_of"
  | "godparent_of"
  | "in_love_with"
  | "colleague_of"
  | "family_connection";

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: EdgeType;
  weight: number; // 1–10
  description: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export const FACTION_COLORS: Record<Faction, string> = {
  supreme_authority: "#FFD700", // gold
  politburo_core: "#E53935", // vivid red
  nkvd: "#7B1FA2", // deep purple-red
  military: "#1565C0", // deep blue
  politburo_family: "#F48FB1", // soft pink
  georgian_network: "#2E7D32", // forest green
  leningrad_group: "#0288D1", // sky blue
  cultural: "#8E24AA", // purple
  enemy_purged: "#546E7A", // blue-grey
  family: "#F57F17", // deep amber
};

export const FACTION_LABELS: Record<Faction, string> = {
  supreme_authority: "Stalin",
  politburo_core: "Politburo Core",
  nkvd: "NKVD / Security",
  military: "Military",
  politburo_family: "Politburo Families",
  georgian_network: "Georgian Network",
  leningrad_group: "Leningrad Group",
  cultural: "Cultural Figures",
  enemy_purged: "Enemies / Opposition",
  family: "Stalin's Family",
};

export const LATER_RELEVANCE_LABELS: Record<LaterRelevance, string> = {
  central: "Major Later",
  recurring: "Recurring Later",
  limited: "Limited Later",
};

export const LATER_RELEVANCE_COLORS: Record<LaterRelevance, string> = {
  central: "#FFD166",
  recurring: "#7BD389",
  limited: "#8E9AAF",
};

export type EdgeColor = string;

/**
 * Edge / relationship colours — each relationship type has a distinct,
 * visually grouped colour so the user can read the graph at a glance.
 *
 *   Positive bonds (green family)
 *     ally          #4CAF50   green
 *     friend_of     #8BC34A   light green
 *
 *   Family / romantic bonds (pink–amber family)
 *     married_to    #E91E63   pink
 *     father_of     #FF8F00   amber
 *     in_love_with  #F06292   pink-red
 *     family_connection #FFB74D light amber
 *     godparent_of  #4FC3F7   light blue
 *
 *   Power / hierarchy (orange–purple family)
 *     subordinate   #FF5722   deep orange
 *     patron_of     #BA68C8   lavender
 *     bodyguard_of  #78909C   grey
 *
 *   Neutral / professional
 *     colleague_of  #26C6DA   cyan
 *
 *   Antagonistic
 *     rival         #FFC107   yellow-amber
 */
export const EDGE_COLORS: Record<EdgeType, string> = {
  // Positive bonds
  ally: "#4CAF50",
  friend_of: "#8BC34A",
  // Family / romantic bonds
  married_to: "#E91E63",
  father_of: "#FF8F00",
  in_love_with: "#F06292",
  family_connection: "#FFB74D",
  godparent_of: "#4FC3F7",
  // Power / hierarchy
  subordinate: "#FF5722",
  patron_of: "#BA68C8",
  bodyguard_of: "#78909C",
  // Neutral / professional
  colleague_of: "#26C6DA",
  // Antagonistic
  rival: "#FFC107",
};

export const EDGE_LABELS: Record<EdgeType, string> = {
  ally: "Ally",
  married_to: "Married to",
  father_of: "Parent of",
  subordinate: "Subordinate",
  rival: "Rival",
  friend_of: "Friend",
  bodyguard_of: "Bodyguard",
  patron_of: "Patron",
  godparent_of: "Godparent",
  in_love_with: "In love with",
  colleague_of: "Colleague",
  family_connection: "Family link",
};

export const DASHED_EDGES = new Set<EdgeType>([
  "rival",
  "enemy_purged" as EdgeType,
]);
export const PARTICLE_EDGES = new Set<EdgeType>(["ally", "friend_of"]);
export const ARROW_EDGES = new Set<EdgeType>([
  "subordinate",
  "bodyguard_of",
  "patron_of",
]);
