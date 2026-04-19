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
import ch12Data from "./ch12.json";
import ch13Data from "./ch13.json";
import ch14Data from "./ch14.json";
import ch15Data from "./ch15.json";
import ch16Data from "./ch16.json";
import ch17Data from "./ch17.json";
import ch18Data from "./ch18.json";
import ch19Data from "./ch19.json";
import ch20Data from "./ch20.json";
import ch21Data from "./ch21.json";
import ch22Data from "./ch22.json";
import ch23Data from "./ch23.json";
import ch24Data from "./ch24.json";
import ch25Data from "./ch25.json";
import ch26Data from "./ch26.json";
import ch27Data from "./ch27.json";
import ch28Data from "./ch28.json";
import ch29Data from "./ch29.json";
import ch30Data from "./ch30.json";
import ch31Data from "./ch31.json";
import ch32Data from "./ch32.json";
import ch33Data from "./ch33.json";
import ch34Data from "./ch34.json";
import ch35Data from "./ch35.json";
import ch36Data from "./ch36.json";
import ch37Data from "./ch37.json";
import ch38Data from "./ch38.json";
import ch39Data from "./ch39.json";
import ch40Data from "./ch40.json";
import ch41Data from "./ch41.json";
import ch42Data from "./ch42.json";
import ch43Data from "./ch43.json";
import ch44Data from "./ch44.json";
import ch45Data from "./ch45.json";
import ch46Data from "./ch46.json";
import ch47Data from "./ch47.json";
import ch48Data from "./ch48.json";
import ch49Data from "./ch49.json";
import ch50Data from "./ch50.json";
import ch51Data from "./ch51.json";
import ch52Data from "./ch52.json";
import ch53Data from "./ch53.json";
import ch54Data from "./ch54.json";
import ch55Data from "./ch55.json";
import ch56Data from "./ch56.json";
import ch57Data from "./ch57.json";
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
     chapter: 12,
     description: "Kirov's funeral ushers in emergency terror laws and Stalin's new security apparatus.",
     data: ch12Data as unknown as GraphData,
   },
   {
     chapter: 13,
     description: "Investigation and consolidation follow the assassination; punitive measures expand.",
     data: ch13Data as unknown as GraphData,
   },
   {
     chapter: 14,
     description: "Security leadership and party leverage shift the court's balance.",
     data: ch14Data as unknown as GraphData,
   },
   {
     chapter: 15,
     description: "Purges deepen as the apparatus rounds up opposition networks.",
     data: ch15Data as unknown as GraphData,
   },
   {
     chapter: 16,
     description: "Show-trial machinery prepares its first high-profile victims.",
     data: ch16Data as unknown as GraphData,
   },
   {
     chapter: 17,
     description: "Show-trial politics and rank adjustments tighten the power structure.",
     data: ch17Data as unknown as GraphData,
   },
   {
     chapter: 18,
     description: "The first waves of repression sweep through party and military ranks.",
     data: ch18Data as unknown as GraphData,
   },
   {
     chapter: 19,
     description: "Security operations accelerate; trust becomes a scarce commodity.",
     data: ch19Data as unknown as GraphData,
   },
   {
     chapter: 20,
     description: "The purge extends to the military; Yagoda's authority peaks.",
     data: ch20Data as unknown as GraphData,
   },
   {
     chapter: 21,
     description: "Trotskyists and opposition remnants face intensified persecution.",
     data: ch21Data as unknown as GraphData,
   },
   {
     chapter: 22,
     description: "Political policing intensifies ahead of the coming terror's zenith.",
     data: ch22Data as unknown as GraphData,
   },
   {
     chapter: 23,
     description: "Terror-era governance transforms the court's composition and ties.",
     data: ch23Data as unknown as GraphData,
   },
   {
     chapter: 24,
     description: "Yagoda falls and Yezhov ascends in the NKVD leadership struggle.",
     data: ch24Data as unknown as GraphData,
   },
   {
     chapter: 25,
     description: "The Yezhovshchina begins: mass operations and show trials escalate.",
     data: ch25Data as unknown as GraphData,
   },
   {
     chapter: 26,
     description: "The Great Purge reaches its peak intensity across Soviet institutions.",
     data: ch26Data as unknown as GraphData,
   },
   {
     chapter: 27,
     description: "Arrests and executions multiply; no faction remains untouched.",
     data: ch27Data as unknown as GraphData,
   },
   {
     chapter: 28,
     description: "The purge machine grinds through the old guard and regional bosses.",
     data: ch28Data as unknown as GraphData,
   },
   {
     chapter: 29,
     description: "Yezhov's grip tightens, but signs of overreach begin to surface.",
     data: ch29Data as unknown as GraphData,
   },
   {
     chapter: 30,
     description: "Some survivors emerge; the tide slowly turns against the NKVD.",
     data: ch30Data as unknown as GraphData,
   },
   {
     chapter: 31,
     description: "Stalin begins pruning Yezhov while preserving the terror apparatus.",
     data: ch31Data as unknown as GraphData,
   },
   {
     chapter: 32,
     description: "Beria gains influence as the NKVD transitions to a new phase.",
     data: ch32Data as unknown as GraphData,
   },
   {
     chapter: 33,
     description: "Security organs consolidate; old and new guard uneasily coexist.",
     data: ch33Data as unknown as GraphData,
   },
   {
     chapter: 34,
     description: "Wartime command pressures redraw relationships across political and military actors.",
     data: ch34Data as unknown as GraphData,
   },
   {
     chapter: 35,
     description: "War demands unify theLeadership; old purges give way to front-line urgency.",
     data: ch35Data as unknown as GraphData,
   },
   {
     chapter: 36,
     description: "Military coordination and Party control tighten during the emergency.",
     data: ch36Data as unknown as GraphData,
   },
   {
     chapter: 37,
     description: "Supply and strategy disputes shape the high command's dynamics.",
     data: ch37Data as unknown as GraphData,
   },
   {
     chapter: 38,
     description: "The Stavka wrestles with offensives and rear-echelon politics.",
     data: ch38Data as unknown as GraphData,
   },
   {
     chapter: 39,
     description: "Stalingrad-era command dynamics consolidate strategic authority.",
     data: ch39Data as unknown as GraphData,
   },
   {
     chapter: 40,
     description: "Victory at Stalingrad reshapes prestige and Stalin's confidence.",
     data: ch40Data as unknown as GraphData,
   },
   {
     chapter: 41,
     description: "Post-victory jockeying begins as the Red Army's heroes rise.",
     data: ch41Data as unknown as GraphData,
   },
   {
     chapter: 42,
     description: "Peace-time reconstruction and Party dominance take centre stage.",
     data: ch42Data as unknown as GraphData,
   },
   {
     chapter: 43,
     description: "Zhdanov emerges as a cultural enforcer and potential successor.",
     data: ch43Data as unknown as GraphData,
   },
   {
     chapter: 44,
     description: "Leningrad triumphs and factional rivalry fuel central tensions.",
     data: ch44Data as unknown as GraphData,
   },
   {
     chapter: 45,
     description: "Zhdanov's cultural line faces covert opposition within the Politburo.",
     data: ch45Data as unknown as GraphData,
   },
   {
     chapter: 46,
     description: "Malenkov and Beria manoeuvre to check Zhdanov's growing influence.",
     data: ch46Data as unknown as GraphData,
   },
   {
     chapter: 47,
     description: "Post-war rivalry and succession positioning sharpen inside the leadership.",
     data: ch47Data as unknown as GraphData,
   },
   {
     chapter: 48,
     description: "Zhdanov falls ill and dies; his Leningrad faction suffers purges.",
     data: ch48Data as unknown as GraphData,
   },
   {
     chapter: 49,
     description: "Beria's security empire expands as Zhdanov's clique is dismantled.",
     data: ch49Data as unknown as GraphData,
   },
   {
     chapter: 50,
     description: "Malenkov consolidates central control while Beria rules the republics.",
     data: ch50Data as unknown as GraphData,
   },
   {
     chapter: 51,
     description: "Leningrad is purged; Malenkov's secretariat becomes the power hub.",
     data: ch51Data as unknown as GraphData,
   },
   {
     chapter: 52,
     description: "Stalin's health worries increase; succession speculation intensifies.",
     data: ch52Data as unknown as GraphData,
   },
   {
     chapter: 53,
     description: "Doctors' plots and security crises expose Stalin's paranoid streak.",
     data: ch53Data as unknown as GraphData,
   },
   {
     chapter: 54,
     description: "Late-period elite conflict narrows trust and reshapes court alliances.",
     data: ch54Data as unknown as GraphData,
   },
   {
     chapter: 55,
     description: "Final ministry reshuffles cement Malenkov and Beria's duopoly.",
     data: ch55Data as unknown as GraphData,
   },
   {
     chapter: 56,
     description: "Stalin's health visibly declines; the succession race grows feverish.",
     data: ch56Data as unknown as GraphData,
   },
   {
     chapter: 57,
     description: "The last winter: Stalin's inner circle awaits the inevitable.",
     data: ch57Data as unknown as GraphData,
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

/**
 * Binary search for the largest snapshot whose chapter number is <= chapterNumber.
 * orderedSnapshots is pre-sorted ascending by chapter, so this is O(log n).
 */
const findLatestSnapshotAtOrBefore = (chapterNumber: number): ChapterSnapshot => {
  let lo = 0;
  let hi = orderedSnapshots.length - 1;
  let result = orderedSnapshots[0];
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1; // unsigned right-shift avoids signed-overflow on large integers
    const midChapter = orderedSnapshots[mid].chapter;
    if (midChapter <= chapterNumber) {
      result = orderedSnapshots[mid];
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return result;
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
