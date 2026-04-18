import React from "react";
import { EdgeType, EDGE_COLORS, EDGE_LABELS, GraphNode } from "../types";
import type { ChapterMeta } from "../types";
import styles from "./FilterBar.module.css";

interface FilterBarProps {
  viewMode: "graph" | "table" | "chapter-summary";
  onViewModeChange: (view: "graph" | "table" | "chapter-summary") => void;
  activeFilters: Set<EdgeType>;
  onToggle: (type: EdgeType) => void;
  activeTab: "filters" | "search";
  onTabChange: (tab: "filters" | "search") => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  searchResults: GraphNode[];
  onSelectNode: (id: string) => void;
  chapters: ChapterMeta[];
  activeChapterIdx: number;
  onChapterChange: (idx: number) => void;
  onBack: () => void;
}

const ALL_TYPES = Object.keys(EDGE_LABELS) as EdgeType[];

const FilterBar: React.FC<FilterBarProps> = ({
  viewMode,
  onViewModeChange,
  activeFilters,
  onToggle,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchQueryChange,
  searchResults,
  onSelectNode,
  chapters,
  activeChapterIdx,
  onChapterChange,
  onBack,
}) => {
  return (
    <div className={styles.bar} role="toolbar" aria-label="Graph controls">
      <button
        className={styles.backButton}
        onClick={onBack}
        aria-label="Back to home"
      >
        ← Home
      </button>
      <select
        className={styles.chapterSelect}
        value={activeChapterIdx}
        onChange={(e) => onChapterChange(Number(e.target.value))}
        aria-label="Chapter"
        title={chapters[activeChapterIdx]?.description}
      >
        {chapters.map((ch, idx) => (
          <option key={ch.id} value={idx}>
            {ch.label}
          </option>
        ))}
      </select>

      <div
        className={styles.viewModes}
        role="tablist"
        aria-label="View modes"
      >
        <button
          id="graph-tab"
          role="tab"
          className={styles.viewModeButton}
          data-active={viewMode === "graph"}
          onClick={() => onViewModeChange("graph")}
          aria-selected={viewMode === "graph"}
          aria-controls="graph-panel"
          tabIndex={viewMode === "graph" ? 0 : -1}
        >
          Graph
        </button>
        <button
          id="table-tab"
          role="tab"
          className={styles.viewModeButton}
          data-active={viewMode === "table"}
          onClick={() => onViewModeChange("table")}
          aria-selected={viewMode === "table"}
          aria-controls="table-panel"
          tabIndex={viewMode === "table" ? 0 : -1}
        >
          Table
        </button>
        <button
          id="summary-tab"
          role="tab"
          className={styles.viewModeButton}
          data-active={viewMode === "chapter-summary"}
          onClick={() => onViewModeChange("chapter-summary")}
          aria-selected={viewMode === "chapter-summary"}
          aria-controls="summary-panel"
          tabIndex={viewMode === "chapter-summary" ? 0 : -1}
        >
          Chapter Summary
        </button>
      </div>

      {viewMode === "graph" && (
        <>
          <div className={styles.tabs} role="tablist" aria-label="Graph tools">
            <button
              role="tab"
              className={styles.tab}
              data-active={activeTab === "filters"}
              onClick={() => onTabChange("filters")}
              aria-selected={activeTab === "filters"}
              aria-controls="graph-filters-panel"
              tabIndex={activeTab === "filters" ? 0 : -1}
            >
              Relationships
            </button>
            <button
              role="tab"
              className={styles.tab}
              data-active={activeTab === "search"}
              onClick={() => onTabChange("search")}
              aria-selected={activeTab === "search"}
              aria-controls="graph-search-panel"
              tabIndex={activeTab === "search" ? 0 : -1}
            >
              Search
            </button>
          </div>

          {activeTab === "filters" && (
            <div
              id="graph-filters-panel"
              className={styles.toolPanel}
              role="tabpanel"
              aria-label="Relationship filters"
            >
              <span className={styles.label}>Show:</span>
              <div className={styles.pills} role="group">
                {ALL_TYPES.map((type) => {
                  const active = activeFilters.has(type);
                  const color = EDGE_COLORS[type];
                  return (
                    <button
                      key={type}
                      className={styles.pill}
                      aria-pressed={active}
                      onClick={() => onToggle(type)}
                      style={{
                        borderColor: color,
                        background: active ? `${color}33` : "transparent",
                        color: active ? color : "#666",
                      }}
                      title={EDGE_LABELS[type]}
                    >
                      {EDGE_LABELS[type]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "search" && (
            <div
              id="graph-search-panel"
              className={styles.searchWrap}
              role="tabpanel"
              aria-label="Graph search"
            >
              <input
                className={styles.searchInput}
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="Search characters by name, role, or later note"
                aria-label="Search characters"
              />
              <div className={styles.searchResults}>
                {searchResults.map((node) => (
                  <button
                    key={node.id}
                    className={styles.searchItem}
                    onClick={() => onSelectNode(node.id)}
                  >
                    <span className={styles.searchName}>{node.label}</span>
                    <span className={styles.searchMeta}>{node.title}</span>
                  </button>
                ))}
                {searchResults.length === 0 && (
                  <div className={styles.searchEmpty}>
                    No matches in visible chapter data.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {viewMode === "table" && (
        <div className={styles.modeHint}>
          Table view keeps the same chapter dataset in a searchable reference
          layout.
        </div>
      )}

      {viewMode === "chapter-summary" && (
        <div className={styles.modeHint}>
          Chapter summary view gives a spoiler-safe overview for the selected
          chapter boundary.
        </div>
      )}
    </div>
  );
};

export default FilterBar;
