"use client";

import { useState } from "react";
import { useConsent } from "@/lib/consent";
import { AdSlot } from "./AdSlot";

export function StickyFooterAd({ slot }: { slot: string }) {
  const [open, setOpen] = useState(true);
  const { consent } = useConsent();
  if (!open) return null;

  const hasAds = Boolean(process.env.NEXT_PUBLIC_ADSENSE_ID && slot);
  if (hasAds && !consent?.ads) return null; // sin consentimiento publicitario no hay barra
  if (!hasAds && process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-neutral-950/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Cerrar anuncio"
        className="absolute -top-7 right-2 rounded-t-md border border-b-0 border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-400"
      >
        ✕
      </button>
      <AdSlot slot={slot} format="horizontal" minHeight={50} className="mx-auto max-w-3xl py-1" />
    </div>
  );
}
