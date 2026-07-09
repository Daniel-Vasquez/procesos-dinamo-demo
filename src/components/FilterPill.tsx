import type { ReactNode } from "react";

interface FilterPillProps {
  active: boolean;
  color: string;
  label: string;
  onClick: () => void;
  /** Leading visual: a dot for processes/departments, a line preview for edge types. */
  swatch: ReactNode;
}

/** Shared multi-toggle pill used by the process, department and edge-type filter groups. */
export default function FilterPill({ active, color, label, onClick, swatch }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={active ? { borderLeftColor: color } : undefined}
      className={`flex w-full items-center gap-2 rounded-[7px] border px-2.5 py-[7px] text-left text-[11.5px] font-medium transition-colors ${
        active
          ? "border-[var(--border2)] border-l-[2.5px] bg-[#1C1C22] text-[var(--text-hi)]"
          : "border-transparent bg-transparent text-[var(--text-mid)] hover:bg-[var(--surface2)] hover:text-[var(--text-hi)]"
      }`}
    >
      {swatch}
      <span>{label}</span>
    </button>
  );
}
