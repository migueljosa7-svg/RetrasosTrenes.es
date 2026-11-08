import Link from "next/link";
import { nucleos } from "@/data/lines";

export function Footer() {
  return (
    <footer className="mx-auto mt-12 max-w-3xl px-4 pb-8 text-xs text-neutral-500">
      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1">
        <Link href="/incidencias" className="hover:text-neutral-300">Incidencias hoy</Link>
        {nucleos.map((n) => (
          <Link key={n.slug} href={`/cercanias/${n.slug}`} className="hover:text-neutral-300">
            Cercanías {n.name}
          </Link>
        ))}
      </div>
      <p>
        RetrasosTrenes.es es un servicio informativo independiente, sin vinculación con Renfe, Adif ni la Generalitat.
        La información puede no estar actualizada: consulta siempre los canales oficiales antes de viajar.
      </p>
    </footer>
  );
}
