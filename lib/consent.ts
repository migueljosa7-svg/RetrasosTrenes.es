import { useMemo, useSyncExternalStore } from "react";

export type Consent = { analytics: boolean; ads: boolean; ts: number };

export const CONSENT_KEY = "rt-consent";
const CHANGE_EVENT = "rt-consent-change";
export const OPEN_EVENT = "rt-open-consent";

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function saveConsent(c: Omit<Consent, "ts">) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...c, ts: Date.now() }));
  } catch {
    /* almacenamiento bloqueado: la elección vale solo para esta sesión de la página */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export const openConsentSettings = () => window.dispatchEvent(new Event(OPEN_EVENT));

const subscribe = (cb: () => void) => {
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};

const snapshot = () => {
  try {
    return localStorage.getItem(CONSENT_KEY) ?? "";
  } catch {
    return "";
  }
};

/** `ready` es false en el servidor y durante la hidratación: nunca se renderiza nada que dependa del consentimiento antes. */
export function useConsent() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "?");
  return useMemo(() => {
    if (raw === "?") return { ready: false, consent: null as Consent | null };
    try {
      return { ready: true, consent: raw ? (JSON.parse(raw) as Consent) : null };
    } catch {
      return { ready: true, consent: null as Consent | null };
    }
  }, [raw]);
}

/** Borra cookies de Google del dominio actual (al retirar el consentimiento). */
export function clearGoogleCookies() {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (/^(_ga|_gid|_gat|__gads|__gpi|__eoi|IDE)/.test(name)) {
      domains.forEach((d) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ""}`;
      });
    }
  });
}
