import { Breadcrumbs } from "./Breadcrumbs";
import { LEGAL } from "@/lib/legal";

export function LegalPage({ title, slug, children }: { title: string; slug: string; children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ name: slug, path: `/${slug}` }]} />
      <article className="max-w-none text-sm leading-relaxed text-neutral-300 [&_a]:text-sky-300 [&_a]:underline [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-neutral-50 [&_li]:mb-1 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5">
        <h1 className="text-2xl font-black text-neutral-50">{title}</h1>
        <p className="mt-1 text-xs text-neutral-500">Última actualización: {LEGAL.updated}</p>
        {children}
      </article>
    </>
  );
}
