import { useMemo, useState } from "react";
import type { GraphLink, GraphNode } from "../types";
import type { CharacterArcPoint } from "../features/stalin/BookExperience";
import {
  FACTION_COLORS,
  FACTION_LABELS,
} from "../types";
import { linkSourceId, linkTargetId } from "../utils/linkHelpers";
import styles from "./CharacterTable.module.css";

const MAX_PROPER_NOUNS_DISPLAY = 180;
const PROPER_NOUN_REGEX =
  /\b(?:[A-Z]{2,}|[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]*)(?:\s+(?:[A-Z]{2,}|[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]*))*/g;

function toArcSummary(
  points: CharacterArcPoint[] | undefined,
  activeChapterLabel: string,
) {
  if (!points || points.length === 0) {
    return `No arc milestones recorded through ${activeChapterLabel}.`;
  }
  const first = points[0];
  const latest = points[points.length - 1];
  const centralityText = `current centrality ${latest.centrality}/10.`;
  if (points.length === 1) {
    return `First appears in ${first.chapterLabel}; ${centralityText}`;
  }
  return `First appears in ${first.chapterLabel}; ${points.length - 1} update milestone(s) through ${activeChapterLabel}; ${centralityText}`;
}

interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  activeChapterLabel: string;
  characterArcs: Map<string, CharacterArcPoint[]>;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSelectNode: (id: string) => void;
  selectedNodeId?: string | null;
}

export default function CharacterTable({
  nodes,
  links,
  activeChapterLabel,
  characterArcs,
  searchQuery,
  onSearchQueryChange,
  onSelectNode,
  selectedNodeId,
}: Props) {
  const [debugProperNouns, setDebugProperNouns] = useState(false);

  const connectionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const link of links) {
      const src = linkSourceId(link);
      const tgt = linkTargetId(link);
      counts.set(src, (counts.get(src) ?? 0) + 1);
      counts.set(tgt, (counts.get(tgt) ?? 0) + 1);
    }
    return counts;
  }, [links]);

  const rows = useMemo(() => {
    const sorted = [...nodes].sort(
      (a, b) => b.centrality - a.centrality || a.label.localeCompare(b.label),
    );
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((node) =>
      [
        node.label,
        node.title,
        node.bio,
        ...(node.nicknames ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [nodes, searchQuery]);

  const properNounRows = useMemo(() => {
    if (!debugProperNouns) return [];
    const counts = new Map<string, number>();

    const consume = (text: string) => {
      if (!text || text.toLowerCase() === text.toUpperCase()) return;
      const matches = text.match(PROPER_NOUN_REGEX);
      if (!matches) return;
      for (const match of matches) {
        const noun = match.trim();
        counts.set(noun, (counts.get(noun) ?? 0) + 1);
      }
    };

    for (const node of nodes) {
      consume(node.label);
      consume(node.title);
      consume(node.bio);
      for (const nickname of node.nicknames ?? []) consume(nickname);
    }
    for (const link of links) consume(link.description);

    return [...counts.entries()]
      .map(([noun, count]) => ({ noun, count }))
      .sort((a, b) => b.count - a.count || a.noun.localeCompare(b.noun));
  }, [debugProperNouns, nodes, links]);

  return (
    <section className={styles.shell} aria-label="Character table">
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Character Table</h2>
          <p className={styles.subtitle}>
            Search the cast and inspect each figure's role and connections in this chapter.
          </p>
        </div>
        <input
          className={styles.search}
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search by name, role, or bio"
          aria-label="Search character table"
        />
      </div>
      <div className={styles.debugRow}>
        <label className={styles.debugLabel}>
          <input
            type="checkbox"
            checked={debugProperNouns}
            onChange={(event) => setDebugProperNouns(event.target.checked)}
          />
          Debug proper nouns (uppercase regex collation)
        </label>
        {debugProperNouns ? (
          <span className={styles.debugMeta}>
            {properNounRows.length} noun entries in current chapter dataset
          </span>
        ) : null}
      </div>

      {debugProperNouns && (
        <div className={styles.debugPanel} aria-label="Proper noun debug output">
          {properNounRows.slice(0, MAX_PROPER_NOUNS_DISPLAY).map((entry) => (
            <div key={entry.noun} className={styles.debugItem}>
              <span>{entry.noun}</span>
              <strong>{entry.count}</strong>
            </div>
          ))}
          {properNounRows.length === 0 && (
            <div className={styles.debugEmpty}>No uppercase proper nouns found.</div>
          )}
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Character</th>
              <th>Current Role</th>
              <th>Chapter Context</th>
              <th className={styles.numeric}>Links</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((node) => {
              const factionColor = FACTION_COLORS[node.faction] ?? "#888";
              return (
                <tr
                  key={node.id}
                  className={styles.row}
                  data-selected={node.id === selectedNodeId}
                  onClick={() => onSelectNode(node.id)}
                >
                  <td>
                    <div className={styles.primaryCell}>
                      <button
                        type="button"
                        className={styles.nameButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNode(node.id);
                        }}
                      >
                        {node.label}
                      </button>
                      <div className={styles.badges}>
                        <span
                          className={styles.badge}
                          style={{
                            background: `${factionColor}22`,
                            borderColor: `${factionColor}55`,
                            color: factionColor,
                          }}
                        >
                          {FACTION_LABELS[node.faction]}
                        </span>
                        {node.nicknames?.length ? (
                          <span className={styles.secondary}>
                            {node.nicknames.join(" · ")}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.role}>{node.title}</div>
                    <div className={styles.centrality}>
                      Centrality {node.centrality}/10
                    </div>
                  </td>
                  <td className={styles.textCell}>
                    <div>{node.bio}</div>
                    <div className={styles.arcMeta}>
                      {toArcSummary(characterArcs.get(node.id), activeChapterLabel)}
                    </div>
                  </td>
                  <td className={styles.numeric}>
                    {connectionCounts.get(node.id) ?? 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className={styles.empty}>
            No characters match the current search.
          </div>
        )}
      </div>
    </section>
  );
}
