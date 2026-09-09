---
title: "How this poll gets built"
date: 2026-09-09
summary: "The rankings are data, not a picture. Here's the pipeline, and why the distinction matters more than it sounds like it should."
tags: ["meta", "engineering"]
draft: false
---

Replace this file with a real post. It exists so the blog section has
something to render, and so you can see what the frontmatter does.

## Frontmatter

Everything above the second `---` is metadata. The schema in
`src/content.config.ts` validates it at build time, which means a post with a
missing `summary` or a malformed `date` fails the build instead of shipping
broken.

Set `draft: true` on anything unfinished. Draft posts are filtered out of both
the index and the generated routes, so they never appear on the live site — but
they still live in the repo and still get validated.

## Writing

Standard markdown works: **bold**, *italic*, [links](/rankings/), lists, and
code.

- Bullet lists
- Are fine
- As you'd expect

> Blockquotes are styled too, for when you want to pull something out.

## Adding a post

Drop a new `.md` file in `src/content/blog/`. The filename becomes the URL —
`how-this-poll-gets-built.md` becomes `/blog/how-this-poll-gets-built/`. Commit,
push, done.
