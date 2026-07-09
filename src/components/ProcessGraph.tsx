import { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Network, type Edge, type Node, type Options } from "vis-network";
import { DATA, deptMap, procMap } from "../data/processes";
import type { EdgeType } from "../data/types";
import {
  DIM_EDGE_COLOR,
  DIM_NODE_COLOR,
  DIM_NODE_FONT,
  TRACKED_EDGE_TYPES,
  edgeStyle,
} from "../lib/graphStyle";

interface ProcessGraphProps {
  activeProcesses: Set<string>;
  activeDepts: Set<string>;
  activeEdgeTypes: Set<string>;
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  /** Bumped token re-triggers the animated focus even for the same node id. */
  focusRequest: { id: string; token: number } | null;
}

interface RawNode {
  id: string;
  label: string;
  title: string;
  dept: string;
  processId: string;
}

interface RawEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  title?: string;
  type: EdgeType;
  /** 'all' marks cross-process edges, which are gated on both endpoints' processes. */
  processId: string;
}

const NODE_FONT = { color: "#D4D4DC", size: 11.5, face: "system-ui,-apple-system,sans-serif" };

function nodeColor(deptColor: string) {
  return {
    background: deptColor + "18",
    border: deptColor,
    highlight: { background: deptColor + "44", border: deptColor },
    hover: { background: deptColor + "2C", border: deptColor },
  };
}

function smoothFor(type: EdgeType) {
  if (type === "feedback" || type === "review") {
    return { enabled: true, type: "curvedCCW", roundness: 0.35 };
  }
  if (type === "cross") {
    return { enabled: true, type: "dynamic", roundness: 0.5 };
  }
  return { enabled: true, type: "cubicBezier", forceDirection: "horizontal", roundness: 0.4 };
}

const EDGE_LABEL_FONT = {
  size: 9,
  color: "#7880A8",
  align: "middle" as const,
  strokeWidth: 0,
  background: "none" as const,
};

function visEdgeStyle(type: EdgeType) {
  const s = edgeStyle(type);
  return {
    font: EDGE_LABEL_FONT,
    color: { color: s.color, highlight: s.highlight, hover: s.hover },
    width: s.width,
    dashes: s.dashes,
    smooth: smoothFor(type),
  };
}

function buildRawGraph(): { rawNodes: RawNode[]; rawEdges: RawEdge[] } {
  const rawNodes: RawNode[] = [];
  const rawEdges: RawEdge[] = [];
  let eid = 1;

  DATA.processes.forEach((proc) => {
    proc.nodes.forEach((n) => {
      rawNodes.push({
        id: n.id,
        label: n.label,
        title: n.description,
        dept: n.dept,
        processId: proc.id,
      });
    });
    proc.edges.forEach((e) => {
      rawEdges.push({
        id: `e${eid++}`,
        from: e.from,
        to: e.to,
        label: e.label,
        type: e.type,
        processId: proc.id,
      });
    });
  });

  DATA.crossProcessEdges.forEach((e) => {
    rawEdges.push({
      id: `e${eid++}`,
      from: e.from,
      to: e.to,
      label: "",
      title: e.reason,
      type: "cross",
      processId: "all",
    });
  });

  return { rawNodes, rawEdges };
}

export default function ProcessGraph({
  activeProcesses,
  activeDepts,
  activeEdgeTypes,
  selectedNodeId,
  onSelectNode,
  focusRequest,
}: ProcessGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesRef = useRef<DataSet<Node> | null>(null);
  const edgesRef = useRef<DataSet<Edge> | null>(null);
  const rawNodesRef = useRef<RawNode[]>([]);
  const rawEdgesRef = useRef<RawEdge[]>([]);
  const onSelectNodeRef = useRef(onSelectNode);

  useEffect(() => {
    onSelectNodeRef.current = onSelectNode;
  }, [onSelectNode]);

  useEffect(() => {
    if (!containerRef.current) return;

    const { rawNodes, rawEdges } = buildRawGraph();
    rawNodesRef.current = rawNodes;
    rawEdgesRef.current = rawEdges;

    const visNodes: Node[] = rawNodes.map((n) => {
      const dept = deptMap[n.dept];
      return {
        id: n.id,
        label: n.label,
        title: n.title,
        color: nodeColor(dept.color),
        font: NODE_FONT,
        shape: "box",
        shapeProperties: { borderRadius: 8 },
        borderWidth: 1.5,
        borderWidthSelected: 2.5,
        margin: { top: 9, right: 12, bottom: 9, left: 12 },
        widthConstraint: { minimum: 100, maximum: 150 },
      } as Node;
    });

    const visEdges: Edge[] = rawEdges.map((e) => ({
      id: e.id,
      from: e.from,
      to: e.to,
      label: e.label,
      title: e.title,
      arrows: { to: { enabled: true, scaleFactor: e.processId === "all" ? 0.4 : 0.55 } },
      ...visEdgeStyle(e.type),
    }));

    const nodes = new DataSet<Node>(visNodes);
    const edges = new DataSet<Edge>(visEdges);
    nodesRef.current = nodes;
    edgesRef.current = edges;

    const options: Options = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: "LR",
          sortMethod: "directed",
          levelSeparation: 190,
          nodeSpacing: 105,
          treeSpacing: 155,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
        },
      },
      physics: { enabled: false },
      nodes: {
        shape: "box",
        shapeProperties: { borderRadius: 8 },
        font: { size: 11.5, color: "#D4D4DC", face: "system-ui,-apple-system,sans-serif" },
        borderWidth: 1.5,
        shadow: false,
        widthConstraint: { minimum: 100, maximum: 150 },
      },
      edges: {
        arrows: { to: { enabled: true, scaleFactor: 0.6 } },
        color: { color: "#3A3A3E", highlight: "#FFFFFF" },
        width: 1.5,
        font: { size: 9, color: "#484854", align: "middle", strokeWidth: 0, background: "none" },
        smooth: { enabled: true, type: "cubicBezier", forceDirection: "horizontal", roundness: 0.4 },
      },
      interaction: {
        hover: true,
        zoomView: true,
        dragView: true,
        tooltipDelay: 350,
        hideEdgesOnDrag: false,
      },
    };

    const network = new Network(containerRef.current, { nodes, edges }, options);

    network.on("click", (params: { nodes: string[] }) => {
      if (params.nodes.length) onSelectNodeRef.current(params.nodes[0]);
      else onSelectNodeRef.current(null);
    });

    networkRef.current = network;

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

    nodes.update(
      rawNodesRef.current.map((n) => {
        const on = activeProcesses.has(n.processId) && activeDepts.has(n.dept);
        if (on) {
          const dept = deptMap[n.dept];
          return { id: n.id, color: nodeColor(dept.color), font: NODE_FONT };
        }
        return { id: n.id, color: DIM_NODE_COLOR, font: DIM_NODE_FONT };
      }),
    );

    edges.update(
      rawEdgesRef.current.map((e) => {
        if (e.processId === "all") {
          const fromNode = rawNodesRef.current.find((n) => n.id === e.from);
          const toNode = rawNodesRef.current.find((n) => n.id === e.to);
          const fromOn = fromNode ? activeProcesses.has(fromNode.processId) : false;
          const toOn = toNode ? activeProcesses.has(toNode.processId) : false;
          if (fromOn && toOn && activeEdgeTypes.has("cross")) {
            return { id: e.id, ...visEdgeStyle("cross") };
          }
          return { id: e.id, color: DIM_EDGE_COLOR, width: 0.5, dashes: false };
        }

        const procOn = activeProcesses.has(e.processId);
        const typeOn =
          !(TRACKED_EDGE_TYPES as readonly EdgeType[]).includes(e.type) || activeEdgeTypes.has(e.type);
        return procOn && typeOn
          ? { id: e.id, ...visEdgeStyle(e.type) }
          : { id: e.id, color: DIM_EDGE_COLOR, width: 0.5, dashes: false };
      }),
    );
  }, [activeProcesses, activeDepts, activeEdgeTypes]);

  useEffect(() => {
    const network = networkRef.current;
    if (!network) return;
    if (selectedNodeId) {
      network.selectNodes([selectedNodeId]);
    } else {
      network.unselectAll();
    }
  }, [selectedNodeId]);

  useEffect(() => {
    if (!focusRequest) return;
    networkRef.current?.focus(focusRequest.id, {
      scale: 1.15,
      animation: { duration: 550, easingFunction: "easeInOutQuad" },
    });
  }, [focusRequest]);

  const activeCount = activeProcesses.size;
  const totalProcesses = DATA.processes.length;
  const watermark =
    activeCount === totalProcesses
      ? "Vista Maestra · Todos los procesos"
      : activeCount === 0
        ? "Sin procesos activos"
        : [...activeProcesses]
            .map((id) => procMap[id]?.label)
            .filter(Boolean)
            .join(" · ");

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" />

      <div className="pointer-events-none absolute left-[15px] top-[15px] z-[2] text-[10.5px] font-medium tracking-[-0.01em] text-[var(--text-lo)]">
        {watermark}
      </div>

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
