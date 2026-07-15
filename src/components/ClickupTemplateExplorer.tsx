import { useCallback, useState } from "react";
import { AREAS, PEOPLE, TASKS } from "../data/clickupTemplate";
import ClickupTemplateGraph from "./ClickupTemplateGraph";
import ClickupTemplateSidebar from "./ClickupTemplateSidebar";

function toggleInSet(prev: Set<string>, id: string): Set<string> {
  const next = new Set(prev);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

const peopleCount = PEOPLE.filter((p) => p.id !== "unassigned").length;

export default function ClickupTemplateExplorer() {
  const [activeAreas, setActiveAreas] = useState<Set<string>>(() => new Set(AREAS.map((a) => a.id)));

  const toggleArea = useCallback((id: string) => {
    setActiveAreas((prev) => toggleInSet(prev, id));
  }, []);
  const activateAllAreas = useCallback(() => {
    setActiveAreas(new Set(AREAS.map((a) => a.id)));
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--bg)] text-[var(--text-hi)]">
      <header className="flex h-14 min-h-14 shrink-0 items-center gap-3.5 border-b border-[var(--border)] bg-[var(--bg)] px-[22px]">
        <h1 className="text-sm font-semibold tracking-[-0.02em] text-[var(--text-hi)]">
          Plantilla Landing Dev
        </h1>
        <div className="h-[18px] w-px shrink-0 bg-[var(--border2)]" />
        <span className="text-[11px] font-normal text-[var(--text-lo)]">
          ClickUp · dínamo 2026 / Plantillas Dev 2025
        </span>
        <div className="ml-auto flex items-center gap-[5px] rounded-[5px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] text-[var(--text-lo)]">
          <div className="h-[5px] w-[5px] rounded-full bg-[#3A7A3A]" />
          {TASKS.length} tareas &nbsp;·&nbsp; {peopleCount} personas &nbsp;·&nbsp; {AREAS.length} áreas
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <ClickupTemplateSidebar
          activeAreas={activeAreas}
          onToggleArea={toggleArea}
          onActivateAll={activateAllAreas}
        />
        <div className="relative flex-1 overflow-hidden">
          <ClickupTemplateGraph activeAreas={activeAreas} />
        </div>
      </div>
    </div>
  );
}
