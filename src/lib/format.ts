// Dates in the JSON are plain calendar days ("2026-09-12"), which Zod coerces
// to midnight UTC. Formatting those in a US timezone would roll them back a
// day, so every format call here pins timeZone to UTC.

export function dayLabel(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function shortDay(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** "September 12, 2026" for one day, "September 10–12, 2026" for a span. */
export function rangeLabel(dates: Date[]): string {
  if (dates.length === 0) return "";

  const sorted = [...dates].sort((a, b) => a.valueOf() - b.valueOf());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const year = last.getUTCFullYear();

  const long = { month: "long", day: "numeric", timeZone: "UTC" } as const;
  const head = first.toLocaleDateString("en-US", long);

  if (first.valueOf() === last.valueOf()) return `${head}, ${year}`;

  const sameMonth = first.getUTCMonth() === last.getUTCMonth();
  const tail = last.toLocaleDateString(
    "en-US",
    sameMonth ? { day: "numeric", timeZone: "UTC" } : long
  );

  return `${head}\u2013${tail}, ${year}`;
}

export function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}