import type { MetadataRoute } from "next";
import { lines, lineHref, nucleos, stations } from "@/data/lines";
import { abs } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (
    path: string,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: number,
  ): MetadataRoute.Sitemap[number] => ({ url: abs(path), lastModified: now, changeFrequency, priority });

  return [
    entry("/", "always", 1),
    entry("/incidencias", "always", 0.9),
    entry("/cercanias", "hourly", 0.7),
    ...nucleos.map((n) => entry(`/cercanias/${n.slug}`, "hourly", 0.8)),
    ...lines.map((l) => entry(lineHref(l), "always", 0.8)),
    ...stations.map((s) => entry(`/estacion/${s.slug}`, "hourly", 0.6)),
  ];
}
