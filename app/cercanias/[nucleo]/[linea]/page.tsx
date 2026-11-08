import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLine, getNucleo, getStation, lineHref, lines, linesByNucleo } from "@/data/lines";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IncidentList } from "@/components/IncidentList";
import { JsonLd, specialAnnouncementJsonLd } from "@/components/JsonLd";
import { LineCard } from "@/components/LineCard";
import { StatusBadge } from "@/components/StatusBadge";
import { TopBanner } from "@/components/Header";
import { hhmm, timeAgo } from "@/lib/format";
import { SITE_NAME } from "@/lib/site";
import { STATUS_META } from "@/lib/status";

export const revalidate = 60;
export const dynamicParams = false; // solo las combinaciones núcleo/línea de data/lines.ts; el resto → 404

type Params = { nucleo: string; linea: string };

export function generateStaticParams(): Params[] {
  return lines.map((l) => ({ nucleo: l.nucleo, linea: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { nucleo, linea } = await params;
  const line = getLine(nucleo, linea);
  const n = getNucleo(nucleo);
  if (!line || !n) return {};

  const title = `Estado Línea ${line.code} ${n.name} en Tiempo Real | Incidencias y Retrasos Hoy`;
  const description = `Consulta si la línea ${line.code} de ${n.name} tiene retrasos, averías o cortes en directo. Información de trenes actualizada al minuto.`;
  const path = lineHref(line);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "es_ES", siteName: SITE_NAME, url: path, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LinePage({ params }: { params: Promise<Params> }) {
  const { nucleo, linea } = await params;
  const line = getLine(nucleo, linea);
  const n = getNucleo(nucleo);
  if (!line || !n) notFound();

  const path = lineHref(line);
  const m = STATUS_META[line.status];
  const headline =
    line.status === "danger" ? "Servicio suspendido" : line.delayMin > 0 ? `Retrasos de ${line.delayMin} min` : "Sin retrasos";
  const others = linesByNucleo(nucleo).filter((l) => l.slug !== line.slug);
  const active = line.incidents.find((i) => i.status !== "ok");

  return (
    <>
      <TopBanner />
      <Breadcrumbs
        items={[
          { name: "cercanias", path: "/cercanias" },
          { name: n.slug, path: `/cercanias/${n.slug}` },
          { name: line.slug, path },
        ]}
      />
      {active && (
        <JsonLd
          data={specialAnnouncementJsonLd({
            name: `${active.title} – Línea ${line.code} ${n.name}`,
            text: `${active.detail} ${line.reason}`,
            path,
            datePosted: active.at,
            area: n.name,
          })}
        />
      )}

      <header className={`rounded-3xl border bg-neutral-900 p-5 ${m.border}`}>
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-black leading-tight text-neutral-50">
            <span className="mr-2 rounded-lg bg-neutral-100 px-2.5 py-0.5 text-neutral-950">{line.code}</span>
            Estado Línea {line.code} {n.name} hoy
          </h1>
        </div>
        <p className="mt-1 text-sm text-neutral-400">
          {line.terminals[0]} – {line.terminals[1]} · {n.operator}
        </p>
        <div className="mt-4">
          <StatusBadge status={line.status} full />
        </div>
        <p className={`mt-3 text-4xl font-black ${m.text}`}>{headline}</p>
        <p className="mt-2 text-neutral-200">{line.reason}</p>
        <p className="mt-3 text-xs text-neutral-500">
          Último aviso a las {hhmm(line.updatedAt)} ({timeAgo(line.updatedAt)})
        </p>
      </header>

      <section className="mt-6" aria-labelledby="demoras">
        <h2 id="demoras" className="mb-2 text-lg font-bold text-neutral-50">
          Demoras habituales en la {line.code} de {n.name}
        </h2>
        <p className="rounded-2xl bg-neutral-900 p-4 text-sm text-neutral-300">
          Cuando hay incidencias, la línea {line.code} suele acumular demoras de{" "}
          {line.usualDelays.map((d) => `+${d} min`).join(" y ")}. Si el estado está en rojo, el servicio puede estar suspendido
          o sustituido por autobuses.
        </p>
      </section>

      <section className="mt-6" aria-labelledby="avisos">
        <h2 id="avisos" className="mb-2 text-lg font-bold text-neutral-50">
          Historial de avisos de hoy
        </h2>
        <IncidentList items={line.incidents} empty={`Sin avisos hoy en la línea ${line.code} de ${n.name}.`} />
      </section>

      <section className="mt-6" aria-labelledby="estaciones">
        <h2 id="estaciones" className="mb-2 text-lg font-bold text-neutral-50">
          Estaciones de la línea {line.code}
        </h2>
        <ol className="relative ml-3 space-y-3 border-l-2 border-neutral-700 pl-5">
          {line.stations.map((slug) => {
            const s = getStation(slug);
            if (!s) return null;
            return (
              <li key={slug} className="relative">
                <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-sky-400 ring-4 ring-neutral-950" />
                <Link href={`/estacion/${slug}`} className="text-neutral-100 hover:text-sky-300">
                  {s.name}
                </Link>
                {s.incidents.length > 0 && <span className="ml-2 text-xs text-amber-300">● aviso</span>}
              </li>
            );
          })}
        </ol>
      </section>

      {others.length > 0 && (
        <section className="mt-8" aria-labelledby="otras">
          <h2 id="otras" className="mb-2 text-lg font-bold text-neutral-50">
            Otras líneas de Cercanías {n.name}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {others.map((l) => (
              <LineCard key={l.slug} line={l} showNucleo={false} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
