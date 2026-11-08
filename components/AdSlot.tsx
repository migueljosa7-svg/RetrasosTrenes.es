"use client";

import { useEffect } from "react";

type Props = { slot: string; format?: "auto" | "fluid" | "horizontal"; label?: string; minHeight?: number; className?: string };

/**
 * Bloque AdSense. Reserva altura (min-height) para evitar CLS.
 * Sin NEXT_PUBLIC_ADSENSE_ID: muestra un placeholder en desarrollo y nada en producción.
 * Para Ezoic, sustituye el <ins> por sus placeholders (<div id="ezoic-pub-ad-placeholder-1xx">).
 */
export function AdSlot({ slot, format = "auto", label = "Publicidad", minHeight = 100, className = "" }: Props) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!client || !slot) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      /* anuncio bloqueado o ya inicializado */
    }
  }, [client, slot]);

  if (!client || !slot) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div
        style={{ minHeight }}
        className={`flex items-center justify-center rounded-xl border border-dashed border-neutral-700 text-xs text-neutral-500 ${className}`}
      >
        {label} (placeholder AdSense)
      </div>
    );
  }

  return (
    <div className={className} style={{ minHeight }}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-neutral-600">{label}</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
