# forge — guidance for Codex

## VCS

- This repo uses git + GitHub.
- Use `git` and `gh` for repository work.
- PR titles are CI-enforced: conventional commits (`feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`) with subject starting uppercase.
- Do not push or open PRs unless the current task explicitly requires it.
- Do not merge PRs automatically.

## Layout

pnpm workspace, TypeScript strict, path alias `@forge/*` -> `./packages/*/src`.

- `apps/citadel` — NestJS + Fastify backend.
- `apps/nc_presentation` — React 18 + Vite presentation site.
- `apps/ncottage-www` — Next.js 15 + React 19 site.
- `packages/shared` — `@forge/shared`, shared utilities package with build output.
- `packages/iron-solver` — reusable Iron Solver application core with use-cases and ports.

## Commands

Run from repo root:

- Dev: `pnpm dev:citadel`, `pnpm dev:nc_presentation`, `pnpm dev:ncottage-www`
- Build: `pnpm build` or `pnpm build:<app>`
- Storybook: `pnpm storybook:ncottage-www`
- Check: `pnpm typecheck`, `pnpm lint`, `pnpm format:check`
- Fix: `pnpm lint:fix`, `pnpm format`
- Browser check: `scripts/chrome-check.zsh`

## Code style

- Prettier: 4 spaces, double quotes, semicolons, trailing comma where valid, print width 80.
- ESLint: no explicit `any`; use type-only imports for types.
- Do not introduce new dependencies without explicit approval.

## Frontend conventions

- Keep changes scoped to the issue and acceptance criteria.
- Prefer small, direct fixes over broad refactors.
- Component folders in `ncottage-www`: `ComponentName.tsx`, `ComponentName.module.css`, optional stories, `index.ts`.
- Local-to-feature code stays in the feature folder.
- Reused by 2+ features can be lifted to app-level folders.
- UI icons are inline JSX components unless there is a strong reason to use an image asset.
- Static images go to `public/images/...` and are rendered via `next/image`.
- Do not add SVGR or sprite tooling yet.

## AI pipeline rules

- Iron Solver infrastructure adapters live in `infrastructure/run_iron_solver`.
- Reusable Iron Solver core lives in `packages/iron-solver`.
- Generic Iron Solver prompt templates live in `packages/iron-solver/prompt-templates`.
- Local/CI job entrypoint lives in `infrastructure/run_iron_solver`.
- GitHub Actions entrypoint is `.github/workflows/iron-solver.yml`; it calls `pnpm --dir infrastructure/run_iron_solver route`.
- The AI workflow is label-driven.
- Status labels are mutually exclusive and use the `status:*` prefix.
- Project labels use the `project:*` prefix.
- The current AI MVP is scoped to `project:ncottage-www`.
- Orchestration is deterministic TypeScript CLI logic, not an LLM agent.
- `frontend-developer:ncottage-www` may edit files and create/update PRs.
- `frontend-reviewer:ncottage-www` reviews PRs read-only and writes comments.
- `frontend-qa:ncottage-www` verifies behavior, captures artifacts, and writes comments.
- Human review and merge are always manual.
- If an agent hits the iteration limit or cannot proceed safely, move the issue to `status:needs-human-attention`.
