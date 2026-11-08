import { lines, nucleos } from "@/data/lines";

// Los feeds GTFS-RT JSON de Renfe (datos abiertos). Sobrescribibles por entorno.
const ALERTS_URL = process.env.RENFE_GTFSRT_ALERTS_URL ?? "https://gtfsrt.renfe.com/alerts.json";
const TIMEOUT_MS = 5000;

export const dynamic = "force-dynamic"; // la caché la controla la cabecera Cache-Control
const CACHE = { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" };

type GtfsText = { translation?: { text?: string; language?: string }[] };
type GtfsAlert = {
  id: string;
  alert?: {
    activePeriod?: { start?: string; end?: string }[];
    informedEntity?: { routeId?: string; stopId?: string }[];
    headerText?: GtfsText;
    descriptionText?: GtfsText;
  };
};

const pickText = (t?: GtfsText) => (t?.translation?.find((x) => x.language === "es") ?? t?.translation?.[0])?.text?.trim() ?? "";
const toIso = (s?: string) => (s ? new Date(Number(s) * 1000).toISOString() : null);

async function fetchAlerts() {
  const res = await fetch(ALERTS_URL, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
  if (!res.ok) throw new Error(`Renfe GTFS-RT respondió ${res.status}`);
  const json = (await res.json()) as { header?: { timestamp?: string }; entity?: GtfsAlert[] };
  if (!Array.isArray(json.entity)) throw new Error("Formato GTFS-RT inesperado");

  return {
    feedTimestamp: toIso(json.header?.timestamp),
    alerts: json.entity.map((e) => ({
      id: e.id,
      text: pickText(e.alert?.descriptionText) || pickText(e.alert?.headerText),
      routeIds: [...new Set((e.alert?.informedEntity ?? []).map((i) => i.routeId).filter(Boolean))] as string[],
      stopIds: [...new Set((e.alert?.informedEntity ?? []).map((i) => i.stopId).filter(Boolean))] as string[],
      start: toIso(e.alert?.activePeriod?.[0]?.start),
      end: toIso(e.alert?.activePeriod?.[0]?.end),
    })),
  };
}

/** Fallback: los datos mock de data/lines.ts, con la misma forma que consume el resto de la app. */
const fallback = () => ({
  nucleos,
  lines: lines.map(({ nucleo, slug, code, status, delayMin, reason, updatedAt }) => ({
    nucleo, slug, code, status, delayMin, reason, updatedAt,
  })),
});

export async function GET() {
  try {
    const live = await fetchAlerts();
    return Response.json(
      { source: "renfe-gtfs-rt", fallback: false, fetchedAt: new Date().toISOString(), ...live },
      { headers: CACHE },
    );
  } catch (err) {
    // Timeout, red caída, HTTP != 200 o JSON inválido → datos locales, nunca un 5xx al cliente.
    console.error("[api/sync] fallback a data/lines.ts:", err instanceof Error ? err.message : err);
    return Response.json(
      { source: "mock", fallback: true, fetchedAt: new Date().toISOString(), ...fallback() },
      { headers: CACHE },
    );
  }
}
