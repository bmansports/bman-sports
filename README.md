# Bman's Sports

A weekly college football Top 25 poll, published as a static site and as
exportable graphics for social media.

**Live:** https://bman-sports.brodybadger83.workers.dev

## What this is

Every week I rank 25 teams. The site publishes each week's poll as its own
page, and each page can export itself as a PNG sized for social. The point of
building it this way rather than making images by hand is that the rankings
become a dataset — by the end of a season there's a structured record of every
poll, which is queryable in ways a folder of PNGs is not.

## Data model

Poll data is normalized into two kinds of file:

```
src/data/
  teams.json              team registry — colors, display names
  cfb-poll/
    2026-week-01.json     one file per week
    2026-week-02.json
```

`teams.json` holds what doesn't change:

```json
"texas": { "name": "Texas", "c1": "#BF5700", "c2": "#333F48" }
```

A weekly poll holds only what does — an ordered list of team ids, records, and
a pointer to the previous week:

```json
{
  "week": "Week 2",
  "previous": "2026-week-01.json",
  "rankings": [
    { "team": "texas", "rec": "1-0" },
    { "team": "notre-dame", "rec": "1-0" }
  ]
}
```

Two things fall out of this split.

**Team metadata is stored once.** Changing a school's color is a one-line edit,
not a find-and-replace across every week of the season.

**Movement is derived, not entered.** Rank order in the previous week's file is
diffed against the current one to produce `+5`, `−2`, or `NR`. Nobody types a
previous rank, so nobody can mistype one.

## Validation

Both collections are typed with Zod schemas in `src/content.config.ts`, checked
at build time:

- `reference('teams')` — a poll cannot cite a team id that isn't in the
  registry. A typo fails the build and names the offending id.
- `.length(25)` — a poll with 24 or 26 entries fails the build.
- Colors are regex-checked as six-digit hex.

The failure mode this replaces is publishing a graphic with a silently blank
row and finding out from a reply.

## Routing

`src/pages/cfb/[week].astro` uses `getStaticPaths()` to generate one page per
file in the poll collection. Adding a week means adding a JSON file — no new
route, no new component, no edits to existing code.

## The graphic

`src/components/PollGraphic.astro` renders the poll: a five-card top tier, then
ranks 6–25 in two columns, with school colors as the organizing device.

Two details worth calling out:

**Contrast is computed, not eyeballed.** `readableOn()` in `src/lib/poll.ts`
converts a school's primary color to relative luminance and returns black or
white for the rank text. With 25 arbitrary brand colors on the board, checking
by hand doesn't scale and doesn't stay correct as teams move.

**Missing logos degrade quietly.** The image element is hidden on error but its
fixed-size box stays, so an absent file leaves a gap rather than shifting every
element in the row.

PNG export runs client-side via html2canvas, since rasterizing requires a
browser. It's the only JavaScript shipped to the visitor; everything else is
static HTML generated at build time.

## Adding a poll

1. Copy the most recent file in `src/data/cfb-poll/` to the next week.
2. Reorder `rankings`, update records, point `previous` at the prior file.
3. Commit and push.

Cloudflare rebuilds and publishes. If a team id is wrong or the list isn't 25
long, the build fails before anything goes live.

## Stack

- **Astro** — static site generation, content collections, build-time schema
  validation
- **Zod** — schema definitions
- **TypeScript** — strict mode
- **Cloudflare Workers static assets** — hosting, deployed on push
- **html2canvas** — client-side PNG export

## Local development

```bash
npm install
npm run dev      # localhost:4321
npm run build    # → dist/
```

## A note on logos

Team logos in `public/logos/` are trademarks of their respective institutions,
used here to identify the teams being ranked. This is a personal, non-commercial
project and is not affiliated with or endorsed by any school, conference, or
the NCAA.