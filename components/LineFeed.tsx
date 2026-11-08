import { Fragment } from "react";
import type { Line } from "@/data/lines";
import { ADS } from "@/lib/site";
import { AdSlot } from "./AdSlot";
import { LineCard } from "./LineCard";

/** Lista de tarjetas con un anuncio In-Feed intercalado cada `every` tarjetas. */
export function LineFeed({ lines, every = 4, showNucleo = true }: { lines: Line[]; every?: number; showNucleo?: boolean }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {lines.map((l, i) => (
        <Fragment key={`${l.nucleo}/${l.slug}`}>
          <LineCard line={l} showNucleo={showNucleo} />
          {(i + 1) % every === 0 && i < lines.length - 1 && (
            <div className="md:col-span-2">
              <AdSlot slot={ADS.slotInFeed} format="fluid" label="Anuncio" minHeight={120} />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
