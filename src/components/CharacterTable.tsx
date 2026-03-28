import { useMemo } from "react";
import type { GraphLink, GraphNode } from "../types";
import {
  FACTION_COLORS,
  FACTION_LABELS,
  LATER_RELEVANCE_COLORS,
  LATER_RELEVANCE_LABELS,
} from "../types";
import { linkSourceId, linkTargetId } from "../utils/linkHelpers";
import styles from "./CharacterTable.module.css";

interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSelectNode: (id: string) => void;
  selectedNodeId?: string | null;
}

export default function CharacterTable({
  nodes,
  links,
  searchQuery,
  onSearchQueryChange,
  onSelectNode,
  selectedNodeId,
}: Props) {
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
        node.laterNote,
        node.laterRelevance,
        ...(node.nicknames ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [nodes, searchQuery]);

  return (
    <section className={styles.shell} aria-label="Character table">
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Character Table</h2>
          <p className={styles.subtitle}>
            Search the cast, inspect their current chapter role, and see whether
            each figure stays important later in the book.
          </p>
        </div>
        <input
          className={styles.search}
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search by name, role, bio, or later relevance"
          aria-label="Search character table"
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Character</th>
              <th>Current Role</th>
              <th>Chapter Context</th>
              <th>Later In Book</th>
              <th className={styles.numeric}>Links</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((node) => {
              const factionColor = FACTION_COLORS[node.faction] ?? "#888";
              const laterColor = node.laterRelevance
                ? LATER_RELEVANCE_COLORS[node.laterRelevance]
                : "#888";
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
                        onClick={() => onSelectNode(node.id)}
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
                  <td className={styles.textCell}>{node.bio}</td>
                  <td>
                    {node.laterRelevance ? (
                      <span
                        className={styles.badge}
                        style={{
                          background: `${laterColor}22`,
                          borderColor: `${laterColor}55`,
                          color: laterColor,
                        }}
                      >
                        {LATER_RELEVANCE_LABELS[node.laterRelevance]}
                      </span>
                    ) : null}
                    <div className={styles.textCell}>
                      {node.laterNote ?? "No later note."}
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
