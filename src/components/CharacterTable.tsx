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
/**
 * Matches proper nouns using two alternation arms:
 *   [A-Z]{2,}                   – all-caps abbreviations (e.g. NKVD, GPU, USSR)
 *   [A-Z][A-Za-zÀ-ÖØ-öø-ÿ’'-]* – a word starting uppercase then any mix of
 *                                   letters (incl. accented), hyphens, apostrophes
 *                                   (e.g. Stalin, O'Brien, Al-Khobar)
 * The outer group repeats after optional whitespace so that contiguous capitalized
 * words like "Joseph Stalin" or "Red Army" are captured as a single token.
 */
const PROPER_NOUN_REGEX =
  /\b(?:[A-Z]{2,}|[A-Z][A-Za-zÀ-ÖØ-öø-ÿ’'-]*)(?:\s+(?:[A-Z]{2,}|[A-Z][A-Za-zÀ-ÖØ-öø-ÿ’'-]*))*/g;

/**
 * Sentence boundary heuristic: split on ., !, ? followed by whitespace (optionally
 * closing quotes/brackets). This lets us skip the first word of each sentence,
 * which is capitalised for grammatical reasons rather than as a proper noun.
 */
const SENTENCE_SPLIT_RE = /[.!?]+["']?\s+/g;

/**
 * Common English words that appear at sentence-start and should not be counted
 * as proper nouns even if they happen to be capitalised in mid-sentence proper
 * noun searches.
 */
const STOP_COMMON_WORDS = new Set([
  "the","a","an","in","on","at","by","for","with","from","to","and","or","but",
  "if","when","while","after","before","since","because","however","therefore",
  "thus","meanwhile","today","yesterday","tomorrow","he","she","it","they","we",
  "you","i","your","our","my","his","her","their","its","this","that","these",
  "those","there","here","where","why","how","what","which","who","whom","whose",
]);

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
 
     const add = (noun: string) => {
       const trimmed = noun.trim();
       if (!trimmed) return;
       counts.set(trimmed, (counts.get(trimmed) ?? 0) + 1);
     };
 
     // 1. Direct node fields are always proper nouns: label, title, nicknames.
     for (const node of nodes) {
       add(node.label);
       add(node.title);
       for (const nick of node.nicknames ?? []) add(nick);
     }
 
     // 2. Free-text fields (bio, link.description) with sentence-start filtering.
     const processText = (text: string) => {
       if (!text) return;
       // Split into sentences; the regex captures the sentence boundary punctuation + trailing space.
       const sentences = text.split(SENTENCE_SPLIT_RE);
       for (const sentence of sentences) {
         let matchIdx = 0;
         const matches = sentence.matchAll(PROPER_NOUN_REGEX);
         for (const m of matches) {
           const noun = m[0];
           // Skip first match if it's a common function word (sentence-start noise).
           if (matchIdx === 0 && STOP_COMMON_WORDS.has(noun.toLowerCase())) {
             matchIdx += 1;
             continue;
           }
           matchIdx += 1;
           add(noun);
         }
       }
     };
 
     for (const node of nodes) processText(node.bio);
     for (const link of links) processText(link.description);
 
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
