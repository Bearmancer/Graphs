import { useState, useCallback, useEffect, useMemo } from "react";
import StalinGraph, { RenderSettings } from "./StalinGraph";
import NodeDetail from "../../components/NodeDetail";
import FilterBar from "../../components/FilterBar";
import SettingsWheel from "../../components/SettingsWheel";
import {
  GraphNode,
  GraphLink,
  EdgeType,
  EDGE_LABELS,
} from "./types";
import chapters, { DEFAULT_CHAPTER_ID } from "./data/chapters";
import CharacterTable from "../../components/CharacterTable";
import { DEFAULT_BASE_SIZE_PX } from "../../fontSizes";
import ChapterSummary from "../../components/ChapterSummary";

const DEFAULT_CHAPTER_IDX = Math.max(0, chapters.findIndex((c) => c.id === DEFAULT_CHAPTER_ID));
const ALL_EDGE_TYPES = new Set(Object.keys(EDGE_LABELS) as EdgeType[]);

export interface CharacterArcPoint {
  chapterId: string;
  chapterLabel: string;
  title: string;
  centrality: number;
  bio: string;
  isFirstAppearance: boolean;
}

type AllSettings = {
  fontUI: string;
  fontSerif: string;
  fontMono: string;
  fontBaseSize: number;
  nodeLabelBase: number;
};

const DEFAULTS: AllSettings = {
  fontUI: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontSerif: "'Spectral', serif",
  fontMono:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",
  fontBaseSize: DEFAULT_BASE_SIZE_PX,
  nodeLabelBase: 12,
};

function readRootSettings(): AllSettings {
  try {
    const cs = getComputedStyle(document.documentElement);
    const read = (key: string, fallback: string) =>
      (cs.getPropertyValue(key) || fallback).trim();
    const fontBaseSize =
      parseFloat(read("--font-base-size", `${DEFAULTS.fontBaseSize}px`)) ||
      DEFAULTS.fontBaseSize;
    const nodeLabelBase =
      parseFloat(read("--node-label-base-size", `${DEFAULTS.nodeLabelBase}`)) ||
      DEFAULTS.nodeLabelBase;
    return {
      fontUI: read("--font-ui", DEFAULTS.fontUI),
      fontSerif: read("--font-serif", DEFAULTS.fontSerif),
      fontMono: read("--font-mono", DEFAULTS.fontMono),
      fontBaseSize,
      nodeLabelBase,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

const STORAGE_KEY = "graph-ui-settings";

export default function BookExperience({ onBack }: { onBack: () => void }) {
  const [chapterIdx, setChapterIdx] = useState(DEFAULT_CHAPTER_IDX);
  const graphData = chapters[chapterIdx].data;
  const allNodes = graphData.nodes as GraphNode[];
  const [viewMode, setViewMode] = useState<"graph" | "table" | "chapter-summary">(
    "graph",
  );
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<EdgeType>>(
    new Set(ALL_EDGE_TYPES),
  );
  const [activeTab, setActiveTab] = useState<"filters" | "search">("filters");
  const [searchQuery, setSearchQuery] = useState("");
  const [panelWidth, setPanelWidth] = useState<number>(() => {
    try {
      const cs = getComputedStyle(document.documentElement);
      return parseFloat(cs.getPropertyValue("--side-panel-width")) || 340;
    } catch {
      return 340;
    }
  });

  useEffect(() => {
    setSelectedNode((prev) =>
      prev && allNodes.some((node) => node.id === prev.id) ? prev : null,
    );
  }, [allNodes]);

  // Load settings from localStorage or computed style
  const [settings, setSettings] = useState<AllSettings>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) } as AllSettings;
    } catch {
      /* ignore */
    }
    return readRootSettings();
  });

  // Apply settings to :root and persist
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--font-ui", settings.fontUI);
    root.style.setProperty("--font-serif", settings.fontSerif);
    root.style.setProperty("--font-mono", settings.fontMono);
    root.style.setProperty("--font-base-size", `${settings.fontBaseSize}px`);
    root.style.setProperty(
      "--node-label-base-size",
      `${settings.nodeLabelBase}`,
    );
    root.style.setProperty("--side-panel-width", `${panelWidth}px`);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings, panelWidth]);

  const handleClose = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  const handleToggleFilter = useCallback((type: EdgeType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const handlePanelWidthChange = useCallback((w: number) => {
    const minW = 220;
    const maxW = Math.floor(window.innerWidth * 0.85);
    const clamped = Math.max(minW, Math.min(maxW, Math.round(w)));
    setPanelWidth(clamped);
    document.documentElement.style.setProperty(
      "--side-panel-width",
      `${clamped}px`,
    );
  }, []);

  const handleSettingsChange = (newSettings: Record<string, unknown>) => {
    setSettings(newSettings as AllSettings);
  };

  const uiSettings: RenderSettings = {
    uiFont: settings.fontUI.replace(/(^"|"$)/g, "").trim(),
    nodeLabelBase: settings.nodeLabelBase,
  };

  const searchResults = useMemo(() => {
    const sorted = [...allNodes].sort(
      (a, b) => b.centrality - a.centrality || a.label.localeCompare(b.label),
    );
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sorted.slice(0, 20);
    return sorted
      .filter((node) => {
        const text = [
          node.label,
          node.title,
          node.bio,
          ...(node.nicknames ?? []),
        ]
          .join(" ")
          .toLowerCase();
        return text.includes(q);
      })
      .slice(0, 40);
  }, [allNodes, searchQuery]);

  const handleSelectNodeFromSearch = useCallback(
    (id: string) => {
      const found = allNodes.find((node) => node.id === id);
      if (!found) return;
      setSelectedNode(found);
      setSearchQuery(found.label);
    },
    [allNodes],
  );

  /** Table-view click: open the detail panel without changing the search filter. */
  const handleTableNodeSelect = useCallback(
    (id: string) => {
      const found = allNodes.find((node) => node.id === id);
      if (!found) return;
      setSelectedNode((prev) => (prev?.id === found.id ? null : found));
    },
    [allNodes],
  );

  const characterArcs = useMemo(() => {
    const arcs = new Map<string, CharacterArcPoint[]>();
    const snapshots = new Map<
      string,
      { title: string; bio: string; centrality: number }
    >();

    for (let i = 0; i <= chapterIdx; i += 1) {
      const chapter = chapters[i];
      const chapterNodes = chapter.data.nodes as GraphNode[];
      for (const node of chapterNodes) {
        const previous = snapshots.get(node.id);
        const isFirstAppearance = !previous;
        const changed =
          isFirstAppearance ||
          previous.title !== node.title ||
          previous.bio !== node.bio ||
          previous.centrality !== node.centrality;

        if (!changed) continue;

        const point: CharacterArcPoint = {
          chapterId: chapter.id,
          chapterLabel: chapter.label,
          title: node.title,
          centrality: node.centrality,
          bio: node.bio,
          isFirstAppearance,
        };
        let nodePoints = arcs.get(node.id);
        if (!nodePoints) {
          nodePoints = [];
          arcs.set(node.id, nodePoints);
        }
        nodePoints.push(point);
        snapshots.set(node.id, {
          title: node.title,
          bio: node.bio,
          centrality: node.centrality,
        });
      }
    }

    return arcs;
  }, [chapterIdx]);

  return (
    <>
      <FilterBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeFilters={activeFilters}
        onToggle={handleToggleFilter}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchResults={searchResults}
        onSelectNode={handleSelectNodeFromSearch}
        chapters={chapters}
        activeChapterIdx={chapterIdx}
        onChapterChange={setChapterIdx}
        onBack={onBack}
      />
      <SettingsWheel
        settings={settings}
        onChange={handleSettingsChange}
        onReset={() => setSettings(readRootSettings())}
      />
      {viewMode === "graph" && (
        <div id="graph-panel" role="tabpanel" aria-labelledby="graph-tab">
          <StalinGraph
            data={graphData}
            activeFilters={activeFilters}
            onNodeClick={handleNodeClick}
            uiSettings={uiSettings}
            focusedNodeId={selectedNode?.id ?? null}
          />
        </div>
      )}
      {viewMode === "table" && (
        <div id="table-panel" role="tabpanel" aria-labelledby="table-tab">
          <CharacterTable
            nodes={allNodes}
            links={graphData.links as GraphLink[]}
            activeChapterLabel={chapters[chapterIdx].label}
            characterArcs={characterArcs}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSelectNode={handleTableNodeSelect}
            selectedNodeId={selectedNode?.id ?? null}
          />
        </div>
      )}
      {viewMode === "chapter-summary" && (
        <div id="summary-panel" role="tabpanel" aria-labelledby="summary-tab">
          <ChapterSummary
            chapter={chapters[chapterIdx]}
            nodes={allNodes}
            links={graphData.links as GraphLink[]}
          />
        </div>
      )}
      <NodeDetail
        node={selectedNode}
        links={graphData.links as GraphLink[]}
        allNodes={allNodes}
        activeChapterLabel={chapters[chapterIdx].label}
        characterArc={selectedNode ? characterArcs.get(selectedNode.id) ?? [] : []}
        onClose={handleClose}
        panelWidth={panelWidth}
        onRequestPanelWidthChange={handlePanelWidthChange}
        viewMode={viewMode}
      />
    </>
  );
}
