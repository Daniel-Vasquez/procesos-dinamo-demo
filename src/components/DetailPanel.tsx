import { DATA, deptMap, nodeMap, procMap } from "../data/processes";
import { edgeStyle } from "../lib/graphStyle";
import {
  NODE_STATUSES,
  STATUS_META,
  type NodeStatus,
  type NodeStatusMap,
} from "../lib/nodeStatus";

interface DetailPanelProps {
  nodeId: string | null;
  onClose: () => void;
  nodeStatuses: NodeStatusMap;
  onSetStatus: (id: string, status: NodeStatus | null) => void;
}

interface ConnRow {
  key: string;
  direction: string;
  arrowColor: string;
  edgeColor: string;
  edgeLabel: string;
  targetId: string;
}

function buildConnections(nodeId: string): ConnRow[] {
  const node = nodeMap[nodeId];
  const proc = procMap[node.processId];
  const rows: ConnRow[] = [];

  proc.edges
    .filter((e) => e.from === nodeId)
    .forEach((e, i) => {
      const style = edgeStyle(e.type);
      rows.push({
        key: `out-${i}`,
        direction: "→",
        arrowColor: "#6A8FAF",
        edgeColor: style.color,
        edgeLabel: e.label,
        targetId: e.to,
      });
    });

  proc.edges
    .filter((e) => e.to === nodeId)
    .forEach((e, i) => {
      const style = edgeStyle(e.type);
      rows.push({
        key: `in-${i}`,
        direction: "←",
        arrowColor: "#6A9A6A",
        edgeColor: style.color,
        edgeLabel: e.label,
        targetId: e.from,
      });
    });

  DATA.crossProcessEdges
    .filter((e) => e.from === nodeId)
    .forEach((e, i) => {
      rows.push({
        key: `cross-out-${i}`,
        direction: "↗",
        arrowColor: "#6060AA",
        edgeColor: "#5A5AAA",
        edgeLabel: "Cross-proceso",
        targetId: e.to,
      });
    });

  DATA.crossProcessEdges
    .filter((e) => e.to === nodeId)
    .forEach((e, i) => {
      rows.push({
        key: `cross-in-${i}`,
        direction: "↙",
        arrowColor: "#6060AA",
        edgeColor: "#5A5AAA",
        edgeLabel: "Cross-proceso",
        targetId: e.from,
      });
    });

  return rows;
}

export default function DetailPanel({ nodeId, onClose, nodeStatuses, onSetStatus }: DetailPanelProps) {
  const node = nodeId ? nodeMap[nodeId] : null;
  const dept = node ? deptMap[node.dept] : null;
  const proc = node ? procMap[node.processId] : null;
  const connections = node ? buildConnections(node.id) : [];
  const isOpen = Boolean(node);
  const currentStatus = node ? (nodeStatuses[node.id] ?? null) : null;

  return (
    <aside
      className={`absolute right-0 top-0 z-[60] flex h-full w-[320px] flex-col border-l border-[var(--border)] bg-[var(--surface)] transition-transform duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isOpen ? "translate-x-0 shadow-[-12px_0_40px_rgba(0,0,0,0.5)]" : "translate-x-full"
      }`}
    >
      {node && dept && proc && (
        <>
          <div className="flex shrink-0 items-start gap-2.5 border-b border-[var(--border)] px-[18px] pb-4 pt-[18px]">
            <div className="min-w-0 flex-1">
              <div
                className="mb-[9px] inline-flex items-center gap-[5px] rounded border px-2 py-[3px] pl-1.5 text-[9px] font-bold uppercase tracking-[0.08em]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: dept.color + "55",
                }}
              >
                <span className="h-[5px] w-[5px] rounded-full" style={{ background: dept.color }} />
                <span>{dept.label}</span>
              </div>
              {currentStatus && (
                <div
                  className="mb-[9px] ml-1.5 inline-flex items-center gap-[5px] rounded border px-2 py-[3px] text-[9px] font-bold uppercase tracking-[0.08em]"
                  style={{
                    background: STATUS_META[currentStatus].color + "1E",
                    borderColor: STATUS_META[currentStatus].color + "66",
                    color: STATUS_META[currentStatus].color,
                  }}
                >
                  <span className="text-[8px] leading-none">{STATUS_META[currentStatus].glyph}</span>
                  <span>{STATUS_META[currentStatus].label}</span>
                </div>
              )}
              <div className="mb-[3px] text-[13.5px] font-semibold leading-[1.4] text-[var(--text-hi)]">
                {node.label.replace(/\n/g, " ")}
              </div>
              <div className="text-[10px] text-[var(--text-lo)]">{proc.label}</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border border-[var(--border)] text-[15px] leading-none text-[var(--text-lo)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text-hi)]"
            >
              ×
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-[18px]">
            <section className="flex flex-col gap-[9px]">
              <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-lo)]">
                Estado
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {NODE_STATUSES.map((status) => {
                  const meta = STATUS_META[status];
                  const active = currentStatus === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      title={active ? "Quitar estado" : `Marcar como ${meta.label.toLowerCase()}`}
                      onClick={() => onSetStatus(node.id, active ? null : status)}
                      className={`flex items-center gap-[7px] rounded-[7px] border px-2.5 py-[7px] text-left text-[11px] font-medium transition-colors ${
                        active
                          ? "text-[var(--text-hi)]"
                          : "border-[var(--border)] bg-[var(--bg)] text-[var(--text-mid)] hover:border-[var(--border2)] hover:text-[var(--text-hi)]"
                      }`}
                      style={
                        active
                          ? { borderColor: meta.color + "88", background: meta.color + "1E" }
                          : undefined
                      }
                    >
                      <span
                        className="flex w-[14px] shrink-0 justify-center text-[9px] leading-none"
                        style={{ color: meta.color }}
                      >
                        {meta.glyph}
                      </span>
                      <span>{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="flex flex-col gap-[9px]">
              <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-lo)]">
                Descripción
              </div>
              <p className="text-[12px] leading-[1.7] text-[var(--text-mid)]">{node.description}</p>
            </section>

            <section className="flex flex-col gap-[9px]">
              <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-lo)]">
                Conexiones
              </div>
              <div className="flex flex-col gap-1">
                {connections.length === 0 && (
                  <div className="text-[11px] text-[var(--text-lo)]">Sin conexiones visibles.</div>
                )}
                {connections.map((row) => {
                  const target = nodeMap[row.targetId];
                  const targetDept = deptMap[target.dept];
                  return (
                    <div
                      key={row.key}
                      className="flex items-center gap-2 rounded-[7px] border border-[var(--border)] bg-[var(--bg)] px-2.5 py-2"
                    >
                      <span
                        className="w-[13px] shrink-0 text-center text-[10px] font-semibold"
                        style={{ color: row.arrowColor }}
                      >
                        {row.direction}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 text-[9.5px] font-medium" style={{ color: row.edgeColor }}>
                          {row.edgeLabel}
                        </div>
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] text-[var(--text-hi)]">
                          {target.label.replace(/\n/g, " ")}
                        </div>
                      </div>
                      <span
                        title={targetDept.label}
                        className="h-[7px] w-[7px] shrink-0 rounded-[2px]"
                        style={{ background: targetDept.color }}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </>
      )}
    </aside>
  );
}
