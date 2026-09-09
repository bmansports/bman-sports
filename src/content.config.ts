import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const teams = defineCollection({
  loader: file('./src/data/teams.json'),
  schema: z.object({
    name: z.string(),
    short: z.string().optional(),
    c1: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    c2: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    scale: z.number().optional(),
  }),
});

const cfbPoll = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/cfb-poll' }),
  schema: z.object({
    title: z.string(),
    week: z.string(),
    date: z.string(),
    previous: z.string().nullable(),
    rankings: z.array(z.object({
      team: reference('teams'),
      rec: z.string(),
    })).length(25),
    droppedOut: z.array(z.string()),
    orv: z.array(z.string()),
  }),
});

const matchups = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/matchups' }),
  schema: z.object({
    week: z.string(),
    // Which poll supplies the ranks on the cards. Defaults to the poll
    // whose id matches this file's.
    poll: z.string().optional(),
    games: z.array(z.object({
      away: reference('teams'),
      home: reference('teams'),
      // Calendar day, "YYYY-MM-DD". The week's date range is derived from these.
      date: z.coerce.date(),
      time: z.string().optional(),
      tv: z.string().optional(),
      note: z.string(),
      headliner: z.boolean().default(false),
    })).min(1),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { teams, cfbPoll, matchups, blog };