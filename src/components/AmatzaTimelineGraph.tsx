import { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data";
import { Network, type Edge, type Node, type Options } from "vis-network";
import { UNASSIGNED_MEMBER_COLOR, isCompletedStatus, type AmatzaTask, type AmatzaTeamMember } from "../data/amatzaTeam";

interface AmatzaTimelineGraphProps {
  tasks: AmatzaTask[];
  team: AmatzaTeamMember[];
  teamMap: Record<number, AmatzaTeamMember>;
}

const NODE_FONT = { color: "#D4D4DC", size: 11.5, face: "system-ui,-apple-system,sans-serif" };
const DAY_MS = 86_400_000;
const PX_PER_DAY = 46;
const LANE_SPACING = 130;
const MIN_TASK_GAP = 170;
const UNASSIGNED_LANE_ID = -1;

const dateFormatter = new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" });
const monthFormatter = new Intl.DateTimeFormat("es-MX", { month: "short", year: "numeric" });

function laneMember(laneId: number, teamMap: Record<number, AmatzaTeamMember>): AmatzaTeamMember {
  return (
    teamMap[laneId] ?? { id: UNASSIGNED_LANE_ID, name: "Sin asignar", role: "Sin asignar", color: UNASSIGNED_MEMBER_COLOR }
  );
}

function taskVisual(task: AmatzaTask, laneColor: string): { border: string; label: string } {
  if (isCompletedStatus(task.statusType)) {
    return { border: task.statusColor, label: `✓ ${task.name}` };
  }
  return { border: laneColor, label: task.name };
}

function buildGraph(
  tasks: AmatzaTask[],
  team: AmatzaTeamMember[],
  teamMap: Record<number, AmatzaTeamMember>,
): { nodes: Node[]; edges: Edge[]; laneCount: number } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const datedTasks = tasks.filter((t) => t.dueDate !== null);
  const now = Date.now();
  const minDate = datedTasks.length ? Math.min(...datedTasks.map((t) => t.dueDate as number)) : now;
  const maxDate = datedTasks.length ? Math.max(...datedTasks.map((t) => t.dueDate as number)) : now;
  const xForDate = (date: number) => ((date - minDate) / DAY_MS) * PX_PER_DAY;

  const laneIds = [...team.map((m) => m.id), UNASSIGNED_LANE_ID];
  const laneIndex = Object.fromEntries(laneIds.map((id, i) => [id, i]));

  const hasUnassignedTask = tasks.some((t) => t.assigneeIds.length === 0);
  const visibleLaneIds = hasUnassignedTask ? laneIds : laneIds.filter((id) => id !== UNASSIGNED_LANE_ID);

  visibleLaneIds.forEach((laneId) => {
    const member = laneMember(laneId, teamMap);
    nodes.push({
      id: `role-${laneId}`,
      label: `${member.name}\n${member.role}`,
      shape: "ellipse",
      x: -280,
      y: laneIndex[laneId] * LANE_SPACING,
      fixed: { x: true, y: true },
      color: {
        background: member.color + "20",
        border: member.color,
        highlight: { background: member.color + "44", border: member.color },
        hover: { background: member.color + "30", border: member.color },
      },
      font: NODE_FONT,
      borderWidth: 1.5,
      margin: { top: 10, right: 12, bottom: 10, left: 12 },
      widthConstraint: { minimum: 150, maximum: 190 },
    });
  });

  visibleLaneIds.forEach((laneId) => {
    const member = laneMember(laneId, teamMap);
    const laneTasks = tasks
      .filter((t) => (laneId === UNASSIGNED_LANE_ID ? t.assigneeIds.length === 0 : t.assigneeIds[0] === laneId))
      .slice()
      .sort((a, b) => (a.dueDate ?? Infinity) - (b.dueDate ?? Infinity));

    let prevX = -Infinity;
    laneTasks.forEach((task) => {
      const rawX = task.dueDate !== null ? xForDate(task.dueDate) : xForDate(maxDate) + MIN_TASK_GAP * 2;
      const x = Math.max(rawX, prevX + MIN_TASK_GAP);
      prevX = x;

      const visual = taskVisual(task, member.color);
      nodes.push({
        id: `task-${task.id}`,
        label: visual.label,
        title: `${member.role} · ${task.status}${task.dueDate ? ` · Vence: ${dateFormatter.format(new Date(task.dueDate))}` : ""}`,
        shape: "box",
        shapeProperties: { borderRadius: 6 },
        x,
        y: laneIndex[laneId] * LANE_SPACING,
        color: {
          background: "#1F2338",
          border: visual.border,
          highlight: { background: "#242A44", border: visual.border },
          hover: { background: "#222540", border: visual.border },
        },
        font: { color: "#B8BCE0", size: 10.5, face: NODE_FONT.face },
        borderWidth: 1.25,
        margin: { top: 8, right: 10, bottom: 8, left: 10 },
        widthConstraint: { minimum: 140, maximum: 190 },
      });

      task.assigneeIds.forEach((assigneeId) => {
        const assignee = laneMember(assigneeId, teamMap);
        edges.push({
          id: `e-${task.id}-${assigneeId}`,
          from: `role-${assigneeId}`,
          to: `task-${task.id}`,
          color: { color: assignee.color + "66", highlight: assignee.color, hover: assignee.color },
          width: 1,
          dashes: task.assigneeIds.length > 1,
          arrows: { to: { enabled: true, scaleFactor: 0.45 } },
          smooth: { enabled: true, type: "cubicBezier", forceDirection: "horizontal", roundness: 0.4 },
        });
      });
    });
  });

  const gridTop = -95;
  const gridBottom = visibleLaneIds.length * LANE_SPACING + 25;

  if (datedTasks.length) {
    const cursor = new Date(minDate);
    cursor.setDate(1);
    cursor.setHours(0, 0, 0, 0);
    let i = 0;
    while (cursor.getTime() <= maxDate) {
      const boundary = cursor.getTime();
      nodes.push({
        id: `grid-label-${i}`,
        label: monthFormatter.format(new Date(boundary)),
        shape: "text",
        x: xForDate(boundary),
        y: gridTop,
        fixed: { x: true, y: true },
        font: { color: "#5A6088", size: 10.5, face: NODE_FONT.face },
      });
      nodes.push({
        id: `grid-top-${i}`,
        shape: "dot",
        size: 1,
        x: xForDate(boundary),
        y: gridTop + 18,
        fixed: { x: true, y: true },
        color: { background: "transparent", border: "transparent" },
      } as Node);
      nodes.push({
        id: `grid-bottom-${i}`,
        shape: "dot",
        size: 1,
        x: xForDate(boundary),
        y: gridBottom,
        fixed: { x: true, y: true },
        color: { background: "transparent", border: "transparent" },
      } as Node);
      edges.push({
        id: `e-grid-${i}`,
        from: `grid-top-${i}`,
        to: `grid-bottom-${i}`,
        color: { color: "#262B46" },
        width: 1,
        dashes: [2, 4],
        arrows: { to: { enabled: false } },
        smooth: false,
      });

      cursor.setMonth(cursor.getMonth() + 1);
      i += 1;
    }

    if (now >= minDate - 3 * DAY_MS && now <= maxDate + 3 * DAY_MS) {
      nodes.push({
        id: "today-label",
        label: "Hoy",
        shape: "text",
        x: xForDate(now),
        y: gridTop,
        fixed: { x: true, y: true },
        font: { color: "#F0A830", size: 11, face: NODE_FONT.face, bold: { color: "#F0A830" } },
      });
      nodes.push({
        id: "today-top",
        shape: "dot",
        size: 1,
        x: xForDate(now),
        y: gridTop + 18,
        fixed: { x: true, y: true },
        color: { background: "transparent", border: "transparent" },
      } as Node);
      nodes.push({
        id: "today-bottom",
        shape: "dot",
        size: 1,
        x: xForDate(now),
        y: gridBottom,
        fixed: { x: true, y: true },
        color: { background: "transparent", border: "transparent" },
      } as Node);
      edges.push({
        id: "e-today",
        from: "today-top",
        to: "today-bottom",
        color: { color: "#F0A83088" },
        width: 1.5,
        dashes: [4, 3],
        arrows: { to: { enabled: false } },
        smooth: false,
      });
    }
  }

  return { nodes, edges, laneCount: visibleLaneIds.length };
}

export default function AmatzaTimelineGraph({ tasks, team, teamMap }: AmatzaTimelineGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesRef = useRef<DataSet<Node> | null>(null);
  const edgesRef = useRef<DataSet<Edge> | null>(null);
  const selectedIdsRef = useRef<Set<string>>(new Set());
  const mountedOnceRef = useRef(false);
  const [selected, setSelected] = useState<{ kind: string; id: string } | null>(null);

  const parseSelected = (id: string): { kind: string; id: string } | null => {
    if (id.startsWith("role-")) return { kind: "role", id: id.replace("role-", "") };
    if (id.startsWith("task-")) return { kind: "task", id: id.replace("task-", "") };
    return null;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const { nodes, edges } = buildGraph(tasks, team, teamMap);
    const nodesDataSet = new DataSet<Node>(nodes);
    const edgesDataSet = new DataSet<Edge>(edges);
    nodesRef.current = nodesDataSet;
    edgesRef.current = edgesDataSet;

    const options: Options = {
      physics: { enabled: false },
      nodes: { shadow: false },
      edges: { shadow: false },
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

    // Igual que en ClickupTemplateGraph: click normal reemplaza la selección,
    // Ctrl/Cmd/Alt/Shift+click la alterna, y click en el fondo la limpia.
    // vis-network arrastra todos los nodos seleccionados juntos de forma nativa.
    // Los nodos decorativos (grid-*, today-*) están fixed y se ignoran aquí.
    network.on("click", (params: { nodes: string[]; event?: { srcEvent?: MouseEvent } }) => {
      const clickedId = params.nodes[0] as string | undefined;
      if (clickedId && !clickedId.startsWith("task-") && !clickedId.startsWith("role-")) return;

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

  // Actualización reactiva: cuando una tarea cambia de estatus (ej. PENDIENTE →
  // COMPLETADO) entre refrescos, solo se repinta el color/label del nodo
  // afectado -- sin reconstruir el grafo ni tocar posiciones/zoom/pan.
  useEffect(() => {
    if (!mountedOnceRef.current) {
      mountedOnceRef.current = true;
      return;
    }
    const nodes = nodesRef.current;
    if (!nodes) return;

    const updates: Node[] = tasks
      .filter((t) => nodes.get(`task-${t.id}`))
      .map((task) => {
        const laneId = task.assigneeIds[0] ?? UNASSIGNED_LANE_ID;
        const member = laneMember(laneId, teamMap);
        const visual = taskVisual(task, member.color);
        return {
          id: `task-${task.id}`,
          label: visual.label,
          title: `${member.role} · ${task.status}${task.dueDate ? ` · Vence: ${dateFormatter.format(new Date(task.dueDate))}` : ""}`,
          color: {
            background: "#1F2338",
            border: visual.border,
            highlight: { background: "#242A44", border: visual.border },
            hover: { background: "#222540", border: visual.border },
          },
        };
      });

    if (updates.length) nodes.update(updates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  const detail = (() => {
    if (!selected) return null;
    if (selected.kind === "role") {
      const laneId = Number(selected.id);
      const member = laneMember(laneId, teamMap);
      const laneTasks = tasks.filter((t) =>
        laneId === UNASSIGNED_LANE_ID ? t.assigneeIds.length === 0 : t.assigneeIds.includes(laneId),
      );
      const pendingTasks = laneTasks.filter((t) => !isCompletedStatus(t.statusType));
      const completedTasks = laneTasks.filter((t) => isCompletedStatus(t.statusType));

      const renderTaskItem = (t: AmatzaTask) => (
        <li key={t.id}>
          <span className="block truncate">{t.name}</span>
          {t.dueDate && (
            <span className="text-[10px] text-[var(--text-lo)]">{dateFormatter.format(new Date(t.dueDate))}</span>
          )}
        </li>
      );

      return (
        <>
          <div className="text-[13px] font-semibold" style={{ color: member.color }}>
            {member.name}
          </div>
          <div className="mt-0.5 text-[11px] text-[var(--text-mid)]">{member.role}</div>
          <div className="mt-2 text-[11px] text-[var(--text-mid)]">
            {completedTasks.length}/{laneTasks.length} tarea{laneTasks.length !== 1 ? "s" : ""} completada
            {laneTasks.length !== 1 ? "s" : ""}
          </div>

          <div className="mt-3 divide-y divide-[var(--border)]">
            <div className="pb-2.5">
              <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--text-lo)]">
                Tareas pendientes ({pendingTasks.length})
              </div>
              {pendingTasks.length ? (
                <ul className="mt-1.5 max-h-[160px] space-y-1.5 overflow-y-auto text-[11px] text-[var(--text-hi)]">
                  {pendingTasks.map(renderTaskItem)}
                </ul>
              ) : (
                <div className="mt-1.5 text-[11px] text-[var(--text-lo)]">Sin tareas pendientes</div>
              )}
            </div>
            <div className="pt-2.5">
              <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--text-lo)]">
                Tareas completadas ({completedTasks.length})
              </div>
              {completedTasks.length ? (
                <ul className="mt-1.5 max-h-[160px] space-y-1.5 overflow-y-auto text-[11px] text-[var(--text-hi)]">
                  {completedTasks.map(renderTaskItem)}
                </ul>
              ) : (
                <div className="mt-1.5 text-[11px] text-[var(--text-lo)]">Sin tareas completadas</div>
              )}
            </div>
          </div>
        </>
      );
    }
    const task = tasks.find((t) => t.id === selected.id);
    if (!task) return null;
    return (
      <>
        <div className="text-[13px] font-semibold text-[var(--text-hi)]">{task.name}</div>
        <div className="mt-1 text-[11px] text-[var(--text-mid)]">Estado: {task.status}</div>
        {task.dueDate && (
          <div className="mt-0.5 text-[11px] text-[var(--text-mid)]">
            Vence: {dateFormatter.format(new Date(task.dueDate))}
          </div>
        )}
        {task.startDate && (
          <div className="mt-0.5 text-[11px] text-[var(--text-mid)]">
            Inicia: {dateFormatter.format(new Date(task.startDate))}
          </div>
        )}
        <ul className="mt-2 space-y-1 text-[11px] text-[var(--text-hi)]">
          {task.assigneeIds.length === 0 && <li>Sin asignar</li>}
          {task.assigneeIds.map((id) => {
            const member = laneMember(id, teamMap);
            return (
              <li key={id}>
                {member.name} · {member.role}
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
        <div className="absolute bottom-[18px] left-[15px] z-[5] max-h-[70vh] w-[300px] overflow-y-auto rounded-[9px] border border-[var(--border2)] bg-[var(--surface)] p-3 shadow-lg">
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
          onClick={() => networkRef.current?.fit({ animation: { duration: 380, easingFunction: "easeInOutQuad" } })}
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
