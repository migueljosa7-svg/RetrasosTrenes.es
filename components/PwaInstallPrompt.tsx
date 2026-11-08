"use client";

import { useEffect, useState } from "react";

const KEY = "rt-pwa-dismissed";
const MOBILE_QUERY = "(max-width: 767px)";

// Evento no estándar (Chromium): lo tipamos a mano.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const wasDismissed = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};
const remember = () => {
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    /* almacenamiento bloqueado */
  }
};

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      // Solo tomamos el control del aviso si de verdad vamos a mostrar el nuestro (móvil, sin descartar,
      // sin estar ya instalada). Si no, NO llamamos a preventDefault: así el navegador conserva su
      // propio aviso y no aparece el mensaje "Banner not shown: preventDefault() called".
      const standalone = window.matchMedia("(display-mode: standalone)").matches;
      if (wasDismissed() || standalone || !window.matchMedia(MOBILE_QUERY).matches) return;
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferredPrompt(null);

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!deferredPrompt) return null;

  const install = async () => {
    const evt = deferredPrompt;
    setDeferredPrompt(null); // el evento solo sirve una vez; ocultamos el banner ya
    try {
      await evt.prompt(); // aquí el navegador muestra su diálogo de instalación
      const { outcome } = await evt.userChoice;
      if (outcome === "dismissed") remember(); // dijo que no: no insistimos
    } catch {
      /* prompt() ya consumido o bloqueado */
    }
  };

  const close = () => {
    remember();
    setDeferredPrompt(null);
  };

  return (
    <div
      role="dialog"
      aria-label="Instalar la aplicación"
      // bottom-20 deja libre el anuncio sticky inferior
      className="fixed inset-x-3 bottom-20 z-50 flex items-center gap-3 rounded-2xl border border-neutral-700 bg-neutral-900/95 p-3 shadow-xl backdrop-blur md:hidden"
    >
      <p className="flex-1 text-sm leading-snug text-neutral-100">
        Instala <strong>RetrasosTrenes</strong> en tu móvil para consultar el estado en 1 clic
      </p>
      <button onClick={install} className="rounded-xl bg-sky-400 px-3 py-2 text-sm font-bold text-neutral-950">
        Instalar
      </button>
      <button onClick={close} className="rounded-xl px-2 py-2 text-sm text-neutral-400" aria-label="Cerrar">
        Cerrar
      </button>
    </div>
  );
}
