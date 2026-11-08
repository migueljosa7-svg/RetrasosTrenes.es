import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RetrasosTrenes.es – Estado de Cercanías en directo",
    short_name: "RetrasosTrenes",
    description: "Retrasos, averías e incidencias de Cercanías, Rodalies y Media Distancia en tiempo real.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    lang: "es",
    // Para instalabilidad completa en Android añade PNG 192x192 y 512x512 en /public y listalos aquí.
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
