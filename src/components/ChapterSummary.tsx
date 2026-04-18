import { useMemo } from "react";
import type { ChapterMeta, GraphNode, GraphLink } from "../types";
import { EDGE_LABELS, FACTION_LABELS } from "../types";
import styles from "./ChapterSummary.module.css";

interface Props {
  chapter: ChapterMeta;
  nodes: GraphNode[];
  links: GraphLink[];
}

export default function ChapterSummary({ chapter, nodes, links }: Props) {
  const topCharacters = useMemo(
    () =>
      [...nodes]
        .sort((a, b) => b.centrality - a.centrality || a.label.localeCompare(b.label))
        .slice(0, 10),
    [nodes],
  );

  const relationshipMix = useMemo(() => {
    const counts = new Map<string, number>();
    for (const link of links) {
      counts.set(link.type, (counts.get(link.type) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [links]);

  const factionMix = useMemo(() => {
    const counts = new Map<string, number>();
    for (const node of nodes) {
      counts.set(node.faction, (counts.get(node.faction) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([faction, count]) => ({ faction, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [nodes]);

  return (
    <section className={styles.shell} aria-label="Chapter summary">
      <header className={styles.header}>
        <h2 className={styles.title}>{chapter.label} Summary</h2>
        <p className={styles.subtitle}>{chapter.description}</p>
      </header>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h3 className={styles.cardTitle}>Snapshot</h3>
          <ul className={styles.statList}>
            <li>
              <span>Characters</span>
              <strong>{nodes.length}</strong>
            </li>
            <li>
              <span>Relationships</span>
              <strong>{links.length}</strong>
            </li>
          </ul>
          <p className={styles.note}>
            This panel only summarizes what is visible at this chapter boundary.
          </p>
        </article>

        <article className={styles.card}>
          <h3 className={styles.cardTitle}>Top Characters</h3>
          <ol className={styles.rankList}>
            {topCharacters.map((node) => (
              <li key={node.id}>
                <span>{node.label}</span>
                <em>Centrality {node.centrality}/10</em>
              </li>
            ))}
          </ol>
        </article>

        <article className={styles.card}>
          <h3 className={styles.cardTitle}>Relationship Mix</h3>
          <ul className={styles.list}>
            {relationshipMix.map((entry) => (
              <li key={entry.type}>
                <span>{EDGE_LABELS[entry.type as keyof typeof EDGE_LABELS] ?? entry.type}</span>
                <strong>{entry.count}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.card}>
          <h3 className={styles.cardTitle}>Faction Mix</h3>
          <ul className={styles.list}>
            {factionMix.map((entry) => (
              <li key={entry.faction}>
                <span>
                  {FACTION_LABELS[entry.faction as keyof typeof FACTION_LABELS] ??
                    entry.faction}
                </span>
                <strong>{entry.count}</strong>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
