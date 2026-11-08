"use client";

import { useMemo, useState } from "react";

export type AlertItem = {
  id: string;
  code: string;
  nucleoSlug: string;
  nucleoName: string;
  status: "warn" | "danger";
  delayMin: number;
  reason: string;
  url: string;
};

const NUCLEO_TAGS: Record<string, string[]> = {
  madrid: ["#CercaniasMadrid", "#Renfe"],
  barcelona: ["#Rodalies", "#RodaliesBCN", "#Renfe"],
  valencia: ["#CercaniasValencia", "#Renfe"],
  zaragoza: ["#CercaniasZaragoza", "#Renfe"],
};
const tagsFor = (slug: string) => NUCLEO_TAGS[slug] ?? ["#Cercanias", "#Renfe"];

const X_LIMIT = 280;
const X_URL_LEN = 23; // X cuenta cualquier URL como 23 caracteres

/** Longitud aproximada según X (URLs = 23; los emojis cuentan 2, que es lo que hace X). */
function xLength(text: string, url: string) {
  const t = text.split(url).join("x".repeat(X_URL_LEN));
  return [...t].reduce((n, ch) => n + ((ch.codePointAt(0) ?? 0) > 0x2fff ? 2 : 1), 0);
}

const delayText = (i: AlertItem) => (i.status === "danger" ? "servicio suspendido" : `retrasos de ~${i.delayMin} min`);
const icon = (s: AlertItem["status"]) => (s === "danger" ? "🔴" : "🟡");

function buildTweet(i: AlertItem) {
  const head =
    i.status === "danger"
      ? `🔴 ALERTA ${i.code} ${i.nucleoName}: ${delayText(i)}.`
      : `🟡 ${i.code} ${i.nucleoName}: ${delayText(i)}.`;
  const tail = `\n\n📲 Estado en directo 👉 ${i.url}\n\n${tagsFor(i.nucleoSlug).join(" ")}`;
  let reason = i.reason;
  const compose = () => `${head} ${reason}${tail}`;
  while (xLength(compose(), i.url) > X_LIMIT && reason.length > 12) reason = reason.slice(0, -6).trimEnd() + "…";
  return compose();
}

function buildTelegram(i: AlertItem) {
  return (
    `${icon(i.status)} ${i.status === "danger" ? "INCIDENCIA GRAVE" : "RETRASOS"} · ${i.code} ${i.nucleoName}\n\n` +
    `${i.reason}\n` +
    `⏱ ${i.status === "danger" ? "Sin servicio en este momento" : `Demora estimada: ~${i.delayMin} min`}\n\n` +
    `🔄 Consulta el estado actualizado de tu línea:\n${i.url}\n\n` +
    `${tagsFor(i.nucleoSlug).join(" ")}\n🔔 Activa las notificaciones para no perderte ningún aviso.`
  );
}

function buildTiktok(i: AlertItem, siteLabel: string) {
  const where = `${i.code} de ${i.nucleoName}`;
  return [
    "🎬 GUION 15 s · VERTICAL 9:16",
    "",
    "⏱ 0–3 s · GANCHO (voz + texto grande en pantalla)",
    `“¡Atención si vas a coger el tren hoy!” ${icon(i.status)}`,
    "",
    "⏱ 3–11 s · DESARROLLO (muestra la web / captura de la línea)",
    i.status === "danger"
      ? `“La ${where} tiene el servicio suspendido. ${i.reason}”`
      : `“La ${where} acumula ${delayText(i)}. ${i.reason}”`,
    "Texto en pantalla: " + (i.status === "danger" ? "SIN SERVICIO" : `+${i.delayMin} MIN`),
    "",
    "⏱ 11–15 s · LLAMADA A LA ACCIÓN",
    `“Consulta tu línea en tiempo real en ${siteLabel}. Enlace en mi perfil.”`,
    "",
    "🏷 Descripción sugerida:",
    `${icon(i.status)} ${where}: ${delayText(i)}. Estado en directo en ${siteLabel} (link en bio) ${tagsFor(i.nucleoSlug).join(" ")} #TrenesEspaña #Cercanías`,
  ].join("\n");
}

function summaryTweet(items: AlertItem[], url: string) {
  const lines = items.slice(0, 5).map((i) => `${icon(i.status)} ${i.nucleoName} ${i.code}: ${i.status === "danger" ? "sin servicio" : `+${i.delayMin} min`}`);
  const tags = [...new Set(["#Cercanias", ...items.flatMap((i) => tagsFor(i.nucleoSlug))])].slice(0, 5);
  return `🚆 Cercanías HOY, así está el servicio:\n\n${lines.join("\n")}\n\n📲 Estado en directo 👉 ${url}\n\n${tags.join(" ")}`;
}

function summaryTiktok(items: AlertItem[], siteLabel: string) {
  const danger = items.filter((i) => i.status === "danger").length;
  return [
    "🎬 GUION 15 s · RESUMEN DEL DÍA",
    "",
    "⏱ 0–3 s · GANCHO",
    "“¡Atención si vas a coger el tren hoy!” 🚨",
    "",
    "⏱ 3–11 s · DESARROLLO",
    `“Ahora mismo hay ${items.length} líneas con problemas${danger ? `, ${danger} sin servicio` : ""}: ` +
      items.slice(0, 3).map((i) => `${i.code} ${i.nucleoName}`).join(", ") + ".”",
    "",
    "⏱ 11–15 s · LLAMADA A LA ACCIÓN",
    `“Mira si tu línea está afectada en ${siteLabel}. Enlace en mi perfil.”`,
    "",
    "🏷 #Cercanias #Renfe #Rodalies #TrenesEspaña",
  ].join("\n");
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback para contextos sin Clipboard API
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

type Tab = "x" | "telegram" | "tiktok";
const TABS: { id: Tab; label: string }[] = [
  { id: "x", label: "X / Twitter" },
  { id: "telegram", label: "Telegram" },
  { id: "tiktok", label: "TikTok / Reels" },
];

export function SocialAlertGenerator({ items, siteUrl }: { items: AlertItem[]; siteUrl: string }) {
  const [sel, setSel] = useState<string>("resumen");
  const [tab, setTab] = useState<Tab>("x");
  const [copied, setCopied] = useState(false);

  const siteLabel = useMemo(() => siteUrl.replace(/^https?:\/\//, ""), [siteUrl]);
  const item = items.find((i) => i.id === sel);

  const text = useMemo(() => {
    if (!items.length) return "";
    if (!item) {
      if (tab === "tiktok") return summaryTiktok(items, siteLabel);
      const t = summaryTweet(items, siteUrl);
      return tab === "telegram" ? `${t}\n\n🔔 Activa las notificaciones para no perderte ningún aviso.` : t;
    }
    if (tab === "x") return buildTweet(item);
    if (tab === "telegram") return buildTelegram(item);
    return buildTiktok(item, siteLabel);
  }, [items, item, tab, siteUrl, siteLabel]);

  if (!items.length) {
    return <p className="rounded-2xl bg-neutral-900 p-4 text-sm text-neutral-400">No hay incidencias activas: nada que publicar ahora mismo. 🎉</p>;
  }

  const len = tab === "x" ? xLength(text, siteUrl) : text.length;
  const overLimit = tab === "x" && len > X_LIMIT;

  const copy = async () => {
    if (await copyText(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const share =
    tab === "x"
      ? { href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, label: "Abrir en X" }
      : tab === "telegram"
        ? { href: `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(text)}`, label: "Abrir en Telegram" }
        : null;

  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">1 · Elige qué publicar</p>
      <div className="flex flex-wrap gap-2">
        <Chip active={sel === "resumen"} onClick={() => setSel("resumen")}>
          📋 Resumen del día
        </Chip>
        {items.map((i) => (
          <Chip key={i.id} active={sel === i.id} onClick={() => setSel(i.id)}>
            {icon(i.status)} {i.nucleoName} {i.code}
          </Chip>
        ))}
      </div>

      <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-neutral-400">2 · Formato</p>
      <div role="tablist" className="grid grid-cols-3 gap-1 rounded-xl bg-neutral-950 p-1 text-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-2 py-2 font-semibold ${tab === t.id ? "bg-sky-400 text-neutral-950" : "text-neutral-300"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-black p-4 font-sans text-sm leading-relaxed text-neutral-100">
        {text}
      </pre>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className={overLimit ? "font-bold text-red-400" : "text-neutral-500"}>
          {tab === "x" ? `${len}/${X_LIMIT} caracteres (URL = ${X_URL_LEN})` : `${len} caracteres`}
        </span>
        {overLimit && <span className="text-red-400">Supera el límite de X</span>}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={copy}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition ${copied ? "bg-emerald-400 text-neutral-950" : "bg-sky-400 text-neutral-950"}`}
        >
          {copied ? "✓ ¡Copiado!" : "📋 Copiar con 1 clic"}
        </button>
        {share && (
          <a href={share.href} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-neutral-600 px-4 py-3 text-sm font-semibold text-neutral-100">
            {share.label}
          </a>
        )}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm ${active ? "border-sky-400 bg-sky-400/15 text-sky-200" : "border-neutral-700 text-neutral-300"}`}
    >
      {children}
    </button>
  );
}
