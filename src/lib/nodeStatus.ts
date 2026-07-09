/** Estados de avance asignables a un nodo. Viven solo en memoria (sin persistencia). */
export type NodeStatus = "en_proceso" | "pausado" | "terminado" | "detenido";

export const NODE_STATUSES: readonly NodeStatus[] = [
  "en_proceso",
  "pausado",
  "terminado",
  "detenido",
];

export interface StatusMeta {
  label: string;
  /** Hex color used for buttons, badges and the graph legend. */
  color: string;
  /** Glyph prefixed to the node label on the graph. */
  glyph: string;
}

export const STATUS_META: Record<NodeStatus, StatusMeta> = {
  en_proceso: { label: "En proceso", color: "#4A90D9", glyph: "▶" },
  pausado: { label: "Pausado", color: "#D9A54A", glyph: "❚❚" },
  terminado: { label: "Terminado", color: "#3FA060", glyph: "✓" },
  detenido: { label: "Detenido", color: "#C25050", glyph: "✕" },
};

/** Map nodeId → status; nodes without entry have no status assigned. */
export type NodeStatusMap = Record<string, NodeStatus>;
