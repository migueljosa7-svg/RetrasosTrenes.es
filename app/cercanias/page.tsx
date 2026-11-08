import type { Metadata } from "next";
import Link from "next/link";
import { linesByNucleo, nucleoStatus, nucleos } from "@/data/lines";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StatusDot } from "@/components/StatusBadge";
import { TopBanner } from "@/components/Header";
import { STATUS_META } from "@/lib/status";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Estado de Cercanías en España Hoy: Todos los Núcleos | Retrasos en Directo",
  description: "Elige tu núcleo de Cercanías (Madrid, Barcelona, Valencia, Zaragoza…) y consulta retrasos e incidencias en tiempo real.",
  alternates: { canonical: "/cercanias" },
};

export default function CercaniasIndex() {
  return (
    <>
      <TopBanner />
      <Breadcrumbs items={[{ name: "cercanias", path: "/cercanias" }]} />
      <h1 className="mb-4 text-2xl font-black text-neutral-50">Cercanías por núcleo urbano</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {nucleos.map((n) => {
          const s = nucleoStatus(n.slug);
          return (
            <Link key={n.slug} href={`/cercanias/${n.slug}`} className={`rounded-2xl border bg-neutral-900 p-4 hover:bg-neutral-800 ${STATUS_META[s].border}`}>
              <span className="flex items-center gap-2 font-bold text-neutral-50">
                <StatusDot status={s} />
                Cercanías {n.name}
              </span>
              <span className="mt-1 block text-xs text-neutral-400">
                {linesByNucleo(n.slug).length} líneas · {STATUS_META[s].short}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
