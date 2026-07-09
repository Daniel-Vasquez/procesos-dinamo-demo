import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deptMap, nodeMap, procMap, type NodeWithProcess } from "../data/processes";

interface SearchBoxProps {
  /** Called with the node id when the user picks a result. */
  onPick: (id: string) => void;
}

const ALL_NODES: NodeWithProcess[] = Object.values(nodeMap);
const MAX_RESULTS = 8;

/** Lowercase and strip diacritics so "campaña" matches "campana" and vice versa. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function searchNodes(query: string): NodeWithProcess[] {
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return ALL_NODES.filter((n) => {
    const haystack = normalize(
      `${n.label.replace(/\n/g, " ")} ${n.description} ${procMap[n.processId].label} ${deptMap[n.dept].label}`,
    );
    return terms.every((t) => haystack.includes(t));
  }).slice(0, MAX_RESULTS);
}

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export default function SearchBox({ onPick }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => searchNodes(query), [query]);

  useEffect(() => {
    function onGlobalKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    window.addEventListener("keydown", onGlobalKey);
    return () => window.removeEventListener("keydown", onGlobalKey);
  }, []);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const pick = useCallback(
    (id: string) => {
      onPick(id);
      setQuery("");
      setOpen(false);
      inputRef.current?.blur();
    },
    [onPick],
  );

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (results[highlighted]) pick(results[highlighted].id);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className="relative w-[260px]">
      <div className="flex items-center gap-2 rounded-[7px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-[5px] transition-colors focus-within:border-[var(--border2)]">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="shrink-0 text-[var(--text-lo)]"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Buscar nodo…"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlighted(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKeyDown}
          className="w-full bg-transparent text-[11.5px] text-[var(--text-hi)] outline-none placeholder:text-[var(--text-lo)]"
        />
        <kbd className="shrink-0 rounded border border-[var(--border2)] px-[5px] py-px text-[9px] leading-[1.4] text-[var(--text-lo)]">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[70] overflow-hidden rounded-[9px] border border-[var(--border2)] bg-[var(--surface)] shadow-[0_14px_40px_rgba(0,0,0,0.55)]">
          {results.length === 0 ? (
            <div className="px-3 py-2.5 text-[11px] text-[var(--text-lo)]">Sin resultados.</div>
          ) : (
            results.map((n, i) => {
              const dept = deptMap[n.dept];
              const proc = procMap[n.processId];
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => pick(n.id)}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    i === highlighted ? "bg-[#21263C]" : "bg-transparent"
                  }`}
                >
                  <span
                    className="h-[8px] w-[8px] shrink-0 rounded-[2px]"
                    style={{ background: dept.color }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] text-[var(--text-hi)]">
                      {n.label.replace(/\n/g, " ")}
                    </span>
                    <span className="block text-[9.5px] text-[var(--text-lo)]">
                      {proc.label} · {dept.label}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
