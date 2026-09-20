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

**One route, composed sections.** `src/app/page.tsx` is the entire site: it renders `Header`, `Intro`, `SectionDivider`, and the content sections in display order. Reordering the page means reordering that JSX. `src/app/layout.tsx` is the only server component of note — it loads Geist/Geist_Mono via `next/font/google` (exposed as `--font-geist-sans` / `--font-geist-mono`), sets metadata, and mounts `<Analytics />` from `@vercel/analytics`.

**Content is hardcoded data arrays inside the components.** Updating the portfolio's content means editing these, not a CMS or JSON file:
- `projectsData` in `src/components/projects.tsx` (exported)
- `experienceData` in `src/components/experience.tsx`
- `skillsData` in `src/components/skills.tsx` (grouped by category)
- Prose lives inline in `about.tsx`, `intro.tsx`, `contact.tsx`

Images referenced by those arrays are static files in `public/` (e.g. `/peerprep.png`, `/homepal.jpg`, plus `/CV.pdf` and `/profile-photo.png`). An empty `imageUrl` or `liveUrl` string is the sentinel for "no image / no live link" — components branch on it.

**Every section component is `'use client'`** because they all use Framer Motion. Keep that directive when adding components that animate.

**Navigation is anchor-scroll, not routing.** `header.tsx` holds a `navLinks` array (`['About', 'Experience', 'Projects', 'Skills', 'Contact']`) and derives both the `href` and the DOM lookup from `item.toLowerCase()`, then calls `scrollIntoView({ behavior: 'smooth' })`. A new nav entry requires a section whose `id` is exactly the lowercased label, and that section needs a `scroll-mt-28`-style class so the fixed header doesn't overlap it.

## Conventions

- **Animation:** sections use the standardized entrance `initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}`. Use `animate` (not `whileInView`) only for above-the-fold elements in `header.tsx` / `intro.tsx`; staggering is done with `transition={{ delay: index * 0.1 }}`.
- **Dark mode** is driven by `prefers-color-scheme` in `globals.css`, not Tailwind's `class` strategy — there is no theme toggle, and `dark:` variants follow the OS setting.
- `--background` / `--foreground` CSS variables are wired into `tailwind.config.ts` as the `background` and `foreground` color tokens.
- `globals.css` defines one custom utility, `.borderBlack` (`border border-black/10`), used for card borders.
- Import components via the `@/*` alias → `./src/*`.
- Icons come from `lucide-react`; images use `next/image`.
