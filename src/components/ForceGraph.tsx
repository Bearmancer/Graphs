import { useRef, useCallback, useState, useEffect, useMemo } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { forceCollide } from "d3-force-3d";
import type { GraphNode, GraphLink, GraphData, EdgeType } from "../types";
import {
  FACTION_COLORS,
  EDGE_COLORS,
  DASHED_EDGES,
  PARTICLE_EDGES,
  ARROW_EDGES,
} from "../types";
import { linkSourceId, linkTargetId } from "../utils/linkHelpers";

interface PhysicsOptions {
  nodeRelSize?: number;
  collisionPad?: number;
  charge?: number;
  linkDistance?: number;
  linkStrength?: number;
  centerStrength?: number;
}

interface ResolvedPhysics {
  nodeRelSize: number;
  collisionPad: number;
  charge: number;
  linkDistance: number;
  linkStrength: number;
  centerStrength: number;
}

function nodeRadius(centrality: number, nodeRelSize: number): number {
  return Math.sqrt(nodeRelSize * centrality);
}

function resolvePhysics(
  data: GraphData,
  options?: PhysicsOptions,
): ResolvedPhysics {
  const nodeCount = Math.max(1, data.nodes.length);
  const avgCentrality =
    data.nodes.reduce((sum, node) => sum + node.centrality, 0) / nodeCount;
  const nodeRelSize = options?.nodeRelSize ?? 18;
  const collisionPad = options?.collisionPad ?? 6;
  const autoCharge = -(nodeRelSize * (11 + Math.log2(nodeCount + 1) * 2.2));
  const autoLinkDistance =
    Math.sqrt(nodeRelSize * Math.max(1, avgCentrality)) *
    (3.45 + Math.min(2.2, Math.log10(nodeCount + 1)));
  return {
    nodeRelSize,
    collisionPad,
    charge: options?.charge ?? autoCharge,
    linkDistance: options?.linkDistance ?? autoLinkDistance,
    linkStrength: options?.linkStrength ?? 0.8,
    centerStrength: options?.centerStrength ?? 0.06,
  };
}

interface Props {
  data: GraphData;
  activeFilters: Set<EdgeType>;
  onNodeClick: (node: GraphNode) => void;
  focusedNodeId?: string | null;
  physics?: PhysicsOptions;
}

export interface RenderSettings {
  uiFont?: string;
  nodeLabelBase?: number;
}

export default function ForceGraph({
  data,
  activeFilters,
  onNodeClick,
  focusedNodeId,
  physics,
  uiSettings,
}: Props & { uiSettings?: RenderSettings }) {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const hasZoomedRef = useRef(false);
  const lastFocusedIdRef = useRef<string | null>(null);
  const getViewportSize = () => ({
    width: document.documentElement.clientWidth || window.innerWidth,
    height: document.documentElement.clientHeight || window.innerHeight,
  });
  const [dimensions, setDimensions] = useState(getViewportSize);
  const physicsConfig = useMemo(
    () => resolvePhysics(data, physics),
    [data, physics],
  );

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    hasZoomedRef.current = false;
    const api = fg as any;
    api.d3Force("charge")?.strength(physicsConfig.charge);
    api
      .d3Force("link")
      ?.distance(physicsConfig.linkDistance)
      .strength(physicsConfig.linkStrength);
    api.d3Force("x")?.strength(physicsConfig.centerStrength);
    api.d3Force("y")?.strength(physicsConfig.centerStrength);
    api.d3Force(
      "collision",
      forceCollide(
        (node: unknown) =>
          nodeRadius(
            (node as GraphNode).centrality,
            physicsConfig.nodeRelSize,
          ) + physicsConfig.collisionPad,
      ),
    );
    api.d3ReheatSimulation();
  }, [data, physicsConfig]);

  useEffect(() => {
    const onResize = () => setDimensions(getViewportSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!focusedNodeId || focusedNodeId === lastFocusedIdRef.current) return;
    const focusNode = data.nodes.find((node) => node.id === focusedNodeId);
    if (!focusNode || focusNode.x == null || focusNode.y == null) return;
    const fg = fgRef.current;
    if (!fg) return;
    const currentZoom = (fg as any).zoom?.() ?? 1;
    fg.centerAt(focusNode.x, focusNode.y, 650);
    if (currentZoom < 1.6) fg.zoom(1.6, 650);
    lastFocusedIdRef.current = focusedNodeId;
  }, [focusedNodeId, data.nodes]);

  const neighbourIds = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const ids = new Set([hoveredNode.id]);
    for (const link of data.links) {
      const src = linkSourceId(link);
      const tgt = linkTargetId(link);
      if (src === hoveredNode.id) ids.add(tgt);
      if (tgt === hoveredNode.id) ids.add(src);
    }
    return ids;
  }, [hoveredNode, data.links]);

  const filteredLinks = useMemo(
    () => data.links.filter((link) => activeFilters.has(link.type as EdgeType)),
    [data.links, activeFilters],
  );
  const filteredData = useMemo(
    () => ({ nodes: data.nodes, links: filteredLinks }),
    [data.nodes, filteredLinks],
  );

  const paintNode = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const r = nodeRadius(node.centrality, physicsConfig.nodeRelSize);
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const isHovered = node.id === hoveredNode?.id;
      const isConnected = hoveredNode !== null && neighbourIds.has(node.id);
      const dimmed = hoveredNode !== null && !isConnected;
      const color = FACTION_COLORS[node.faction] ?? "#888";

      ctx.save();
      ctx.globalAlpha = dimmed
        ? 0.1
        : isHovered
          ? 1.0
          : isConnected
            ? 0.98
            : 1.0;

      if (isHovered || isConnected) {
        ctx.shadowColor = color;
        ctx.shadowBlur = isHovered ? r * 2.1 : r * 1.15;
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (isConnected && !isHovered) {
        ctx.beginPath();
        ctx.arc(x, y, r + 2 / globalScale, 0, 2 * Math.PI);
        ctx.strokeStyle = `${color}99`;
        ctx.lineWidth = 1.5 / globalScale;
        ctx.stroke();
      }

      ctx.strokeStyle = isHovered
        ? "rgba(255,255,255,0.82)"
        : isConnected
          ? `${color}CC`
          : "rgba(255,255,255,0.18)";
      ctx.lineWidth = (isHovered ? 2 : isConnected ? 1.2 : 0.5) / globalScale;
      ctx.stroke();

      const showLabel = node.centrality >= 7 || globalScale >= 1.2;
      if (showLabel) {
        const base = uiSettings?.nodeLabelBase ?? 12;
        const fontSize = Math.max(1, base / globalScale);
        const uiFont = uiSettings?.uiFont ?? "Inter, sans-serif";
        ctx.font = `${isHovered ? "700" : "400"} ${fontSize}px ${uiFont}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = dimmed
          ? "rgba(255,255,255,0.12)"
          : isHovered
            ? "#fff"
            : isConnected
              ? "#f6f6f6"
              : "rgba(255,255,255,0.85)";
        const lastName = node.label.split(" ").slice(-1)[0];
        ctx.fillText(lastName, x, y + r + 2 / globalScale);
      }

      ctx.restore();
    },
    [
      hoveredNode,
      neighbourIds,
      physicsConfig.nodeRelSize,
      uiSettings?.nodeLabelBase,
      uiSettings?.uiFont,
    ],
  );

  const getLinkColor = useCallback(
    (link: GraphLink) => {
      const src = linkSourceId(link);
      const tgt = linkTargetId(link);
      const dimmed =
        hoveredNode !== null &&
        src !== hoveredNode.id &&
        tgt !== hoveredNode.id;
      const base = EDGE_COLORS[link.type] ?? "#666";
      return dimmed ? `${base}18` : `${base}BB`;
    },
    [hoveredNode],
  );
  const getLinkWidth = useCallback(
    (link: GraphLink) => {
      const base = Math.max(0.5, link.weight * 0.2);
      if (!hoveredNode) return base;
      const src = linkSourceId(link);
      const tgt = linkTargetId(link);
      return src === hoveredNode.id || tgt === hoveredNode.id
        ? base * 1.8
        : base * 0.55;
    },
    [hoveredNode],
  );
  const getLinkDash = useCallback(
    (link: GraphLink): number[] | null =>
      DASHED_EDGES.has(link.type as EdgeType) ? [4, 4] : null,
    [],
  );
  const getLinkParticles = useCallback(
    (link: GraphLink) => (PARTICLE_EDGES.has(link.type as EdgeType) ? 2 : 0),
    [],
  );
  const getLinkArrow = useCallback(
    (link: GraphLink) => (ARROW_EDGES.has(link.type as EdgeType) ? 5 : 0),
    [],
  );

  const handleNodeClick = useCallback(
    (node: GraphNode) => onNodeClick(node),
    [onNodeClick],
  );
  const handleNodeHover = useCallback(
    (node: GraphNode | null) => setHoveredNode(node),
    [],
  );
  const handleEngineStop = useCallback(() => {
    if (!hasZoomedRef.current) {
      fgRef.current?.zoomToFit(600, 60);
      hasZoomedRef.current = true;
    }
  }, []);

  return (
    <ForceGraph2D
      ref={fgRef}
      width={dimensions.width}
      height={dimensions.height}
      graphData={filteredData}
      backgroundColor="#0D0D0D"
      nodeVal={(node) => (node as GraphNode).centrality}
      nodeRelSize={physicsConfig.nodeRelSize}
      warmupTicks={100}
      cooldownTicks={300}
      cooldownTime={8000}
      d3AlphaDecay={0.02}
      d3VelocityDecay={0.35}
      onEngineStop={handleEngineStop}
      nodeCanvasObject={
        paintNode as (
          node: object,
          ctx: CanvasRenderingContext2D,
          globalScale: number,
        ) => void
      }
      nodeCanvasObjectMode={() => "replace"}
      nodePointerAreaPaint={(
        node: object,
        color: string,
        ctx: CanvasRenderingContext2D,
      ) => {
        const currentNode = node as GraphNode;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(
          currentNode.x ?? 0,
          currentNode.y ?? 0,
          nodeRadius(currentNode.centrality, physicsConfig.nodeRelSize) +
            physicsConfig.collisionPad,
          0,
          2 * Math.PI,
        );
        ctx.fill();
      }}
      linkColor={getLinkColor as (link: object) => string}
      linkWidth={getLinkWidth as (link: object) => number}
      linkLineDash={getLinkDash as (link: object) => number[] | null}
      linkDirectionalParticles={getLinkParticles as (link: object) => number}
      linkDirectionalParticleSpeed={0.004}
      linkDirectionalParticleWidth={2}
      linkDirectionalArrowLength={getLinkArrow as (link: object) => number}
      linkDirectionalArrowRelPos={1}
      onNodeClick={handleNodeClick as (node: object, event: MouseEvent) => void}
      onNodeHover={
        handleNodeHover as (
          node: object | null,
          prevNode: object | null,
        ) => void
      }
    />
  );
}
