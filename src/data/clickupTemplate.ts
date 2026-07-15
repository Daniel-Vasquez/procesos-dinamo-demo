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

export interface ClickupTemplateData {
  areas: ClickupArea[];
  templates: ClickupProcessTemplate[];
  people: ClickupPerson[];
  tasks: ClickupTask[];
  areaMap: Record<string, ClickupArea>;
  personMap: Record<string, ClickupPerson>;
  templateMap: Record<string, ClickupProcessTemplate>;
}

export const UNASSIGNED_AREA_COLOR = "#525A7C";

/** Departamentos de dínamo. ClickUp no modela esta clasificación, así que se mantiene a mano. */
export const AREAS: ClickupArea[] = [
  { id: "pm", label: "PM", color: "#5B9FE8" },
  { id: "dev", label: "Desarrollo web", color: "#9B72E0" },
  { id: "comms", label: "Comunicación", color: "#E8A63A" },
];

/**
 * Listas de ClickUp (dentro de workspace "dinamo" › espacio "dínamo 2026" ›
 * carpeta "Plantillas Dev 2025") que se muestran como plantillas toggleables.
 * Las tareas de cada lista se traen en vivo desde la API; esto solo define
 * qué listas mostrar y cómo pintarlas.
 */
export const TEMPLATES: Array<ClickupProcessTemplate & { listId: string }> = [
  { id: "landing-dev", label: "Plantilla Landing Dev", color: "#5B9FE8", listId: "901711971661" },
  { id: "landing-campaign", label: "Plantilla Landing Campañas", color: "#4EC89A", listId: "901704869365" },
];

/**
 * Mapeo persona (id numérico de usuario en ClickUp) → área de dínamo. ClickUp
 * no expone esta clasificación organizacional en su API, así que se mantiene
 * a mano aquí. Agregar una entrada cuando se sume alguien nuevo al equipo;
 * quien no aparezca cae en areaId null ("Sin área") sin romper nada.
 */
export const PERSON_AREA: Record<number, string> = {
  89265089: "pm", // Aiko Chavez
  14775041: "dev", // Ramses Reyes
  55675855: "dev", // Francisco J Rojo Córdova
  89264245: "dev", // Daniel Vasquez
  26226862: "comms", // Seth Gonzalez
};
