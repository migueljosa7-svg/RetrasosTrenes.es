"use client";

import { useEffect } from "react";
import { useConsent } from "@/lib/consent";

type Props = { slot: string; format?: "auto" | "fluid" | "horizontal"; label?: string; minHeight?: number; className?: string };

/**
 * Bloque AdSense. Reserva altura (min-height) para evitar CLS.
 * Solo se renderiza con consentimiento publicitario (el script lo carga CookieBanner).
 * Sin NEXT_PUBLIC_ADSENSE_ID: placeholder en desarrollo y nada en producción.
 */
export function AdSlot({ slot, format = "auto", label = "Publicidad", minHeight = 100, className = "" }: Props) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const { consent } = useConsent();
  const allowed = Boolean(consent?.ads);

  useEffect(() => {
    if (!client || !slot || !allowed) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({}); // la cola se procesa cuando el script termina de cargar
    } catch {
      /* anuncio bloqueado o ya inicializado */
    }
  }, [client, slot, allowed]);

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

  if (!allowed) return null;

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
