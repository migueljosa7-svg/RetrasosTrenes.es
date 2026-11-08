"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "@/data/lines";

// Leaflet toca `window` al importarse: se carga solo en cliente (ssr: false).
// ssr:false solo está permitido desde un Client Component, de ahí este wrapper.
const LiveMapInner = dynamic(() => import("./LiveMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full animate-pulse items-center justify-center bg-neutral-900 text-xs text-neutral-500">
      Cargando mapa…
    </div>
  ),
});

const LEGEND = [
  { color: "bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]", label: "Normal" },
  { color: "bg-amber-400 shadow-[0_0_8px_2px_rgba(251,191,36,0.6)]", label: "Retraso leve" },
  { color: "bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.7)]", label: "Incidencia grave" },
];

export function LiveMap({ markers, className = "h-[320px] sm:h-[420px]" }: { markers: MapMarker[]; className?: string }) {
  return (
    <section aria-label="Mapa de estado de Cercanías en España" className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900">
      {/* isolate: contiene los z-index internos de Leaflet para que no tapen cabecera ni banners */}
      <div className={`isolate ${className}`}>
        <LiveMapInner markers={markers} />
      </div>
      <ul className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-neutral-800 px-4 py-2 text-xs text-neutral-400">
        {LEGEND.map((l) => (
          <li key={l.label} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${l.color}`} aria-hidden />
            {l.label}
          </li>
        ))}
        <li className="text-neutral-500">Toca un núcleo para ver sus líneas</li>
      </ul>
    </section>
  );
}
