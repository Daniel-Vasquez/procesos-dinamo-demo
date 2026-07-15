import { DATA, totalEdgeCount, totalNodeCount } from "../data/processes";
import PageNav from "./PageNav";
import SearchBox from "./SearchBox";

interface HeaderProps {
  onSearchPick: (nodeId: string) => void;
}

export default function Header({ onSearchPick }: HeaderProps) {
  return (
    <header className="flex h-14 min-h-14 shrink-0 items-center gap-3.5 border-b border-[var(--border)] bg-[var(--bg)] px-[22px]">
      <h1 className="text-sm font-semibold tracking-[-0.02em] text-[var(--text-hi)]">
        Process Network
      </h1>
      <div className="h-[18px] w-px shrink-0 bg-[var(--border2)]" />
      <span className="text-[11px] font-normal text-[var(--text-lo)]">
        Agencia de Marketing Digital &nbsp;·&nbsp; {DATA.processes.length} procesos &nbsp;·&nbsp;{" "}
        {DATA.departments.length} departamentos
      </span>
      <PageNav currentPath="/" />
      <div className="ml-auto">
        <SearchBox onPick={onSearchPick} />
      </div>
      <div className="flex items-center gap-[5px] rounded-[5px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] text-[var(--text-lo)]">
        <div className="h-[5px] w-[5px] rounded-full bg-[#3A7A3A]" />
        {totalNodeCount} nodos &nbsp;·&nbsp; {totalEdgeCount} conexiones
      </div>
    </header>
  );
}
