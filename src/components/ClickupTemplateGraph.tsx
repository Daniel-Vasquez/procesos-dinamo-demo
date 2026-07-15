import { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data";
import { Network, type Edge, type Node, type Options } from "vis-network";
import { AREAS, PEOPLE, TASKS, UNASSIGNED_AREA_COLOR, areaMap, personMap } from "../data/clickupTemplate";
import { DIM_EDGE_COLOR, DIM_NODE_COLOR, DIM_NODE_FONT } from "../lib/graphStyle";

interface ClickupTemplateGraphProps {
  activeAreas: Set<string>;
}

const NODE_FONT = { color: "#D4D4DC", size: 11.5, face: "system-ui,-apple-system,sans-serif" };

function areaColor(areaId: string | null) {
  return areaId ? areaMap[areaId].color : UNASSIGNED_AREA_COLOR;
}

/** Areas are only toggleable when they belong to AREAS; the "Sin asignar" branch is always shown. */
function personActive(personId: string, activeAreas: Set<string>): boolean {
  const person = personMap[personId];
  return person.areaId ? activeAreas.has(person.areaId) : true;
}

function taskActive(taskId: string, activeAreas: Set<string>): boolean {
  const task = TASKS.find((t) => t.id === taskId);
  return task ? task.assigneeIds.some((pid) => personActive(pid, activeAreas)) : true;
}

function buildGraph(): { nodes: Node[]; edges: Edge[]; unassignedIds: string[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  AREAS.forEach((area) => {
    nodes.push({
      id: `area-${area.id}`,
      label: area.label,
      shape: "box",
      shapeProperties: { borderRadius: 10 },
      color: {
        background: area.color + "2C",
        border: area.color,
        highlight: { background: area.color + "44", border: area.color },
        hover: { background: area.color + "3A", border: area.color },
      },
      font: { color: "#F2F3FA", size: 13, face: NODE_FONT.face, bold: { color: "#F2F3FA" } },
      borderWidth: 2,
      margin: { top: 12, right: 16, bottom: 12, left: 16 },
      widthConstraint: { minimum: 120 },
      level: 0,
    });
  });

  const hasUnassignedTask = TASKS.some((t) => t.assigneeIds.includes("unassigned"));
  if (hasUnassignedTask) {
    // Virtual root so the "Sin asignar" branch stays anchored in the same tree
    // instead of being laid out as a disconnected component far from the rest.
    nodes.push({
      id: "area-unassigned",
      label: "Sin asignar",
      shape: "box",
      shapeProperties: { borderRadius: 10 },
      color: {
        background: UNASSIGNED_AREA_COLOR + "18",
        border: UNASSIGNED_AREA_COLOR,
        highlight: { background: UNASSIGNED_AREA_COLOR + "30", border: UNASSIGNED_AREA_COLOR },
        hover: { background: UNASSIGNED_AREA_COLOR + "26", border: UNASSIGNED_AREA_COLOR },
      },
      font: { color: "#9096B8", size: 12, face: NODE_FONT.face },
      borderWidth: 1.5,
      borderWidthSelected: 2,
      margin: { top: 10, right: 14, bottom: 10, left: 14 },
      widthConstraint: { minimum: 110 },
      level: 0,
    } as Node);
  }

  PEOPLE.forEach((person) => {
    if (person.id === "unassigned" && !hasUnassignedTask) return;
    const color = areaColor(person.areaId);
    nodes.push({
      id: `person-${person.id}`,
      label: person.name,
      shape: "ellipse",
      color: {
        background: color + "20",
        border: color,
        highlight: { background: color + "44", border: color },
        hover: { background: color + "30", border: color },
      },
      font: NODE_FONT,
      borderWidth: 1.5,
      margin: { top: 8, right: 10, bottom: 8, left: 10 },
      widthConstraint: { minimum: 110, maximum: 160 },
      level: 1,
    });
    const parentAreaId = person.areaId ? `area-${person.areaId}` : person.id === "unassigned" ? "area-unassigned" : null;
    if (parentAreaId) {
      edges.push({
        id: `e-area-${person.id}`,
        from: parentAreaId,
        to: `person-${person.id}`,
        color: { color: color + "88", highlight: color, hover: color },
        width: 1.5,
        dashes: !person.areaId,
        arrows: { to: { enabled: false } },
        smooth: { enabled: true, type: "cubicBezier", forceDirection: "vertical", roundness: 0.4 },
      });
    }
  });

  TASKS.forEach((task) => {
    const primaryColor = areaColor(personMap[task.assigneeIds[0]]?.areaId ?? null);
    nodes.push({
      id: `task-${task.id}`,
      label: task.name,
      title: `Estado: ${task.status}`,
      shape: "box",
      shapeProperties: { borderRadius: 6 },
      color: {
        background: "#1F2338",
        border: primaryColor,
        highlight: { background: "#242A44", border: primaryColor },
        hover: { background: "#222540", border: primaryColor },
      },
      font: { color: "#B8BCE0", size: 10.5, face: NODE_FONT.face },
      borderWidth: 1.25,
      margin: { top: 8, right: 10, bottom: 8, left: 10 },
      widthConstraint: { minimum: 130, maximum: 180 },
      level: 2,
    });

    task.assigneeIds.forEach((personId) => {
      const color = areaColor(personMap[personId]?.areaId ?? null);
      edges.push({
        id: `e-${task.id}-${personId}`,
        from: `person-${personId}`,
        to: `task-${task.id}`,
        color: { color: color + "66", highlight: color, hover: color },
        width: 1,
        dashes: task.assigneeIds.length > 1,
        arrows: { to: { enabled: true, scaleFactor: 0.45 } },
        smooth: { enabled: true, type: "cubicBezier", forceDirection: "vertical", roundness: 0.4 },
      });
    });
  });

  const unassignedIds = nodes
    .map((n) => n.id as string)
    .filter(
      (id) =>
        id === "area-unassigned" ||
        id === "person-unassigned" ||
        TASKS.some((t) => t.id === id.replace("task-", "") && t.assigneeIds.includes("unassigned")),
    );

  return { nodes, edges, unassignedIds };
}

export default function ClickupTemplateGraph({ activeAreas }: ClickupTemplateGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesRef = useRef<DataSet<Node> | null>(null);
  const edgesRef = useRef<DataSet<Edge> | null>(null);
  const [selected, setSelected] = useState<{ kind: string; id: string } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const { nodes, edges, unassignedIds } = buildGraph();
    const nodesDataSet = new DataSet<Node>(nodes);
    const edgesDataSet = new DataSet<Edge>(edges);
    nodesRef.current = nodesDataSet;
    edgesRef.current = edgesDataSet;

    const options: Options = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: "UD",
          sortMethod: "directed",
          levelSeparation: 150,
          nodeSpacing: 140,
          treeSpacing: 60,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
        },
      },
      physics: { enabled: false },
      nodes: {
        shadow: false,
      },
      edges: {
        shadow: false,
      },
      interaction: {
        hover: true,
        zoomView: true,
        dragView: true,
        tooltipDelay: 250,
        hideEdgesOnDrag: false,
      },
    };

    const network = new Network(containerRef.current, { nodes: nodesDataSet, edges: edgesDataSet }, options);
    networkRef.current = network;

    network.on("click", (params: { nodes: string[] }) => {
      if (!params.nodes.length) {
        setSelected(null);
        return;
      }
      const id = params.nodes[0] as string;
      if (id.startsWith("area-")) setSelected({ kind: "area", id: id.replace("area-", "") });
      else if (id.startsWith("person-")) setSelected({ kind: "person", id: id.replace("person-", "") });
      else if (id.startsWith("task-")) setSelected({ kind: "task", id: id.replace("task-", "") });
    });

    // The "Sin asignar" branch has no edge into the main tree, so the hierarchical
    // layout drops it far away as its own component, blowing up fit()'s bounding
    // box. Snap it back next to the main cluster before fitting the view.
    if (unassignedIds.length) {
      const mainIds = nodes.map((n) => n.id as string).filter((id) => !unassignedIds.includes(id));
      const mainPositions = network.getPositions(mainIds);
      const unassignedPositions = network.getPositions(unassignedIds);
      const mainMaxX = Math.max(...Object.values(mainPositions).map((p) => p.x));
      const unassignedMinX = Math.min(...Object.values(unassignedPositions).map((p) => p.x));
      const offsetX = mainMaxX + 220 - unassignedMinX;
      unassignedIds.forEach((id) => {
        const pos = unassignedPositions[id];
        network.moveNode(id, pos.x + offsetX, pos.y);
      });
    }

    const fitTimer = setTimeout(() => {
      network.fit({ animation: { duration: 700, easingFunction: "easeInOutQuad" } });
    }, 150);

    return () => {
      clearTimeout(fitTimer);
      network.destroy();
      networkRef.current = null;
      nodesRef.current = null;
      edgesRef.current = null;
    };
  }, []);

  useEffect(() => {
    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    if (!nodes || !edges) return;

    const areaUpdates: Node[] = AREAS.map((area) => {
      const active = activeAreas.has(area.id);
      return active
        ? {
            id: `area-${area.id}`,
            color: {
              background: area.color + "2C",
              border: area.color,
              highlight: { background: area.color + "44", border: area.color },
              hover: { background: area.color + "3A", border: area.color },
            },
            font: { color: "#F2F3FA", size: 13, face: NODE_FONT.face, bold: { color: "#F2F3FA" } },
          }
        : { id: `area-${area.id}`, color: DIM_NODE_COLOR, font: DIM_NODE_FONT };
    });

    const personUpdates: Node[] = PEOPLE.filter((p) => nodes.get(`person-${p.id}`)).map((person) => {
      const active = personActive(person.id, activeAreas);
      const color = areaColor(person.areaId);
      return active
        ? {
            id: `person-${person.id}`,
            color: {
              background: color + "20",
              border: color,
              highlight: { background: color + "44", border: color },
              hover: { background: color + "30", border: color },
            },
            font: NODE_FONT,
          }
        : { id: `person-${person.id}`, color: DIM_NODE_COLOR, font: DIM_NODE_FONT };
    });

    const taskUpdates: Node[] = TASKS.map((task) => {
      const active = taskActive(task.id, activeAreas);
      const primaryColor = areaColor(personMap[task.assigneeIds[0]]?.areaId ?? null);
      return active
        ? {
            id: `task-${task.id}`,
            color: {
              background: "#1F2338",
              border: primaryColor,
              highlight: { background: "#242A44", border: primaryColor },
              hover: { background: "#222540", border: primaryColor },
            },
            font: { color: "#B8BCE0", size: 10.5, face: NODE_FONT.face },
          }
        : { id: `task-${task.id}`, color: DIM_NODE_COLOR, font: DIM_NODE_FONT };
    });

    nodes.update([...areaUpdates, ...personUpdates, ...taskUpdates]);

    const areaPersonEdgeUpdates: Edge[] = PEOPLE.filter((p) => edges.get(`e-area-${p.id}`)).map((person) => {
      const active = personActive(person.id, activeAreas);
      const color = areaColor(person.areaId);
      return active
        ? { id: `e-area-${person.id}`, color: { color: color + "88", highlight: color, hover: color } }
        : { id: `e-area-${person.id}`, color: DIM_EDGE_COLOR };
    });

    const personTaskEdgeUpdates: Edge[] = TASKS.flatMap((task) =>
      task.assigneeIds.map((personId) => {
        const active = personActive(personId, activeAreas);
        const color = areaColor(personMap[personId]?.areaId ?? null);
        return active
          ? { id: `e-${task.id}-${personId}`, color: { color: color + "66", highlight: color, hover: color } }
          : { id: `e-${task.id}-${personId}`, color: DIM_EDGE_COLOR };
      }),
    );

    edges.update([...areaPersonEdgeUpdates, ...personTaskEdgeUpdates]);
  }, [activeAreas]);

  const detail = (() => {
    if (!selected) return null;
    if (selected.kind === "area") {
      const area = areaMap[selected.id];
      const peopleInArea = PEOPLE.filter((p) => p.areaId === selected.id);
      const taskCount = TASKS.filter((t) =>
        t.assigneeIds.some((pid) => personMap[pid]?.areaId === selected.id),
      ).length;
      return (
        <>
          <div className="text-[13px] font-semibold" style={{ color: area.color }}>
            {area.label}
          </div>
          <div className="mt-1 text-[11px] text-[var(--text-mid)]">
            {peopleInArea.length} persona{peopleInArea.length !== 1 ? "s" : ""} · {taskCount} tarea
            {taskCount !== 1 ? "s" : ""}
          </div>
          <ul className="mt-2 space-y-1 text-[11px] text-[var(--text-hi)]">
            {peopleInArea.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </>
      );
    }
    if (selected.kind === "person") {
      const person = personMap[selected.id];
      const area = person.areaId ? areaMap[person.areaId] : null;
      const tasks = TASKS.filter((t) => t.assigneeIds.includes(selected.id));
      return (
        <>
          <div className="text-[13px] font-semibold text-[var(--text-hi)]">{person.name}</div>
          <div className="mt-1 text-[11px]" style={{ color: area?.color ?? UNASSIGNED_AREA_COLOR }}>
            {area?.label ?? "Sin área"}
          </div>
          <div className="mt-2 text-[11px] text-[var(--text-mid)]">
            {tasks.length} tarea{tasks.length !== 1 ? "s" : ""} asignada{tasks.length !== 1 ? "s" : ""}
          </div>
          <ul className="mt-1 space-y-1 text-[11px] text-[var(--text-hi)]">
            {tasks.map((t) => (
              <li key={t.id}>{t.name}</li>
            ))}
          </ul>
        </>
      );
    }
    const task = TASKS.find((t) => t.id === selected.id);
    if (!task) return null;
    return (
      <>
        <div className="text-[13px] font-semibold text-[var(--text-hi)]">{task.name}</div>
        <div className="mt-1 text-[11px] text-[var(--text-mid)]">Estado: {task.status}</div>
        <ul className="mt-2 space-y-1 text-[11px] text-[var(--text-hi)]">
          {task.assigneeIds.map((pid) => {
            const p = personMap[pid];
            const area = p.areaId ? areaMap[p.areaId] : null;
            return (
              <li key={pid}>
                {p.name}
                {area ? ` · ${area.label}` : ""}
              </li>
            );
          })}
        </ul>
      </>
    );
  })();

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" />

      {detail && (
        <div className="absolute bottom-[18px] left-[15px] z-[5] max-w-[280px] rounded-[9px] border border-[var(--border2)] bg-[var(--surface)] p-3 shadow-lg">
          {detail}
        </div>
      )}

      <div className="absolute bottom-[18px] right-[18px] z-[5] flex flex-col gap-[3px]">
        <button
          type="button"
          title="Acercar"
          onClick={() =>
            networkRef.current?.moveTo({
              scale: networkRef.current.getScale() * 1.3,
              animation: { duration: 220, easingFunction: "easeInOutQuad" },
            })
          }
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[var(--border2)] bg-[var(--surface)] text-sm leading-none text-[var(--text-mid)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text-hi)]"
        >
          +
        </button>
        <button
          type="button"
          title="Ajustar"
          onClick={() =>
            networkRef.current?.fit({ animation: { duration: 380, easingFunction: "easeInOutQuad" } })
          }
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[var(--border2)] bg-[var(--surface)] text-sm leading-none text-[var(--text-mid)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text-hi)]"
        >
          ⊙
        </button>
        <button
          type="button"
          title="Alejar"
          onClick={() =>
            networkRef.current?.moveTo({
              scale: networkRef.current.getScale() / 1.3,
              animation: { duration: 220, easingFunction: "easeInOutQuad" },
            })
          }
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[var(--border2)] bg-[var(--surface)] text-sm leading-none text-[var(--text-mid)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text-hi)]"
        >
          −
        </button>
      </div>
    </div>
  );
}
