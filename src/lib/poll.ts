export interface Team {
  name: string;
  short?: string;
  c1: string;
  c2: string;
  scale?: number;
}

export interface Ranking {
  team: { id: string } | string;
  rec: string;
}

export interface Poll {
  title: string;
  week: string;
  date: string;
  previous: string | null;
  rankings: Ranking[];
  droppedOut: string[];
  orv: string[];
}

export interface Row extends Team {
  id: string;
  rank: number;
  rec: string;
  prev: number | null;
}

// A schema reference resolves to { id, collection }; a plain string
// works too, so accept either rather than depending on the shape.
function refId(ref: Ranking["team"]): string {
  return typeof ref === "string" ? ref : ref.id;
}

// Merge the registry and the weekly file into rows the component can
// draw, deriving each team's movement from last week's order.
export function buildBoard(
  teams: Map<string, Team>,
  poll: Poll,
  prevPoll: Poll | null
): Row[] {
  const prevRank = new Map<string, number>();
  if (prevPoll) {
    prevPoll.rankings.forEach((r, i) => prevRank.set(refId(r.team), i + 1));
  }

  return poll.rankings.map((entry, i) => {
    const id = refId(entry.team);
    const meta = teams.get(id);
    if (!meta) {
      throw new Error(
        `Unknown team id "${id}" at rank ${i + 1} in "${poll.week}" ` +
        `\u2014 add it to teams.json or fix the spelling.`
      );
    }
    return {
      ...meta,
      id,
      rank: i + 1,
      rec: entry.rec,
      prev: prevRank.has(id) ? prevRank.get(id)! : null,
    };
  });
}

export interface Movement {
  text: string;
  cls: "up" | "down" | "flat" | "new";
}

export function movement(prev: number | null, rank: number): Movement {
  if (prev === null || prev === undefined) return { text: "NR", cls: "new" };
  const d = prev - rank;
  if (d > 0) return { text: "+" + d, cls: "up" };
  if (d < 0) return { text: "\u2212" + -d, cls: "down" };
  return { text: "\u2014", cls: "flat" };
}

// Black or white text on the school color, decided by luminance, so you
// never hand-check contrast across 25 different colors.
export function readableOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  return L > 0.35 ? "#0E1319" : "#FFFFFF";
}

export function slug(s: string): string {
  return String(s)
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function dash(rec: string): string {
  return String(rec).replace("-", "\u2013");
}
