import type { EdgeType } from "../data/types";

export interface EdgeVisualStyle {
  color: string;
  highlight: string;
  hover: string;
  width: number;
  dashes: boolean | number[];
}

/** Visual style per edge type, ported 1:1 from the original prototype. */
export function edgeStyle(type: EdgeType): EdgeVisualStyle {
  switch (type) {
    case "handoff":
      return { color: "#7AB8E8", highlight: "#A8D0F4", hover: "#A8D0F4", width: 2, dashes: false };
    case "approval":
      return { color: "#6490B8", highlight: "#90B8E0", hover: "#90B8E0", width: 1.5, dashes: false };
    case "feedback":
      return { color: "#C078E8", highlight: "#D8A0F8", hover: "#D8A0F8", width: 1.5, dashes: [5, 4] };
    case "review":
      return { color: "#E8BE40", highlight: "#F4D870", hover: "#F4D870", width: 1.5, dashes: [4, 3] };
    case "coordination":
      return { color: "#48C8D8", highlight: "#78E0EC", hover: "#78E0EC", width: 1.5, dashes: [3, 3] };
    case "context":
      return { color: "#4868A8", highlight: "#6888C8", hover: "#6888C8", width: 1, dashes: [2, 4] };
    case "cross":
      return { color: "#5868B8", highlight: "#8090D8", hover: "#7080C8", width: 1, dashes: [3, 5] };
    default:
      return { color: "#5060A0", highlight: "#8090C0", hover: "#7080B0", width: 1.5, dashes: false };
  }
}

/** Edge types the user can toggle in the sidebar; `coordination`/`context` always show. */
export const TRACKED_EDGE_TYPES = ["handoff", "approval", "feedback", "review", "cross"] as const satisfies EdgeType[];

export type TrackedEdgeType = (typeof TRACKED_EDGE_TYPES)[number];

export const EDGE_TYPE_LABELS: Record<TrackedEdgeType, string> = {
  handoff: "Handoff",
  approval: "Aprobación",
  feedback: "Feedback",
  review: "Revisión",
  cross: "Cross-proceso",
};

export const DIM_NODE_COLOR = {
  background: "#1F2338",
  border: "#2A3050",
  highlight: { background: "#222540", border: "#303860" },
  hover: { background: "#222540", border: "#303860" },
};

export const DIM_NODE_FONT = { color: "#282E4A", size: 11.5 };

export const DIM_EDGE_COLOR = { color: "#252A42", highlight: "#252A42", hover: "#252A42" };
