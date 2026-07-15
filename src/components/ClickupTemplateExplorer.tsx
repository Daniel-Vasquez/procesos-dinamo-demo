import { useCallback, useState } from "react";
import type { ClickupTemplateData } from "../data/clickupTemplate";
import ClickupTemplateGraph from "./ClickupTemplateGraph";
import ClickupTemplateSidebar from "./ClickupTemplateSidebar";
import PageNav from "./PageNav";

interface ClickupTemplateExplorerProps {
  data: ClickupTemplateData;
}

function toggleInSet(prev: Set<string>, id: string): Set<string> {
  const next = new Set(prev);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export default function ClickupTemplateExplorer({ data }: ClickupTemplateExplorerProps) {
  const { areas, templates, people, tasks, areaMap, personMap, templateMap } = data;
  const peopleCount = people.filter((p) => p.id !== "unassigned").length;

  const [activeAreas, setActiveAreas] = useState<Set<string>>(() => new Set(areas.map((a) => a.id)));
  const [activeTemplates, setActiveTemplates] = useState<Set<string>>(
    () => new Set(templates.map((t) => t.id)),
  );

  const toggleArea = useCallback((id: string) => {
    setActiveAreas((prev) => toggleInSet(prev, id));
  }, []);
  const activateAllAreas = useCallback(() => {
    setActiveAreas(new Set(areas.map((a) => a.id)));
  }, [areas]);

  const toggleTemplate = useCallback((id: string) => {
    setActiveTemplates((prev) => toggleInSet(prev, id));
  }, []);
  const activateAllTemplates = useCallback(() => {
    setActiveTemplates(new Set(templates.map((t) => t.id)));
  }, [templates]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--bg)] text-[var(--text-hi)]">
      <header className="flex h-14 min-h-14 shrink-0 items-center gap-3.5 border-b border-[var(--border)] bg-[var(--bg)] px-[22px]">
        <h1 className="text-sm font-semibold tracking-[-0.02em] text-[var(--text-hi)]">
          Plantillas Dev 2025
        </h1>
        <div className="h-[18px] w-px shrink-0 bg-[var(--border2)]" />
        <span className="text-[11px] font-normal text-[var(--text-lo)]">
          ClickUp · dínamo 2026 / Plantillas Dev 2025
        </span>
        <PageNav currentPath="/clickup-plantilla-landing" />
        <div className="ml-auto flex items-center gap-[5px] rounded-[5px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] text-[var(--text-lo)]">
          <div className="h-[5px] w-[5px] rounded-full bg-[#3A7A3A]" />
          {tasks.length} tareas &nbsp;·&nbsp; {peopleCount} personas &nbsp;·&nbsp; {areas.length} áreas
          &nbsp;·&nbsp; {templates.length} plantillas
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <ClickupTemplateSidebar
          areas={areas}
          templates={templates}
          activeAreas={activeAreas}
          onToggleArea={toggleArea}
          onActivateAllAreas={activateAllAreas}
          activeTemplates={activeTemplates}
          onToggleTemplate={toggleTemplate}
          onActivateAllTemplates={activateAllTemplates}
        />
        <div className="relative flex-1 overflow-hidden">
          <ClickupTemplateGraph
            areas={areas}
            people={people}
            tasks={tasks}
            areaMap={areaMap}
            personMap={personMap}
            templateMap={templateMap}
            activeAreas={activeAreas}
            activeTemplates={activeTemplates}
          />
        </div>
      </div>
    </div>
  );
}
