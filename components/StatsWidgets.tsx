"use client";

import { useEffect, useState } from "react";

function useCountUp(target: number, ms = 900) {
  const [value, setValue] = useState(target); // SSR y primer render: valor final (SEO, sin saltos)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3)))); // easeOutCubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

function Tile({ label, children, tone }: { label: string; children: React.ReactNode; tone: string }) {
  return (
    <div className={`rounded-2xl border bg-neutral-900/80 p-3 text-center backdrop-blur ${tone}`}>
      <div className="text-3xl font-black tabular-nums leading-none">{children}</div>
      <p className="mt-1.5 text-[11px] leading-tight text-neutral-400">{label}</p>
    </div>
  );
}

type Props = { operational: number; total: number; activeIncidents: number; ageMin: number };

/** Tres widgets: líneas operativas, incidencias activas y antigüedad del último aviso (se actualiza solo). */
export function StatsWidgets({ operational, total, activeIncidents, ageMin }: Props) {
  const ops = useCountUp(operational);
  const inc = useCountUp(activeIncidents);
  const [age, setAge] = useState(ageMin);

  useEffect(() => {
    const t0 = Date.now();
    const id = setInterval(() => setAge(ageMin + Math.floor((Date.now() - t0) / 60_000)), 15_000);
    return () => clearInterval(id);
  }, [ageMin]);

  return (
    <section aria-label="Estadísticas rápidas" className="grid grid-cols-3 gap-2">
      <Tile label="Líneas operativas" tone="border-emerald-500/30 shadow-[0_0_24px_-10px_rgba(52,211,153,0.6)]">
        <span className="text-emerald-300">{ops}</span>
        <span className="text-base font-bold text-neutral-500">/{total}</span>
      </Tile>
      <Tile
        label="Incidencias activas"
        tone={
          activeIncidents > 0
            ? "border-red-500/40 shadow-[0_0_24px_-8px_rgba(239,68,68,0.7)]"
            : "border-emerald-500/30 shadow-[0_0_24px_-10px_rgba(52,211,153,0.6)]"
        }
      >
        <span className={activeIncidents > 0 ? "text-red-300" : "text-emerald-300"}>{inc}</span>
      </Tile>
      <Tile label="Último aviso" tone="border-sky-500/30 shadow-[0_0_24px_-10px_rgba(56,189,248,0.6)]">
        <span className="flex items-center justify-center gap-1.5 text-sky-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400 shadow-[0_0_8px_2px_rgba(56,189,248,0.7)]" aria-hidden />
          <span>{age < 1 ? "<1" : age}</span>
          <span className="text-base font-bold text-neutral-500">min</span>
        </span>
      </Tile>
    </section>
  );
}
