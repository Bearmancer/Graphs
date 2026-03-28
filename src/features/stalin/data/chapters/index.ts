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

const chapters: ChapterMeta[] = [
  {
    id: "prologue",
    label: "Prologue",
    description: "The Last Supper – Nadya's final evening at Voroshilov's dinner (Nov 1932)",
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
    label: "Ch 3 Recap ★",
    description: "Full cast through Ch 2 with later-relevance annotations – default view",
    data: fullData as unknown as GraphData,
  },
  {
    id: "ch5",
    label: "Chapter 5",
    description: "Holidays and Hell – the Politburo's seaside life (1931–32); Beria enters Stalin's circle",
    data: ch5Data as unknown as GraphData,
  },
  {
    id: "ch7",
    label: "Chapter 7",
    description: "Stalin the Intellectual – Gorky's dinner and the birth of Socialist Realism (1932)",
    data: ch7Data as unknown as GraphData,
  },
  {
    id: "ch9",
    label: "Chapter 9",
    description: "The Omnipotent Widower – Stalin after Nadya's death; Sergo's rising power (1932–33)",
    data: ch9Data as unknown as GraphData,
  },
  {
    id: "ch11",
    label: "Chapter 11",
    description: "Assassination of the Favourite – Kirov murdered; Yezhov begins his rise (Dec 1934)",
    data: ch11Data as unknown as GraphData,
  },
  {
    id: "ch14",
    label: "Chapter 14",
    description: "The Dwarf Rises – Yezhov consolidates power; the old guard weakens (1935)",
    data: ch14Data as unknown as GraphData,
  },
  {
    id: "ch17",
    label: "Chapter 17",
    description: "The Executioner – Zinoviev and Kamenev shot; Beria and Yezhov ascend (1936)",
    data: ch17Data as unknown as GraphData,
  },
  {
    id: "ch23",
    label: "Chapter 23",
    description: "The Great Terror – mass purges strip the court; Bukharin, Tukhachevsky, and more are gone (1937–38)",
    data: ch23Data as unknown as GraphData,
  },
  {
    id: "ch34",
    label: "Chapter 34",
    description: "Siege of Leningrad – WWII begins; Zhukov enters; Yezhov is gone (1941)",
    data: ch34Data as unknown as GraphData,
  },
  {
    id: "ch39",
    label: "Chapter 39",
    description: "The Supremo of Stalingrad – Stalin directs the pivotal battle from Moscow (1942–43)",
    data: ch39Data as unknown as GraphData,
  },
  {
    id: "ch47",
    label: "Chapter 47",
    description: "Molotov's Chance – post-war power struggles; Malenkov and Beria rise (1945–46)",
    data: ch47Data as unknown as GraphData,
  },
  {
    id: "ch54",
    label: "Chapter 54",
    description: "The Leningrad Case – Zhdanov dead; Voznesensky and Kuznetsov purged (1949–50)",
    data: ch54Data as unknown as GraphData,
  },
  {
    id: "ch58",
    label: "Chapter 58",
    description: "Stalin's Death – the final court; Stalin collapses; the succession opens (Mar 1953)",
    data: ch58Data as unknown as GraphData,
  },
];

export const DEFAULT_CHAPTER_ID = "ch3-recap";

export default chapters;
