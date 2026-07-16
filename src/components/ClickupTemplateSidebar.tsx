import { useCallback, useRef, useState } from "react";
import type { ClickupArea, ClickupProcessTemplate } from "../data/clickupTemplate";
import FilterPill from "./FilterPill";

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

const MIN_WIDTH = 180;
const MAX_WIDTH = 420;
const DEFAULT_WIDTH = 220;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={collapsed ? "" : "rotate-180"}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
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
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [collapsed, setCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleResizeStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startWidthRef.current = width;
      setIsResizing(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [width],
  );

  const handleResizeMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - startXRef.current;
    setWidth(clamp(startWidthRef.current + delta, MIN_WIDTH, MAX_WIDTH));
  }, []);

  const handleResizeEnd = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  return (
    <div className="relative flex h-full shrink-0">
      <aside
        style={{ width: collapsed ? 0 : width }}
        className={`z-10 flex flex-col overflow-y-auto overflow-x-hidden border-[var(--border)] bg-[var(--surface)] ${
          collapsed ? "border-r-0" : "border-r"
        } ${isResizing ? "" : "transition-[width] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)]"}`}
      >
        <div style={{ minWidth: MIN_WIDTH }} className="flex flex-col gap-[26px] p-[18px_13px]">
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
        </div>
      </aside>

      <div className="relative flex w-[9px] shrink-0 items-center justify-center">
        {!collapsed && (
          <div
            onPointerDown={handleResizeStart}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
            className="group absolute inset-y-0 left-1/2 flex w-[9px] -translate-x-1/2 cursor-col-resize touch-none items-center justify-center"
          >
            <div className="h-full w-px bg-[var(--border)] transition-colors group-hover:bg-[var(--text-lo)]" />
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Mostrar barra de opciones" : "Ocultar barra de opciones"}
          className="absolute top-3 z-20 flex h-[22px] w-[16px] items-center justify-center rounded-[4px] border border-[var(--border2)] bg-[var(--surface)] text-[var(--text-lo)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text-hi)]"
        >
          <ChevronIcon collapsed={collapsed} />
        </button>
      </div>
    </div>
  );
}
