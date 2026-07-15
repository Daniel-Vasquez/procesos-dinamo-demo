import { AREAS } from "../data/clickupTemplate";
import FilterPill from "./FilterPill";

interface ClickupTemplateSidebarProps {
  activeAreas: Set<string>;
  onToggleArea: (id: string) => void;
  onActivateAll: () => void;
}

function Dot({ color, active }: { color: string; active: boolean }) {
  return (
    <span
      className="h-[7px] w-[7px] shrink-0 rounded-full transition-opacity"
      style={{ background: color, opacity: active ? 1 : 0.3 }}
    />
  );
}

export default function ClickupTemplateSidebar({
  activeAreas,
  onToggleArea,
  onActivateAll,
}: ClickupTemplateSidebarProps) {
  return (
    <aside className="z-10 flex w-[220px] min-w-[220px] shrink-0 flex-col gap-[26px] overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] p-[18px_13px]">
      <div>
        <div className="mb-[7px] text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-lo)]">
          Áreas
        </div>
        <div className="mb-1 flex flex-col gap-0.5">
          <FilterPill
            active={false}
            color="#6A7090"
            label="Activar todas"
            onClick={onActivateAll}
            swatch={<Dot color="#6A7090" active />}
          />
        </div>
        <div className="flex flex-col gap-0.5">
          {AREAS.map((area) => (
            <FilterPill
              key={area.id}
              active={activeAreas.has(area.id)}
              color={area.color}
              label={area.label}
              onClick={() => onToggleArea(area.id)}
              swatch={<Dot color={area.color} active={activeAreas.has(area.id)} />}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
