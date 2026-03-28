import styles from "./BulowExperience.module.css";

interface BulowExperienceProps {
  onBack: () => void;
}

export default function BulowExperience({ onBack }: BulowExperienceProps) {
  return (
    <main className={styles.page}>
      <button className={styles.backButton} onClick={onBack} aria-label="Back to home">
        ← Back
      </button>
      <div className={styles.content}>
        <span className={styles.icon}>🌳</span>
        <h1 className={styles.title}>Family Tree — Hierarchy Graph</h1>
        <p className={styles.body}>
          The Bülow hierarchy renderer and its dataset are still being built.
          Check back once chapter data and the tree layout are wired up.
        </p>
      </div>
    </main>
  );
}
