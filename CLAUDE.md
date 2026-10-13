# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # dev server with Turbopack on http://localhost:3000
npm run build   # production build (use this to type-check; tsconfig is noEmit)
npm run start   # serve the production build
npm run lint    # next lint (eslint-config-next: core-web-vitals + typescript)
```

There is no test framework configured in this repo — `npm run build` and `npm run lint` are the only verification steps.

Both `package-lock.json` and `pnpm-lock.yaml` are committed. npm is the de facto default; if you add a dependency, keep whichever lockfile you touch consistent and avoid regenerating the other.

## Architecture

Next.js 15 App Router + React 19 + Tailwind CSS v3 + Framer Motion. Single-page personal portfolio deployed on Vercel.

**Two routes, one data source.**
- `/` (`src/app/page.tsx`) is the **range**: an aim-trainer homepage. It loads the range fonts (Big Shoulders Display / Archivo / JetBrains Mono via `next/font/google`, exposed as `--font-range-*`) and renders `src/components/range/range.tsx`.
- `/classic` (`src/app/classic/page.tsx`) is the original scrolling page: it renders `Header`, `Intro`, `SectionDivider`, and the content sections in display order. Reordering that page means reordering that JSX.
- `src/app/layout.tsx` is the only server component of note — it loads Geist/Geist_Mono (`--font-geist-sans` / `--font-geist-mono`), sets metadata, and mounts `<Analytics />` from `@vercel/analytics`.

**Content lives in `src/data/portfolio.ts`** and both routes read it, so they stay in sync: `profile` (name, role, links, email, hobbies), `experienceData`, `leadershipData`, `projectsData`, `benchIdeas`, `skillsData` (each category has a `slot` name shown in the range's Loadout), `educationData`, `courseworkData`, `certificationsData`. Some prose is still inline in the classic `about.tsx` / `intro.tsx` / `contact.tsx` and in `range/dossier-body.tsx`.

Images referenced by those arrays are static files in `public/` (e.g. `/peerprep.png`, `/homepal.jpg`, plus `/CV.pdf` and `/profile-photo.png`). An empty `imageUrl`, `githubUrl` or `liveUrl` string is the sentinel for "none" — components branch on it.

**The range (`src/components/range/`):**
- `engine.ts` — framework-free canvas engine: draws the pseudo-3D room and five bots, handles pointer input, firing, hit-testing and Web Audio. `BOT_DEFS` lists the bots (`about`, `experience`, `projects`, `loadout`, `contact`; keys 1–5) and `LAYOUT` places them. It reports to React through `onHud` / `onKill` and exposes a controller (`flickTo`, `startReload`, `knockDown`, `close`, `destroy`).
- `range.tsx` — React shell: HUD, kill feed, crosshair settings (persisted to `localStorage`), section buttons, keyboard shortcuts, and the dossier dialog. Opening a section sets `#<bot id>`; loading `/#<bot id>` opens it directly.
- `dossier-body.tsx` — the section content shown in the dossier, built from `src/data/portfolio.ts`.
- `range.module.css` — all range styling; design tokens are CSS variables on `.app`, which the engine reads via `getComputedStyle` for canvas colours and fonts. Note `display:` rules override the `hidden` attribute, so hidden elements need an explicit `[hidden] { display: none }`.

**Every classic section component is `'use client'`** because they all use Framer Motion. Keep that directive when adding components that animate.

**Classic navigation is anchor-scroll, not routing.** `header.tsx` holds a `navLinks` array and derives both the `href` and the DOM lookup from `item.toLowerCase()`, then calls `scrollIntoView({ behavior: 'smooth' })`. A new nav entry requires a section whose `id` is exactly the lowercased label, and that section needs a `scroll-mt-28`-style class so the fixed header doesn't overlap it. The header also links back to the range at `/`.

## Conventions

- **Animation (classic page):** sections use the standardized entrance `initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}`. Use `animate` (not `whileInView`) only for above-the-fold elements in `header.tsx` / `intro.tsx`; staggering is done with `transition={{ delay: index * 0.1 }}`.
- **Dark mode** (classic page) is driven by `prefers-color-scheme` in `globals.css`, not Tailwind's `class` strategy — there is no theme toggle, and `dark:` variants follow the OS setting. The range is always dark.
- `--background` / `--foreground` CSS variables are wired into `tailwind.config.ts` as the `background` and `foreground` color tokens.
- `globals.css` defines one custom utility, `.borderBlack` (`border border-black/10`), used for card borders.
- Import components via the `@/*` alias → `./src/*`.
- Icons come from `lucide-react`; images use `next/image`.
