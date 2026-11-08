"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { SearchItem } from "@/data/lines";
import { normalize } from "@/lib/format";

/** Buscador instantáneo en cliente: filtra líneas y estaciones sin recargar. Acepta ?q= (SearchAction). */
export function SearchBox({ items }: { items: SearchItem[] }) {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  const index = useMemo(() => items.map((i) => ({ ...i, h: normalize(i.haystack) })), [items]);
  const results = useMemo(() => {
    const tokens = normalize(q).replace(/-/g, "").split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    return index
      .filter((i) => {
        const h = i.h.replace(/-/g, "");
        return tokens.every((t) => h.includes(t));
      })
      .slice(0, 8);
  }, [q, index]);

  return (
    <div className="relative">
      <label htmlFor="buscador" className="sr-only">
        Buscar línea o estación
      </label>
      <input
        id="buscador"
        type="search"
        inputMode="search"
        autoComplete="off"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Busca tu línea o estación: C5, R4, Atocha…"
        className="w-full rounded-2xl border border-neutral-700 bg-neutral-900 px-4 py-4 text-base text-neutral-50 placeholder:text-neutral-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
      />
      {q.trim() !== "" && (
        <ul className="mt-2 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900" role="listbox">
          {results.length === 0 && <li className="px-4 py-3 text-sm text-neutral-400">Sin resultados para “{q}”.</li>}
          {results.map((r) => (
            <li key={r.href} className="border-b border-neutral-800 last:border-0">
              <Link href={r.href} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-neutral-800">
                <span>
                  <span className="block text-sm font-semibold text-neutral-100">{r.label}</span>
                  <span className="block text-xs text-neutral-400">{r.sublabel}</span>
                </span>
                <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300">{r.type}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
