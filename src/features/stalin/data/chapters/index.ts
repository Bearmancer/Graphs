import type { GraphData } from "../../types";
import type { ChapterMeta } from "../../../../graph-types";

import prologueData from "./prologue.json";
import ch1Data from "./ch1.json";
import ch2Data from "./ch2.json";
import fullData from "../graph.json";

export type { ChapterMeta } from "../../../../graph-types";

const chapters: ChapterMeta[] = [
  {
    id: "prologue",
    label: "Prologue",
    description: "The Last Supper – Nadya's final evening at Voroshilov's dinner",
    data: prologueData as unknown as GraphData,
  },
  {
    id: "ch1",
    label: "Chapter 1",
    description: "The Kremlin family and the magnates who orbit Stalin's court",
    data: ch1Data as unknown as GraphData,
  },
  {
    id: "ch2",
    label: "Chapter 2",
    description: "Succession politics, rivals, and the full Kremlin network",
    data: ch2Data as unknown as GraphData,
  },
  {
    id: "ch3-recap",
    label: "Ch 3 Recap",
    description: "Full cast with later-relevance annotations and reading notes",
    data: fullData as unknown as GraphData,
  },
];

export default chapters;
