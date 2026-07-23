import { useCallback, useEffect, useState } from "react";
import { isCompletedStatus, type AmatzaTimelineData } from "../data/amatzaTeam";
import AmatzaTimelineGraph from "./AmatzaTimelineGraph";
import PageNav from "./PageNav";
import RefreshButton, { type RefreshState } from "./RefreshButton";

interface AmatzaTimelineProps {
  data: AmatzaTimelineData;
}

const POLL_INTERVAL_MS = 20_000;

export default function AmatzaTimeline({ data: initialData }: AmatzaTimelineProps) {
  const [data, setData] = useState(initialData);
  const [refreshState, setRefreshState] = useState<RefreshState>("idle");
  const { tasks, team, teamMap } = data;
  const completedCount = tasks.filter((t) => isCompletedStatus(t.statusType)).length;

  const fetchLatest = useCallback(async (): Promise<AmatzaTimelineData> => {
    const res = await fetch("/api/clickup/amatza-timeline");
    if (!res.ok) throw new Error(`ClickUp respondió ${res.status}`);
    return (await res.json()) as AmatzaTimelineData;
  }, []);

  const checkForChanges = useCallback(async () => {
    setRefreshState("loading");
    try {
      const fresh = await fetchLatest();
      setData(fresh);
      setRefreshState("idle");
    } catch {
      setRefreshState("error");
    }
  }, [fetchLatest]);

  // Trae el estado más reciente de ClickUp periódicamente para que, si una
  // tarea pasa de PENDIENTE a COMPLETADO (o cambia de estatus) en ClickUp, la
  // línea del tiempo se actualice sola sin que alguien tenga que refrescar.
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatest()
        .then(setData)
        .catch(() => {
          // Falla silenciosa en el polling de fondo; "Revisar cambios" sí reporta el error.
        });
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchLatest]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--bg)] text-[var(--text-hi)]">
      <header className="flex h-14 min-h-14 shrink-0 items-center gap-3.5 border-b border-[var(--border)] bg-[var(--bg)] px-[22px]">
        <h1 className="text-sm font-semibold tracking-[-0.02em] text-[var(--text-hi)]">Amatza · One page</h1>
        <div className="h-[18px] w-px shrink-0 bg-[var(--border2)]" />
        <span className="text-[11px] font-normal text-[var(--text-lo)]">ClickUp · dínamo 2026 / Amatza / One page</span>
        <PageNav currentPath="/amatza-timeline" />
        <div className="ml-auto flex items-center gap-2.5">
          <RefreshButton state={refreshState} onClick={checkForChanges} />
          <div className="flex items-center gap-[5px] rounded-[5px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] text-[var(--text-lo)]">
            <div className="h-[5px] w-[5px] rounded-full bg-[#3A7A3A]" />
            {completedCount}/{tasks.length} completadas &nbsp;·&nbsp; {team.length} personas
          </div>
        </div>
      </header>
      <div className="relative flex-1 overflow-hidden">
        <AmatzaTimelineGraph tasks={tasks} team={team} teamMap={teamMap} />
      </div>
    </div>
  );
}
