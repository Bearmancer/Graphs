import { useState, useEffect } from "react";
import HomePage, { type VariantId } from "./pages/HomePage";
import BookExperience from "./features/stalin/BookExperience";
import BulowExperience from "./features/bulow/BulowExperience";

type Screen = "home" | VariantId;

const TITLES: Record<Screen, string> = {
  home: "Book-Graph Visualiser",
  stalin: "Stalin's Court — Relationship Map",
  bulow: "Family Tree — Hierarchy Graph",
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("stalin");

  useEffect(() => {
    document.title = TITLES[screen];
  }, [screen]);

  if (screen === "stalin") {
    return <BookExperience onBack={() => setScreen("home")} />;
  }

  if (screen === "bulow") {
    return <BulowExperience onBack={() => setScreen("home")} />;
  }

  return <HomePage onSelect={(id) => setScreen(id)} />;
}
