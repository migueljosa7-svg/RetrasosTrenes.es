import { STATUS_META, type Status } from "@/lib/status";

/** Semáforo con halo de neón; pulso suave si hay incidencia y parpadeo más marcado si es grave. */
export function StatusDot({ status, className = "" }: { status: Status; className?: string }) {
  const m = STATUS_META[status];
  return (
    <span className={`relative inline-flex h-3 w-3 shrink-0 ${className}`} aria-hidden>
      {status !== "ok" && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${m.dot}`} />}
      <span className={`relative inline-flex h-3 w-3 rounded-full ${m.dot} ${m.glow} ${status === "danger" ? "animate-pulse" : ""}`} />
    </span>
  );
}

export function StatusBadge({ status, full = false }: { status: Status; full?: boolean }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${m.badge}`}>
      <StatusDot status={status} />
      {full ? m.label : m.short}
    </span>
  );
}
