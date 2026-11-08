import { abs, SITE_NAME, SITE_URL } from "@/lib/site";

type Json = Record<string, unknown>;

export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      // Escapamos "<" para que el JSON nunca cierre la etiqueta <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** WebSite + SearchAction (buscador directo en Google). El target lo atiende la home con ?q= */
export const websiteJsonLd = (): Json => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "es-ES",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

/** BreadcrumbList. `path` es la ruta absoluta dentro del sitio (ej: /cercanias/madrid). */
export const breadcrumbJsonLd = (items: { name: string; path: string }[]): Json => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});

/**
 * SpecialAnnouncement para interrupciones. Úsalo solo mientras la incidencia esté activa.
 * Nota: Google solo muestra oficialmente rich results de SpecialAnnouncement para COVID-19;
 * para otros temas el marcado es válido pero no garantiza un snippet destacado.
 */
export const specialAnnouncementJsonLd = (a: {
  name: string;
  text: string;
  path: string;
  datePosted: string;
  expires?: string;
  area: string;
}): Json => ({
  "@context": "https://schema.org",
  "@type": "SpecialAnnouncement",
  name: a.name,
  text: a.text,
  datePosted: a.datePosted,
  expires: a.expires ?? new Date(Date.now() + 6 * 3_600_000).toISOString(),
  url: abs(a.path),
  inLanguage: "es-ES",
  spatialCoverage: { "@type": "AdministrativeArea", name: a.area },
  announcementLocation: { "@type": "AdministrativeArea", name: a.area },
});
