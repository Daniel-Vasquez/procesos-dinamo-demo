interface PageNavProps {
  currentPath: string;
}

const LINKS = [
  { href: "/", label: "Procesos" },
  { href: "/clickup-plantilla-landing", label: "Plantillas ClickUp" },
];

export default function PageNav({ currentPath }: PageNavProps) {
  return (
    <nav className="flex items-center gap-1">
      {LINKS.map((link) => {
        const active = currentPath === link.href;
        return (
          <a
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-[6px] px-2.5 py-[5px] text-[11px] font-medium transition-colors ${
              active
                ? "bg-[var(--surface2)] text-[var(--text-hi)]"
                : "text-[var(--text-lo)] hover:bg-[var(--surface2)] hover:text-[var(--text-hi)]"
            }`}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
