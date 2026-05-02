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

## SVG / images (`ncottage-www`)

Three categories — pick by what the asset needs to do:

1. **UI icons** — inline JSX as React components. Use `stroke="currentColor"` / `fill="currentColor"` so colour is driven by CSS, set `aria-hidden="true"` on decorative ones (or `aria-label` on the parent control). Group local-only icons in `icons.tsx` next to the consumer. If an icon is used in 2+ unrelated places, lift it to `src/components/ui/icons/` (see `ChevronDownIcon`, `CheckIcon`, `SearchIcon`, `CloseIcon`).
2. **Static images** (photos, ready-made illustrations independent of theme) — file in `public/images/...`, rendered via `next/image`. Use this for hero/category/advantage imagery. Don't pull large decorative assets into JSX.
3. **Inline SVG components** — when the SVG needs CSS Modules, theme tokens, `<pattern>`, or dynamic content (i18n text, conditional shapes). Build it as a normal React component with its own `.module.css` (see `components/layout/NotFoundIllustration/`). Do NOT serve such SVGs through `next/image` — it renders an `<img>` and the SVG document is isolated from the page's classes and CSS variables.

**No SVGR / sprites yet** — don't add `@svgr/webpack` or sprite tooling. Revisit only if the icon count grows past ~30 or designers start handing off `.svg` files regularly.

## File organization (`ncottage-www`)

Rule: **local to a feature → inside the feature; reused by 2+ features → lift to app level.** Don't pre-create folders.

Inside a feature (`src/components/features/<feature>/`) — flat files next to the components:

- `use*.ts` — feature-only hooks (see `useProjectsFilter.ts`)
- `icons.tsx` — feature-only icons
- `api.ts` / `queries.ts` — fetch/GraphQL calls scoped to the feature
- `helpers.ts` — pure functions (formatters, mappers)
- `types.ts` — when feature types grow beyond a few inline declarations
- Promote to a subfolder (`hooks/`, `api/`) only when files of one kind reach 3+.

App-level (cross-feature):

- `src/hooks/` — reusable React hooks (`useMediaQuery`, `useDebouncedValue`)
- `src/lib/` — pure utilities, no React
- `src/api/` — HTTP/GraphQL client, shared endpoints, query keys (create when the first cross-feature call appears)
- `src/domain/` — domain types/schemas
- `src/data/` — static data fixtures (migrate into `src/api/` once a backend exists)

## Gotchas

- `packages/shared` exports source directly (`main: ./src/index.ts`), no compile step — consumers inherit TS strictness.
- `ncottage-www` uses React 19, `nc_presentation` uses React 18 — don't cross-import components between them.
- Issue templates in `.github/ISSUE_TEMPLATE/` are Russian, default assignee `mv-Arthur`.
