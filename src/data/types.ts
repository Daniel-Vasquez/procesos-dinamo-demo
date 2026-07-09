export type DepartmentId = string;

export interface Department {
  id: DepartmentId;
  label: string;
  /** Hex color, used for node borders, legend swatches and dept badges. */
  color: string;
}

/**
 * `handoff`, `approval`, `feedback`, `review` and `cross` are user-toggleable
 * in the sidebar. `coordination` and `context` render but aren't filterable
 * (mirrors the original prototype's TRACKED_ETYPES behavior).
 */
export type EdgeType =
  | "handoff"
  | "approval"
  | "feedback"
  | "review"
  | "cross"
  | "coordination"
  | "context";

export interface ProcessNode {
  id: string;
  /** May contain \n for multi-line labels on the graph node. */
  label: string;
  dept: DepartmentId;
  description: string;
}

export interface ProcessEdge {
  from: string;
  to: string;
  label: string;
  type: EdgeType;
}

export interface ProcessDefinition {
  id: string;
  label: string;
  /** Hex color used for this process's filter pill and watermark. */
  color: string;
  nodes: ProcessNode[];
  edges: ProcessEdge[];
}

export interface CrossProcessEdge {
  from: string;
  to: string;
  reason: string;
}

export interface ProcessGraphData {
  departments: Department[];
  processes: ProcessDefinition[];
  crossProcessEdges: CrossProcessEdge[];
}
