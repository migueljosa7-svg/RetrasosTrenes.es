export type Status = "ok" | "warn" | "danger";

// Clases como literales completos para que Tailwind las detecte (tailwind.config incluye ./lib).
export const STATUS_META: Record<
  Status,
  { label: string; short: string; dot: string; glow: string; cardGlow: string; badge: string; border: string; text: string }
> = {
  ok: {
    label: "Servicio Normal / Sin Incidencias",
    short: "Servicio normal",
    dot: "bg-emerald-400",
    glow: "shadow-[0_0_10px_2px_rgba(52,211,153,0.6)]",
    cardGlow: "shadow-[0_0_28px_-12px_rgba(52,211,153,0.5)]",
    badge: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/40",
    border: "border-emerald-500/30",
    text: "text-emerald-300",
  },
  warn: {
    label: "Retrasos Leves / Frecuencia Alterada",
    short: "Retrasos leves",
    dot: "bg-amber-400",
    glow: "shadow-[0_0_10px_2px_rgba(251,191,36,0.65)]",
    cardGlow: "shadow-[0_0_28px_-10px_rgba(251,191,36,0.55)]",
    badge: "bg-amber-500/15 text-amber-300 ring-amber-500/40",
    border: "border-amber-500/40",
    text: "text-amber-300",
  },
  danger: {
    label: "Incidencia Grave / Suspensión de Servicio",
    short: "Incidencia grave",
    dot: "bg-red-500",
    glow: "shadow-[0_0_12px_3px_rgba(239,68,68,0.75)]",
    cardGlow: "shadow-[0_0_30px_-8px_rgba(239,68,68,0.65)]",
    badge: "bg-red-500/15 text-red-300 ring-red-500/40",
    border: "border-red-500/50",
    text: "text-red-300",
  },
};

const RANK: Record<Status, number> = { ok: 0, warn: 1, danger: 2 };
export const worstStatus = (list: Status[]): Status =>
  list.reduce<Status>((acc, s) => (RANK[s] > RANK[acc] ? s : acc), "ok");
