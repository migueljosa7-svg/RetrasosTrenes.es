export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tudominio.es").replace(/\/$/, "");
export const SITE_NAME = "RetrasosTrenes.es";
export const SITE_TAGLINE = "Estado de Cercanías, Rodalies y Media Distancia en tiempo real";

export const ADS = {
  client: process.env.NEXT_PUBLIC_ADSENSE_ID,
  slotTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "",
  slotInFeed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED ?? "",
  slotSticky: process.env.NEXT_PUBLIC_ADSENSE_SLOT_STICKY ?? "",
};

export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
