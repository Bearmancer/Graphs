export interface IBook {
  title: string;
  chapters: IChapter[];
  graphData: IGraphData;
}

export interface IChapter {
  id: string;
  title: string;
  content: string;
}

export interface IGraphData {
  nodes: INode[];
  edges: IEdge[];
}

export interface INode {
  id: string;
  label: string;
  group?: number;
}

export interface IEdge {
  source: string;
  target: string;
  value?: number;
}
