import { Suspense } from "react";
import Link from "next/link";
import { allIncidents, buildSearchIndex, lines, nucleos, linesByNucleo, nucleoStatus } from "@/data/lines";
import { LineFeed } from "@/components/LineFeed";
import { IncidentList } from "@/components/IncidentList";
import { SearchBox } from "@/components/SearchBox";
import { StatusDot } from "@/components/StatusBadge";
import { TopBanner } from "@/components/Header";
import { STATUS_META, worstStatus } from "@/lib/status";

export const revalidate = 60; // ISR: regenera como máximo cada minuto

export default function HomePage() {
  const overall = worstStatus(lines.map((l) => l.status));
  const counts = {
    ok: lines.filter((l) => l.status === "ok").length,
    warn: lines.filter((l) => l.status === "warn").length,
    danger: lines.filter((l) => l.status === "danger").length,
  };
  const urgent = allIncidents()
    .filter((i) => i.status === "danger")
    .slice(0, 3);
  // Primero las líneas con problemas
  const rank = { danger: 0, warn: 1, ok: 2 } as const;
  const sorted = [...lines].sort((a, b) => rank[a.status] - rank[b.status]);

  return (
    <>
      <TopBanner />

      <section>
        <h1 className="text-2xl font-black leading-tight text-neutral-50 sm:text-3xl">
          Retrasos de Cercanías y trenes hoy en España
        </h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-neutral-300">
          <StatusDot status={overall} />
          Estado general de la red: <strong className={STATUS_META[overall].text}>{STATUS_META[overall].short}</strong>
        </p>
      </section>

      <section className="mt-4">
        <Suspense fallback={<div className="h-14 rounded-2xl bg-neutral-900" />}>
          <SearchBox items={buildSearchIndex()} />
        </Suspense>
      </section>

      <section aria-label="Resumen" className="mt-4 grid grid-cols-3 gap-2 text-center">
        {(["ok", "warn", "danger"] as const).map((s) => (
          <div key={s} className={`rounded-2xl border bg-neutral-900 p-3 ${STATUS_META[s].border}`}>
            <p className={`text-3xl font-black ${STATUS_META[s].text}`}>{counts[s]}</p>
            <p className="text-[11px] leading-tight text-neutral-400">{STATUS_META[s].short}</p>
          </div>
        ))}
      </section>

      {urgent.length > 0 && (
        <section className="mt-6" aria-labelledby="urgentes">
          <h2 id="urgentes" className="mb-2 text-lg font-bold text-red-300">
            Alertas urgentes de hoy
          </h2>
          <IncidentList items={urgent} />
          <Link href="/incidencias" className="mt-2 inline-block text-sm text-sky-300 hover:underline">
            Ver todas las incidencias en directo →
          </Link>
        </section>
      )}

      <section className="mt-6" aria-labelledby="nucleos">
        <h2 id="nucleos" className="mb-2 text-lg font-bold text-neutral-50">
          Cercanías por núcleo urbano
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {nucleos.map((n) => (
            <Link
              key={n.slug}
              href={`/cercanias/${n.slug}`}
              className={`rounded-2xl border bg-neutral-900 p-4 hover:bg-neutral-800 ${STATUS_META[nucleoStatus(n.slug)].border}`}
            >
              <span className="flex items-center gap-2 font-bold text-neutral-50">
                <StatusDot status={nucleoStatus(n.slug)} />
                {n.name}
              </span>
              <span className="mt-1 block text-xs text-neutral-400">{linesByNucleo(n.slug).length} líneas</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6" aria-labelledby="lineas">
        <h2 id="lineas" className="mb-2 text-lg font-bold text-neutral-50">
          Estado de todas las líneas
        </h2>
        <LineFeed lines={sorted} />
      </section>
    </>
  );
}
