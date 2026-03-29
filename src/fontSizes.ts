/**
 * Font-size schema for the Book-Graph Visualiser.
 *
 * ## Design rationale
 *
 * Every font size is expressed in **rem** units so it scales proportionally
 * when the user adjusts `--font-base-size` (the root font size) via the
 * settings wheel.  The only absolute value is `--font-base-size` itself
 * (default 16 px), which acts as the single scaling knob for the entire UI.
 *
 * Sizes are grouped by the area of the UI they apply to:
 *
 * | Category   | Where it appears                                   |
 * |------------|----------------------------------------------------|
 * | panel      | Side detail panel (NodeDetail)                     |
 * | table      | Character table view                               |
 * | filter     | Top toolbar / filter bar                            |
 * | settings   | Settings popover                                   |
 * | canvas     | Force-graph node labels (screen-px, not rem)        |
 *
 * ### Why rem, not px?
 *
 * Earlier versions used a mix of `px` for panel text and `rem` for toolbar
 * text.  Changing the base size scaled toolbar fonts but left panel fonts
 * (strongest-tie names, chronological-relationship descriptions, etc.)
 * unchanged — the root cause of issues #9 and #10.  Moving everything to
 * rem means one slider governs the whole experience.
 *
 * ### Why slightly larger defaults?
 *
 * Several panel elements (relationship descriptions, strength metadata,
 * faction badges) were previously ≤ 10 px at the default 16 px base.
 * The new defaults nudge those up to improve legibility on standard DPI
 * screens while still fitting comfortably in the side panel.
 */

export type FontSizeCategory = "panel" | "table" | "filter" | "settings" | "canvas";

export interface FontSizeEntry {
  /** CSS custom-property name, e.g. `--font-title-size`. */
  cssVar: string;
  /** Default value in rem (or unitless for canvas sizes). */
  defaultValue: number;
  /** Human-readable purpose. */
  description: string;
  /** UI area this size belongs to. */
  category: FontSizeCategory;
  /** Unit appended when writing to `:root` (`"rem"`, `"px"`, or `""` for unitless). */
  unit: "rem" | "px" | "";
}

/** Base font size — the single absolute anchor.  All other sizes derive from this via rem. */
export const DEFAULT_BASE_SIZE_PX = 16;

/**
 * Complete font-size schema.
 *
 * The order within each category is roughly "largest → smallest" so the
 * settings UI can render them top-to-bottom if desired.
 */
export const FONT_SIZE_SCHEMA: FontSizeEntry[] = [
  // ── Base ────────────────────────────────────────────────────────────
  {
    cssVar: "--font-base-size",
    defaultValue: DEFAULT_BASE_SIZE_PX,
    description: "Root font size — the single scaling knob",
    category: "panel",
    unit: "px",
  },

  // ── Panel (NodeDetail side panel) ──────────────────────────────────
  {
    cssVar: "--font-title-size",
    defaultValue: 1.25,
    description: "Character name in the detail panel header",
    category: "panel",
    unit: "rem",
  },
  {
    cssVar: "--font-bio-size",
    defaultValue: 0.92,
    description: "Bio / overview paragraph text",
    category: "panel",
    unit: "rem",
  },
  {
    cssVar: "--font-small-size",
    defaultValue: 0.82,
    description: "Title line, metric values, relationship target names",
    category: "panel",
    unit: "rem",
  },
  {
    cssVar: "--font-nickname-size",
    defaultValue: 0.76,
    description: "Nicknames, section headings (Overview, Strongest Ties …)",
    category: "panel",
    unit: "rem",
  },
  {
    cssVar: "--font-meta-size",
    defaultValue: 0.74,
    description: "Counts, strength/centrality metadata, subtitles",
    category: "panel",
    unit: "rem",
  },
  {
    cssVar: "--font-badge-size",
    defaultValue: 0.66,
    description: "Faction badges, edge-type badges",
    category: "panel",
    unit: "rem",
  },

  // ── Table (CharacterTable) ─────────────────────────────────────────
  {
    cssVar: "--font-table-title",
    defaultValue: 1.35,
    description: "\"Character Table\" heading",
    category: "table",
    unit: "rem",
  },
  {
    cssVar: "--font-table-name",
    defaultValue: 1.0,
    description: "Character name cell in table",
    category: "table",
    unit: "rem",
  },
  {
    cssVar: "--font-table-search",
    defaultValue: 0.9,
    description: "Table search input text",
    category: "table",
    unit: "rem",
  },
  {
    cssVar: "--font-table-body",
    defaultValue: 0.88,
    description: "Bio / context column text",
    category: "table",
    unit: "rem",
  },
  {
    cssVar: "--font-table-subtitle",
    defaultValue: 0.88,
    description: "Subtitle under the table heading",
    category: "table",
    unit: "rem",
  },
  {
    cssVar: "--font-table-secondary",
    defaultValue: 0.78,
    description: "Nicknames, centrality footnotes in table",
    category: "table",
    unit: "rem",
  },
  {
    cssVar: "--font-table-header",
    defaultValue: 0.75,
    description: "Column headers (Character, Role, …)",
    category: "table",
    unit: "rem",
  },
  {
    cssVar: "--font-table-badge",
    defaultValue: 0.72,
    description: "Faction badge inside table rows",
    category: "table",
    unit: "rem",
  },

  // ── Filter bar ─────────────────────────────────────────────────────
  {
    cssVar: "--font-search-name",
    defaultValue: 0.8,
    description: "Search-result character name",
    category: "filter",
    unit: "rem",
  },
  {
    cssVar: "--font-search-input",
    defaultValue: 0.78,
    description: "Search input text",
    category: "filter",
    unit: "rem",
  },
  {
    cssVar: "--font-hint",
    defaultValue: 0.75,
    description: "Hint text / empty-state messages",
    category: "filter",
    unit: "rem",
  },
  {
    cssVar: "--font-search-meta",
    defaultValue: 0.7,
    description: "Search-result subtitle / role",
    category: "filter",
    unit: "rem",
  },
  {
    cssVar: "--font-filter-label",
    defaultValue: 0.68,
    description: "\"Show:\" label next to filter pills",
    category: "filter",
    unit: "rem",
  },
  {
    cssVar: "--font-filter-pill",
    defaultValue: 0.65,
    description: "Edge-type filter pill text",
    category: "filter",
    unit: "rem",
  },

  // ── Settings popover ───────────────────────────────────────────────
  {
    cssVar: "--font-settings-label",
    defaultValue: 0.8,
    description: "Label text in the settings popover",
    category: "settings",
    unit: "rem",
  },
  {
    cssVar: "--font-settings-hint",
    defaultValue: 0.78,
    description: "\"Saved automatically\" hint",
    category: "settings",
    unit: "rem",
  },

  // ── Canvas (force-graph) ───────────────────────────────────────────
  {
    cssVar: "--node-label-base-size",
    defaultValue: 12,
    description: "Node label base size in screen pixels (not rem)",
    category: "canvas",
    unit: "",
  },
];

/**
 * Convenience lookup: CSS variable name → default value (with unit).
 *
 * Useful for the settings-reset logic.
 */
export const FONT_SIZE_DEFAULTS: Record<string, string> = Object.fromEntries(
  FONT_SIZE_SCHEMA.map((entry) => [
    entry.cssVar,
    `${entry.defaultValue}${entry.unit}`,
  ]),
);
