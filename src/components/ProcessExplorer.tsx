import { useCallback, useState } from "react";
import { DATA } from "../data/processes";
import { TRACKED_EDGE_TYPES } from "../lib/graphStyle";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ProcessGraph from "./ProcessGraph";
import DetailPanel from "./DetailPanel";

function toggleInSet(prev: Set<string>, id: string): Set<string> {
  const next = new Set(prev);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

/** Top-level state owner for filters and node selection; mounted as a single client:load island. */
export default function ProcessExplorer() {
  const [activeProcesses, setActiveProcesses] = useState<Set<string>>(
    () => new Set(DATA.processes.map((p) => p.id)),
  );
  const [activeDepts, setActiveDepts] = useState<Set<string>>(
    () => new Set(DATA.departments.map((d) => d.id)),
  );
  const [activeEdgeTypes, setActiveEdgeTypes] = useState<Set<string>>(
    () => new Set(TRACKED_EDGE_TYPES),
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  /** token bumps on every search pick so re-picking the same node re-focuses it. */
  const [focusRequest, setFocusRequest] = useState<{ id: string; token: number } | null>(null);

  const toggleProcess = useCallback((id: string) => {
    setActiveProcesses((prev) => toggleInSet(prev, id));
  }, []);
  const activateAllProcesses = useCallback(() => {
    setActiveProcesses(new Set(DATA.processes.map((p) => p.id)));
  }, []);

  const toggleDept = useCallback((id: string) => {
    setActiveDepts((prev) => toggleInSet(prev, id));
  }, []);
  const activateAllDepts = useCallback(() => {
    setActiveDepts(new Set(DATA.departments.map((d) => d.id)));
  }, []);

  const toggleEdgeType = useCallback((type: string) => {
    setActiveEdgeTypes((prev) => toggleInSet(prev, type));
  }, []);
  const activateAllEdgeTypes = useCallback(() => {
    setActiveEdgeTypes(new Set(TRACKED_EDGE_TYPES));
  }, []);

  const closePanel = useCallback(() => setSelectedNodeId(null), []);

  const handleSearchPick = useCallback((id: string) => {
    setSelectedNodeId(id);
    setFocusRequest((prev) => ({ id, token: (prev?.token ?? 0) + 1 }));
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--bg)] text-[var(--text-hi)]">
      <Header onSearchPick={handleSearchPick} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeProcesses={activeProcesses}
          activeDepts={activeDepts}
          activeEdgeTypes={activeEdgeTypes}
          onToggleProcess={toggleProcess}
          onActivateAllProcesses={activateAllProcesses}
          onToggleDept={toggleDept}
          onActivateAllDepts={activateAllDepts}
          onToggleEdgeType={toggleEdgeType}
          onActivateAllEdgeTypes={activateAllEdgeTypes}
        />
        <div className="relative flex-1 overflow-hidden">
          <ProcessGraph
            activeProcesses={activeProcesses}
            activeDepts={activeDepts}
            activeEdgeTypes={activeEdgeTypes}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            focusRequest={focusRequest}
          />
          <DetailPanel nodeId={selectedNodeId} onClose={closePanel} />
        </div>
      </div>
    </div>
  );
}
