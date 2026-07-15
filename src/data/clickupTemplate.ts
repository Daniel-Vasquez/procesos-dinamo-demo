export interface ClickupArea {
  id: string;
  label: string;
  color: string;
}

export interface ClickupPerson {
  id: string;
  name: string;
  areaId: string | null;
}

export interface ClickupTask {
  id: string;
  name: string;
  status: string;
  assigneeIds: string[];
}

/**
 * Datos extraídos de ClickUp: workspace "dinamo" › espacio "dínamo 2026" ›
 * carpeta "Plantillas Dev 2025" › lista "plantilla landing dev" (list id 901711971661).
 */
export const AREAS: ClickupArea[] = [
  { id: "pm", label: "PM", color: "#5B9FE8" },
  { id: "dev", label: "Desarrollo web", color: "#9B72E0" },
  { id: "comms", label: "Comunicación", color: "#E8A63A" },
];

export const UNASSIGNED_AREA_COLOR = "#525A7C";

export const PEOPLE: ClickupPerson[] = [
  { id: "aiko", name: "Aiko Chavez", areaId: "pm" },
  { id: "ramses", name: "Ramses Reyes", areaId: "dev" },
  { id: "francisco", name: "Francisco J Rojo Córdova", areaId: "dev" },
  { id: "seth", name: "Seth Gonzalez", areaId: "comms" },
  { id: "unassigned", name: "Sin asignar", areaId: null },
];

export const TASKS: ClickupTask[] = [
  {
    id: "t1",
    name: "Revisión interna dispositivos y dedazos",
    status: "to do",
    assigneeIds: ["unassigned"],
  },
  {
    id: "t2",
    name: "Revisión de sitio con el cliente",
    status: "to do",
    assigneeIds: ["ramses", "francisco"],
  },
  { id: "t3", name: "Chequeo sitio web v2.0", status: "to do", assigneeIds: ["francisco"] },
  {
    id: "t4",
    name: "Revisar checklist revisión del sitio post publicación",
    status: "to do",
    assigneeIds: ["francisco"],
  },
  { id: "t5", name: "Desarrollo de one page", status: "to do", assigneeIds: ["francisco"] },
  { id: "t6", name: "Se compra y configura dominio", status: "to do", assigneeIds: ["ramses"] },
  { id: "t7", name: "Kickoff (mini)", status: "to do", assigneeIds: ["aiko", "seth"] },
  { id: "t8", name: "Se crean los textos de la página", status: "to do", assigneeIds: ["seth"] },
  { id: "t9", name: "Se crea el ambiente de desarrollo", status: "to do", assigneeIds: ["ramses"] },
  {
    id: "t10",
    name: "Visto bueno de los textos por parte del cliente",
    status: "to do",
    assigneeIds: ["aiko"],
  },
  {
    id: "t11",
    name: "Se envía documento al cliente con cuestionario para generar contenido",
    status: "to do",
    assigneeIds: ["aiko"],
  },
  {
    id: "t12",
    name: "Se instalan wordpress y plugins de one page",
    status: "to do",
    assigneeIds: ["ramses"],
  },
];

export const areaMap: Record<string, ClickupArea> = Object.fromEntries(
  AREAS.map((a) => [a.id, a]),
);
export const personMap: Record<string, ClickupPerson> = Object.fromEntries(
  PEOPLE.map((p) => [p.id, p]),
);
