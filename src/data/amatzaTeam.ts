export interface AmatzaTeamMember {
  id: number;
  name: string;
  role: string;
  color: string;
}

/** Tal cual los reporta ClickUp para cada status de la lista (campo `type`). */
export type AmatzaStatusType = "open" | "custom" | "done" | "closed";

export interface AmatzaTask {
  id: string;
  name: string;
  status: string;
  statusType: AmatzaStatusType;
  statusColor: string;
  assigneeIds: number[];
  dueDate: number | null;
  startDate: number | null;
}

export interface AmatzaTimelineData {
  tasks: AmatzaTask[];
  team: AmatzaTeamMember[];
  teamMap: Record<number, AmatzaTeamMember>;
  fetchedAt: number;
}

/** ClickUp: workspace "dinamo" › espacio "dínamo 2026" › carpeta "Amatza" › lista "One page". */
export const AMATZA_LIST_ID = "901714995132";

export const UNASSIGNED_MEMBER_COLOR = "#525A7C";

/**
 * Equipo de dínamo asignado al proyecto "Amatza / One page". ClickUp no expone
 * esta clasificación de rol dentro del proyecto, así que se mantiene a mano.
 */
export const AMATZA_TEAM: AmatzaTeamMember[] = [
  { id: 89265089, name: "Aiko Chavez", role: "PM", color: "#5B9FE8" },
  { id: 95160163, name: "Andrea Yoanna Cedillo Viera", role: "Comunicación", color: "#E8A63A" },
  { id: 89264245, name: "Daniel Vasquez", role: "Desarrollador Web", color: "#9B72E0" },
  { id: 26226859, name: "Jio", role: "Diseño", color: "#D96FB0" },
];

/** Un status cuenta como "completado" en la línea del tiempo cuando ClickUp lo marca done o closed. */
export function isCompletedStatus(statusType: AmatzaStatusType): boolean {
  return statusType === "done" || statusType === "closed";
}
