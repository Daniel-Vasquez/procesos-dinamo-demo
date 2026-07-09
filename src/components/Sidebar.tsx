import { DATA } from "../data/processes";
import { EDGE_TYPE_LABELS, TRACKED_EDGE_TYPES, type TrackedEdgeType, edgeStyle } from "../lib/graphStyle";
import FilterPill from "./FilterPill";

interface SidebarProps {
  activeProcesses: Set<string>;
  activeDepts: Set<string>;
  activeEdgeTypes: Set<string>;
  onToggleProcess: (id: string) => void;
  onActivateAllProcesses: () => void;
  onToggleDept: (id: string) => void;
  onActivateAllDepts: () => void;
  onToggleEdgeType: (type: string) => void;
  onActivateAllEdgeTypes: () => void;
}

const EDGE_BORDER_STYLE: Record<TrackedEdgeType, "solid" | "dashed" | "dotted"> = {
  handoff: "solid",
  approval: "solid",
  feedback: "dashed",
  review: "dashed",
  cross: "dotted",
};

function Dot({ color, active, square = false }: { color: string; active: boolean; square?: boolean }) {
  return (
    <span
      className={`shrink-0 transition-opacity ${square ? "h-[9px] w-[9px] rounded-[3px]" : "h-[7px] w-[7px] rounded-full"}`}
      style={{ background: color, opacity: active ? 1 : 0.3 }}
    />
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-[7px] text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-lo)]">
      {children}
    </div>
  );
}

export default function Sidebar({
  activeProcesses,
  activeDepts,
  activeEdgeTypes,
  onToggleProcess,
  onActivateAllProcesses,
  onToggleDept,
  onActivateAllDepts,
  onToggleEdgeType,
  onActivateAllEdgeTypes,
}: SidebarProps) {
  return (
    <aside className="z-10 flex w-[220px] min-w-[220px] shrink-0 flex-col gap-[26px] overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] p-[18px_13px]">
      <div>
        <SectionLabel>Vista</SectionLabel>
        <div className="flex flex-col gap-0.5">
          <FilterPill
            active={false}
            color="#5A5A6A"
            label="Activar todos"
            onClick={onActivateAllProcesses}
            swatch={<Dot color="#5A5A6A" active />}
          />
          {DATA.processes.map((proc) => (
            <FilterPill
              key={proc.id}
              active={activeProcesses.has(proc.id)}
              color={proc.color}
              label={proc.label}
              onClick={() => onToggleProcess(proc.id)}
              swatch={<Dot color={proc.color} active={activeProcesses.has(proc.id)} />}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Departamentos</SectionLabel>
        <div className="mb-1 flex flex-col gap-0.5">
          <FilterPill
            active={false}
            color="#6A7090"
            label="Activar todos"
            onClick={onActivateAllDepts}
            swatch={<Dot color="#6A7090" active square />}
          />
        </div>
        <div className="flex flex-col gap-0.5">
          {DATA.departments.map((dept) => (
            <FilterPill
              key={dept.id}
              active={activeDepts.has(dept.id)}
              color={dept.color}
              label={dept.label}
              onClick={() => onToggleDept(dept.id)}
              swatch={<Dot color={dept.color} active={activeDepts.has(dept.id)} square />}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Tipo de conexión</SectionLabel>
        <div className="mb-1 flex flex-col gap-0.5">
          <FilterPill
            active={false}
            color="#6A7090"
            label="Activar todos"
            onClick={onActivateAllEdgeTypes}
            swatch={<Dot color="#6A7090" active />}
          />
        </div>
        <div className="flex flex-col gap-0.5">
          {TRACKED_EDGE_TYPES.map((type) => {
            const active = activeEdgeTypes.has(type);
            const style = edgeStyle(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => onToggleEdgeType(type)}
                className={`flex w-full items-center gap-[9px] rounded-[7px] border px-2.5 py-[7px] text-left text-[11.5px] font-medium transition-colors ${
                  active
                    ? "border-[var(--border2)] bg-[#21263C] text-[var(--text-hi)]"
                    : "border-transparent bg-transparent text-[var(--text-mid)] opacity-35 hover:bg-[var(--surface2)] hover:text-[var(--text-hi)] hover:opacity-100"
                }`}
              >
                <span
                  className="h-0 w-6 shrink-0"
                  style={{
                    borderTop: `2px ${EDGE_BORDER_STYLE[type]} ${style.color}`,
                  }}
                />
                <span>{EDGE_TYPE_LABELS[type]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
