# forge — guidance for Claude

## VCS
- This repo uses **git + GitHub** (not Arc/Arcadia). Use `git` and `gh`.
- PR titles are CI-enforced (`.github/workflows/pr-title-check.yml`): conventional commits (`feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`) with subject starting uppercase (`^[A-Z].+$`). Malformed titles fail CI.
- Don't push or open PRs without explicit user approval.

## Layout
pnpm workspace, TS 5.9 strict, `moduleResolution: bundler`, path alias `@forge/*` → `./packages/*/src`.

- `apps/citadel` — NestJS + Fastify backend (Telegram account management), bundled via esbuild.
- `apps/nc_presentation` — React 18 + Vite, slides-style presentation site.
- `apps/ncottage-www` — Next.js 15 + React 19 site, Storybook 10 for component dev.
- `packages/shared` — `@forge/shared`, source-only package (no build step).

## Commands (from repo root)
- Dev: `pnpm dev:citadel`, `pnpm dev:nc_presentation`, `pnpm dev:ncottage-www`
- Build: `pnpm build` (all) or `pnpm build:<app>`
- Storybook: `pnpm storybook:ncottage-www` (port 6006)
- Check: `pnpm typecheck`, `pnpm lint`, `pnpm format:check`
- Fix: `pnpm lint:fix`, `pnpm format`
- Generic filter: `pnpm --filter @forge/<name> <script>`

## Code style (enforced)
- Prettier: 4 spaces, double quotes, semi, `trailingComma: "es5"`, `printWidth: 80`, `endOfLine: "lf"`.
- ESLint hard rules: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/consistent-type-imports` (always `import type { X } from ...` for types).
- Component convention in `ncottage-www`: folder `ComponentName/` with `ComponentName.tsx`, `ComponentName.module.css`, optional `ComponentName.stories.tsx`, `index.ts` barrel.

## Gotchas
- `packages/shared` exports source directly (`main: ./src/index.ts`), no compile step — consumers inherit TS strictness.
- `ncottage-www` uses React 19, `nc_presentation` uses React 18 — don't cross-import components between them.
- Issue templates in `.github/ISSUE_TEMPLATE/` are Russian, default assignee `mv-Arthur`.
