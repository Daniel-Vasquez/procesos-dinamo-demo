import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";

interface ResizableSidebarProps {
  children: ReactNode;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  /** Usado en el title/aria-label del botón toggle: "Mostrar {label}" / "Ocultar {label}". */
  label?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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

/**
 * Panel lateral izquierdo colapsable + redimensionable, compartido por las
 * vistas que necesitan una barra lateral (filtros, leyendas, etc.). El
 * contenedor padre debe ser un flex row: al vivir en un `shrink-0` junto a un
 * hermano `flex-1`, el área de contenido se reacomoda sola cuando este panel
 * cambia de ancho o se colapsa, sin necesitar lógica extra.
 */
export default function ResizableSidebar({
  children,
  minWidth = 180,
  maxWidth = 420,
  defaultWidth = 220,
  label = "barra lateral",
}: ResizableSidebarProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [collapsed, setCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const isDraggingRef = useRef(false);
  const movedRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  // El botón de toggle vive dentro del riel de arrastre (no al lado), para que
  // un pointerdown que empiece sobre el botón siga burbujeando hasta aquí.
  // Un pointerup sin desplazamiento relevante se interpreta como "click" (toggle);
  // con desplazamiento, como resize.
  const handleResizeStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDraggingRef.current = true;
      movedRef.current = false;
      startXRef.current = e.clientX;
      startWidthRef.current = width;
      setIsResizing(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [width],
  );

  const handleResizeMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientX - startXRef.current;
      if (Math.abs(delta) > 4) movedRef.current = true;
      if (!collapsed) {
        setWidth(clamp(startWidthRef.current + delta, minWidth, maxWidth));
      }
    },
    [collapsed, minWidth, maxWidth],
  );

  const handleResizeEnd = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (!movedRef.current) {
      setCollapsed((c) => !c);
    }
  }, []);

  const handleToggleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCollapsed((c) => !c);
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
        <div style={{ minWidth }} className="flex flex-col gap-[26px] p-[18px_13px]">
          {children}
        </div>
      </aside>

      <div
        onPointerDown={handleResizeStart}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeEnd}
        className="group relative flex w-[9px] shrink-0 cursor-col-resize touch-none items-center justify-center"
      >
        {!collapsed && (
          <div className="h-full w-px bg-[var(--border)] transition-colors group-hover:bg-[var(--text-lo)]" />
        )}
        <div
          role="button"
          tabIndex={0}
          onKeyDown={handleToggleKeyDown}
          title={collapsed ? `Mostrar ${label}` : `Ocultar ${label}`}
          aria-label={collapsed ? `Mostrar ${label}` : `Ocultar ${label}`}
          style={{ cursor: "pointer" }}
          className="absolute top-1/2 z-20 flex h-[22px] w-[16px] -translate-y-1/2 items-center justify-center rounded-[4px] border border-[var(--border2)] bg-[var(--surface)] text-[var(--text-lo)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text-hi)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--text-lo)]"
        >
          <ChevronIcon collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
}
