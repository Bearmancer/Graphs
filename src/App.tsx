import { useEffect } from "react";
import StalinExperience from "./features/stalin/StalinExperience";

export default function App() {
  useEffect(() => {
    document.title = "Stalin's Court - Relationship Map";
  }, []);

  return <StalinExperience />;
}
