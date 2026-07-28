# forge — guidance for Codex

## VCS

- This repo uses git + GitHub.
- Use `git` and `gh` for repository work.
- PR titles are CI-enforced: conventional commits (`feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`) with subject starting uppercase.
- Do not push or open PRs unless the current task explicitly requires it.
- Do not merge PRs automatically.

## Layout

pnpm workspace, TypeScript strict, path alias `@forge/*` -> `./packages/*/src`.

- `apps/ncottage-www` — Next.js 15 + React 19 public site.
- `apps/ncottage-api` — NestJS + Fastify + Prisma content API.
- `apps/ncottage-admin` — Next.js admin CMS UI.
- `packages/shared` — `@forge/shared`, shared domain types and contracts.

## Commands

Run from repo root:

- Dev: `pnpm dev:ncottage-www`, `pnpm dev:ncottage-api`, `pnpm dev:ncottage-admin`
- Build: `pnpm build` or `pnpm build:<app>`
- Storybook: `pnpm storybook:ncottage-www`
- Check: `pnpm typecheck`, `pnpm lint`, `pnpm format:check`
- Fix: `pnpm lint:fix`, `pnpm format`

## Code style

- Prettier: 4 spaces, double quotes, semicolons, trailing comma where valid, print width 80.
- ESLint: no explicit `any`; use type-only imports for types.
- Do not introduce new dependencies without explicit approval.

## Scratch & build artifacts

- Any ephemeral output — one-off dumps, audit reports, screenshots, scratch
  scripts — MUST be written under `/.scratch/` at the repo root. It is the only
  gitignored catch-all; a single `.gitignore` line covers everything future.
  Never scatter temp files elsewhere in the tree.
- Build outputs are already ignored (`dist`, `.next`, `storybook-static`,
  `coverage`, `playwright-report`, `test-results`, `*.tsbuildinfo`). Do not
  commit them and do not hand-edit generated `dist/`.
- `.env.example` is tracked as a template; real `.env*` stay local.

## Frontend conventions

- Keep changes scoped to the issue and acceptance criteria.
- Prefer small, direct fixes over broad refactors.
- Component folders in `ncottage-www`: `ComponentName.tsx`, `ComponentName.module.css`, optional stories, `index.ts`.
- Local-to-feature code stays in the feature folder.
- Reused by 2+ features can be lifted to app-level folders.
- UI icons are inline JSX components unless there is a strong reason to use an image asset.
- Static images go to `public/images/...` and are rendered via `next/image`.
- Do not add SVGR or sprite tooling yet.
