import Link from "next/link";
import { nucleos } from "@/data/lines";
import { ADS, SITE_NAME } from "@/lib/site";

const LEGAL_LINKS = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/politica-privacidad", label: "Política de privacidad" },
  { href: "/politica-cookies", label: "Política de cookies" },
];

export function Footer() {
  const hasStickyAd = Boolean(ADS.client && ADS.slotSticky);

  return (
    <footer className="mt-12 border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto grid max-w-3xl gap-8 px-4 py-8 text-sm sm:grid-cols-3">
        <div>
          <p className="text-base font-black text-neutral-50">
            Retrasos<span className="text-sky-400">Trenes</span>.es
          </p>
          <p className="mt-2 text-xs text-neutral-500">Estado de Cercanías, Rodalies y Media Distancia en tiempo real.</p>
        </div>

        <nav aria-label="Núcleos principales">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Cercanías</p>
          <ul className="space-y-1.5">
            {nucleos.map((n) => (
              <li key={n.slug}>
                <Link href={`/cercanias/${n.slug}`} className="text-neutral-300 hover:text-sky-300">
                  {n.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/incidencias" className="text-neutral-300 hover:text-sky-300">
                Incidencias hoy
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Información legal">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Legal</p>
          <ul className="space-y-1.5">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-neutral-300 hover:text-sky-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto max-w-3xl border-t border-neutral-900 px-4 py-5 text-xs text-neutral-500">
        <p>Sitio informativo independiente no afiliado con Renfe ni el Ministerio de Transportes.</p>
        <p className="mt-1">
          La información puede no estar actualizada: consulta siempre los canales oficiales antes de viajar.
        </p>
        <p className="mt-3">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>

      {/* Reserva el hueco del anuncio sticky (fixed) para que no tape el final de la página */}
      {hasStickyAd && <div aria-hidden className="h-16" />}
    </footer>
  );
}
