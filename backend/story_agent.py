"""
story_agent.py — Progressive graph JSON builder for the Stalin graph pipeline.

Reads an EPUB chapter-by-chapter via EpubProgressTracker and (using mock or
real LLM extraction) produces graph.json subsets that match the GraphData
TypeScript interface used by ~/graphs/Graph/src/data/graph.json.

GraphData shape:
  { nodes: GraphNode[], links: GraphLink[] }

GraphNode: id, label, title, faction, centrality, bio, dates?, nicknames?
GraphLink: source, target, type, weight, description
"""

import json
import re
import sys
from pathlib import Path
from typing import Any

from epub_parser import EpubProgressTracker


# ---------------------------------------------------------------------------
# Type aliases (mirrors TypeScript interfaces)
# ---------------------------------------------------------------------------

VALID_FACTIONS = {
    "supreme_authority", "politburo_core", "nkvd", "military",
    "politburo_family", "georgian_network", "leningrad_group",
    "cultural", "enemy_purged", "family",
}

VALID_EDGE_TYPES = {
    "ally", "married_to", "father_of", "subordinate", "rival",
    "friend_of", "bodyguard_of", "patron_of", "godparent_of",
    "in_love_with", "colleague_of", "family_connection",
}


def _node(
    node_id: str,
    label: str,
    title: str,
    faction: str,
    centrality: int,
    bio: str,
    dates: str = "",
    nicknames: list[str] | None = None,
) -> dict:
    n: dict[str, Any] = {
        "id": node_id,
        "label": label,
        "title": title,
        "faction": faction if faction in VALID_FACTIONS else "cultural",
        "centrality": max(1, min(10, centrality)),
        "bio": bio,
    }
    if dates:
        n["dates"] = dates
    if nicknames:
        n["nicknames"] = nicknames
    return n


def _link(source: str, target: str, edge_type: str, weight: int, description: str) -> dict:
    return {
        "source": source,
        "target": target,
        "type": edge_type if edge_type in VALID_EDGE_TYPES else "colleague_of",
        "weight": max(1, min(10, weight)),
        "description": description,
    }


# ---------------------------------------------------------------------------
# Mock extraction: simulates what an LLM would return for early chapters.
# Each entry represents "discoveries" made up to that chapter progression point.
# Replace with real LLM calls when integrating an actual model.
# ---------------------------------------------------------------------------

MOCK_PROGRESSIONS: list[dict] = [
    # Progression point 1 — Chapter 1-3: Stalin's origins & early family
    {
        "chapters_covered": 3,
        "new_nodes": [
            _node("Stalin", "Joseph Stalin", "General Secretary", "supreme_authority", 10,
                  "Born Ioseb Jughashvili. Rose to absolute power in the USSR.",
                  "1878–1953", ["Koba", "Soso"]),
            _node("Keke_Djugashvili", "Keke Djugashvili", "Mother", "family", 4,
                  "Stalin's devoutly religious mother.", "1858–1937"),
            _node("Vissarion_Djugashvili", "Vissarion Djugashvili", "Father", "family", 2,
                  "Cobbler; abusive alcoholic father of Stalin.", "1850–1909"),
        ],
        "new_links": [
            _link("Keke_Djugashvili", "Stalin", "father_of", 6, "Mother of Stalin"),
            _link("Vissarion_Djugashvili", "Stalin", "father_of", 3, "Biological father, largely absent"),
        ],
    },
    # Progression point 2 — Chapters 4-8: Nadya & Politburo inner circle
    {
        "chapters_covered": 8,
        "new_nodes": [
            _node("Nadya_Alliluyeva", "Nadya Alliluyeva", "Wife", "family", 6,
                  "Stalin's second wife; committed suicide in 1932.", "1901–1932"),
            _node("Molotov", "Vyacheslav Molotov", "Foreign Minister", "politburo_core", 8,
                  "Loyal Politburo stalwart; signed Molotov–Ribbentrop Pact.", "1890–1986"),
            _node("Kaganovich", "Lazar Kaganovich", "Commissar", "politburo_core", 7,
                  "Stalin's most loyal lieutenant; oversaw collectivization.", "1893–1991"),
            _node("Voroshilov", "Kliment Voroshilov", "Marshal", "military", 7,
                  "Civil War hero; head of Red Army.", "1881–1969"),
        ],
        "new_links": [
            _link("Stalin", "Nadya_Alliluyeva", "married_to", 8, "Married 1919; volatile relationship"),
            _link("Stalin", "Molotov", "ally", 9, "Decades-long political alliance"),
            _link("Stalin", "Kaganovich", "ally", 8, "Trusted loyalist"),
            _link("Stalin", "Voroshilov", "ally", 7, "Military ally since Civil War"),
        ],
    },
    # Progression point 3 — Chapters 9-15: NKVD, purges, inner circle expands
    {
        "chapters_covered": 15,
        "new_nodes": [
            _node("Yagoda", "Genrikh Yagoda", "NKVD Chief", "nkvd", 7,
                  "First NKVD chief; oversaw Gulag expansion; later purged.", "1891–1938"),
            _node("Yezhov", "Nikolai Yezhov", "NKVD Chief", "nkvd", 8,
                  "The 'Bloody Dwarf'; orchestrated Great Terror.", "1895–1940"),
            _node("Beria", "Lavrentiy Beria", "NKVD Chief", "nkvd", 9,
                  "Long-serving secret police chief; feared and powerful.", "1899–1953"),
            _node("Mikoyan", "Anastas Mikoyan", "Commissar of Trade", "politburo_core", 7,
                  "Survived every purge; master political survivor.", "1895–1978"),
            _node("Ordzhonikidze", "Sergo Ordzhonikidze", "Commissar", "georgian_network", 6,
                  "Georgian comrade of Stalin; died 1937 (likely suicide under pressure).",
                  "1886–1937"),
        ],
        "new_links": [
            _link("Stalin", "Yagoda", "subordinate", 7, "Commanded Yagoda's terror apparatus"),
            _link("Stalin", "Yezhov", "subordinate", 9, "Unleashed Yezhov on the party"),
            _link("Stalin", "Beria", "subordinate", 8, "Beria replaced Yezhov in 1938"),
            _link("Yagoda", "Yezhov", "subordinate", 5, "Yezhov succeeded Yagoda"),
            _link("Yezhov", "Beria", "subordinate", 5, "Beria replaced Yezhov"),
            _link("Stalin", "Mikoyan", "ally", 7, "Long-term political survival alliance"),
            _link("Stalin", "Ordzhonikidze", "friend_of", 6, "Old Georgian comrade"),
        ],
    },
]


# ---------------------------------------------------------------------------
# GraphBuilder: merges progression snapshots into cumulative GraphData
# ---------------------------------------------------------------------------

class GraphBuilder:
    def __init__(self) -> None:
        self._nodes: dict[str, dict] = {}
        self._links: list[dict] = []

    def apply_progression(self, progression: dict) -> None:
        for node in progression.get("new_nodes", []):
            self._nodes[node["id"]] = node
        for link in progression.get("new_links", []):
            key = (link["source"], link["target"], link["type"])
            # Avoid duplicates
            exists = any(
                (l["source"], l["target"], l["type"]) == key
                for l in self._links
            )
            if not exists:
                self._links.append(link)

    def to_graph_data(self) -> dict:
        return {
            "nodes": list(self._nodes.values()),
            "links": self._links,
        }


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def build_progressive_graphs(
    epub_path: str | None,
    output_dir: str,
    use_mock: bool = True,
) -> list[Path]:
    """
    Build a series of graph JSON snapshots, one per progression point.

    Args:
        epub_path: Path to the EPUB file. Only used when use_mock=False.
        output_dir: Directory to write progress_subset_graph_N.json files.
        use_mock: When True, use hardcoded MOCK_PROGRESSIONS (no LLM needed).

    Returns:
        List of output file Paths created.
    """
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    tracker: EpubProgressTracker | None = None
    if not use_mock and epub_path:
        tracker = EpubProgressTracker(epub_path)
        print(f"EPUB loaded: {tracker.chapter_count} chapters")

    builder = GraphBuilder()
    output_files: list[Path] = []

    progressions = MOCK_PROGRESSIONS

    for i, prog in enumerate(progressions, start=1):
        # If real mode: extract text and (TODO) call LLM here
        if tracker and not use_mock:
            n_chapters = prog["chapters_covered"]
            text = tracker.get_text_up_to_chapter(n_chapters)
            # TODO: pass `text` to LLM extraction function → merge into prog
            _ = text  # placeholder

        builder.apply_progression(prog)
        graph_data = builder.to_graph_data()

        out_path = out_dir / f"progress_subset_graph_{i}.json"
        out_path.write_text(json.dumps(graph_data, indent=2, ensure_ascii=False))
        print(
            f"Wrote {out_path.name}: "
            f"{len(graph_data['nodes'])} nodes, {len(graph_data['links'])} links"
        )
        output_files.append(out_path)

    return output_files


def validate_graph_data(path: str) -> bool:
    """Quick validation that a JSON file matches GraphData shape."""
    data = json.loads(Path(path).read_text())
    nodes = data.get("nodes", [])
    links = data.get("links", [])

    required_node_keys = {"id", "label", "title", "faction", "centrality", "bio"}
    required_link_keys = {"source", "target", "type", "weight", "description"}

    for n in nodes:
        missing = required_node_keys - n.keys()
        if missing:
            print(f"Node {n.get('id')} missing keys: {missing}")
            return False

    for l in links:
        missing = required_link_keys - l.keys()
        if missing:
            print(f"Link {l.get('source')}→{l.get('target')} missing keys: {missing}")
            return False

    print(f"Valid: {len(nodes)} nodes, {len(links)} links")
    return True


if __name__ == "__main__":
    epub = sys.argv[1] if len(sys.argv) > 1 else None
    mock = "--real" not in sys.argv

    script_dir = Path(__file__).parent
    output_dir = str(script_dir / "output")

    print(f"Building progressive graphs (mock={mock}) → {output_dir}")
    files = build_progressive_graphs(epub, output_dir, use_mock=mock)

    print("\nValidating outputs:")
    all_valid = all(validate_graph_data(str(f)) for f in files)
    sys.exit(0 if all_valid else 1)
