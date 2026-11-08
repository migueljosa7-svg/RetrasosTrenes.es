import Link from "next/link";
import type { FeedIncident, Incident } from "@/data/lines";
import { hhmm, timeAgo } from "@/lib/format";
import { STATUS_META } from "@/lib/status";
import { StatusDot } from "./StatusBadge";

type Item = Incident & Partial<Pick<FeedIncident, "href" | "scope" | "nucleoName">>;

export function IncidentList({ items, empty = "Sin avisos registrados hoy." }: { items: Item[]; empty?: string }) {
  if (!items.length) return <p className="rounded-xl bg-neutral-900 p-4 text-sm text-neutral-400">{empty}</p>;
  return (
    <ol className="space-y-3">
      {items.map((i) => (
        <li key={i.id} className={`rounded-2xl border bg-neutral-900 p-4 ${STATUS_META[i.status].border}`}>
          <div className="flex items-center justify-between gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-2">
              <StatusDot status={i.status} />
              {i.scope ? `${i.scope} · ${i.nucleoName}` : STATUS_META[i.status].short}
            </span>
            <time dateTime={i.at}>
              {hhmm(i.at)} · {timeAgo(i.at)}
            </time>
          </div>
          <h3 className="mt-2 font-semibold text-neutral-50">
            {i.href ? (
              <Link href={i.href} className="hover:text-sky-300">
                {i.title}
              </Link>
            ) : (
              i.title
            )}
          </h3>
          <p className="mt-1 text-sm text-neutral-300">{i.detail}</p>
        </li>
      ))}
    </ol>
  );
}
