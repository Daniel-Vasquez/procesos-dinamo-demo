import type { ClickupArea, ClickupProcessTemplate } from "../data/clickupTemplate";
import FilterPill from "./FilterPill";
import ResizableSidebar from "./ResizableSidebar";

interface ClickupTemplateSidebarProps {
  areas: ClickupArea[];
  templates: ClickupProcessTemplate[];
  activeAreas: Set<string>;
  onToggleArea: (id: string) => void;
  onActivateAllAreas: () => void;
  activeTemplates: Set<string>;
  onToggleTemplate: (id: string) => void;
  onActivateAllTemplates: () => void;
}

function Dot({ color, active }: { color: string; active: boolean }) {
  return (
    <span
      className="h-[7px] w-[7px] shrink-0 rounded-full transition-opacity"
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

export default function ClickupTemplateSidebar({
  areas,
  templates,
  activeAreas,
  onToggleArea,
  onActivateAllAreas,
  activeTemplates,
  onToggleTemplate,
  onActivateAllTemplates,
}: ClickupTemplateSidebarProps) {
  return (
    <ResizableSidebar label="barra de opciones">
      <div>
        <SectionLabel>Plantillas</SectionLabel>
        <div className="mb-1 flex flex-col gap-0.5">
          <FilterPill
            active={false}
            color="#6A7090"
            label="Activar todas"
            onClick={onActivateAllTemplates}
            swatch={<Dot color="#6A7090" active />}
          />
        </div>
        <div className="flex flex-col gap-0.5">
          {templates.map((template) => (
            <FilterPill
              key={template.id}
              active={activeTemplates.has(template.id)}
              color={template.color}
              label={template.label}
              onClick={() => onToggleTemplate(template.id)}
              swatch={<Dot color={template.color} active={activeTemplates.has(template.id)} />}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Áreas</SectionLabel>
        <div className="mb-1 flex flex-col gap-0.5">
          <FilterPill
            active={false}
            color="#6A7090"
            label="Activar todas"
            onClick={onActivateAllAreas}
            swatch={<Dot color="#6A7090" active />}
          />
        </div>
        <div className="flex flex-col gap-0.5">
          {areas.map((area) => (
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
    </ResizableSidebar>
  );
}
