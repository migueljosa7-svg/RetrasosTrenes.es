"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapMarker } from "@/data/lines";
import type { Status } from "@/lib/status";

const COLORS: Record<Status, string> = { ok: "#34d399", warn: "#fbbf24", danger: "#ef4444" };

function statusText(status: Status, delayMin: number) {
  if (status === "danger") return "Sin servicio";
  if (status === "warn") return delayMin > 0 ? `Retraso +${delayMin} min` : "Retrasos leves";
  return "Servicio normal";
}

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string) => {
  const n = document.createElement(tag);
  n.className = className;
  if (text) n.textContent = text; // textContent: nunca interpreta HTML
  return n;
};

function buildPopup(m: MapMarker, go: (href: string) => void) {
  const root = el("div", "rt-pop");
  root.append(el("p", "rt-pop-title", `Cercanías ${m.name}`));

  m.lines.forEach((l) => {
    const a = el("a", "rt-pop-line");
    a.href = l.href;
    const dot = el("span", "rt-pop-dot");
    dot.style.background = COLORS[l.status];
    dot.style.boxShadow = `0 0 8px ${COLORS[l.status]}`;
    const body = el("span", "rt-pop-body");
    body.append(el("strong", "", l.code), el("span", "rt-pop-status", ` · ${statusText(l.status, l.delayMin)}`));
    if (l.status !== "ok") body.append(el("span", "rt-pop-reason", l.reason));
    a.append(dot, body, el("span", "rt-pop-go", "›"));
    // Navegación SPA sin recargar; respeta Ctrl/Cmd+clic para abrir en pestaña nueva.
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      go(l.href);
    });
    root.append(a);
  });
  return root;
}

export default function LiveMapInner({ markers }: { markers: MapMarker[] }) {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, {
      center: [40.2, -3.5],
      zoom: 6,
      minZoom: 5,
      maxZoom: 12,
      scrollWheelZoom: false, // no secuestra el scroll de la página en móvil/escritorio
      attributionControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    const go = (href: string) => router.push(href);
    markers.forEach((m) => {
      const icon = L.divIcon({
        className: "rt-marker-wrap",
        html: `<span class="rt-marker rt-${m.status}" style="--c:${COLORS[m.status]}"></span>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
      });
      L.marker(m.coords, { icon, title: `Cercanías ${m.name}`, alt: `Cercanías ${m.name}: ${statusText(m.status, 0)}` })
        .bindPopup(buildPopup(m, go), { className: "rt-popup", maxWidth: 300, minWidth: 220 })
        .addTo(map);
    });

    if (markers.length > 1) map.fitBounds(L.latLngBounds(markers.map((m) => m.coords)), { padding: [40, 40], maxZoom: 7 });

    return () => {
      map.remove();
    };
  }, [markers, router]);

  return <div ref={container} className="h-full w-full bg-neutral-950" />;
}
