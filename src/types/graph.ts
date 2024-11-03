export interface GraphNode {
  id: string;
  name: string;
  value?: number;
  group?: string;
  rating?: string;
  x?: number;
  y?: number;
  z?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  value?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}