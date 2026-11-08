import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNucleo, linesByNucleo, nucleoStatus, nucleos, stationsByNucleo } from "@/data/lines";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IncidentList } from "@/components/IncidentList";
import { LineFeed } from "@/components/LineFeed";
import { StatusBadge } from "@/components/StatusBadge";
import { TopBanner } from "@/components/Header";
import { SITE_NAME } from "@/lib/site";
import { STATUS_META } from "@/lib/status";

export const revalidate = 60;
export const dynamicParams = false;

type Params = { nucleo: string };

export const generateStaticParams = (): Params[] => nucleos.map((n) => ({ nucleo: n.slug }));

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { nucleo } = await params;
  const n = getNucleo(nucleo);
  if (!n) return {};
  const title = `Estado Cercanías ${n.name} Hoy: Retrasos e Incidencias en Tiempo Real`;
  const description = `Retrasos, averías y cortes en las líneas de Cercanías ${n.name} (${n.region}). Semáforo de estado de todas las líneas, actualizado al minuto.`;
  const path = `/cercanias/${n.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "es_ES", siteName: SITE_NAME, url: path, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function NucleoPage({ params }: { params: Promise<Params> }) {
  const { nucleo } = await params;
  const n = getNucleo(nucleo);
  if (!n) notFound();

  const ls = linesByNucleo(n.slug);
  const status = nucleoStatus(n.slug);
  const incidents = ls
    .flatMap((l) => l.incidents.map((i) => ({ ...i, href: `/cercanias/${l.nucleo}/${l.slug}`, scope: `Línea ${l.code}`, nucleoName: n.name })))
    .sort((a, b) => +new Date(b.at) - +new Date(a.at));

  return (
    <>
      <TopBanner />
      <Breadcrumbs items={[{ name: "cercanias", path: "/cercanias" }, { name: n.slug, path: `/cercanias/${n.slug}` }]} />

      <header className={`rounded-3xl border bg-neutral-900 p-5 ${STATUS_META[status].border}`}>
        <h1 className="text-2xl font-black text-neutral-50">Estado de Cercanías {n.name} hoy</h1>
        <p className="mt-1 text-sm text-neutral-400">{n.blurb}</p>
        <div className="mt-3">
          <StatusBadge status={status} full />
        </div>
      </header>

      <section className="mt-6" aria-labelledby="lineas">
        <h2 id="lineas" className="mb-2 text-lg font-bold text-neutral-50">
          Semáforo de líneas
        </h2>
        <LineFeed lines={ls} showNucleo={false} />
      </section>

      <section className="mt-6" aria-labelledby="avisos">
        <h2 id="avisos" className="mb-2 text-lg font-bold text-neutral-50">
          Avisos oficiales y últimas incidencias
        </h2>
        <IncidentList items={incidents} empty={`Sin incidencias hoy en Cercanías ${n.name}.`} />
      </section>

      <section className="mt-6" aria-labelledby="estaciones">
        <h2 id="estaciones" className="mb-2 text-lg font-bold text-neutral-50">
          Estaciones principales
        </h2>
        <ul className="flex flex-wrap gap-2">
          {stationsByNucleo(n.slug).map((s) => (
            <li key={s.slug}>
              <Link href={`/estacion/${s.slug}`} className="block rounded-full bg-neutral-900 px-3 py-1.5 text-sm text-neutral-200 hover:text-sky-300">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
