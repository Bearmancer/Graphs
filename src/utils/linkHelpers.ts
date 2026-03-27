import type { GraphLink, GraphNode } from "../graph-types";

/** Extract the source node ID from a link (handles both string and resolved-object form). */
export function linkSourceId(link: GraphLink): string {
  return typeof link.source === "object"
    ? (link.source as GraphNode).id
    : link.source;
}

/** Extract the target node ID from a link (handles both string and resolved-object form). */
export function linkTargetId(link: GraphLink): string {
  return typeof link.target === "object"
    ? (link.target as GraphNode).id
    : link.target;
}

/** Return both source and target IDs as a tuple. */
export function linkEndpointIds(link: GraphLink): [string, string] {
  return [linkSourceId(link), linkTargetId(link)];
}
