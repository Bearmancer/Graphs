"""
epub_parser.py — EPUB text extraction utility for story graph pipeline.

Provides EpubProgressTracker: extracts ordered chapter text from an EPUB file
so the story_agent can build progressive graph subsets chapter by chapter.
"""

import zipfile
import re
from pathlib import Path
from typing import Optional
from bs4 import BeautifulSoup


def _text_from_html(html_bytes: bytes) -> str:
    """Strip HTML tags and return clean plaintext."""
    soup = BeautifulSoup(html_bytes, "lxml")
    for tag in soup(["script", "style", "head"]):
        tag.decompose()
    return soup.get_text(separator="\n", strip=True)


def _parse_opf(epub: zipfile.ZipFile) -> tuple[str, list[str]]:
    """
    Parse META-INF/container.xml → OPF path, then OPF spine → ordered item hrefs.
    Returns (opf_dir, [chapter_paths_in_reading_order]).
    """
    container = epub.read("META-INF/container.xml")
    soup = BeautifulSoup(container, "xml")
    rootfile = soup.find("rootfile")
    if not rootfile:
        raise ValueError("container.xml has no rootfile element")
    opf_path = rootfile["full-path"]
    opf_dir = str(Path(opf_path).parent)
    if opf_dir == ".":
        opf_dir = ""

    opf = epub.read(opf_path)
    opf_soup = BeautifulSoup(opf, "xml")

    # Build id → href map from manifest
    manifest: dict[str, str] = {}
    for item in opf_soup.find_all("item"):
        item_id = item.get("id")
        href = item.get("href", "")
        media_type = item.get("media-type", "")
        if media_type in ("application/xhtml+xml", "text/html") and item_id:
            manifest[item_id] = href

    # Spine preserves reading order
    chapters: list[str] = []
    for itemref in opf_soup.find_all("itemref"):
        idref = itemref.get("idref")
        if idref and idref in manifest:
            href = manifest[idref]
            if opf_dir:
                full = f"{opf_dir}/{href}"
            else:
                full = href
            chapters.append(full)

    return opf_dir, chapters


class EpubProgressTracker:
    """
    Loads an EPUB and exposes chapter text progressively.

    Usage:
        tracker = EpubProgressTracker("book.epub")
        text = tracker.get_text_up_to_chapter(5)   # first 5 chapters
        total = tracker.chapter_count
    """

    def __init__(self, epub_path: str) -> None:
        self.epub_path = Path(epub_path)
        if not self.epub_path.exists():
            raise FileNotFoundError(f"EPUB not found: {self.epub_path}")

        self._epub = zipfile.ZipFile(str(self.epub_path), "r")
        _, self._chapters = _parse_opf(self._epub)

        # Cache chapter texts lazily
        self._cache: dict[int, str] = {}

    @property
    def chapter_count(self) -> int:
        return len(self._chapters)

    def _get_chapter_text(self, index: int) -> str:
        """Return plaintext for chapter at zero-based index."""
        if index in self._cache:
            return self._cache[index]

        path = self._chapters[index]
        # EPUB zips may store paths with or without leading slash
        names = self._epub.namelist()
        # Try exact match first, then basename match
        if path in names:
            raw = self._epub.read(path)
        else:
            # Some EPUBs omit the opf subdir prefix in actual zip entries
            basename = Path(path).name
            matches = [n for n in names if Path(n).name == basename]
            if not matches:
                return ""
            raw = self._epub.read(matches[0])

        text = _text_from_html(raw)
        self._cache[index] = text
        return text

    def get_text_up_to_chapter(self, n: int) -> str:
        """
        Return concatenated plaintext for chapters 1..n (1-based).
        Clamps to available chapter count.
        """
        n = max(1, min(n, self.chapter_count))
        parts: list[str] = []
        for i in range(n):
            chapter_text = self._get_chapter_text(i)
            if chapter_text:
                parts.append(f"--- Chapter {i + 1} ---\n{chapter_text}")
        return "\n\n".join(parts)

    def get_chapter_text(self, n: int) -> str:
        """Return text for a single chapter (1-based index)."""
        if n < 1 or n > self.chapter_count:
            raise IndexError(f"Chapter {n} out of range (1–{self.chapter_count})")
        return self._get_chapter_text(n - 1)

    def list_chapters(self) -> list[dict]:
        """Return chapter metadata list for inspection."""
        return [
            {"index": i + 1, "path": p}
            for i, p in enumerate(self._chapters)
        ]

    def __del__(self) -> None:
        try:
            self._epub.close()
        except Exception:
            pass


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: epub_parser.py <file.epub> [chapter_n]")
        sys.exit(1)

    tracker = EpubProgressTracker(sys.argv[1])
    print(f"Total chapters: {tracker.chapter_count}")
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 3
    text = tracker.get_text_up_to_chapter(n)
    print(f"\n=== Text up to chapter {n} ({len(text)} chars) ===")
    print(text[:1000], "..." if len(text) > 1000 else "")
