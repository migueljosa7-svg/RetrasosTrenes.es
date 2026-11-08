import type { Metadata } from "next";
import { Fragment } from "react";
import { allIncidents } from "@/data/lines";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IncidentList } from "@/components/IncidentList";
import { AdSlot } from "@/components/AdSlot";
import { TopBanner } from "@/components/Header";
import { ADS, SITE_NAME } from "@/lib/site";

export const revalidate = 60;

const title = "Incidencias de Trenes en Directo Hoy: Averías, Huelgas y Retrasos | Renfe y Rodalies";
const description =
  "Feed en vivo de todas las averías, huelgas y problemas técnicos de hoy en la red ferroviaria española: Cercanías, Rodalies y Media Distancia.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/incidencias" },
  openGraph: { type: "website", locale: "es_ES", siteName: SITE_NAME, url: "/incidencias", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function IncidenciasPage() {
  const items = allIncidents();
  // Troceamos en bloques de 4 para intercalar un anuncio In-Feed entre bloques.
  const chunks = Array.from({ length: Math.ceil(items.length / 4) }, (_, i) => items.slice(i * 4, i * 4 + 4));

  return (
    <>
      <TopBanner />
      <Breadcrumbs items={[{ name: "incidencias", path: "/incidencias" }]} />
      <h1 className="text-2xl font-black text-neutral-50">Incidencias en directo hoy</h1>
      <p className="mb-4 mt-1 text-sm text-neutral-400">
        Orden cronológico, de la más reciente a la más antigua. Se actualiza cada minuto.
      </p>
      {chunks.map((c, i) => (
        <Fragment key={i}>
          <IncidentList items={c} />
          {i < chunks.length - 1 && <AdSlot slot={ADS.slotInFeed} format="fluid" minHeight={120} className="my-3" />}
        </Fragment>
      ))}
    </>
  );
}
