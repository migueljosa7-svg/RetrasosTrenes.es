import Link from "next/link";
import { getNucleo, lineHref, type Line } from "@/data/lines";
import { STATUS_META } from "@/lib/status";
import { hhmm, timeAgo } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

export function LineCard({ line, showNucleo = true }: { line: Line; showNucleo?: boolean }) {
  const m = STATUS_META[line.status];
  const nucleo = getNucleo(line.nucleo);
  const delay =
    line.status === "danger" ? "Sin servicio" : line.delayMin > 0 ? `+${line.delayMin} min` : "Sin retraso";

  return (
    <Link
      href={lineHref(line)}
      className={`group block rounded-2xl border bg-neutral-900 p-4 transition active:scale-[0.99] hover:bg-neutral-800/80 ${m.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-lg font-black tracking-tight text-neutral-950">
            {line.code}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-neutral-100">
              {line.terminals[0]} – {line.terminals[1]}
            </p>
            {showNucleo && <p className="text-xs text-neutral-400">{nucleo?.name}</p>}
          </div>
        </div>
        <StatusBadge status={line.status} />
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className={`text-2xl font-extrabold ${m.text}`}>{delay}</span>
        <span className="text-xs text-neutral-500">
          Último aviso {hhmm(line.updatedAt)} · {timeAgo(line.updatedAt)}
        </span>
      </div>
      <p className="mt-1 text-sm text-neutral-300">{line.reason}</p>
    </Link>
  );
}
