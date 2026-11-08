import type { Metadata } from "next";
import { getNucleo, lineHref, lines } from "@/data/lines";
import { SocialAlertGenerator, type AlertItem } from "@/components/SocialAlertGenerator";
import { abs, SITE_URL } from "@/lib/site";

export const revalidate = 60;

// Herramienta interna: fuera de buscadores, del sitemap y del menú.
export const metadata: Metadata = {
  title: "Generador de alertas para redes",
  robots: { index: false, follow: false },
};

export default function SocialPage() {
  const items: AlertItem[] = lines
    .filter((l) => l.status !== "ok")
    .sort((a, b) => (a.status === b.status ? 0 : a.status === "danger" ? -1 : 1))
    .map((l) => ({
      id: `${l.nucleo}/${l.slug}`,
      code: l.code,
      nucleoSlug: l.nucleo,
      nucleoName: getNucleo(l.nucleo)?.name ?? "",
      status: l.status as "warn" | "danger",
      delayMin: l.delayMin,
      reason: l.reason,
      url: abs(lineHref(l)),
    }));

  return (
    <>
      <h1 className="text-2xl font-black text-neutral-50">Centro de alertas para redes</h1>
      <p className="mb-4 mt-1 text-sm text-neutral-400">
        Textos listos para publicar a partir de las incidencias activas ahora mismo ({items.length}).
      </p>
      <SocialAlertGenerator items={items} siteUrl={SITE_URL} />
    </>
  );
}
