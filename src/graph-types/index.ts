/**
 * Generic graph types shared by ALL book-graph variants.
 *
 * Book-specific code (e.g. Stalin, Bülow) should import these base shapes
 * and narrow/extend them as needed.
 */

/** The minimum shape every book graph must provide — no book-specific fields. */
export interface GraphNode {
  id: string;
  label: string;
  title: string;
  group: string; // generic "group" replaces "faction" (mapped per variant)
  centrality: number; // 1–10; maps to node radius
  bio: string;
  dates?: string;
  nicknames?: string[];
  laterRelevance?: string; // generic string, each variant defines its own enum
  laterNote?: string;
  // injected by force-graph at runtime
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
  index?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string; // generic string, each variant defines its own enum
  weight: number; // 1–10
  description: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface ChapterMeta {
  id: string;
  label: string;
  description: string;
  data: GraphData;
}

/** A variant defines the full configuration for one book's graph. */
export interface GraphVariant<
  TGroup extends string = string,
  TEdge extends string = string,
  TRelevance extends string = string,
> {
  id: string;
  title: string;
  // Colour maps
  groupColors: Record<TGroup, string>;
  groupLabels: Record<TGroup, string>;
  edgeColors: Record<TEdge, string>;
  edgeLabels: Record<TEdge, string>;
  // Optional relevance system
  relevanceLabels?: Record<TRelevance, string>;
  relevanceColors?: Record<TRelevance, string>;
  // Edge style sets
  dashedEdges: Set<TEdge>;
  particleEdges: Set<TEdge>;
  arrowEdges: Set<TEdge>;
  // Chapters
  chapters: ChapterMeta[];
}
