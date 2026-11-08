import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNucleo, getStation, linesAtStation, lineHref, stations } from "@/data/lines";
import { getDepartures } from "@/lib/departures";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IncidentList } from "@/components/IncidentList";
import { TopBanner } from "@/components/Header";
import { hhmm } from "@/lib/format";
import { SITE_NAME } from "@/lib/site";
import { STATUS_META } from "@/lib/status";

export const revalidate = 60;
export const dynamicParams = false;

type Params = { slug: string };

export const generateStaticParams = (): Params[] => stations.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getStation(slug);
  if (!s) return {};
  const title = `Panel de Salidas y Retrasos en ${s.name} Hoy | Tiempo Real`;
  const description = `Salidas, retrasos, cambios de vía e incidencias en ${s.name} en directo. Consulta el estado de los trenes de Cercanías antes de salir.`;
  const path = `/estacion/${s.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "es_ES", siteName: SITE_NAME, url: path, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function StationPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = getStation(slug);
  if (!s) notFound();
  const n = getNucleo(s.nucleo);
  const departures = getDepartures(s.slug, s.name);
  const ls = linesAtStation(s.slug);

  return (
    <>
      <TopBanner />
      <Breadcrumbs
        items={[
          ...(n ? [{ name: n.slug, path: `/cercanias/${n.slug}` }] : []),
          { name: s.slug, path: `/estacion/${s.slug}` },
        ]}
      />

      <header className="rounded-3xl border border-neutral-800 bg-neutral-900 p-5">
        <h1 className="text-2xl font-black text-neutral-50">Salidas y retrasos en {s.name} hoy</h1>
        <p className="mt-1 text-sm text-neutral-400">
          {n?.name} · Líneas:{" "}
          {ls.map((l, i) => (
            <span key={l.nucleo + l.slug}>
              {i > 0 && ", "}
              <Link href={lineHref(l)} className="text-sky-300 hover:underline">
                {l.code}
              </Link>
            </span>
          ))}
        </p>
      </header>

      <section className="mt-6" aria-labelledby="salidas">
        <h2 id="salidas" className="mb-2 text-lg font-bold text-neutral-50">
          Panel de salidas
        </h2>
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-black font-mono">
          <div className="grid grid-cols-[3.5rem_3.5rem_1fr_3rem] gap-2 border-b border-neutral-800 px-3 py-2 text-[11px] uppercase text-neutral-500">
            <span>Hora</span>
            <span>Línea</span>
            <span>Destino</span>
            <span className="text-right">Vía</span>
          </div>
          {departures.map((d, i) => {
            const status = d.cancelled ? "danger" : d.delayMin > 0 ? "warn" : "ok";
            return (
              <div key={i} className="grid grid-cols-[3.5rem_3.5rem_1fr_3rem] items-center gap-2 border-b border-neutral-900 px-3 py-2.5 text-sm last:border-0">
                <time className="font-bold text-amber-300">{hhmm(d.scheduledAt)}</time>
                <span className="font-bold text-neutral-100">{d.line.code}</span>
                <span className="min-w-0">
                  <span className="block truncate text-neutral-100">{d.destination}</span>
                  <span className={`block text-xs ${STATUS_META[status].text}`}>
                    {d.cancelled ? "Suprimido" : d.delayMin > 0 ? `Retraso +${d.delayMin} min` : "En hora"}
                  </span>
                </span>
                <span className="text-right text-neutral-200">{d.platform}</span>
              </div>
            );
          })}
          {departures.length === 0 && <p className="p-4 text-sm text-neutral-500">Sin salidas previstas.</p>}
        </div>
        <p className="mt-2 text-xs text-neutral-500">Horarios de ejemplo con datos de demostración.</p>
      </section>

      <section className="mt-6" aria-labelledby="incidencias">
        <h2 id="incidencias" className="mb-2 text-lg font-bold text-neutral-50">
          Incidencias y cambios de vía en {s.name}
        </h2>
        <IncidentList items={s.incidents} empty={`Sin incidencias en la terminal de ${s.name}.`} />
      </section>
    </>
  );
}
