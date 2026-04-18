import type { GraphData } from "../../types";
import type { ChapterMeta } from "../../../../graph-types";

import prologueData from "./prologue.json";
import ch1Data from "./ch1.json";
import ch2Data from "./ch2.json";
import fullData from "../graph.json";
import ch5Data from "./ch5.json";
import ch7Data from "./ch7.json";
import ch9Data from "./ch9.json";
import ch11Data from "./ch11.json";
import ch14Data from "./ch14.json";
import ch17Data from "./ch17.json";
import ch23Data from "./ch23.json";
import ch34Data from "./ch34.json";
import ch39Data from "./ch39.json";
import ch47Data from "./ch47.json";
import ch54Data from "./ch54.json";
import ch58Data from "./ch58.json";

type ChapterSnapshot = {
  chapter: number;
  description: string;
  data: GraphData;
};

// Numeric snapshots begin at Chapter 1; prologue is a named non-numeric boundary.
const SNAPSHOTS: ChapterSnapshot[] = [
  {
    chapter: 1,
    description: "The Kremlin household and its core political circle come into focus.",
    data: ch1Data as unknown as GraphData,
  },
  {
    chapter: 2,
    description: "Succession tensions and rivalries reshape the court's alignments.",
    data: ch2Data as unknown as GraphData,
  },
  {
    chapter: 3,
    description: "Early-court recap boundary for the first phase of the network.",
    data: fullData as unknown as GraphData,
  },
  {
    chapter: 5,
    description: "Court life widens around holiday politics, patronage, and access.",
    data: ch5Data as unknown as GraphData,
  },
  {
    chapter: 7,
    description: "Culture, prestige, and influence become major drivers in the inner circle.",
    data: ch7Data as unknown as GraphData,
  },
  {
    chapter: 9,
    description: "Household strain and elite maneuvering intensify inside the Kremlin world.",
    data: ch9Data as unknown as GraphData,
  },
  {
    chapter: 11,
    description: "A political shock event reorders trust, security, and access.",
    data: ch11Data as unknown as GraphData,
  },
  {
    chapter: 14,
    description: "Security leadership and party leverage shift the court's balance.",
    data: ch14Data as unknown as GraphData,
  },
  {
    chapter: 17,
    description: "Show-trial politics and rank adjustments tighten the power structure.",
    data: ch17Data as unknown as GraphData,
  },
  {
    chapter: 23,
    description: "Terror-era governance transforms the court's composition and ties.",
    data: ch23Data as unknown as GraphData,
  },
  {
    chapter: 34,
    description: "Wartime command pressures redraw relationships across political and military actors.",
    data: ch34Data as unknown as GraphData,
  },
  {
    chapter: 39,
    description: "Stalingrad-era command dynamics consolidate strategic authority.",
    data: ch39Data as unknown as GraphData,
  },
  {
    chapter: 47,
    description: "Post-war rivalry and succession positioning sharpen inside the leadership.",
    data: ch47Data as unknown as GraphData,
  },
  {
    chapter: 54,
    description: "Late-period elite conflict narrows trust and reshapes court alliances.",
    data: ch54Data as unknown as GraphData,
  },
  {
    chapter: 58,
    description: "Final chapter boundary for the Stalin-court network.",
    data: ch58Data as unknown as GraphData,
  },
];

const prologue: ChapterMeta = {
  id: "prologue",
  label: "Prologue",
  description: "Opening Kremlin dinner scene and immediate household context.",
  data: prologueData as unknown as GraphData,
};

const snapshotByChapter = new Map<number, ChapterSnapshot>(
  SNAPSHOTS.map((snapshot) => [snapshot.chapter, snapshot]),
);

const orderedSnapshots = [...SNAPSHOTS].sort((a, b) => a.chapter - b.chapter);

const findLatestSnapshotAtOrBefore = (chapterNumber: number): ChapterSnapshot => {
  for (let i = orderedSnapshots.length - 1; i >= 0; i -= 1) {
    const snapshot = orderedSnapshots[i];
    if (snapshot.chapter <= chapterNumber) return snapshot;
  }
  return orderedSnapshots[0];
};

const chapters: ChapterMeta[] = [prologue];

for (let chapterNumber = 1; chapterNumber <= 58; chapterNumber += 1) {
  const exactSnapshot = snapshotByChapter.get(chapterNumber);
  const latestSnapshot = findLatestSnapshotAtOrBefore(chapterNumber);

  chapters.push({
    id: `ch${chapterNumber}`,
    label: `Chapter ${chapterNumber}`,
    description:
      exactSnapshot?.description ??
      `No new extraction checkpoint for this chapter yet; graph remains at cumulative state through Chapter ${latestSnapshot.chapter}.`,
    data: (exactSnapshot?.data ?? latestSnapshot.data) as GraphData,
  });
}

export const DEFAULT_CHAPTER_ID = "prologue";

export default chapters;
