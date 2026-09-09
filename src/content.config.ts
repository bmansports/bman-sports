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

export const collections = { teams, cfbPoll };