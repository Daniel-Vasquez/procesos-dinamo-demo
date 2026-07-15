import {
  AREAS,
  PERSON_AREA,
  TEMPLATES,
  type ClickupPerson,
  type ClickupTask,
  type ClickupTemplateData,
} from "../data/clickupTemplate";

const CLICKUP_API = "https://api.clickup.com/api/v2";

interface ClickupApiAssignee {
  id: number;
  username: string | null;
}

interface ClickupApiTask {
  id: string;
  name: string;
  status: { status: string };
  assignees: ClickupApiAssignee[];
}

async function fetchListTasks(listId: string, token: string): Promise<ClickupApiTask[]> {
  const res = await fetch(`${CLICKUP_API}/list/${listId}/task?include_closed=true`, {
    headers: { Authorization: token },
  });

  if (!res.ok) {
    throw new Error(`ClickUp respondió ${res.status} al pedir la lista ${listId}`);
  }

  const data = (await res.json()) as { tasks?: ClickupApiTask[] };
  return data.tasks ?? [];
}

/** Server-only: llama a la API de ClickUp en vivo y arma los datos con la misma forma que consumen los componentes. */
export async function getClickupTemplateData(): Promise<ClickupTemplateData> {
  const token = import.meta.env.CLICKUP_TOKEN;
  if (!token) {
    throw new Error("Falta la variable de entorno CLICKUP_TOKEN");
  }

  const taskLists = await Promise.all(TEMPLATES.map((template) => fetchListTasks(template.listId, token)));

  const people = new Map<string, ClickupPerson>();
  const tasks: ClickupTask[] = [];

  taskLists.forEach((apiTasks, i) => {
    const templateId = TEMPLATES[i].id;

    apiTasks.forEach((apiTask) => {
      const assigneeIds = apiTask.assignees.length ? apiTask.assignees.map((a) => String(a.id)) : ["unassigned"];

      apiTask.assignees.forEach((assignee) => {
        const id = String(assignee.id);
        if (people.has(id)) return;
        people.set(id, {
          id,
          name: assignee.username ?? `Usuario ${id}`,
          areaId: PERSON_AREA[assignee.id] ?? null,
        });
      });

      tasks.push({
        id: apiTask.id,
        name: apiTask.name,
        status: apiTask.status.status,
        assigneeIds,
        templateId,
      });
    });
  });

  people.set("unassigned", { id: "unassigned", name: "Sin asignar", areaId: null });

  const peopleList = [...people.values()];
  const areaMap = Object.fromEntries(AREAS.map((a) => [a.id, a]));
  const personMap = Object.fromEntries(peopleList.map((p) => [p.id, p]));
  const templateMap = Object.fromEntries(TEMPLATES.map((t) => [t.id, t]));

  return {
    areas: AREAS,
    templates: TEMPLATES,
    people: peopleList,
    tasks,
    areaMap,
    personMap,
    templateMap,
  };
}
