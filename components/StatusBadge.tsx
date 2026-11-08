import { STATUS_META, type Status } from "@/lib/status";

export function StatusDot({ status, className = "" }: { status: Status; className?: string }) {
  return (
    <span className={`relative inline-flex h-3 w-3 ${className}`} aria-hidden>
      {status !== "ok" && (
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${STATUS_META[status].dot}`} />
      )}
      <span className={`relative inline-flex h-3 w-3 rounded-full ${STATUS_META[status].dot}`} />
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
