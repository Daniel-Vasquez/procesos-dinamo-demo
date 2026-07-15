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

export interface ClickupProcessTemplate {
  id: string;
  label: string;
  color: string;
}

export interface ClickupTask {
  id: string;
  name: string;
  status: string;
  assigneeIds: string[];
  templateId: string;
}

/**
 * Datos extraídos de ClickUp: workspace "dinamo" › espacio "dínamo 2026" ›
 * carpeta "Plantillas Dev 2025".
 */
export const AREAS: ClickupArea[] = [
  { id: "pm", label: "PM", color: "#5B9FE8" },
  { id: "dev", label: "Desarrollo web", color: "#9B72E0" },
  { id: "comms", label: "Comunicación", color: "#E8A63A" },
];

export const UNASSIGNED_AREA_COLOR = "#525A7C";

/** Lists inside "Plantillas Dev 2025", each a separately toggleable process/template. */
export const TEMPLATES: ClickupProcessTemplate[] = [
  { id: "landing-dev", label: "Plantilla Landing Dev", color: "#5B9FE8" },
  { id: "landing-campaign", label: "Plantilla Landing Campañas", color: "#4EC89A" },
];

export const PEOPLE: ClickupPerson[] = [
  { id: "aiko", name: "Aiko Chavez", areaId: "pm" },
  { id: "ramses", name: "Ramses Reyes", areaId: "dev" },
  { id: "francisco", name: "Francisco J Rojo Córdova", areaId: "dev" },
  { id: "daniel", name: "Daniel Vasquez", areaId: "dev" },
  { id: "seth", name: "Seth Gonzalez", areaId: "comms" },
  { id: "unassigned", name: "Sin asignar", areaId: null },
];

export const TASKS: ClickupTask[] = [
  // Lista "plantilla landing dev" (list id 901711971661)
  {
    id: "t1",
    name: "Revisión interna dispositivos y dedazos",
    status: "to do",
    assigneeIds: ["unassigned"],
    templateId: "landing-dev",
  },
  {
    id: "t2",
    name: "Revisión de sitio con el cliente",
    status: "to do",
    assigneeIds: ["ramses", "francisco"],
    templateId: "landing-dev",
  },
  {
    id: "t3",
    name: "Chequeo sitio web v2.0",
    status: "to do",
    assigneeIds: ["francisco"],
    templateId: "landing-dev",
  },
  {
    id: "t4",
    name: "Revisar checklist revisión del sitio post publicación",
    status: "to do",
    assigneeIds: ["francisco"],
    templateId: "landing-dev",
  },
  {
    id: "t5",
    name: "Desarrollo de one page",
    status: "to do",
    assigneeIds: ["francisco"],
    templateId: "landing-dev",
  },
  {
    id: "t6",
    name: "Se compra y configura dominio",
    status: "to do",
    assigneeIds: ["ramses"],
    templateId: "landing-dev",
  },
  {
    id: "t7",
    name: "Kickoff (mini)",
    status: "to do",
    assigneeIds: ["aiko", "seth"],
    templateId: "landing-dev",
  },
  {
    id: "t8",
    name: "Se crean los textos de la página",
    status: "to do",
    assigneeIds: ["seth"],
    templateId: "landing-dev",
  },
  {
    id: "t9",
    name: "Se crea el ambiente de desarrollo",
    status: "to do",
    assigneeIds: ["ramses"],
    templateId: "landing-dev",
  },
  {
    id: "t10",
    name: "Visto bueno de los textos por parte del cliente",
    status: "to do",
    assigneeIds: ["aiko"],
    templateId: "landing-dev",
  },
  {
    id: "t11",
    name: "Se envía documento al cliente con cuestionario para generar contenido",
    status: "to do",
    assigneeIds: ["aiko"],
    templateId: "landing-dev",
  },
  {
    id: "t12",
    name: "Se instalan wordpress y plugins de one page",
    status: "to do",
    assigneeIds: ["ramses"],
    templateId: "landing-dev",
  },
  // Lista "Plantilla de landing para campañ" (list id 901704869365)
  {
    id: "t13",
    name: "Dar acceso a ads del cliente",
    status: "to do",
    assigneeIds: ["seth"],
    templateId: "landing-campaign",
  },
  {
    id: "t14",
    name: "Conectar y configurar conversiones en tag manager y ads",
    status: "to do",
    assigneeIds: ["daniel"],
    templateId: "landing-campaign",
  },
  {
    id: "t15",
    name: "Se comunica al equipo de comunicación que esta listo para campañas",
    status: "to do",
    assigneeIds: ["daniel"],
    templateId: "landing-campaign",
  },
  {
    id: "t16",
    name: "Se pide ayuda a dos personas random en dínamo para revisar en dispositivos",
    status: "to do",
    assigneeIds: ["aiko"],
    templateId: "landing-campaign",
  },
  {
    id: "t17",
    name: "Se pide al equipo de comunicación que revisen a nivel textos",
    status: "to do",
    assigneeIds: ["daniel"],
    templateId: "landing-campaign",
  },
  {
    id: "t18",
    name: "Se vacían textos e imagenes para la nueva landing",
    status: "to do",
    assigneeIds: ["daniel"],
    templateId: "landing-campaign",
  },
  {
    id: "t19",
    name: "El equipo de desarrollo copia una landing para el nuevo contenido",
    status: "to do",
    assigneeIds: ["daniel"],
    templateId: "landing-campaign",
  },
  {
    id: "t20",
    name: "Se envían textos revisados al equipo de desarrollo",
    status: "to do",
    assigneeIds: ["aiko"],
    templateId: "landing-campaign",
  },
];

export const areaMap: Record<string, ClickupArea> = Object.fromEntries(
  AREAS.map((a) => [a.id, a]),
);
export const personMap: Record<string, ClickupPerson> = Object.fromEntries(
  PEOPLE.map((p) => [p.id, p]),
);
export const templateMap: Record<string, ClickupProcessTemplate> = Object.fromEntries(
  TEMPLATES.map((t) => [t.id, t]),
);
