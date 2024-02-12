export interface HeaderNode {
  heading: string;
  level: number;
  id: string;
  children: HeaderNode[];
}

export interface HeaderTreeNode {
  expandable: boolean;
  name: string;
  id: string;
  level: number;
}

export interface Header {
  level: number;
  id: string;
  heading: string;
}
