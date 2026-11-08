import Link from "next/link";
import { breadcrumbJsonLd, JsonLd } from "./JsonLd";

export type Crumb = { name: string; path: string };

/** Migas visibles + BreadcrumbList JSON-LD (la home se antepone automáticamente). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Inicio", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <nav aria-label="Migas de pan" className="mb-4 text-xs text-neutral-400">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden>›</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-neutral-200">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:text-sky-300">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
