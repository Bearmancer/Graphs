import json
from pathlib import Path

base = Path("/home/ubuntu/Graphs/src/features/stalin/data/chapters")

# Chapter-bound bio revisions — conservative, non-spoiler updates only
# Each dict lists nodes whose bios need time-bounded rewrites for that chapter.
# Unlisted nodes retain their current bios from the file.

revisions = {
    "ch5.json": {
        # Stalin: update to holiday-era context (late 1931, famine, Sochi dacha, Sergo's prominence)
        "Stalin": "Georgian Bolshevik who has consolidated power as General Secretary. By this holiday period he dominates an intimate Kremlin court while his marriage to Nadya grows more strained. He favours the Black Sea coast—especially Sochi's Dacha No. 9—where he holidays with his magnates.",
        # Nadya: Industrial Academy student; prologue quarrel is recent history, still on holiday with Stalin
        "Nadya_Alliluyeva": "Stalin's wife and Industrial Academy student. She joins the holidays but the bitter quarrel from the prologue still echoes in their relationship.",
        # Voroshilov: keep existing—still accurate for holiday dinner setting
        # Bukharin: remove "by chapter 2" reference; note he's politically beaten but remains in the circle for now
        "Bukharin": "Gifted theorist, painter, and charmer once close to both Stalin and Nadya. By this point he has been politically beaten by Stalin but still retains emotional significance in their circle.",
        # Kamenev: generalize; he's part of factional maneuvering
        "Kamenev": "Veteran Bolshevik who became central to the alliance politics following Lenin's illness. He remains involved in the factional maneuvering around Stalin.",
        # Yakov: elder son; still in Kremlin household
        "Yakov_Djugashvili": "Stalin's elder son from his first marriage. He remains settled within the Kremlin household.",
        # Anna_Redens: present in family scenes
        "Anna_Redens": "Nadya's sister, part of the extended family network that gathers on holiday.",
        # Pavel_Alliluyev: Red Army officer, brings gifts from abroad
        "Pavel_Alliluyev": "Nadya's brother, a Red Army officer who often returns from abroad with gifts for the family.",
        # Fyodor_Alliluyev: Bolshevik aide, went with Stalin to Tsaritsyn
        "Fyodor_Alliluyev": "Nadya's brother who questioned Stalin back in 1917, worked in his Commissariat, and later accompanied him to Tsaritsyn.",
        # Galina_Yegorova: actress, flirtation with Stalin helped trigger Nadya's anger in prologue
        "Galina_Yegorova": "Glamorous actress and wife of Alexander Yegorov. Stalin's flirtation with her helped spark Nadya's anger during the prologue quarrel.",
        # Alexander_Svanidze: Georgian Bolshevik brother-in-law, domestic refuge
        "Alexander_Svanidze": "Kato's brother, an old Georgian Bolshevik from the same seminary world as Stalin. He remains a key link in the extended Svanidze-Alliluyev family network that gives Stalin a Georgian domestic refuge.",
        # Karl_Pauker: security chief, present on prologue night
        "Karl_Pauker": "Former Budapest Opera barber turned security chief in Stalin's entourage. He was one of the first men the frightened household turned to on the night of the prologue.",
        # Nikolai_Vlasik: bodyguard, recollections help map prologue timeline
        "Nikolai_Vlasik": "One of the guards shadowing Stalin's movements. His recollections help map the last hours before Nadya's death in the prologue.",
        # Dora_Khazan: close friend, shares tram rides/gossip; add chapter 5 note if possible
        "Dora_Khazan": "Andreyev's wife and one of Nadya's closest companions. She studies with Nadya and shares the tram rides, gossip, and domestic-political overlap of the prologue.",
    },
    "ch7.json": {
        "Stalin": "Georgian Bolshevik now at peak power as General Secretary. Chapter 7 centres on the cultural world: Gorky's return, the Writers' Congress, and Stalin's cultivation of the intelligentsia. His marriage remains strained.",
        "Nadya_Alliluyeva": "Stalin's wife and Industrial Academy student. She appears less frequently as cultural events dominate.",
        "Bukharin": "Gifted theorist and former ally; still politically beaten but remains part of the extended circle during cultural gatherings.",
        "Kamenev": "Veteran Bolshevik involved in factional politics; still present but no longer a central player.",
        "Yakov_Djugashvili": "Stalin's elder son; continues living within the Kremlin household.",
        "Anna_Redens": "Nadya's sister and family holdout across the Stalin household changes.",
        "Pavel_Alliluyev": "Nadya's brother, Red Army officer, sometimes present at family gatherings.",
        "Fyodor_Alliluyev": "Nadya's brother who once questioned Stalin in 1917 and later worked in his Commissariat.",
        "Galina_Yegorova": "Actress and Alexander Yegorov's wife; remembered for her role in the prologue quarrel.",
        "Alexander_Svanidze": "Stalin's Georgian brother-in-law and banker; part of the domestic safety-net.",
        "Karl_Pauker": "Security chief present during the prologue's aftermath.",
        "Nikolai_Vlasik": "Bodyguard whose memories frame the final hours before Nadya's death.",
        "Dora_Khazan": "Andreyev's wife, close to Nadya; their friendship includes shared studies and tram rides.",
    },
    "ch9.json": {
        # Nadya is dead and removed from this chapter; the file already drops her — good
        # Stalin, Voroshilov, Bukharin, Kamenev, Yakov, Anna, Pavel, Fyodor, Galina, Alexander_Svanidze, Karl_Pauker, Nikolai_Vlasik, Dora_Khazan have stale references — update them to present-tense post-suicide context
        "Stalin": "General Secretary now a widower. He has moved out of the Poteshny Palace into Bukharin's old apartment in the Yellow Palace and is constructing his dacha at Kuntsevo. He is emotionally shattered by Nadya's death and surrounded by a reconstructed family of in-laws and loyalists.",
        "Voroshilov": "Defence Commissar and Chekist old comrade; remains in Stalin's inner circle during the widower period.",
        "Bukharin": "Party theorist and former ally who has offered his apartment to Stalin; he remains in the magnates' orbit despite past political defeats.",
        "Kamenev": "Old Bolshevik still lingering in factional politics but increasingly marginal.",
        "Yakov_Djugashvili": "Stalin's elder son; continues in the Kremlin household under the new, altered régime.",
        "Anna_Redens": "Nadya's sister; now a constant companion to the grieving Stalin alongside her husband Stanislas Redens.",
        "Pavel_Alliluyev": "Nadya's brother, Red Army officer; stands close to Stalin after Nadya's death, notably at the funeral and afterward.",
        "Fyodor_Alliluyev": "Nadya's brother with a long personal tie to Stalin's past; remains within the extended family circle.",
        "Galina_Yegorova": "Actress and Alexander Yegorov's wife; recalled for her role during the prologue quarrel.",
        "Alexander_Svanidze": "Stalin's brother-in-law; part of the in-law network that now surrounds the widower Stalin.",
        "Karl_Pauker": "Security chief present during the prologue crisis and still within Stalin's immediate orbit.",
        "Nikolai_Vlasik": "Bodyguard whose recollections frame the prologue night; remains a trusted protector.",
        "Dora_Khazan": "Andreyev's wife and Nadya's close friend; part of the core group of women who signed the death announcement.",
    },
    "ch11.json": {
        # Kirov assassination aftermath; these characters need context-correct bios in this chapter
        "Stalin": "General Secretary now deeply shaken by Kirov's murder. He personally leads the investigation to Leningrad and swiftly crafts emergency laws—the December 1st decree—that unleash a new era of terror.",
        "Voroshilov": "Defence Commissar and loyalist; accompanies Stalin to Leningrad after the assassination.",
        "Bukharin": "Former ally still within the Party fold; his own fate now uncertain in the wake of Kirov's death.",
        "Kamenev": "Former oppositionist, still around but no longer relevant to centre-stage events.",
        "Yakov_Djugashvili": "Stalin's elder son; continues in the Kremlin household.",
        "Anna_Redens": "Nadya's sister; part of the household that has absorbed Stalin after Nadya's death and now after Kirov's murder.",
        "Pavel_Alliluyev": "Nadya's brother and Red Army officer; a loyal presence during this crisis.",
        "Fyodor_Alliluyev": "Nadya's brother with deep roots in Stalin's earlier history; present in the extended court.",
        "Galina_Yegorova": "Actress and wife of Yegorov; a peripheral figure in the Kremlin social world.",
        "Alexander_Svanidze": "Banker brother-in-law; part of the in-law network that still buffers Stalin.",
        "Karl_Pauker": "Security chief who handled the prologue crisis and remains.",
        "Nikolai_Vlasik": "Bodyguard and trusted protector through many crises, including the immediate aftermath of Kirov's murder.",
        "Dora_Khazan": "Deputy textiles official and Nadya's close friend; now part of the widowed Stalin's personal entourage.",
    },
}

file_map = {
    "ch5.json": base / "ch5.json",
    "ch7.json": base / "ch7.json",
    "ch9.json": base / "ch9.json",
    "ch11.json": base / "ch11.json",
}

for label, path in file_map.items():
    data = json.loads(path.read_text())
    changed = 0
    revs = revisions.get(label, {})
    for node in data["nodes"]:
        if node["id"] in revs:
            old = node["bio"]
            new = revs[node["id"]]
            # Apply minimal normalization: strip trailing spaces and period count
            # Keep exact text as-is from the revision dict above
            node["bio"] = new
            changed += 1
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"{label}: updated {changed} bios")

print("Done — bios revised; next: verify centrality/titles and check for spoilers")
