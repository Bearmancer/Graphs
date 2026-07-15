import { useRef, useCallback, useState, useEffect, useMemo } from "react";
import type { GraphNode, GraphLink, GraphData, EdgeType } from "./types";
import { FACTION_COLORS, EDGE_COLORS, DASHED_EDGES, PARTICLE_EDGES, ARROW_EDGES } from "./types";
import { linkSourceId, linkTargetId } from "../../utils/linkHelpers";
import { WebGPURenderer } from "./WebGPURenderer";

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

function resolvePhysics(data: GraphData, options?: PhysicsOptions): ResolvedPhysics {
  const nodeCount = Math.max(1, data.nodes.length);
  const avgCentrality = data.nodes.reduce((sum, node) => sum + node.centrality, 0) / nodeCount;
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

export default function StalinGraph({
  data,
  activeFilters,
  onNodeClick,
  focusedNodeId,
  physics,
  uiSettings,
}: Props & { uiSettings?: RenderSettings }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGPURenderer | null>(null);
  const [dimensions, setDimensions] = useState({
    width: document.documentElement.clientWidth || window.innerWidth,
    height: document.documentElement.clientHeight || window.innerHeight,
  });
  
  const physicsConfig = useMemo(() => resolvePhysics(data, physics), [data, physics]);

  useEffect(() => {
    const onResize = () => setDimensions({
      width: document.documentElement.clientWidth || window.innerWidth,
      height: document.documentElement.clientHeight || window.innerHeight,
    });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    async function initGPU() {
      if (!canvasRef.current) return;
      
      if (!navigator.gpu) {
        console.error("WebGPU not supported");
        return;
      }

      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        console.error("No GPU adapter found");
        return;
      }

      const device = await adapter.requestDevice();
      const renderer = new WebGPURenderer(canvasRef.current, device, {
        ...physicsConfig,
        width: dimensions.width,
        height: dimensions.height,
      });
      
      await renderer.setData(data);
      rendererRef.current = renderer;

      const loop = () => {
        renderer.render();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    initGPU();
  }, [dimensions, data]);

  const filteredLinks = useMemo(
    () => data.links.filter((link) => activeFilters.has(link.type as EdgeType)),
    [data.links, activeFilters],
  );
  const filteredData = useMemo(
    () => ({ nodes: data.nodes, links: filteredLinks }),
    [data.nodes, filteredLinks],
  );

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setData(filteredData);
    }
  }, [filteredData]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{ backgroundColor: "#0D0D0D", display: "block" }}
    />
  );
}
