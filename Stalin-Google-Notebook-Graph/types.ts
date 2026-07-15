export interface CharacterNode {
  id: string;
  name: string;
  val: number;
  group: number;
  recap: string;
}

export interface CharacterLink {
  source: string;
  target: string;
  label: string;
  weight: number;
}

export interface GraphData {
  nodes: CharacterNode[];
  links: CharacterLink[];
}
