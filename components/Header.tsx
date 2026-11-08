import Link from "next/link";
import { nucleos } from "@/data/lines";
import { SITE_NAME } from "@/lib/site";
import { AdSlot } from "./AdSlot";
import { ADS } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-black tracking-tight text-neutral-50">
          Retrasos<span className="text-sky-400">Trenes</span>.es
          <span className="sr-only"> – {SITE_NAME}</span>
        </Link>
        <Link href="/incidencias" className="rounded-full bg-red-500/15 px-3 py-1.5 text-xs font-bold text-red-300 ring-1 ring-red-500/40">
          ● Incidencias en directo
        </Link>
      </div>
      <nav aria-label="Núcleos" className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 pb-2 text-sm">
        {nucleos.map((n) => (
          <Link key={n.slug} href={`/cercanias/${n.slug}`} className="shrink-0 rounded-full bg-neutral-900 px-3 py-1 text-neutral-300 hover:text-white">
            {n.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}

/** Banner superior responsivo, bajo la cabecera. */
export function TopBanner() {
  return <AdSlot slot={ADS.slotTop} format="horizontal" label="Publicidad" minHeight={90} className="mx-auto mb-4 max-w-3xl" />;
}
