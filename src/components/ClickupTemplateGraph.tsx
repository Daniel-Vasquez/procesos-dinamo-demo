import { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data";
import { Network, type Edge, type Node, type Options } from "vis-network";
import {
  UNASSIGNED_AREA_COLOR,
  type ClickupArea,
  type ClickupPerson,
  type ClickupProcessTemplate,
  type ClickupTask,
} from "../data/clickupTemplate";
import { DIM_EDGE_COLOR, DIM_NODE_COLOR, DIM_NODE_FONT } from "../lib/graphStyle";

interface ClickupTemplateGraphProps {
  areas: ClickupArea[];
  people: ClickupPerson[];
  tasks: ClickupTask[];
  areaMap: Record<string, ClickupArea>;
  personMap: Record<string, ClickupPerson>;
  templateMap: Record<string, ClickupProcessTemplate>;
  activeAreas: Set<string>;
  activeTemplates: Set<string>;
}

const NODE_FONT = { color: "#D4D4DC", size: 11.5, face: "system-ui,-apple-system,sans-serif" };

function buildGraph(
  areas: ClickupArea[],
  people: ClickupPerson[],
  tasks: ClickupTask[],
  areaMap: Record<string, ClickupArea>,
  personMap: Record<string, ClickupPerson>,
  templateMap: Record<string, ClickupProcessTemplate>,
): { nodes: Node[]; edges: Edge[]; unassignedIds: string[] } {
  const areaColor = (areaId: string | null) => (areaId ? areaMap[areaId].color : UNASSIGNED_AREA_COLOR);

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  areas.forEach((area) => {
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

  const hasUnassignedTask = tasks.some((t) => t.assigneeIds.includes("unassigned"));
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

  people.forEach((person) => {
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

  tasks.forEach((task) => {
    const primaryColor = areaColor(personMap[task.assigneeIds[0]]?.areaId ?? null);
    nodes.push({
      id: `task-${task.id}`,
      label: task.name,
      title: `${templateMap[task.templateId].label} · Estado: ${task.status}`,
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
        tasks.some((t) => t.id === id.replace("task-", "") && t.assigneeIds.includes("unassigned")),
    );

  return { nodes, edges, unassignedIds };
}

export default function ClickupTemplateGraph({
  areas,
  people,
  tasks,
  areaMap,
  personMap,
  templateMap,
  activeAreas,
  activeTemplates,
}: ClickupTemplateGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesRef = useRef<DataSet<Node> | null>(null);
  const edgesRef = useRef<DataSet<Edge> | null>(null);
  const selectedIdsRef = useRef<Set<string>>(new Set());
  const [selected, setSelected] = useState<{ kind: string; id: string } | null>(null);

  const parseSelected = (id: string): { kind: string; id: string } | null => {
    if (id.startsWith("area-")) return { kind: "area", id: id.replace("area-", "") };
    if (id.startsWith("person-")) return { kind: "person", id: id.replace("person-", "") };
    if (id.startsWith("task-")) return { kind: "task", id: id.replace("task-", "") };
    return null;
  };

  const areaColor = (areaId: string | null) => (areaId ? areaMap[areaId].color : UNASSIGNED_AREA_COLOR);

  /** Areas are only toggleable when they belong to `areas`; the "Sin asignar" branch is always shown. */
  const personActive = (personId: string, active: Set<string>): boolean => {
    const person = personMap[personId];
    return person.areaId ? active.has(person.areaId) : true;
  };

  /** A task needs its template active AND at least one assignee in an active area. */
  const taskActive = (taskId: string, activeAreaSet: Set<string>, activeTemplateSet: Set<string>): boolean => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return true;
    return activeTemplateSet.has(task.templateId) && task.assigneeIds.some((pid) => personActive(pid, activeAreaSet));
  };

  /** A person↔task edge follows that one assignee's area plus the task's template. */
  const personTaskEdgeActive = (
    personId: string,
    taskId: string,
    activeAreaSet: Set<string>,
    activeTemplateSet: Set<string>,
  ): boolean => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return true;
    return activeTemplateSet.has(task.templateId) && personActive(personId, activeAreaSet);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const { nodes, edges, unassignedIds } = buildGraph(areas, people, tasks, areaMap, personMap, templateMap);
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
          levelSeparation: 180,
          nodeSpacing: 220,
          treeSpacing: 130,
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

    // Ctrl/Cmd/Alt/Shift + click toggles a node into the current selection instead of
    // replacing it, so multiple nodes can be selected at once. vis-network's own drag
    // handler already moves every currently-selected node together when the drag
    // starts on one of them, so no custom drag logic is needed for that part.
    network.on("click", (params: { nodes: string[]; event?: { srcEvent?: MouseEvent } }) => {
      const clickedId = params.nodes[0] as string | undefined;
      const srcEvent = params.event?.srcEvent;
      const multiselectKey = !!srcEvent && (srcEvent.ctrlKey || srcEvent.metaKey || srcEvent.altKey || srcEvent.shiftKey);

      if (!clickedId) {
        selectedIdsRef.current = new Set();
        network.unselectAll();
        setSelected(null);
        return;
      }

      if (multiselectKey) {
        const next = new Set(selectedIdsRef.current);
        if (next.has(clickedId)) next.delete(clickedId);
        else next.add(clickedId);
        selectedIdsRef.current = next;
      } else {
        selectedIdsRef.current = new Set([clickedId]);
      }

      if (selectedIdsRef.current.size > 0) {
        network.selectNodes([...selectedIdsRef.current], true);
      } else {
        network.unselectAll();
      }

      setSelected(selectedIdsRef.current.has(clickedId) ? parseSelected(clickedId) : null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    if (!nodes || !edges) return;

    const areaUpdates: Node[] = areas.map((area) => {
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

    const personUpdates: Node[] = people.filter((p) => nodes.get(`person-${p.id}`)).map((person) => {
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

    const taskUpdates: Node[] = tasks.map((task) => {
      const active = taskActive(task.id, activeAreas, activeTemplates);
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

    const areaPersonEdgeUpdates: Edge[] = people.filter((p) => edges.get(`e-area-${p.id}`)).map((person) => {
      const active = personActive(person.id, activeAreas);
      const color = areaColor(person.areaId);
      return active
        ? { id: `e-area-${person.id}`, color: { color: color + "88", highlight: color, hover: color } }
        : { id: `e-area-${person.id}`, color: DIM_EDGE_COLOR };
    });

    const personTaskEdgeUpdates: Edge[] = tasks.flatMap((task) =>
      task.assigneeIds.map((personId) => {
        const active = personTaskEdgeActive(personId, task.id, activeAreas, activeTemplates);
        const color = areaColor(personMap[personId]?.areaId ?? null);
        return active
          ? { id: `e-${task.id}-${personId}`, color: { color: color + "66", highlight: color, hover: color } }
          : { id: `e-${task.id}-${personId}`, color: DIM_EDGE_COLOR };
      }),
    );

    edges.update([...areaPersonEdgeUpdates, ...personTaskEdgeUpdates]);

    // The hierarchical layout fixes each node's vertical coordinate to keep it on
    // its level, which blocks dragging nodes up/down. Release that lock once the
    // layout above has settled so positions stay untouched but nodes can be
    // dragged freely afterwards. `level` must be echoed back unchanged: vis-network's
    // update() treats a missing `level` as a level change and would silently re-run
    // the hierarchical layout (re-locking every node) as part of this very call.
    nodes.update(nodes.getIds().map((id) => ({ id, level: nodes.get(id)?.level, fixed: { x: false, y: false } })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAreas, activeTemplates]);

  const detail = (() => {
    if (!selected) return null;
    if (selected.kind === "area") {
      const area = areaMap[selected.id];
      const peopleInArea = people.filter((p) => p.areaId === selected.id);
      const taskCount = tasks.filter((t) =>
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
      const personTasks = tasks.filter((t) => t.assigneeIds.includes(selected.id));
      return (
        <>
          <div className="text-[13px] font-semibold text-[var(--text-hi)]">{person.name}</div>
          <div className="mt-1 text-[11px]" style={{ color: area?.color ?? UNASSIGNED_AREA_COLOR }}>
            {area?.label ?? "Sin área"}
          </div>
          <div className="mt-2 text-[11px] text-[var(--text-mid)]">
            {personTasks.length} tarea{personTasks.length !== 1 ? "s" : ""} asignada
            {personTasks.length !== 1 ? "s" : ""}
          </div>
          <ul className="mt-1 space-y-1 text-[11px] text-[var(--text-hi)]">
            {personTasks.map((t) => (
              <li key={t.id}>
                {t.name}
                <span className="text-[var(--text-lo)]"> · {templateMap[t.templateId].label}</span>
              </li>
            ))}
          </ul>
        </>
      );
    }
    const task = tasks.find((t) => t.id === selected.id);
    if (!task) return null;
    return (
      <>
        <div className="text-[13px] font-semibold text-[var(--text-hi)]">{task.name}</div>
        <div className="mt-1 text-[11px] text-[var(--text-mid)]">
          {templateMap[task.templateId].label} · Estado: {task.status}
        </div>
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
