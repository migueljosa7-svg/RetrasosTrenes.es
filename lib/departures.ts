import { linesAtStation, type Line } from "@/data/lines";

export type Departure = {
  line: Line;
  destination: string;
  scheduledAt: string;
  delayMin: number;
  cancelled: boolean;
  platform: string;
};

/** Genera un panel de salidas simulado a partir de las líneas que pasan por la estación. */
export function getDepartures(stationSlug: string, stationName: string): Departure[] {
  const now = Date.now();
  const rows: Departure[] = [];
  linesAtStation(stationSlug).forEach((line, i) => {
    ([0, 1] as const).forEach((dir) => {
      const destination = line.terminals[dir];
      if (stationName.toLowerCase().includes(destination.toLowerCase())) return;
      [0, 1].forEach((n) => {
        const offset = 3 + i * 4 + dir * 6 + n * 30;
        rows.push({
          line,
          destination,
          scheduledAt: new Date(now + offset * 60_000).toISOString(),
          delayMin: line.status === "danger" ? 0 : line.delayMin,
          cancelled: line.status === "danger",
          platform: String(1 + ((i * 2 + dir + n) % 6)),
        });
      });
    });
  });
  return rows.sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));
}
