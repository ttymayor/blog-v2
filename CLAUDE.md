# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `pnpm build` — Build production site to `./dist/`
- `pnpm preview` — Preview build locally (requires fresh build first)
- `pnpm dlx` — Use instead of `npx`
- **DO NOT** use `pnpm dev` — the dev server is unstable in this environment

## Architecture

**Astro 5** static site with **React 19** for interactive components, **Tailwind CSS 4** for styling, and **shadcn/ui** (New York style) for UI primitives.

### Layouts & Pages

- `BaseLayout.astro` — Shell layout (html/head/body/header/footer). Does NOT include content width constraints — each page adds its own `max-w-5xl mx-auto px-4` wrapper as needed.
- `BlogPost.astro` — Blog article layout with TOC sidebar, wraps content in `.prose` div.
- `about.astro` — Full-width page with inline section data (projects, slides, events, dev-rule). Components are NOT imported — data and templates live directly in the page.

### Content System

Blog posts use Astro Content Collections with glob loader from `src/content/blog/`. Posts are `.md`/`.mdx` files with this frontmatter schema:

```yaml
title: string
description: string
pubDate: date
tags: string[]
category?: string
draft?: boolean      # excluded in production
pin?: boolean        # pinned to top of listing
updatedDate?: date
heroImage?: image
```

Dynamic routing via `src/pages/blog/[...slug].astro`. Blog data fetched through `src/lib/blog.ts`.

### Markdown Pipeline

Remark: `remarkMath`, `remarkGfm`, `remarkReadingTime` (custom), `remarkModifiedTime` (custom, reads git history)
Rehype: `rehypeKatex`, `rehypeSlug`
Syntax highlighting: Shiki

Custom MDX component overrides in `src/components/mdx/` (H1-H6, Image, Table, TableOfContents).

### Styling

- Global theme in `src/styles/global.css` with OKLch CSS variables for light/dark
- `.prose` class in global.css defines all blog typography styles (in `@layer base`)
- Dark mode: localStorage-based (defaults to dark), flash prevented via inline script in BaseLayout
- shadcn/ui config in `components.json`, components in `src/components/ui/`

### Component Patterns

- `.astro` files for static/structural components
- `.tsx` files for interactive components (use `client:load` or `client:only="react"`)
- Icons: `@lucide/astro` in Astro files, `lucide-react` in React files

## Coding Conventions

- **Import alias**: Always use `@/` for imports from `src/`. Never use relative paths like `../../`.
- **View Transitions**: Header uses `transition:persist`. Theme applied via `astro:before-swap` hook.
- **CSS layers**: `.prose` styles are in `@layer base` — utility classes will override them. Avoid combining `space-y-*` with `.prose` containers as it zeroes out margin-bottom on children.
