"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearGoogleCookies, OPEN_EVENT, readConsent, saveConsent, useConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

type GtagWindow = Window & { dataLayer?: unknown[] };

function loadGoogleAnalytics(adsGranted: boolean) {
  if (!GA_ID || document.getElementById("ga4-src")) return;
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments); // gtag.js exige el objeto `arguments`, no un array
  }
  // Consent Mode v2: el consentimiento publicitario se refleja en las señales de Google.
  const ads = adsGranted ? "granted" : "denied";
  gtag("consent", "default", { analytics_storage: "granted", ad_storage: ads, ad_user_data: ads, ad_personalization: ads });
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
  const s = document.createElement("script");
  s.id = "ga4-src";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

function loadAdSense() {
  if (!ADSENSE_ID || document.getElementById("adsense-src")) return;
  const s = document.createElement("script");
  s.id = "adsense-src";
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`;
  document.head.appendChild(s);
}

export function CookieBanner() {
  const { ready, consent } = useConsent();
  const [reopened, setReopened] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  // Carga de scripts de Google: SOLO con consentimiento explícito.
  useEffect(() => {
    if (!consent) return;
    if (consent.analytics) loadGoogleAnalytics(consent.ads);
    if (consent.ads) loadAdSense();
  }, [consent]);

  // Permite reabrir desde el footer ("Configurar cookies").
  useEffect(() => {
    const open = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? false);
      setAds(c?.ads ?? false);
      setConfiguring(true);
      setReopened(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  if (!ready || (consent && !reopened)) return null;

  const decide = (next: { analytics: boolean; ads: boolean }) => {
    const prev = readConsent();
    saveConsent(next);
    const withdrew = prev && ((prev.analytics && !next.analytics) || (prev.ads && !next.ads));
    if (withdrew) {
      // Los scripts ya cargados no se pueden "descargar": limpiamos cookies y recargamos.
      clearGoogleCookies();
      location.reload();
      return;
    }
    setReopened(false);
    setConfiguring(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-neutral-700 bg-neutral-950/95 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] backdrop-blur"
    >
      <div className="mx-auto max-w-3xl px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <p id="cookie-title" className="text-sm font-bold text-neutral-50">
          🍪 Tu privacidad importa
        </p>
        <p id="cookie-desc" className="mt-1 text-xs leading-relaxed text-neutral-300">
          Usamos cookies analíticas (Google Analytics) para mejorar el sitio y cookies publicitarias (Google AdSense) para mostrar
          anuncios. No cargamos ninguna hasta que lo decidas. Más información en la{" "}
          <Link href="/politica-cookies" className="text-sky-300 underline">
            Política de cookies
          </Link>
          .
        </p>

        {configuring && (
          <div className="mt-3 space-y-2 rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-xs">
            <Toggle label="Necesarias" desc="Imprescindibles para recordar tu elección. Siempre activas." checked disabled />
            <Toggle label="Analíticas" desc="Google Analytics 4: estadísticas de uso con IP anonimizada." checked={analytics} onChange={setAnalytics} />
            <Toggle label="Publicitarias" desc="Google AdSense: anuncios y su medición." checked={ads} onChange={setAds} />
          </div>
        )}

        <div className="mt-3 grid grid-cols-3 gap-2 text-sm font-semibold">
          {configuring ? (
            <>
              <button onClick={() => decide({ analytics: false, ads: false })} className="rounded-xl border border-neutral-600 px-3 py-2.5 text-neutral-100">
                Rechazar
              </button>
              <button onClick={() => decide({ analytics, ads })} className="rounded-xl border border-sky-500 px-3 py-2.5 text-sky-300">
                Guardar
              </button>
              <button onClick={() => decide({ analytics: true, ads: true })} className="rounded-xl bg-sky-400 px-3 py-2.5 text-neutral-950">
                Aceptar todas
              </button>
            </>
          ) : (
            <>
              <button onClick={() => decide({ analytics: false, ads: false })} className="rounded-xl border border-neutral-600 px-3 py-2.5 text-neutral-100">
                Rechazar
              </button>
              <button onClick={() => setConfiguring(true)} className="rounded-xl border border-neutral-600 px-3 py-2.5 text-neutral-100">
                Configurar
              </button>
              <button onClick={() => decide({ analytics: true, ads: true })} className="rounded-xl bg-sky-400 px-3 py-2.5 text-neutral-950">
                Aceptar todas
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  desc,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className={`flex items-start justify-between gap-3 ${disabled ? "opacity-70" : "cursor-pointer"}`}>
      <span>
        <span className="block font-semibold text-neutral-100">{label}</span>
        <span className="block text-neutral-400">{desc}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-sky-400"
      />
    </label>
  );
}
