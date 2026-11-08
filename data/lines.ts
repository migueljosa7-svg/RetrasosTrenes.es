/**
 * DATOS MOCK. Trazados, estaciones e incidencias son ilustrativos (no son datos oficiales).
 * Sustituir por una fuente real (p. ej. GTFS-RT de Renfe en data.renfe.com / Adif) manteniendo
 * estos tipos y las funciones de acceso de abajo: el resto de la app no necesita cambios.
 */
import { worstStatus, type Status } from "@/lib/status";

const ago = (min: number) => new Date(Date.now() - min * 60_000).toISOString();

export type Incident = {
  id: string;
  title: string;
  detail: string;
  status: Status;
  at: string; // ISO
};

export type Nucleo = {
  slug: string;
  name: string;
  region: string;
  operator: string;
  blurb: string;
  coords: [number, number]; // [lat, lng]
};

export type Station = { slug: string; name: string; nucleo: string; incidents: Incident[] };

export type Line = {
  slug: string; // "linea-c5"
  code: string; // "C-5"
  nucleo: string;
  terminals: [string, string];
  status: Status;
  delayMin: number; // 0 si no hay retraso
  reason: string;
  updatedAt: string;
  usualDelays: number[]; // demoras habituales en minutos
  stations: string[]; // slugs de estación, en orden
  incidents: Incident[];
};

export const nucleos: Nucleo[] = [
  {
    slug: "madrid",
    name: "Madrid",
    region: "Comunidad de Madrid",
    coords: [40.4168, -3.7038],
    operator: "Cercanías Madrid",
    blurb: "Líneas C-1, C-2, C-5 y C-8 de la red de Cercanías de Madrid.",
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    region: "Cataluña",
    coords: [41.3874, 2.1686],
    operator: "Rodalies de Catalunya",
    blurb: "Líneas R1, R2 y R4 de Rodalies en el área metropolitana de Barcelona.",
  },
  {
    slug: "valencia",
    name: "Valencia",
    region: "Comunitat Valenciana",
    coords: [39.4699, -0.3763],
    operator: "Cercanías Valencia",
    blurb: "Líneas C-1 y C-2 de Cercanías Valencia.",
  },
  {
    slug: "zaragoza",
    name: "Zaragoza",
    region: "Aragón",
    coords: [41.6488, -0.8891],
    operator: "Cercanías Zaragoza",
    blurb: "Línea C-1 de Cercanías Zaragoza.",
  },
];

export const stations: Station[] = [
  // Madrid
  { slug: "madrid-atocha", name: "Madrid-Atocha", nucleo: "madrid", incidents: [
    { id: "st-atocha-1", title: "Cambio de vía en andenes de Cercanías", detail: "Los trenes de la C-5 con destino Humanes salen hoy desde la vía 4 en lugar de la vía 2.", status: "warn", at: ago(18) },
  ] },
  { slug: "madrid-chamartin", name: "Madrid-Chamartín-Clara Campoamor", nucleo: "madrid", incidents: [] },
  { slug: "madrid-principe-pio", name: "Madrid-Príncipe Pío", nucleo: "madrid", incidents: [] },
  { slug: "aeropuerto-t4", name: "Aeropuerto T4", nucleo: "madrid", incidents: [] },
  { slug: "alcala-de-henares", name: "Alcalá de Henares", nucleo: "madrid", incidents: [
    { id: "st-alcala-1", title: "Tren averiado en vía 1", detail: "Un tren detenido en la estación provoca retrasos en la C-2 en ambos sentidos.", status: "warn", at: ago(42) },
  ] },
  { slug: "guadalajara", name: "Guadalajara", nucleo: "madrid", incidents: [] },
  { slug: "fuenlabrada", name: "Fuenlabrada", nucleo: "madrid", incidents: [] },
  { slug: "humanes", name: "Humanes", nucleo: "madrid", incidents: [] },
  { slug: "mostoles-el-soto", name: "Móstoles-El Soto", nucleo: "madrid", incidents: [] },
  { slug: "cercedilla", name: "Cercedilla", nucleo: "madrid", incidents: [] },
  // Barcelona
  { slug: "barcelona-sants", name: "Barcelona-Sants", nucleo: "barcelona", incidents: [
    { id: "st-sants-1", title: "Afectaciones en la R4", detail: "Los trenes de la R4 no salen hacia Manresa. Se recomienda usar la R2 hasta Martorell.", status: "danger", at: ago(35) },
  ] },
  { slug: "barcelona-placa-catalunya", name: "Barcelona-Plaça Catalunya", nucleo: "barcelona", incidents: [] },
  { slug: "barcelona-passeig-de-gracia", name: "Barcelona-Passeig de Gràcia", nucleo: "barcelona", incidents: [] },
  { slug: "molins-de-rei", name: "Molins de Rei", nucleo: "barcelona", incidents: [] },
  { slug: "mataro", name: "Mataró", nucleo: "barcelona", incidents: [] },
  { slug: "macanet-massanes", name: "Maçanet-Massanes", nucleo: "barcelona", incidents: [] },
  { slug: "castelldefels", name: "Castelldefels", nucleo: "barcelona", incidents: [] },
  { slug: "vilanova-i-la-geltru", name: "Vilanova i la Geltrú", nucleo: "barcelona", incidents: [] },
  { slug: "sant-vicenc-de-calders", name: "Sant Vicenç de Calders", nucleo: "barcelona", incidents: [] },
  { slug: "granollers-centre", name: "Granollers Centre", nucleo: "barcelona", incidents: [] },
  { slug: "martorell", name: "Martorell", nucleo: "barcelona", incidents: [] },
  { slug: "manresa", name: "Manresa", nucleo: "barcelona", incidents: [] },
  // Valencia
  { slug: "valencia-nord", name: "València-Estació del Nord", nucleo: "valencia", incidents: [] },
  { slug: "alzira", name: "Alzira", nucleo: "valencia", incidents: [] },
  { slug: "sueca", name: "Sueca", nucleo: "valencia", incidents: [] },
  { slug: "gandia", name: "Gandia", nucleo: "valencia", incidents: [] },
  { slug: "xativa", name: "Xàtiva", nucleo: "valencia", incidents: [] },
  { slug: "moixent", name: "Moixent", nucleo: "valencia", incidents: [] },
  // Zaragoza
  { slug: "zaragoza-delicias", name: "Zaragoza-Delicias", nucleo: "zaragoza", incidents: [] },
  { slug: "zaragoza-goya", name: "Zaragoza-Goya", nucleo: "zaragoza", incidents: [] },
  { slug: "zaragoza-miraflores", name: "Zaragoza-Miraflores", nucleo: "zaragoza", incidents: [] },
  { slug: "casetas", name: "Casetas", nucleo: "zaragoza", incidents: [] },
  { slug: "utebo", name: "Utebo", nucleo: "zaragoza", incidents: [] },
];

export const lines: Line[] = [
  // ───────── MADRID ─────────
  {
    slug: "linea-c1", code: "C-1", nucleo: "madrid", terminals: ["Príncipe Pío", "Aeropuerto T4"],
    status: "ok", delayMin: 0, reason: "Circulación normal en toda la línea.", updatedAt: ago(4), usualDelays: [5, 10],
    stations: ["madrid-principe-pio", "madrid-atocha", "madrid-chamartin", "aeropuerto-t4"],
    incidents: [],
  },
  {
    slug: "linea-c2", code: "C-2", nucleo: "madrid", terminals: ["Guadalajara", "Chamartín"],
    status: "warn", delayMin: 10, reason: "Tren averiado en Alcalá de Henares. Frecuencia alterada en ambos sentidos.", updatedAt: ago(9), usualDelays: [10, 15],
    stations: ["guadalajara", "alcala-de-henares", "madrid-atocha", "madrid-chamartin"],
    incidents: [
      { id: "c2-1", title: "Tren averiado en Alcalá de Henares", detail: "Retrasos de hasta 10 minutos mientras se retira el tren afectado.", status: "warn", at: ago(42) },
      { id: "c2-0", title: "Incidencia resuelta en Guadalajara", detail: "Restablecida la circulación tras una incidencia en señalización.", status: "ok", at: ago(190) },
    ],
  },
  {
    slug: "linea-c5", code: "C-5", nucleo: "madrid", terminals: ["Humanes", "Móstoles-El Soto"],
    status: "warn", delayMin: 20, reason: "Avería de un tren en Atocha. Retrasos de 20 minutos y posibles supresiones.", updatedAt: ago(6), usualDelays: [10, 20],
    stations: ["mostoles-el-soto", "humanes", "fuenlabrada", "madrid-atocha"],
    incidents: [
      { id: "c5-2", title: "Avería de tren en Atocha", detail: "Un tren con avería en andén obliga a reorganizar vías. Demoras de unos 20 minutos.", status: "warn", at: ago(26) },
      { id: "c5-1", title: "Retrasos por incidencia en Fuenlabrada", detail: "Retrasos de hasta 10 minutos por una incidencia en infraestructura.", status: "warn", at: ago(140) },
    ],
  },
  {
    slug: "linea-c8", code: "C-8", nucleo: "madrid", terminals: ["Cercedilla", "Chamartín"],
    status: "danger", delayMin: 0, reason: "Servicio suspendido entre Cercedilla y Chamartín por avería en la catenaria.", updatedAt: ago(14), usualDelays: [10, 20],
    stations: ["cercedilla", "madrid-chamartin"],
    incidents: [
      { id: "c8-1", title: "Suspensión por avería en la catenaria", detail: "Sin servicio en todo el tramo. Renfe valora un servicio alternativo por carretera.", status: "danger", at: ago(55) },
    ],
  },
  // ───────── BARCELONA ─────────
  {
    slug: "linea-r1", code: "R1", nucleo: "barcelona", terminals: ["Molins de Rei", "Maçanet-Massanes"],
    status: "ok", delayMin: 0, reason: "Servicio con normalidad.", updatedAt: ago(3), usualDelays: [5, 10],
    stations: ["molins-de-rei", "barcelona-sants", "barcelona-placa-catalunya", "mataro", "macanet-massanes"],
    incidents: [],
  },
  {
    slug: "linea-r2", code: "R2", nucleo: "barcelona", terminals: ["Sant Vicenç de Calders", "Granollers Centre"],
    status: "warn", delayMin: 15, reason: "Limitación de velocidad por obras entre Castelldefels y Sitges.", updatedAt: ago(11), usualDelays: [10, 15],
    stations: ["sant-vicenc-de-calders", "vilanova-i-la-geltru", "castelldefels", "barcelona-sants", "barcelona-passeig-de-gracia", "granollers-centre"],
    incidents: [
      { id: "r2-1", title: "Limitación temporal de velocidad", detail: "Retrasos de hasta 15 minutos entre Castelldefels y Vilanova i la Geltrú.", status: "warn", at: ago(75) },
    ],
  },
  {
    slug: "linea-r4", code: "R4", nucleo: "barcelona", terminals: ["Sant Vicenç de Calders", "Manresa"],
    status: "danger", delayMin: 0, reason: "Servicio interrumpido entre Martorell y Manresa por incidencia en la infraestructura.", updatedAt: ago(8), usualDelays: [10, 20],
    stations: ["sant-vicenc-de-calders", "martorell", "barcelona-sants", "manresa"],
    incidents: [
      { id: "r4-1", title: "Interrupción entre Martorell y Manresa", detail: "Servicio alternativo por carretera. Sin previsión de restablecimiento.", status: "danger", at: ago(35) },
      { id: "r4-0", title: "Retrasos de 20 minutos por incidencia en Martorell", detail: "Tras la incidencia previa, circulación con demoras.", status: "warn", at: ago(160) },
    ],
  },
  // ───────── VALENCIA ─────────
  {
    slug: "linea-c1", code: "C-1", nucleo: "valencia", terminals: ["València Nord", "Gandia"],
    status: "ok", delayMin: 0, reason: "Servicio con normalidad.", updatedAt: ago(5), usualDelays: [5, 10],
    stations: ["valencia-nord", "alzira", "sueca", "gandia"],
    incidents: [],
  },
  {
    slug: "linea-c2", code: "C-2", nucleo: "valencia", terminals: ["València Nord", "Moixent"],
    status: "warn", delayMin: 7, reason: "Retrasos leves por espera de cruce en Xàtiva.", updatedAt: ago(13), usualDelays: [5, 10],
    stations: ["valencia-nord", "alzira", "xativa", "moixent"],
    incidents: [
      { id: "v-c2-1", title: "Espera de cruce en Xàtiva", detail: "Retrasos puntuales de 5 a 7 minutos.", status: "warn", at: ago(48) },
    ],
  },
  // ───────── ZARAGOZA ─────────
  {
    slug: "linea-c1", code: "C-1", nucleo: "zaragoza", terminals: ["Casetas", "Miraflores"],
    status: "ok", delayMin: 0, reason: "Servicio con normalidad.", updatedAt: ago(7), usualDelays: [5, 10],
    stations: ["casetas", "utebo", "zaragoza-delicias", "zaragoza-goya", "zaragoza-miraflores"],
    incidents: [],
  },
];

// ───────── Acceso a datos ─────────
export const getNucleo = (slug: string) => nucleos.find((n) => n.slug === slug);
export const getLine = (nucleo: string, slug: string) => lines.find((l) => l.nucleo === nucleo && l.slug === slug);
export const getStation = (slug: string) => stations.find((s) => s.slug === slug);
export const linesByNucleo = (nucleo: string) => lines.filter((l) => l.nucleo === nucleo);
export const linesAtStation = (stationSlug: string) => lines.filter((l) => l.stations.includes(stationSlug));
export const stationsByNucleo = (nucleo: string) => stations.filter((s) => s.nucleo === nucleo);
export const lineHref = (l: Line) => `/cercanias/${l.nucleo}/${l.slug}`;
export const nucleoStatus = (nucleo: string): Status => worstStatus(linesByNucleo(nucleo).map((l) => l.status));

export type FeedIncident = Incident & { href: string; scope: string; nucleoName: string };

export function allIncidents(): FeedIncident[] {
  const fromLines = lines.flatMap((l) =>
    l.incidents.map((i) => ({
      ...i,
      href: lineHref(l),
      scope: `Línea ${l.code}`,
      nucleoName: getNucleo(l.nucleo)?.name ?? "",
    })),
  );
  const fromStations = stations.flatMap((s) =>
    s.incidents.map((i) => ({
      ...i,
      href: `/estacion/${s.slug}`,
      scope: s.name,
      nucleoName: getNucleo(s.nucleo)?.name ?? "",
    })),
  );
  return [...fromLines, ...fromStations].sort((a, b) => +new Date(b.at) - +new Date(a.at));
}

/** Datos serializables para el mapa (se pasan del servidor al componente cliente). */
export type MapMarker = {
  slug: string;
  name: string;
  coords: [number, number];
  status: Status;
  lines: { code: string; href: string; status: Status; delayMin: number; reason: string }[];
};

export const mapMarkers = (): MapMarker[] =>
  nucleos.map((n) => ({
    slug: n.slug,
    name: n.name,
    coords: n.coords,
    status: nucleoStatus(n.slug),
    lines: linesByNucleo(n.slug).map((l) => ({
      code: l.code,
      href: lineHref(l),
      status: l.status,
      delayMin: l.delayMin,
      reason: l.reason,
    })),
  }));

export type SearchItem = { type: "Línea" | "Estación"; label: string; sublabel: string; href: string; haystack: string };

export function buildSearchIndex(): SearchItem[] {
  const l: SearchItem[] = lines.map((x) => {
    const n = getNucleo(x.nucleo)!;
    return {
      type: "Línea",
      label: `${x.code} ${n.name}`,
      sublabel: `${x.terminals[0]} – ${x.terminals[1]}`,
      href: lineHref(x),
      haystack: `linea ${x.code} ${x.code.replace("-", "")} ${n.name} ${x.terminals.join(" ")} rodalies cercanias`,
    };
  });
  const s: SearchItem[] = stations.map((x) => ({
    type: "Estación",
    label: x.name,
    sublabel: getNucleo(x.nucleo)?.name ?? "",
    href: `/estacion/${x.slug}`,
    haystack: `estacion ${x.name} ${getNucleo(x.nucleo)?.name ?? ""}`,
  }));
  return [...l, ...s];
}
