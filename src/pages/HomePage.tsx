import styles from "./HomePage.module.css";
import stalinVariant from "../features/stalin/variant";
import bulowVariant from "../features/bulow/variant";

export type VariantId = "stalin" | "bulow";

interface HomePageProps {
  onSelect: (id: VariantId) => void;
}

interface CardDef {
  id: VariantId;
  icon: string;
  layoutLabel: string;
  description: string;
  accentColor: string;
  badgeLabel: string;
  badgeColor: string;
}

const CARDS: CardDef[] = [
  {
    id: "stalin",
    icon: "🕸️",
    layoutLabel: "Force-directed network",
    description:
      "A web of overlapping relationships between figures in Stalin's inner circle. " +
      "Nodes repel and attract based on connection weight; chapters unlock progressively.",
    accentColor: "#FFD700",
    badgeLabel: "Data available",
    badgeColor: "#4caf50",
  },
  {
    id: "bulow",
    icon: "🌳",
    layoutLabel: "Hierarchy tree",
    description:
      "A top-to-bottom lineage chart for tracking descent, chain of command, or family structure. " +
      "Renderer and data are in progress.",
    accentColor: "#CFB53B",
    badgeLabel: "Coming soon",
    badgeColor: "#888",
  },
];

export default function HomePage({ onSelect }: HomePageProps) {
  return (
    <main className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Book-Graph Visualiser</h1>
        <p className={styles.subtitle}>Choose a graph to explore</p>
      </div>

      <div className={styles.cards}>
        {CARDS.map((card) => {
          const variant = card.id === "stalin" ? stalinVariant : bulowVariant;
          return (
            <button
              key={card.id}
              className={styles.card}
              style={{ borderColor: `${card.accentColor}55` }}
              onClick={() => onSelect(card.id)}
            >
              <span className={styles.cardIcon}>{card.icon}</span>
              <span
                className={styles.cardMeta}
                style={{ color: card.accentColor }}
              >
                {card.layoutLabel}
              </span>
              <span className={styles.cardTitle}>{variant.title}</span>
              <span className={styles.cardDesc}>{card.description}</span>
              <span
                className={styles.cardBadge}
                style={{
                  color: card.badgeColor,
                  borderColor: `${card.badgeColor}66`,
                }}
              >
                {card.badgeLabel}
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
