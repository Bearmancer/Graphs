import { useEffect } from "react";
import BookExperience from "./features/stalin/BookExperience";

export default function App() {
  useEffect(() => {
    document.title = "Stalin's Court - Relationship Map";
  }, []);

  return <BookExperience />;
}
