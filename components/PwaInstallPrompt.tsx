"use client";

import { useEffect, useState } from "react";

const KEY = "rt-pwa-dismissed";

// Evento no estándar (Chromium): lo tipamos a mano.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function wasDismissed() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function PwaInstallPrompt() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (wasDismissed()) return;
    const onPrompt = (e: Event) => {
      e.preventDefault(); // evita el mini-infobar nativo; mostramos el nuestro
      setEvt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setEvt(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!evt) return null;

  const close = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* almacenamiento bloqueado */
    }
    setEvt(null);
  };

  const install = async () => {
    await evt.prompt();
    await evt.userChoice.catch(() => null);
    setEvt(null); // el evento solo puede usarse una vez
  };

  return (
    <div
      role="dialog"
      aria-label="Instalar la aplicación"
      // md:hidden: solo móvil. bottom-20 deja libre el anuncio sticky inferior.
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
