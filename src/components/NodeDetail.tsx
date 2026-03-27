import { useEffect, useCallback } from "react";
import type { GraphNode, GraphLink, EdgeType } from "../types";
import {
  FACTION_COLORS,
  FACTION_LABELS,
  EDGE_COLORS,
  EDGE_LABELS,
  LATER_RELEVANCE_COLORS,
  LATER_RELEVANCE_LABELS,
} from "../types";
import { linkSourceId, linkTargetId } from "../utils/linkHelpers";
import styles from "./NodeDetail.module.css";

interface Props {
  node: GraphNode | null;
  links: GraphLink[];
  allNodes: GraphNode[];
  onClose: () => void;
  panelWidth?: number;
  onRequestPanelWidthChange?: (w: number) => void;
}

export default function NodeDetail({
  node,
  links,
  allNodes,
  onClose,
  panelWidth,
  onRequestPanelWidthChange,
}: Props) {
  const nodeMap = Object.fromEntries(allNodes.map((n) => [n.id, n]));

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!node) return null;

  const relevantLinks = links.filter((l) => {
    const srcId = linkSourceId(l);
    const tgtId = linkTargetId(l);
    return srcId === node.id || tgtId === node.id;
  });

  const totalStrength = relevantLinks.reduce(
    (sum, link) => sum + link.weight,
    0,
  );
  const relationshipCounts = relevantLinks.reduce<Record<string, number>>(
    (acc, link) => {
      acc[link.type] = (acc[link.type] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const relationshipEntries = Object.entries(relationshipCounts)
    .map(([type, count]) => ({ type: type as EdgeType, count }))
    .sort((a, b) => b.count - a.count);
  const strongestLinks = [...relevantLinks]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  const factionColor = FACTION_COLORS[node.faction] ?? "#888";

  const startResize = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault?.();
    const minW = 220;
    const maxW = Math.floor(window.innerWidth * 0.85);

    function onMove(ev: MouseEvent | TouchEvent) {
      const clientX =
        "touches" in ev
          ? (ev as TouchEvent).touches[0].clientX
          : (ev as MouseEvent).clientX;
      const newW = Math.max(minW, Math.min(maxW, window.innerWidth - clientX));
      if (typeof onRequestPanelWidthChange === "function")
        onRequestPanelWidthChange(newW);
      else
        document.documentElement.style.setProperty(
          "--side-panel-width",
          `${newW}px`,
        );
    }

    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <aside
        className={styles.panel}
        role="complementary"
        aria-label={`Details for ${node.label}`}
        style={{
          width: typeof panelWidth === "number" ? `${panelWidth}px` : undefined,
        }}
      >
        <div
          className={styles.resizer}
          onMouseDown={startResize}
          onTouchStart={startResize}
          aria-hidden="true"
        />
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div
          className={styles.header}
          style={{ borderLeftColor: factionColor }}
        >
          <h2 className={styles.name}>{node.label}</h2>
          {node.nicknames && node.nicknames.length > 0 && (
            <p className={styles.nicknames}>{node.nicknames.join(" · ")}</p>
          )}
          <p className={styles.titleLine}>{node.title}</p>
          {node.dates && <p className={styles.dates}>{node.dates}</p>}
          <div className={styles.badgeRow}>
            <span
              className={styles.factionBadge}
              style={{
                background: `${factionColor}33`,
                color: factionColor,
                borderColor: `${factionColor}66`,
              }}
            >
              {FACTION_LABELS[node.faction]}
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Overview</div>
          <div className={styles.bio}>{node.bio}</div>
        </div>

        {(node.laterRelevance || node.laterNote) && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Later In Book</div>
            {node.laterRelevance && (
              <div className={styles.badgeRow}>
                <span
                  className={styles.factionBadge}
                  style={{
                    background: `${LATER_RELEVANCE_COLORS[node.laterRelevance]}22`,
                    color: LATER_RELEVANCE_COLORS[node.laterRelevance],
                    borderColor: `${LATER_RELEVANCE_COLORS[node.laterRelevance]}55`,
                  }}
                >
                  {LATER_RELEVANCE_LABELS[node.laterRelevance]}
                </span>
              </div>
            )}
            {node.laterNote && (
              <div className={styles.bio}>{node.laterNote}</div>
            )}
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Chapter Snapshot</div>
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Centrality</span>
              <span className={styles.metricValue}>{node.centrality}/10</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Connections</span>
              <span className={styles.metricValue}>{relevantLinks.length}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Total Tie Strength</span>
              <span className={styles.metricValue}>{totalStrength}</span>
            </div>
          </div>
          {relationshipEntries.length > 0 && (
            <ul className={styles.countList}>
              {relationshipEntries.map((entry) => (
                <li key={entry.type} className={styles.countItem}>
                  <span className={styles.countLabel}>
                    {EDGE_LABELS[entry.type] ?? entry.type}
                  </span>
                  <span className={styles.countValue}>{entry.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {strongestLinks.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Strongest Ties</div>
            <ul className={styles.keyList}>
              {strongestLinks.map((link, index) => {
                const srcId = linkSourceId(link);
                const tgtId = linkTargetId(link);
                const otherId = srcId === node.id ? tgtId : srcId;
                const otherNode = nodeMap[otherId];
                return (
                  <li key={`${otherId}-${index}`} className={styles.keyItem}>
                    <span className={styles.keyTitle}>
                      {otherNode?.label ?? otherId}
                    </span>
                    <span className={styles.keyMeta}>
                      {EDGE_LABELS[link.type as EdgeType] ?? link.type} ·
                      strength {link.weight}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {relevantLinks.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Relationships</div>
            <ul className={styles.relList}>
              {relevantLinks.map((link, i) => {
                const srcId = linkSourceId(link);
                const tgtId = linkTargetId(link);
                const otherId = srcId === node.id ? tgtId : srcId;
                const otherNode = nodeMap[otherId];
                const edgeColor = EDGE_COLORS[link.type as EdgeType] ?? "#888";
                const directionLabel = srcId === node.id ? "→" : "←";
                return (
                  <li key={i} className={styles.relItem}>
                    <div className={styles.relHeader}>
                      <span className={styles.relArrow}>{directionLabel}</span>
                      <span
                        className={styles.relTypeBadge}
                        style={{
                          background: `${edgeColor}33`,
                          color: edgeColor,
                          borderColor: `${edgeColor}66`,
                        }}
                      >
                        {EDGE_LABELS[link.type as EdgeType] ?? link.type}
                      </span>
                      <span className={styles.relTarget}>
                        {otherNode?.label ?? otherId}
                      </span>
                    </div>
                    <span className={styles.relDesc}>{link.description}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </aside>
    </>
  );
}
