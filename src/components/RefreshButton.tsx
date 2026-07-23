export type RefreshState = "idle" | "loading" | "error";

interface RefreshButtonProps {
  state: RefreshState;
  onClick: () => void;
  errorMessage?: string;
}

/** Botón "Revisar cambios" compartido por las vistas que traen datos en vivo de ClickUp. */
export default function RefreshButton({ state, onClick, errorMessage = "No se pudo consultar ClickUp" }: RefreshButtonProps) {
  return (
    <>
      {state === "error" && <span className="text-[10px] text-[#E0635A]">{errorMessage}</span>}
      <button
        type="button"
        onClick={onClick}
        disabled={state === "loading"}
        className="rounded-[5px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-mid)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text-hi)] disabled:opacity-60"
      >
        {state === "loading" ? "Revisando…" : "Revisar cambios"}
      </button>
    </>
  );
}
