import { departments } from "./departments";
import { parrillas } from "./processes/parrillas";
import { web } from "./processes/web";
import { campanas } from "./processes/campanas";
import { crossProcessEdges } from "./crossProcessEdges";
import type { Department, ProcessDefinition, ProcessGraphData, ProcessNode } from "./types";

/**
 * Punto único de edición para agregar procesos nuevos: crea un archivo en
 * `./processes/<nombre>.ts` con un `ProcessDefinition` y agrégalo a este
 * arreglo. Ningún componente necesita tocarse — todos leen de `DATA` y de
 * los lookups exportados abajo.
 */
export const DATA: ProcessGraphData = {
  departments,
  processes: [parrillas, web, campanas],
  crossProcessEdges,
};

export const deptMap: Record<string, Department> = Object.fromEntries(
  DATA.departments.map((d) => [d.id, d]),
);

export const procMap: Record<string, ProcessDefinition> = Object.fromEntries(
  DATA.processes.map((p) => [p.id, p]),
);

export interface NodeWithProcess extends ProcessNode {
  processId: string;
}

export const nodeMap: Record<string, NodeWithProcess> = Object.fromEntries(
  DATA.processes.flatMap((p) => p.nodes.map((n) => [n.id, { ...n, processId: p.id }])),
);

export const totalNodeCount = DATA.processes.reduce((sum, p) => sum + p.nodes.length, 0);
export const totalEdgeCount =
  DATA.processes.reduce((sum, p) => sum + p.edges.length, 0) + DATA.crossProcessEdges.length;
